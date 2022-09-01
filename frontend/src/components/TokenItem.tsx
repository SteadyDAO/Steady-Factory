import { Skeleton } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import useEtherSWR from 'ether-swr';
import { formatUnits } from 'ethers/lib/utils';
import ethImage from '../assets/images/ethereum_icon.svg';

const TokenItem = (props: {
  steadyToken: string;
}) => {
  const { account } = useWeb3React();
  
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
    </div>
    <div className="TokensItemMobileContainer">
        <img className="TokensItemMobileTokenImg" src={ethImage} alt="" />
        <div className="TokensItemInfoMobileContainer">
        <span>{symbol ? symbol : <Skeleton width={80} height={35} variant="text" />}</span>
        <span>{balance && decimals ? `${(+formatUnits(balance, decimals)).toLocaleString()} ${symbol}` : <Skeleton width={80} height={35} variant="text" />}</span>
        </div>
    </div>
    </>
  );
}

export default TokenItem;
