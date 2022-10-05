import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import steadyImage from '../assets/images/steadydao.png';
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
          <ConnectButton />
          </> : <></>
        }
      </div>
    </div>
  );
}

export default Header;
