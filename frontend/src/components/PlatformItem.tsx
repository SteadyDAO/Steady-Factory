import { Skeleton } from "@mui/material";
import { formatUnits } from "ethers/lib/utils";
import { getABI } from "../helpers/Contract";
import { getAppConfig } from "../helpers/Utilities";
import { IPlatform } from "../models/Alchemist";
import { IAppConfig } from "../models/Base";
import ethImage from '../assets/images/ethereum_icon.svg';
import { useContractRead } from "wagmi";

const PlatformItem = (props: {
  platform: IPlatform;
}) => {
  const config: IAppConfig = getAppConfig();

  const { data: tokenName } = useContractRead({
    addressOrName: props.platform.id,
    contractInterface: getABI('Chyme'),
    functionName: 'name',
    chainId: config.NETWORK.CHAIN_ID,
    watch: true,
    cacheTime: 3000
  });

  const { data: symbol } = useContractRead({
    addressOrName: props.platform.id,
    contractInterface: getABI('Chyme'),
    functionName: 'symbol',
    chainId: config.NETWORK.CHAIN_ID,
    watch: true,
    cacheTime: 3000
  });

  const { data: decimals } = useContractRead({
    addressOrName: props.platform.id,
    contractInterface: getABI('Chyme'),
    functionName: 'decimals',
    chainId: config.NETWORK.CHAIN_ID,
    watch: true,
    cacheTime: 3000
  });

  return (
    <div className="PlatformItemContainer">
      <div className="PlatformItemTokenContainer">
        <img width={36} height={36} src={ethImage} alt="" />
        {symbol && tokenName ?
          <div className="PlatformItemTokenNameContainer">
            <div className="PlatformItemTokenSymbolContainer">
              <span className="PlatformItemTokenSymbol">{symbol}</span>
            </div>
            <span className="PlatformItemTokenName">{tokenName}</span>
          </div> : <Skeleton width={80} height={35} variant="text" />
        }
      </div>
      <div className="PlatformItemTokenContainer">
        {symbol && decimals ?
          <span className="PlatformTokensItemTotalValueLocked">{(+formatUnits(props.platform.totalValueLocked, decimals)).toLocaleString()} {symbol}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
      <div className="PlatformItemTokenContainer">
        {symbol && decimals ?
          <span className="PlatformTokensItemTotalSplit">{(+formatUnits(props.platform.totalSplit, decimals)).toLocaleString()} {symbol}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
      <div className="PlatformItemTokenContainer">
        {symbol && decimals ?
          <span className="PlatformTokensItemTotalMerged">{(+formatUnits(props.platform.totalMerged, decimals)).toLocaleString()} {symbol}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
    </div>
  );
}

export default PlatformItem;
