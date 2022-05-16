import { useQuery } from "@apollo/client";
import { Button, CircularProgress, Dialog, FormControl, IconButton, InputAdornment, MenuItem, Select, Skeleton, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_ALCHEMISTS } from "../graphql/alchemist.queries";
import { IAlchemist, IChyme, IStrike } from "../models/Alchemist";
import * as _ from "lodash";
import { getContractByAddressName } from "../helpers/Contract";
import { getDefaultProvider } from "ethers";
import config from '../config/config.json';
import { formatUnits, isAddress, parseUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { IFormControl } from "../models/Form";
import { connectWallet, errorHandler, pollingTransaction } from "../helpers/Wallet";
import { TransactionResponse } from "@ethersproject/providers";
import SnackbarMessage from "./Snackbar";
import { ISnackbarConfig } from "../models/Material";
import { Transition } from "./Transition";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const Split = () => {
  const { account, active, activate, chainId, library } = useWeb3React();
  const [chymes, setChymes] = useState<Array<IChyme>>([]);
  const [chymeDecimal, setChymeDecimal] = useState<number>();
  const [isNotEnoughBalance, setIsNotEnoughBalance] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [isSplitCompleted, setIsSplitCompleted] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [strikePrices, setStrikePrices] = useState<Array<IStrike>>([]);
  const [chymeControl, setChymeControl] = useState<IFormControl>({
    value: 'default',
    invalid: true
  });
  const [strikeControl, setStrikeControl] = useState<IFormControl>({
    value: 'default',
    invalid: true
  });
  const [amountControl, setAmountControl] = useState<IFormControl>({
    value: '',
    invalid: true
  });
  const [balance, setBalance] = useState<string>('-');
  const [symbol, setSymbol] = useState<string>('-');
  const { data: getAlchemists } = useQuery(GET_ALCHEMISTS, {
    pollInterval: 30000
  });
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);

  useEffect(() => {
    if (getAlchemists && getAlchemists.alchemists) {
      const als = getAlchemists.alchemists.map((alchemist: IAlchemist) => {
        return {
          ...alchemist,
          chyme: `0x${alchemist.chyme.slice(34, 74)}`
        }
      });
      const temp = _.groupBy(als, 'chyme');
      const tempChymes: Array<IChyme> = [];
      _.forIn(temp, (value, key) => {
        tempChymes.push({
          address: key,
          alchemists: value
        } as any);
      });
      const getSymbols = async () => {
        tempChymes.forEach(async (chyme: IChyme, index: number) => {
          const chymeContract = getContractByAddressName(chyme.address, 'Chyme', getDefaultProvider(config.NETWORK.CHAIN_ID) as any);
          const sb = await chymeContract.symbol();
          tempChymes[index].symbol = sb;
          setChymes([...tempChymes]);
        });
      }
      getSymbols();
    }
  }, [getAlchemists]);

  useEffect(() => {
    if (isAddress(chymeControl.value) && account) {
      const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', getDefaultProvider(config.NETWORK.CHAIN_ID) as any);
      const getBalance = async () => {
        const bl = await chymeContract.balanceOf(account);
        const sb = await chymeContract.symbol();
        const dcm = await chymeContract.decimal();
        setBalance(formatUnits(bl, dcm));
        setSymbol(sb);
        setChymeDecimal(dcm);
      }
      getBalance();
    }
    if (isAddress(chymeControl.value)) {
      const alchemists = chymes.filter((chyme: IChyme) => chyme.address === chymeControl.value)[0]?.alchemists;
      const tempStrikePrices: Array<IStrike> = alchemists.map((alchemist: IAlchemist) => {
        return {
          ratio: alchemist.ratio,
          alchemist: alchemist.alchemist,
          priceOracle: alchemist.priceOracle
        } as any;
      });
      const getStrikePrice = async () => {
        tempStrikePrices.forEach(async (strike: IStrike, index: number) => {
          const oracleContract = getContractByAddressName(strike.priceOracle, 'Oracle', getDefaultProvider(config.NETWORK.CHAIN_ID) as any);
          const latestAnswer = await oracleContract.latestAnswer();
          const decimals = await oracleContract.decimals();
          tempStrikePrices[index].forgePrice = +formatUnits(latestAnswer, decimals);
          tempStrikePrices[index].strikePrice = (+formatUnits(latestAnswer, decimals) * strike.ratio) / 100;
          setStrikePrices([...tempStrikePrices]);
        });
      }
      getStrikePrice();
    }
    // eslint-disable-next-line
  }, [chymeControl, account, chymes]);

  useEffect(() => {
    if (amountControl.value && balance && +amountControl.value > +balance) {
      setIsNotEnoughBalance(true);
    } else {
      setIsNotEnoughBalance(false);
    }
  }, [amountControl, balance]);

  useEffect(() => {
    if (!isNotEnoughBalance && !chymeControl.invalid && !strikeControl.invalid && !amountControl.invalid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [chymeControl, strikeControl, amountControl, isNotEnoughBalance]);

  useEffect(() => {
    if (chymes.length > 0) {
      setChymeControl({
        value: chymes[0].address,
        invalid: false
      });
    } else {
      setChymeControl({
        value: 'default',
        invalid: true
      });
    }
  }, [chymes]);

  useEffect(() => {
    if (strikePrices.length > 0) {
      setStrikeControl({
        value: strikePrices[0].alchemist,
        invalid: false
      });
    } else {
      setStrikeControl({
        value: 'default',
        invalid: true
      });
    }
  }, [strikePrices]);

  const approve = async () => {
    setDisableForm(true);
    const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
    const allowance = await chymeContract.allowance(account?.toString(), strikeControl.value);
    if (allowance?.gte(parseUnits(amountControl.value.toString(), chymeDecimal))) {
      splitChyme();
    } else {
      setConfirmationStep(0);
      setIsConfirmation(true);
      setIsTryAgain(false);
      setIsSplitCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      chymeContract.approve(strikeControl.value, parseUnits(amountControl.value.toString(), chymeDecimal))
        .then((transactionResponse: TransactionResponse) => {
          setSnackbar({
            isOpen: true,
            timeOut: 500000,
            type: 'warning',
            message: 'Transaction is processing'
          });
          pollingTransaction(transactionResponse.hash, approveCompleted);
        }, (err: any) => {
          setConfirmationMessage('Something went wrong. Please try again.');
          setIsTryAgain(true);
          setDisableForm(false);
          errorHandler(err, setSnackbar);
        });
    }
  }

  const approveCompleted = (status: number) => {
    if (status === 1) {
      splitChyme();
      setSnackbar({
        isOpen: false,
        type: 'warning',
        message: ''
      } as any);
    } else if (status === 0) {
      setDisableForm(false);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Approve failed'
      });
    }
  }

  const splitChyme = () => {
    setConfirmationStep(1);
    setIsConfirmation(true);
    setIsTryAgain(false);
    setIsSplitCompleted(false);
    setConfirmationMessage('Waiting for transaction confirmation...');
    const alchemistContract = getContractByAddressName(strikeControl.value, 'Alchemist', library.getSigner());
    alchemistContract.split(parseUnits(amountControl.value.toString(), chymeDecimal))
      .then((transactionResponse: TransactionResponse) => {
        setSnackbar({
          isOpen: true,
          timeOut: 500000,
          type: 'warning',
          message: 'Transaction is processing'
        });
        pollingTransaction(transactionResponse.hash, splitCompleted);
      }, (err: any) => {
        setConfirmationMessage('Something went wrong. Please try again.');
        setIsTryAgain(true);
        setDisableForm(false);
        errorHandler(err, setSnackbar);
      });
  }

  const splitCompleted = (status: number) => {
    if (status === 1) {
      setDisableForm(false);
      setIsSplitCompleted(true);
      setConfirmationMessage('Successfully splitted.');
      setConfirmationStep(2);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'success',
        message: 'Successfully splitted'
      });
      const getBalance = async () => {
        const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', getDefaultProvider(config.NETWORK.CHAIN_ID) as any);
        const bl = await chymeContract.balanceOf(account);
        const sb = await chymeContract.symbol();
        const dcm = await chymeContract.decimal();
        setBalance(formatUnits(bl, dcm));
        setSymbol(sb);
        setChymeDecimal(dcm);
      }
      getBalance();
    } else if (status === 0) {
      setDisableForm(false);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Split failed'
      });
    }
  }

  const tryAgain = () => {
    if (confirmationStep === 0) {
      approve();
    } else if (confirmationStep === 1) {
      splitChyme();
    }
  }

  return (
    <>
      <div className="SplitContainer">
        <span className="SplitLabel">Split Chyme</span>
        <div className="SplitFormContainer">
          <div className="SplitChymeControl SplitFormControl">
            <FormControl required fullWidth>
              <Select value={chymeControl.value} disabled={disableForm} onChange={(event) => {
                if (event.target.value) {
                  setChymeControl({
                    value: event.target.value,
                    invalid: false
                  });
                } else {
                  setChymeControl({
                    value: 'default',
                    invalid: true
                  });
                }
              }}>
                <MenuItem selected disabled value="default">Chyme</MenuItem>
                {chymes.length > 0 && chymes.map((chyme: IChyme) =>
                  <MenuItem key={chyme.address} value={chyme.address}>
                    {chyme.symbol}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <div className="SplitStrikeControl SplitFormControl">
            <FormControl required fullWidth>
              <Select value={strikeControl.value} disabled={!chymeControl.value || chymeControl.value === 'default' || disableForm} onChange={(event) => {
                if (event.target.value) {
                  setStrikeControl({
                    value: event.target.value,
                    invalid: false
                  });
                } else {
                  setStrikeControl({
                    value: 'default',
                    invalid: true
                  });
                }
              }}>
                <MenuItem selected disabled value="default">Strike Price</MenuItem>
                {strikePrices.length > 0 && strikePrices.map((strike: IStrike) =>
                  <MenuItem key={strike.alchemist} value={strike.alchemist}>
                    {strike.strikePrice ? `${strike.strikePrice.toLocaleString()} (${strike.ratio}%)` : <Skeleton width={80} height={35} variant="text" />}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <span className="SplitBalance">Balance: {balance} {symbol}</span>
          <div className="SplitAmountControl SplitFormControl">
            <FormControl required fullWidth>
              <TextField
                value={amountControl.value}
                disabled={!+balance || disableForm}
                type="text"
                placeholder="Amount"
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <Button className="SplitMaxAmountButton" color="secondary" variant="contained" disabled={!+balance || disableForm} onClick={() => {
                        if (+balance) {
                          setAmountControl({
                            value: +balance,
                            invalid: false
                          });
                        } else {
                          setAmountControl({
                            value: '',
                            invalid: true
                          });
                        }
                      }}>Max</Button>
                    </InputAdornment>,
                }}
                onChange={(e) => {
                  if (+e.target.value && +e.target.value > 0) {
                    setAmountControl({
                      value: +e.target.value,
                      invalid: false
                    });
                  } else {
                    setAmountControl({
                      value: '',
                      invalid: true
                    });
                  }
                }}
              />
            </FormControl>
          </div>
          {isNotEnoughBalance ?
            <span className="SplitFormControlErrorMessage">Not enough balance</span> : <></>
          }
        </div>
        <div className="SplitActions">
          {active && chainId ?
            <Button className="SplitButton" color="secondary" variant="contained" disabled={!isFormValid || disableForm} onClick={approve}>
              {disableForm ?
                <CircularProgress color="secondary" size={25} /> : <></>
              }
              Split
            </Button> :
            <Button className="SplitButton" color="secondary" variant="contained" onClick={() => {
              connectWallet(activate)
            }}>Connect Wallet</Button>
          }
        </div>
      </div>
      <Dialog
        className="TransactionsConfirmationDialog"
        open={isConfirmation}
        TransitionComponent={Transition}
        keepMounted
      >
        <div className="TransactionsConfirmationContainer">
          <div className="TransactionsConfirmationHeaderContainer">
            <IconButton onClick={() => {
              setIsConfirmation(false);
            }}>
              <CloseIcon color="primary" />
            </IconButton>
          </div>
          <div className="TransactionsConfirmationContentContainer">
            {!isTryAgain && !isSplitCompleted ?
              <CircularProgress color="secondary" size={50} /> : <></>
            }
            {isSplitCompleted ?
              <CheckCircleIcon className="CompletedColor" fontSize="large" /> : <></>
            }
            {isTryAgain ?
              <ErrorIcon className="ErrorColor" fontSize="large" /> : <></>
            }
            <span className="TransactionsConfirmationMessage">{confirmationMessage}</span>
            <Stepper className="TransactionsConfirmationStepper" activeStep={confirmationStep} alternativeLabel>
              <Step>
                <StepLabel>Approve Amount</StepLabel>
              </Step>
              <Step>
                <StepLabel>Split Chyme</StepLabel>
              </Step>
            </Stepper>
          </div>
          {isTryAgain ?
            <div className="TransactionsConfirmationActionsContainer">
              <Button variant="contained" onClick={tryAgain}>
                Try again
              </Button>
            </div> : <></>
          }
        </div>
      </Dialog>
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default Split;
