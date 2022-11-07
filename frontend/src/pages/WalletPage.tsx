import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

const WalletPage = () => {
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
