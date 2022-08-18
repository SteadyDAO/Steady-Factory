import { useQuery } from "@apollo/client";
import { Button, CircularProgress, Dialog, FormControl, IconButton, InputAdornment, MenuItem, Select, Step, StepLabel, Stepper, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_ALCHEMISTS } from "../graphql/alchemist.queries";
import { IAlchemist, IRatio } from "../models/Alchemist";
import { getContractByAddressName } from "../helpers/Contract";
import { formatUnits, isAddress, parseUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { IFormControl } from "../models/Form";
import { errorHandler, pollingTransaction } from "../helpers/Wallet";
import { TransactionResponse } from "@ethersproject/providers";
import SnackbarMessage from "./Snackbar";
import { ISnackbarConfig } from "../models/Material";
import { Transition } from "./Transition";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ConnectWallet from "./ConnectWallet";
import InfoIcon from '@mui/icons-material/Info';
import { ratios } from "../consts/Alchemist";
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "../helpers/Utilities";

const Split = () => {
  const config: IAppConfig = getAppConfig();
  const { account, active, chainId, library } = useWeb3React();
  const [alchemists, setAlchemists] = useState<Array<IAlchemist>>([]);
  const [chymeDecimal, setChymeDecimal] = useState<number>();
  const [isNotEnoughBalance, setIsNotEnoughBalance] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [isSplitCompleted, setIsSplitCompleted] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [chymeControl, setChymeControl] = useState<IFormControl>({
    value: 'default',
    invalid: true
  });
  const [ratioControl, setRatioControl] = useState<IFormControl>({
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
      setAlchemists(getAlchemists.alchemists);
    }
  }, [getAlchemists]);

  useEffect(() => {
    if (isAddress(chymeControl.value) && account && chainId === config.NETWORK.CHAIN_ID) {
      const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
      const getBalance = async () => {
        const bl = await chymeContract.balanceOf(account);
        const sb = await chymeContract.symbol();
        const dcm = await chymeContract.decimal();
        setBalance(formatUnits(bl, dcm));
        setSymbol(sb);
        setChymeDecimal(dcm);
      }
      getBalance();
      setRatioControl({
        value: 0,
        invalid: false
      });
    }
    // eslint-disable-next-line
  }, [chymeControl, account, chainId]);

  useEffect(() => {
    if (amountControl.value && balance && +amountControl.value > +balance) {
      setIsNotEnoughBalance(true);
    } else {
      setIsNotEnoughBalance(false);
    }
  }, [amountControl, balance]);

  useEffect(() => {
    if (!isNotEnoughBalance && !chymeControl.invalid && !ratioControl.invalid && !amountControl.invalid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [chymeControl, ratioControl, amountControl, isNotEnoughBalance]);

  useEffect(() => {
    if (alchemists.length > 0) {
      setChymeControl({
        value: alchemists[0].chyme.id,
        invalid: false
      });
    } else {
      setChymeControl({
        value: 'default',
        invalid: true
      });
    }
  }, [alchemists]);

  const approve = async () => {
    setDisableForm(true);
    const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
    const alchemistAdd = alchemists.filter((al: IAlchemist) => al.chyme.id === chymeControl.value)[0].alchemist;
    const allowance = await chymeContract.allowance(account?.toString(), alchemistAdd);
    if (allowance?.gte(parseUnits(amountControl.value.toString(), chymeDecimal))) {
      splitChyme();
    } else {
      setConfirmationStep(0);
      setIsConfirmation(true);
      setIsTryAgain(false);
      setIsSplitCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      chymeContract.approve(alchemistAdd, parseUnits(amountControl.value.toString(), chymeDecimal))
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
    const alchemistAdd = alchemists.filter((al: IAlchemist) => al.chyme.id === chymeControl.value)[0].alchemist;
    const alchemistContract = getContractByAddressName(alchemistAdd, 'Alchemist', library.getSigner());
    alchemistContract.split(parseUnits(amountControl.value.toString(), chymeDecimal), ratioControl.value)
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
        const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
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

  const getTestToken = () => {
    const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
    chymeContract.mint(account, parseUnits(10000 + '', chymeDecimal))
      .then((transactionResponse: TransactionResponse) => {
        setSnackbar({
          isOpen: true,
          timeOut: 500000,
          type: 'warning',
          message: 'Transaction is processing'
        });
        pollingTransaction(transactionResponse.hash, getTestTokenCompleted);
      }, (err: any) => {
        setConfirmationMessage('Something went wrong. Please try again.');
        errorHandler(err, setSnackbar);
      });
  }

  const getTestTokenCompleted = (status: number) => {
    if (status === 1) {
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'success',
        message: 'Successfully'
      });
      const getBalance = async () => {
        const chymeContract = getContractByAddressName(chymeControl.value, 'Chyme', library.getSigner());
        const bl = await chymeContract.balanceOf(account);
        const sb = await chymeContract.symbol();
        const dcm = await chymeContract.decimal();
        setBalance(formatUnits(bl, dcm));
        setSymbol(sb);
        setChymeDecimal(dcm);
      }
      getBalance();
    } else if (status === 0) {
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Split failed'
      });
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
                {alchemists.length > 0 && alchemists.map((alchemist: IAlchemist) =>
                  <MenuItem key={alchemist.id} value={alchemist.chyme.id}>
                    {alchemist.chyme?.symbol}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>
          <div className="SplitStrikeControl SplitFormControl">
            <FormControl required fullWidth>
              <Select value={ratioControl.value} disabled={!chymeControl.value || chymeControl.value === 'default' || disableForm} onChange={(event) => {
                if (typeof event.target.value === 'number') {
                  setRatioControl({
                    value: event.target.value,
                    invalid: false
                  });
                } else {
                  setRatioControl({
                    value: 'default',
                    invalid: true
                  });
                }
              }}>
                <MenuItem selected disabled value="default">Ratio</MenuItem>
                {ratios.map((ratio: IRatio) =>
                  <MenuItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
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
          <div className="GetTokenContainer">
            <Button variant="contained" disabled={!isAddress(chymeControl.value) || !chymeDecimal} onClick={getTestToken}>Get token</Button>
            <Tooltip title="This use for test only. On production this button will be removed.">
              <InfoIcon />
            </Tooltip>
          </div>
        </div>
        <div className="SplitActions">
          {active && chainId === config.NETWORK.CHAIN_ID ?
            <Button className="SplitButton" color="secondary" variant="contained" disabled={!isFormValid || disableForm} onClick={approve}>
              {disableForm ?
                <CircularProgress color="secondary" size={25} /> : <></>
              }
              Split
            </Button> :
            <ConnectWallet />
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