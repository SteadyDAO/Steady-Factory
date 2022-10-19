import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLaunchApp, setIsLaunchApp] = useState<boolean>(false);
  const [isWallet, setIsWallet] = useState<boolean>(false);

  useEffect(() => {
    setIsLaunchApp(pathname === '/');
    setIsWallet(pathname !== '/');
  }, [pathname]);

  return (
    <div className="HeaderContainer">
      <span className="LogoText" onClick={() => {
        navigate('/');
      }}>STEADY DAO</span>
      <div className="RightSideContainer">
        {isLaunchApp ?
          <Button color="secondary" variant="contained" onClick={() => {
            navigate('/split');
          }}>Launch App</Button> : <></>
        }
        {isWallet ?
          <>
          <ConnectButton />
          </> : <></>
        }
      </div>
    </div>
  );
}

export default Header;
