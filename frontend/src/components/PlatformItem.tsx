import { Skeleton } from "@mui/material";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { getContractByAddressName } from "../helpers/Contract";
import { getAppConfig } from "../helpers/Utilities";
import { IPlatform } from "../models/Alchemist";
import { IAppConfig } from "../models/Base";

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
  }, []);

  return (
    <div className="PlatformItemContainer">
      <div className="PlatformItemHeader">
        {tokenName ?
          <span className="PlatformItemTokenName">{tokenName}</span> :
          <Skeleton width={80} height={35} variant="text" />
        }
      </div>
      <div className="PlatformItemContent">
        <div className="PlatformItemValue">
          <span className="PlatformItemValueLabel">Total Value Locked</span>
          {symbol && decimals ?
            <span className="PlatformItemValueLocked">{(+formatUnits(props.platform.totalValueLocked, decimals)).toLocaleString()} {symbol}</span> :
            <Skeleton width={80} height={35} variant="text" />
          }
        </div>
        <div className="PlatformItemValue">
          <span className="PlatformItemValueLabel">Total Split</span>
          {symbol && decimals ?
            <span className="PlatformItemValueLocked">{(+formatUnits(props.platform.totalSplit, decimals)).toLocaleString()} {symbol}</span> :
            <Skeleton width={80} height={35} variant="text" />
          }
        </div>
        <div className="PlatformItemValue">
          <span className="PlatformItemValueLabel">Total Merged</span>
          {symbol && decimals ?
            <span className="PlatformItemValueLocked">{(+formatUnits(props.platform.totalMerged, decimals)).toLocaleString()} {symbol}</span> :
            <Skeleton width={80} height={35} variant="text" />
          }
        </div>
      </div>
    </div>
  );
}

export default PlatformItem;
