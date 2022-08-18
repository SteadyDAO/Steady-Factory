import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { connectWallet } from "../helpers/Wallet";
import SnackbarMessage from "./Snackbar";
import { ISnackbarConfig } from "../models/Material";
import { useState } from "react";
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "../helpers/Utilities";

const ConnectWallet = () => {
  const config: IAppConfig = getAppConfig();
  const { active, activate, chainId } = useWeb3React();
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);
  return (
    <>
      {active ?
        <>
          {chainId !== config.NETWORK.CHAIN_ID ?
            <Button color="secondary" variant="contained" onClick={
              () => {
                (window as any).ethereum?.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${config.NETWORK.CHAIN_ID.toString(16)}` }] })
                  .then(() => {
                  }, () => {
                    setSnackbar({
                      isOpen: true,
                      message: 'Polygon network is not found, please add the chain to your address first.',
                      type: 'error',
                      timeOut: 60000
                    });
                  });
              }
            }>Switch to {config.NETWORK.NAME}</Button> : <></>}
        </> :
        <Button color="secondary" variant="contained" onClick={() => {
          connectWallet(activate)
        }}>Connect Wallet</Button>
      }
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default ConnectWallet;
