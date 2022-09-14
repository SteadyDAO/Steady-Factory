import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { EtherSWRConfig } from "ether-swr";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getABIs } from "../helpers/Contract";
import { connectWallet } from "../helpers/Wallet";
import Account from "./Account";
import steadyImage from '../assets/images/steadydao.png';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { active, activate, chainId, library } = useWeb3React();
  const [isLaunchApp, setIsLaunchApp] = useState<boolean>(false);
  const [isWallet, setIsWallet] = useState<boolean>(false);

  useEffect(() => {
    setIsLaunchApp(pathname === '/');
    setIsWallet(pathname !== '/');
  }, [pathname]);

  useEffect(() => {
    const checkConnection = async () => {
      if ((window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const addresses = await provider.listAccounts();
        if (addresses && addresses.length > 0) {
          connectWallet(activate);
        }
      }
    };
    checkConnection();
    // eslint-disable-next-line
  }, [activate, navigate]);

  return (
    <div className="HeaderContainer">
      <img src={steadyImage} alt="Steady DAO" className="Logo" onClick={() => {
        navigate('/');
      }} />
      <div className="RightSideContainer">
        {isLaunchApp ?
          <Button color="secondary" variant="contained" onClick={() => {
            navigate('/split');
          }}>Launch App</Button> : <></>
        }
        {isWallet ?
          <>
            {active && chainId ?
              <EtherSWRConfig
                value={{
                  web3Provider: library,
                  refreshInterval: 1000,
                  ABIs: new Map(getABIs([
                  ])),
                }}>
                <Account />
              </EtherSWRConfig> :
              <Button color="secondary" variant="contained" onClick={() => {
                if (typeof (window as any).ethereum === 'undefined' || typeof (window as any).web3 === 'undefined') {
                  window.open('https://metamask.io', '_blank');
                  return;
                }
                connectWallet(activate);
              }}>Connect Wallet</Button>
            }
          </> : <></>
        }
      </div>
    </div>
  );
}

export default Header;
