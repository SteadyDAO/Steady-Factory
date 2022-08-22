import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Popover } from '@mui/material';
import { EtherSWRConfig } from 'ether-swr';
import { getABIs } from '../helpers/Contract';
import Account from './Account';
import { connectWallet } from '../helpers/Wallet';
import { useWeb3React } from '@web3-react/core';

const BottomNavigate = () => {
  const { active, activate, chainId, library } = useWeb3React();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const open = Boolean(anchorEl);
  const id = open ? 'wallet-popover' : undefined;

  useEffect(() => {
    if (pathname === '/split') {
      setValue(0);
    } else if (pathname === '/merge') {
      setValue(1);
    }
  }, [pathname]);

  return (
    <div className="BottomNavigateContainer">
      <BottomNavigation
        className="BottomNavigate"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue === 1) {
            return;
          }
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          onClick={() => {
            navigate('/split');
          }}
          className={value === 0 ? 'BottomNavigateAction BottomNavigateActionSelected' : 'BottomNavigateAction'} label="Split"
          icon={<CallSplitIcon fontSize="large" />} />
        <BottomNavigationAction
          aria-describedby={id}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          }}
          className={value === 1 ? 'BottomNavigateAction BottomNavigateActionSelected' : 'BottomNavigateAction'} label="Wallet"
          icon={<AccountBalanceWalletIcon fontSize="large" />} />
      </BottomNavigation>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
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
      </Popover>
    </div>
  );
}

export default BottomNavigate;
