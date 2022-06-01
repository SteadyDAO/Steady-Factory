import { Button, CircularProgress, Dialog, IconButton, Step, StepLabel, Stepper } from "@mui/material";
import { IOpenseaAsset } from "../models/Ethereum";
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
import { GET_ELIXIR_BY_TOKEN_ID } from "../graphql/alchemist.queries";
import { useQuery } from "@apollo/client";

const ElixirNft = (props: {
  elixirNft: IOpenseaAsset
}) => {
  const { account, library } = useWeb3React();
  const [disableMerge, setDisableMerge] = useState<boolean>(true);
  const [isTryAgain, setIsTryAgain] = useState<boolean>(false);
  const [isMergeCompleted, setIsMergeCompleted] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [isApprovedNft, setIsApprovedNft] = useState<boolean>(false);
  const [isApprovedSteadyToken, setIsApprovedSteadyToken] = useState<boolean>(false);
  const [confirmationStep, setConfirmationStep] = useState<number>(0);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [steadyRequiredAmount, setSteadyRequiredAmount] = useState();
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const elixirNftContract = getContractByAddressName(elixirContractAddress, 'ElixirNft', library.getSigner());

  const { data: getElixirs } = useQuery(GET_ELIXIR_BY_TOKEN_ID, {
    variables: {
      tokenId: `0x${(+props.elixirNft.token_id).toString(16)}`
    },
    pollInterval: 3000
  });

  useEffect(() => {
    const getApproved = async () => {
        try {
          const steadyTokenContract = getContractByAddressName(getElixirs.elixirs[0].chyme?.steadyToken, 'SteadyToken', library.getSigner());
          const approvedAddress = await elixirNftContract.getApproved(+props.elixirNft.token_id);
          setIsApprovedNft(approvedAddress?.toLowerCase() === (getElixirs.elixirs[0].chyme?.alchemist?.id)?.toLowerCase());
          const steadyRequired = await elixirNftContract.getSteadyRequired(+props.elixirNft.token_id);
          const allowance = await steadyTokenContract.allowance(account, getElixirs.elixirs[0].chyme?.alchemist?.id);
          const steadyDecimals = await steadyTokenContract.decimals();
          setSteadyRequiredAmount(steadyRequired.steadyRequired);
          setIsApprovedSteadyToken(allowance?.gte(steadyRequired.steadyRequired, steadyDecimals));
          setDisableMerge(false);
        } catch (err) {
          console.log(err)
          setDisableMerge(true);
        }
    };
    if (getElixirs && getElixirs.elixirs && getElixirs.elixirs.length > 0) {
      getApproved();
    }
    // eslint-disable-next-line
  }, [getElixirs]);

  const approveNft = async () => {
    if (isApprovedNft) {
      approveSteadyToken();
    } else {
      setConfirmationStep(0);
      setIsConfirmation(true);
      setIsTryAgain(false);
      setIsMergeCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      elixirNftContract.approve(getElixirs.elixirs[0].chyme?.alchemist?.id, +props.elixirNft.token_id)
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
      setIsConfirmation(true);
      setIsTryAgain(false);
      setIsMergeCompleted(false);
      setConfirmationMessage('Waiting for transaction confirmation...');
      const steadyTokenContract = getContractByAddressName(getElixirs.elixirs[0].chyme?.steadyToken, 'SteadyToken', library.getSigner());
      steadyTokenContract.approve(getElixirs.elixirs[0].chyme?.alchemist?.id, steadyRequiredAmount)
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
    setIsConfirmation(true);
    setIsTryAgain(false);
    setIsMergeCompleted(false);
    setConfirmationMessage('Waiting for transaction confirmation...');
    const alchemistContract = getContractByAddressName(getElixirs.elixirs[0].chyme?.alchemist?.id, 'Alchemist', library.getSigner());
    alchemistContract.merge(+props.elixirNft.token_id)
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
        errorHandler(err, setSnackbar);
      });
  }

  const mergeCompleted = (status: number) => {
    if (status === 1) {
      setIsMergeCompleted(true);
      setConfirmationMessage('Successfully merged.');
      setConfirmationStep(3);
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'success',
        message: 'Successfully merged'
      });
    } else if (status === 0) {
      setSnackbar({
        isOpen: true,
        timeOut: 5000,
        type: 'error',
        message: 'merge failed'
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
        <img className="ElixirNftImage" src={props.elixirNft.image_preview_url} alt="" onClick={() => {
          window.open(props.elixirNft.permalink, '_blank')
        }} />
        <div className="ElixirNftActions">
          <Button color="secondary" variant="contained" onClick={approveNft} disabled={disableMerge}>Merge</Button>
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
                <StepLabel>Approve NFT</StepLabel>
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
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default ElixirNft;
