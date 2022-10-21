import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { getAppConfig } from "../helpers/Utilities";
import { IAppConfig } from "../models/Base";

const WalletPage = () => {
  const config: IAppConfig = getAppConfig();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
  }, [])

  return (
    <div className="WalletPageContainer">
      <ConnectButton />
      {isConnected && !chain?.unsupported ?
        <>
        </> : <></>
      }
    </div>
  );
}

export default WalletPage;
