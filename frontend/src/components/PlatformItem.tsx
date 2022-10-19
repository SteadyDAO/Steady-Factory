import { Skeleton } from "@mui/material";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { getContractByAddressName } from "../helpers/Contract";
import { getAppConfig } from "../helpers/Utilities";
import { IPlatform } from "../models/Alchemist";
import { IAppConfig } from "../models/Base";
import ethImage from '../assets/images/ethereum_icon.svg';

const PlatformItem = (props: {
  platform: IPlatform;
}) => {
  const config: IAppConfig = getAppConfig();
  const [tokenName, setTokenName] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [decimals, setDecimals] = useState<string>();

  useEffect(() => {
    const getTokenInfo = async () => {
      const chymeContract = getContractByAddressName(props.platform.id, 'Chyme', new ethers.providers.JsonRpcProvider(config.NETWORK.RPC_URL) as any);
      const name = await chymeContract.name();
      const sb = await chymeContract.symbol();
      const dc = await chymeContract.decimals();
      setTokenName(name);
      setSymbol(sb);
      setDecimals(dc);
    }
    getTokenInfo();
    // eslint-disable-next-line
  }, []);

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
          <span className="PlatformTokensHeaderTotalSplit">{(+formatUnits(props.platform.totalSplit, decimals)).toLocaleString()} {symbol}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
      <div className="PlatformItemTokenContainer">
        {symbol && decimals ?
          <span className="PlatformTokensHeaderTotalMerged">{(+formatUnits(props.platform.totalMerged, decimals)).toLocaleString()} {symbol}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
    </div>
  );
}

export default PlatformItem;
