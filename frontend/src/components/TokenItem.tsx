import { Button, Skeleton } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import useEtherSWR from 'ether-swr';
import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import ethImage from '../assets/images/ethereum_icon.svg';
import metamaskImage from '../assets/images/metamask.svg';
import { ISnackbarConfig } from '../models/Material';
import SnackbarMessage from './Snackbar';

const TokenItem = (props: {
  steadyToken: string;
}) => {
  const { account } = useWeb3React();
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);

  const { data: balance } = useEtherSWR([
    props.steadyToken,
    'balanceOf',
    account
  ]);

  const { data: decimals } = useEtherSWR([
    props.steadyToken,
    'decimals'
  ]);

  const { data: symbol } = useEtherSWR([
    props.steadyToken,
    'symbol'
  ]);

  const { data: name } = useEtherSWR([
    props.steadyToken,
    'name'
  ]);

  const { data: totalSupply } = useEtherSWR([
    props.steadyToken,
    'totalSupply'
  ]);

  return (
    <>
      <div className="TokensItemContainer">
        <div className="TokensItemTokenContainer">
          <img className="TokensItemTokenImg" src={ethImage} alt="" />
          <span>{name ? name : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensItemBalanceContainer">
          <span>{balance && decimals ? `${(+formatUnits(balance, decimals)).toLocaleString()} ${symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensItemTotalSupplyContainer">
          <span>{totalSupply && decimals ? `${(+formatUnits(totalSupply, decimals)).toLocaleString()} ${symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensAddTokenContainer">
          {symbol && decimals ?
            <Button variant="text" className="TokensAddTokenButton" onClick={() => {
              (window as any).ethereum?.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: props.steadyToken,
                    symbol: symbol,
                    decimals: decimals
                  },
                },
              }).then(() => {
              }, () => {
              });
            }}>
              <img className="TokensAddTokenImg" src={metamaskImage} alt="" />
              <span>{`Add ${symbol}`}</span>
            </Button> : <Skeleton width={80} height={35} variant="text" />
          }
        </div>
      </div>
      <div className="TokensItemMobileContainer">
        <img className="TokensItemMobileTokenImg" src={ethImage} alt="" />
        <div className="TokensItemInfoMobileContainer">
          <span>{symbol ? symbol : <Skeleton width={80} height={35} variant="text" />}</span>
          <span>{balance && decimals ? `${(+formatUnits(balance, decimals)).toLocaleString()} ${symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
      </div>
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default TokenItem;
