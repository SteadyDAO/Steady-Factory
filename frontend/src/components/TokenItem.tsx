import { Button, Skeleton } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import ethImage from '../assets/images/ethereum_icon.svg';
import metamaskImage from '../assets/images/metamask.svg';
import { getABI } from '../helpers/Contract';
import { getAppConfig } from '../helpers/Utilities';
import { IAppConfig } from '../models/Base';
import { ISnackbarConfig } from '../models/Material';
import SnackbarMessage from './Snackbar';

const TokenItem = (props: {
  steadyToken: string;
}) => {
  const config: IAppConfig = getAppConfig();
  const { address } = useAccount();
  const [snackbar, setSnackbar] = useState<ISnackbarConfig>({
    isOpen: false
  } as any);
  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: props.steadyToken,
    chainId: config.NETWORK.CHAIN_ID
  });
  const { data: totalSupply } = useContractRead({
    addressOrName: props.steadyToken,
    contractInterface: getABI('SteadyToken'),
    functionName: 'totalSupply',
    chainId: config.NETWORK.CHAIN_ID
  });
  const { data: name } = useContractRead({
    addressOrName: props.steadyToken,
    contractInterface: getABI('SteadyToken'),
    functionName: 'name',
    chainId: config.NETWORK.CHAIN_ID
  });

  return (
    <>
      <div className="TokensItemContainer">
        <div className="TokensItemTokenContainer">
          <img className="TokensItemTokenImg" src={ethImage} alt="" />
          <span>{name ? name : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensItemBalanceContainer">
          <span>{balanceData?.value && balanceData?.decimals ? `${(+formatUnits(balanceData?.value, balanceData?.decimals)).toLocaleString()} ${balanceData?.symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensItemTotalSupplyContainer">
          <span>{totalSupply && balanceData?.decimals ? `${(+formatUnits(totalSupply, balanceData?.decimals)).toLocaleString()} ${balanceData?.symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
        <div className="TokensAddTokenContainer">
          {balanceData?.symbol && balanceData?.decimals ?
            <Button variant="text" className="TokensAddTokenButton" onClick={() => {
              (window as any).ethereum?.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: props.steadyToken,
                    symbol: balanceData?.symbol,
                    decimals: balanceData?.decimals
                  },
                },
              }).then(() => {
              }, () => {
              });
            }}>
              <img className="TokensAddTokenImg" src={metamaskImage} alt="" />
              <span>{`Add ${balanceData?.symbol}`}</span>
            </Button> : <Skeleton width={80} height={35} variant="text" />
          }
        </div>
      </div>
      <div className="TokensItemMobileContainer">
        <img className="TokensItemMobileTokenImg" src={ethImage} alt="" />
        <div className="TokensItemInfoMobileContainer">
          <span>{balanceData?.symbol ? balanceData?.symbol : <Skeleton width={80} height={35} variant="text" />}</span>
          <span>{balanceData?.value && balanceData?.decimals ? `${(+formatUnits(balanceData?.value, balanceData?.decimals)).toLocaleString()} ${balanceData?.symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
      </div>
      <SnackbarMessage snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
}

export default TokenItem;
