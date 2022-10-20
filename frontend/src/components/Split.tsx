import { useQuery } from "@apollo/client";
import { Button, CircularProgress, Dialog, FormControl, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Popper, Skeleton, Step, StepLabel, Stepper, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_ALCHEMISTS } from "../graphql/alchemist.queries";
import { IAlchemist } from "../models/Alchemist";
import { getContractByAddressName, getContractByName } from "../helpers/Contract";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { IFormControl } from "../models/Form";
import { errorHandler, pollingTransaction } from "../helpers/Wallet";
import { TransactionResponse } from "@ethersproject/providers";
import SnackbarMessage from "./Snackbar";
import { ISnackbarConfig } from "../models/Material";
import { Transition } from "./Transition";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "../helpers/Utilities";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import CallSplitIcon from '@mui/icons-material/CallSplit';
import ethImage from '../assets/images/ethereum_icon.svg';
import openseaImage from '../assets/images/opensea.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';

const Split = () => {
  const config: IAppConfig = getAppConfig();
  const [alchemists, setAlchemists] = useState<Array<IAlchemist>>([]);
  const [chymeDecimal, setChymeDecimal] = useState<number>();
  const [oraclePrice, setOraclePrice] = useState<number>();
  const [isNotEnoughBalance, setIsNotEnoughBalance] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [isSplitCompleted, setIsSplitCompleted] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [chymeControl, setChymeControl] = useState<IFormControl>({
    value: null,
    invalid: true
  });
  const [amountControl, setAmountControl] = useState<IFormControl>({
    value: '',
    invalid: true
  });
  const [balance, setBalance] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [polling, setPolling] = useState<any>();
  const { data: getAlchemists } = useQuery(GET_ALCHEMISTS, {
  });
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [tokensDropdownEl, setTokensDropdownEl] = useState<null | HTMLElement>(null);
  const openTokensDropdownEl = Boolean(tokensDropdownEl);
  const [errorPopperEl, setErrorPopperEl] = useState<null | HTMLElement>(null);
  const openErrorPopperEl = Boolean(errorPopperEl);
  const errorPopperId = openErrorPopperEl ? 'error-popper' : undefined;

  useEffect(() => {
    if (getAlchemists && getAlchemists.alchemists) {
      setAlchemists(getAlchemists.alchemists);
    }
  }, [getAlchemists]);

  useEffect(() => {
    if (chymeControl.value && address && chain?.id === config.NETWORK.CHAIN_ID) {
      if (polling) {
        clearInterval(polling);
        setBalance('');
        setSymbol('');
      }
      const getBalance = async () => {
        const chymeContract = getContractByAddressName(chymeControl.value?.chyme?.id, 'Chyme', provider as any);
        const bl = await chymeContract.balanceOf(address);
        const sb = await chymeContract.symbol();
        const dcm = await chymeContract.decimal();
        setBalance(formatUnits(bl, dcm));
        setSymbol(sb);
        setChymeDecimal(dcm);
      }
      const pl = setInterval(() => {
        getBalance();
      }, 3000);
      setPolling(pl);
      const getOraclePrice = async () => {
        const academyContract = getContractByName('Academy', provider as any);
        const chymeInfo = await academyContract.getChymeInfo(chymeControl.value?.chyme?.id);
        const oracleAddress = chymeInfo.oracleAddress;
        const oracleContract = getContractByAddressName(oracleAddress, 'Oracle', provider as any);
        const oracleLatestAnswer = await oracleContract.latestAnswer();
        const oracleDecimals = await oracleContract.decimals();
        setOraclePrice((+formatUnits(oracleLatestAnswer, oracleDecimals)).toFixed(2) as any);
      }
      getOraclePrice();
    }
    // eslint-disable-next-line
  }, [chymeControl]);

  useEffect(() => {
    if (amountControl.value && balance && +amountControl.value > +balance) {
      setIsNotEnoughBalance(true);
    } else {
      setIsNotEnoughBalance(false);
    }
  }, [amountControl, balance]);

  useEffect(() => {
    if (!isNotEnoughBalance && !chymeControl.invalid && !amountControl.invalid + amountControl.value && +amountControl.value > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [chymeControl, amountControl, isNotEnoughBalance]);

  useEffect(() => {
    if (alchemists.length > 0) {
      setChymeControl({
        value: alchemists[0],
        invalid: false
      });
    } else {
      setChymeControl({
        value: null,
        invalid: true
      });
    }
  }, [alchemists]);

  const openTokensDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTokensDropdownEl(event.currentTarget);
  };

  const closeTokensDropdown = () => {
    setTokensDropdownEl(null);
  };

  const approve = async () => {
    setDisableForm(true);
    const chymeContract = getContractByAddressName(chymeControl.value?.chyme?.id, 'Chyme', signer as any);
    const allowance = await chymeContract.allowance(address?.toString(), chymeControl.value?.id);
    if (allowance?.gte(parseUnits(amountControl.value.toString(), chymeDecimal))) {
      splitChyme();
    } else {
      setConfirmationStep(0);
      setIsConfirmation(true);
      setIsTryAgain(false);
      setIsSplitCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      chymeContract.approve(chymeControl.value?.id, parseUnits(amountControl.value.toString(), chymeDecimal))
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
    const alchemistContract = getContractByAddressName(chymeControl.value?.id, 'Alchemist', signer as any);
    alchemistContract.split(parseUnits(amountControl.value.toString(), chymeDecimal), 0)
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
      setTimeout(() => {
        setDisableForm(false);
        setIsSplitCompleted(true);
        setConfirmationMessage('Split Success!');
        setConfirmationStep(2);
        setAmountControl({
          value: '',
          invalid: true
        });
        setSnackbar({
          isOpen: true,
          timeOut: 5000,
          type: 'success',
          message: 'Split Success!'
        });
        const getBalance = async () => {
          const chymeContract = getContractByAddressName(chymeControl.value?.chyme?.id, 'Chyme', signer as any);
          const bl = await chymeContract.balanceOf(address);
          const sb = await chymeContract.symbol();
          const dcm = await chymeContract.decimal();
          setBalance(formatUnits(bl, dcm));
          setSymbol(sb);
          setChymeDecimal(dcm);
        }
        getBalance();
      }, 6000)
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

  // Get Test Token
  const getTestToken = async () => {
    const chymeContract = getContractByAddressName(chymeControl.value?.chyme?.id, 'Chyme', signer as any);
    chymeContract.mint(address, parseUnits('8000', chymeDecimal))
      .then(() => {
      }, () => {
      });
  }


  return (
    <>
      <div className="SplitContainer">
        <div className="SplitSectionContainer">
          <div className="SplitSectionTitleContainer">
            <span className="SplitSectionTitle">You split</span>
            <div className="SplitBalanceContainer">
              {balance && symbol ?
                <>
                  <span className="SplitBalanceText">Balance:</span>
                  <span className="SplitBalanceText">{balance.toLocaleString()} {symbol}</span>
                  <Tooltip title={`Get ${symbol}`}>
                    <GetAppIcon className="SplitGetTokenIcon" color="secondary" fontSize="inherit" onClick={getTestToken} />
                  </Tooltip>
                </> : <Skeleton width={100} height={30} variant="text" />
              }
            </div>
          </div>
          <div className="SplitAmountContainer">
            <Button className="SplitAmountButton" id="token-dropdown" onClick={openTokensDropdown}>
              {chymeControl.value?.chyme?.symbol ?
                <>
                  <img width={24} height={24} src={ethImage} alt="Token Icon" />
                  <span className="SplitAmountButtonText">{chymeControl.value?.chyme?.symbol}</span>
                  <ExpandMoreIcon fontSize="medium" />
                </> : <Skeleton width={80} height={40} variant="text" />
              }
            </Button>
            <div className="SplitAmountControl">
              <FormControl required fullWidth>
                <TextField color="secondary"
                  aria-describedby={errorPopperId}
                  error={isNotEnoughBalance}
                  value={amountControl.value}
                  disabled={!+balance || disableForm}
                  type="text"
                  placeholder="Amount"
                  InputProps={{
                    endAdornment:
                      <InputAdornment position="end">
                        <Button className="SplitMaxAmountButton" color="secondary" variant="contained"
                          disabled={!+balance || disableForm}
                          onClick={() => {
                            setErrorPopperEl(null);
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
                    setAmountControl({
                      value: e.target.value,
                      invalid: false
                    });
                    if (+e.target.value && +e.target.value > +balance) {
                      setErrorPopperEl(e.currentTarget);
                    } else {
                      setErrorPopperEl(null);
                    }
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className="SplitSectionTitleContainer">
            <div className="SplitBalanceContainer">
              {symbol && oraclePrice ?
                <>
                  <span className="SplitBalanceText">{symbol}/USD:</span>
                  <span className="SplitBalanceText">${oraclePrice}</span>
                </> : <Skeleton width={80} height={30} variant="text" />
              }
            </div>
            <div className="SplitBalanceContainer">
              {symbol && oraclePrice && +amountControl.value ?
                <span className="SplitBalanceText">~ ${(+amountControl.value * oraclePrice).toLocaleString()}</span> : <></>
              }

            </div>
          </div>
        </div>
        <CallSplitIcon fontSize="inherit" className="SplitIcon" />
        <div className="SplitSectionContainer">
          <div className="SplitSectionTitleContainer">
            <span className="SplitSectionTitle">You receive</span>
          </div>
          {isFormValid && oraclePrice && symbol ?
            <div className="SplitReceiveContainer">
              <div className="SplitReceiveItemContainer">
                <img width={24} height={24} src={ethImage} alt="Token Icon" />
                <span className="SplitReceiveItemText">{(Math.floor((+amountControl.value * 75 * oraclePrice) / 100)).toLocaleString()} s{symbol} (75%)</span>
              </div>
              <AddIcon fontSize="large" />
              <div className="SplitReceiveItemContainer">
                <img width={48} height={48} src={openseaImage} alt="NFT Icon" />
                <div className="SplitReceiveItemNftContainer">
                  <span className="SplitReceiveItemText">1 Leveraged NFT</span>
                  <span className="SplitReceiveItemText">~ {(Math.floor((+amountControl.value * 25 * oraclePrice) / 100)).toLocaleString()} s{symbol} (25%)</span>
                </div>
              </div>
            </div> : <></>
          }
        </div>
        {isConnected && chain?.id === config.NETWORK.CHAIN_ID ?
          <Button className="SplitButton" color="secondary" variant="contained"
            disabled={!isFormValid || disableForm}
            onClick={approve}>
            {disableForm ?
              <CircularProgress color="secondary" size={25} /> : <></>
            }
            Split
          </Button> :
          <ConnectButton />
        }
      </div>

      <Menu
        id="token-dropdown"
        anchorEl={tokensDropdownEl}
        open={openTokensDropdownEl}
        onClose={closeTokensDropdown}
      >
        {alchemists.length > 0 && alchemists.map((alchemist: IAlchemist) =>
          <MenuItem key={alchemist.id} selected={alchemist.chyme.id === chymeControl.value?.chyme?.id} onClick={() => {
            if (alchemist.chyme.id !== chymeControl.value?.chyme?.id) {
              setChymeControl({
                value: alchemist,
                invalid: false
              });
              setAmountControl({
                value: '',
                invalid: true
              });
            }
            closeTokensDropdown();
          }}>
            <ListItemIcon>
              <img width={24} height={24} src={ethImage} alt="Token Icon" />
            </ListItemIcon>
            <ListItemText>{alchemist.chyme?.symbol}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Popper id={errorPopperId} open={openErrorPopperEl} anchorEl={errorPopperEl}>
        <span className="SplitFormControlErrorMessage">Not enough balance</span>
      </Popper>

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
                <StepLabel>Split Token</StepLabel>
              </Step>
            </Stepper>
          </div>
          {isTryAgain ?
            <div className="TransactionsConfirmationActionsContainer">
              <Button color="secondary" variant="contained" onClick={tryAgain}>
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
