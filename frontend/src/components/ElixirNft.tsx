import { Button, CircularProgress, Dialog, IconButton, Step, StepLabel, Stepper } from "@mui/material";
import { TransactionResponse } from "@ethersproject/providers";
import SnackbarMessage from "./Snackbar";
import { ISnackbarConfig } from "../models/Material";
import { Transition } from "./Transition";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect, useState } from "react";
import { getContractAddressByName, getContractByAddressName } from "../helpers/Contract";
import { useWeb3React } from "@web3-react/core";
import { errorHandler, pollingTransaction } from "../helpers/Wallet";
import ElixirNftImage from "./ElixirNftImage";
import { IElixir } from "../models/Alchemist";
import { formatUnits } from "ethers/lib/utils";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ElixirNft = (props: {
  elixirNft: IElixir
}) => {
  const { account, library } = useWeb3React();
  const [disableMerge, setDisableMerge] = useState<boolean>(true);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [isMergeCompleted, setIsMergeCompleted] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [isTxConfirmation, setIsTxConfirmation] = useState<boolean>(false);
  const [isApprovedNft, setIsApprovedNft] = useState<boolean>(false);
  const [isApprovedSteadyToken, setIsApprovedSteadyToken] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);
  const [maturesDays, setMaturesDays] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [steadyRequiredAmount, setSteadyRequiredAmount] = useState(0);
  const [steadyDecimals, setSteadyDecimals] = useState();
  const [steadySymbol, setSteadySymbol] = useState();
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [chymeDecimals, setChymeDecimalsl] = useState();
  const [chymeSymbol, setChymeSymbol] = useState();
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const elixirNftContract = getContractByAddressName(elixirContractAddress, 'ElixirNft', library.getSigner());

  useEffect(() => {
    const getApproved = async () => {
      try {
        const maturesTime = (+props.elixirNft.dateSplit) - (new Date().getTime() / 1000) + 157680000;
        const mDays = Math.floor(maturesTime / 3600 / 24);
        if (mDays < 0) {
          setMaturesDays(0);
        } else {
          setMaturesDays(mDays);
        }
        const steadyTokenContract = getContractByAddressName(props.elixirNft.chyme?.steadyToken, 'SteadyToken', library.getSigner());
        const approvedAddress = await elixirNftContract.getApproved(props.elixirNft.tokenId);
        setIsApprovedNft(approvedAddress?.toLowerCase() === (props.elixirNft.chyme?.alchemist?.id)?.toLowerCase());
        const steadyRequired = await elixirNftContract.getSteadyRequired(props.elixirNft.tokenId);
        const allowance = await steadyTokenContract.allowance(account, props.elixirNft.chyme?.alchemist?.id);
        const steadyDcms = await steadyTokenContract.decimals();
        const steadySymbol = await steadyTokenContract.symbol();
        setSteadyDecimals(steadyDcms);
        setSteadySymbol(steadySymbol);
        setSteadyRequiredAmount(steadyRequired.steadyRequired);
        setIsApprovedSteadyToken(allowance?.gte(steadyRequired.steadyRequired, steadyDcms));
        const chymeContract = getContractByAddressName(props.elixirNft.chyme?.id, 'Chyme', library.getSigner());
        const chymeDcms = await chymeContract.decimals();
        const receiveAmt = await chymeContract.balanceOf(props.elixirNft.vault);
        const chymeSymbol = await chymeContract.symbol();
        setChymeDecimalsl(chymeDcms);
        setReceiveAmount(receiveAmt);
        setChymeSymbol(chymeSymbol);
        const oracleContract = getContractByAddressName(props.elixirNft.chyme.priceOracle, 'Oracle', library.getSigner());
        const oracleLatestAnswer = await oracleContract.latestAnswer();
        const oracleDecimals = await oracleContract.decimals();
        const oraclePrice = +formatUnits(oracleLatestAnswer, oracleDecimals);
        const forgeConstant = +formatUnits(+props.elixirNft.forgeConstant, oracleDecimals);
        const vl = (oraclePrice - forgeConstant) * +formatUnits(+props.elixirNft.amount, oracleDecimals);
        setValue(+(vl.toFixed(2)));
        setDisableMerge(false);
      } catch (err) {
        console.log(err)
        setDisableMerge(true);
      }
    };
    getApproved();
    // eslint-disable-next-line
  }, []);

  const approveNft = async () => {
    setDisableMerge(true);
    if (isApprovedNft) {
      approveSteadyToken();
    } else {
      setConfirmationStep(0);
      setIsTxConfirmation(true);
      setIsTryAgain(false);
      setIsMergeCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      elixirNftContract.approve(props.elixirNft.chyme?.alchemist?.id, props.elixirNft.tokenId)
        .then((transactionResponse: TransactionResponse) => {
          setSnackbar({
            isOpen: true,
            timeOut: 500000,
            type: 'warning',
            message: 'Transaction is processing'
          });
          pollingTransaction(transactionResponse.hash, approveNftCompleted);
        }, (err: any) => {
          setConfirmationMessage('Something went wrong. Please try again.');
          setIsTryAgain(true);
          setDisableMerge(false);
          errorHandler(err, setSnackbar);
        });
    }
  }

  const approveNftCompleted = (status: number) => {
    if (status === 1) {
      approveSteadyToken();
      setSnackbar({
        isOpen: false,
        type: 'warning',
        message: ''
      } as any);
    } else if (status === 0) {
      setDisableMerge(false);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Approve failed'
      });
    }
  }

  const approveSteadyToken = async () => {
    if (isApprovedSteadyToken) {
      merge();
    } else {
      setConfirmationStep(1);
      setIsTxConfirmation(true);
      setIsTryAgain(false);
      setIsMergeCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      const steadyTokenContract = getContractByAddressName(props.elixirNft.chyme?.steadyToken, 'SteadyToken', library.getSigner());
      steadyTokenContract.approve(props.elixirNft.chyme?.alchemist?.id, steadyRequiredAmount)
        .then((transactionResponse: TransactionResponse) => {
          setSnackbar({
            isOpen: true,
            timeOut: 500000,
            type: 'warning',
            message: 'Transaction is processing'
          });
          pollingTransaction(transactionResponse.hash, approveSteadyTokenCompleted);
        }, (err: any) => {
          setConfirmationMessage('Something went wrong. Please try again.');
          setIsTryAgain(true);
          setDisableMerge(false);
          errorHandler(err, setSnackbar);
        });
    }
  }

  const approveSteadyTokenCompleted = (status: number) => {
    if (status === 1) {
      merge();
      setSnackbar({
        isOpen: false,
        type: 'warning',
        message: ''
      } as any);
    } else if (status === 0) {
      setDisableMerge(false);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Approve failed'
      });
    }
  }

  const merge = () => {
    setConfirmationStep(2);
    setIsTxConfirmation(true);
    setIsTryAgain(false);
    setIsMergeCompleted(false);
    setConfirmationMessage('Waiting for transaction confirmation...');
    const alchemistContract = getContractByAddressName(props.elixirNft.chyme?.alchemist?.id, 'Alchemist', library.getSigner());
    alchemistContract.merge(props.elixirNft.tokenId)
      .then((transactionResponse: TransactionResponse) => {
        setSnackbar({
          isOpen: true,
          timeOut: 500000,
          type: 'warning',
          message: 'Transaction is processing'
        });
        pollingTransaction(transactionResponse.hash, mergeCompleted);
      }, (err: any) => {
        setConfirmationMessage('Something went wrong. Please try again.');
        setIsTryAgain(true);
        setDisableMerge(false);
        errorHandler(err, setSnackbar);
      });
  }

  const mergeCompleted = (status: number) => {
    if (status === 1) {
      setIsMergeCompleted(true);
      setConfirmationMessage('Merge Success!');
      setConfirmationStep(3);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'success',
        message: 'Merge Success!'
      });
    } else if (status === 0) {
      setDisableMerge(false);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'Merge failed'
      });
    }
  }

  const tryAgain = () => {
    if (confirmationStep === 0) {
      approveNft();
    } else if (confirmationStep === 1) {
      approveSteadyToken();
    } else if (confirmationStep === 2) {
      merge();
    }
  }

  return (
    <>
      <div className="ElixirNftContainer">
        <ElixirNftImage maturesDays={maturesDays} chyme={props.elixirNft.chyme.id} value={value} />
        <div className="ElixirNftActions">
          <Button color="secondary" variant="contained" onClick={() => {
            setIsConfirmation(true);
          }} disabled={disableMerge}>Merge</Button>
        </div>
      </div>
      <Dialog
        className="TransactionsConfirmationDialog"
        open={isTxConfirmation}
        TransitionComponent={Transition}
        keepMounted
      >
        <div className="TransactionsConfirmationContainer">
          <div className="TransactionsConfirmationHeaderContainer">
            <IconButton onClick={() => {
              setIsTxConfirmation(false);
            }}>
              <CloseIcon color="primary" />
            </IconButton>
          </div>
          <div className="TransactionsConfirmationContentContainer">
            {!isTryAgain && !isMergeCompleted ?
              <CircularProgress color="secondary" size={50} /> : <></>
            }
            {isMergeCompleted ?
              <CheckCircleIcon className="CompletedColor" fontSize="large" /> : <></>
            }
            {isTryAgain ?
              <ErrorIcon className="ErrorColor" fontSize="large" /> : <></>
            }
            <span className="TransactionsConfirmationMessage">{confirmationMessage}</span>
            <Stepper className="TransactionsConfirmationStepper" activeStep={confirmationStep} alternativeLabel>
              <Step>
                <StepLabel>Approve Elixir NFT</StepLabel>
              </Step>
              <Step>
                <StepLabel>Approve Steady Token</StepLabel>
              </Step>
              <Step>
                <StepLabel>Merge</StepLabel>
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
          <div className="MergeConfirmationContent">
            <span>You will spend:</span>
            <div className="MergeConfirmationContentRow">
              <KeyboardArrowRightIcon fontSize="small" color="primary" />
              <span>1 Elixir NFT</span>
            </div>
            <div className="MergeConfirmationContentRow">
              <KeyboardArrowRightIcon fontSize="small" color="primary" />
              <span>{`${formatUnits(steadyRequiredAmount, steadyDecimals)} ${steadySymbol}`}</span>
            </div>
            <span>You will receive:</span>
            <div className="MergeConfirmationContentRow">
              <KeyboardArrowRightIcon fontSize="small" color="primary" />
              <span>{`${formatUnits(receiveAmount, chymeDecimals)} ${chymeSymbol}`}</span>
            </div>
          </div>
          <div className="TransactionsConfirmationActionsContainer">
            <Button variant="contained" color="secondary" onClick={() => {
              setIsConfirmation(false);
              approveNft();
            }}>
              OK
            </Button>
            <Button variant="contained" onClick={() => {
              setIsConfirmation(false);
            }}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default ElixirNft;
