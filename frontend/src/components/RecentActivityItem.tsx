import { getAppConfig } from "../helpers/Utilities";
import { IElixir } from "../models/Alchemist";
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IAppConfig } from "../models/Base";
import { formatUnits } from 'ethers/lib/utils';
import moment from "moment";
import { Skeleton, Tooltip } from "@mui/material";
import { useContractRead } from "wagmi";
import { getABI } from "../helpers/Contract";

const RecentActivityItem = (props: {
  elixir: IElixir
}) => {
  const config: IAppConfig = getAppConfig();

  const { data: decimals } = useContractRead({
    addressOrName: props.elixir.chyme.id,
    contractInterface: getABI('Chyme'),
    functionName: 'decimals',
    chainId: config.NETWORK.CHAIN_ID
  });
  return (
    <div className="RecentActivityItemContainer">
      {props.elixir.status === 'Split' ?
        <>
          <CallSplitIcon className="RecentActivityItemIcon" fontSize="inherit" />
          <div className="RecentActivityItemInfoContainer">
            {decimals ?
              <span className="RecentActivityItemTitle">{`Split ${formatUnits(props.elixir.amount, decimals)} ${props.elixir.chyme?.symbol}`}</span> : <Skeleton height={35} width={100} />
            }
            <div className="RecentActivityItemInfoDetailsContainer">
              <span className="RecentActivityItemInfoTime">{moment(+props.elixir.dateSplit * 1000).format('DD MMMM yyyy')}</span>
              <Tooltip title="View address on explorer">
                <span className="RecentActivityItemInfoAddress" onClick={() => {
                  window.open(`${config.NETWORK.BLOCK_EXPLORER}address/${props.elixir.owner}`, '_blank');
                }}>{props.elixir.owner}</span>
              </Tooltip>
              <Tooltip title="View transaction on explorer">
                <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" onClick={() => {
                  window.open(`${config.NETWORK.BLOCK_EXPLORER}tx/${props.elixir.splitTxId}`, '_blank');
                }} />
              </Tooltip>
            </div>
          </div>
        </> :
        <>
          <MergeTypeIcon className="RecentActivityItemIcon" fontSize="inherit" />
          <div className="RecentActivityItemInfoContainer">
            <span className="RecentActivityItemTitle">Merged 1 Leveraged NFT</span>
            <div className="RecentActivityItemInfoDetailsContainer">
              <span className="RecentActivityItemInfoTime">{moment(+props.elixir.dateMerged * 1000).format('DD MMMM yyyy')}</span>
              <Tooltip title="View address on explorer">
                <span className="RecentActivityItemInfoAddress" onClick={() => {
                  window.open(`${config.NETWORK.BLOCK_EXPLORER}address/${props.elixir.owner}`, '_blank');
                }}>{props.elixir.owner}</span>
              </Tooltip>
              <Tooltip title="View transaction on explorer">
                <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" onClick={() => {
                  window.open(`${config.NETWORK.BLOCK_EXPLORER}tx/${props.elixir.mergeTxId}`, '_blank');
                }} />
              </Tooltip>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default RecentActivityItem;
