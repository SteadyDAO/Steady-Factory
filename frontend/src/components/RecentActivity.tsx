import MergeTypeIcon from '@mui/icons-material/MergeType';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEffect, useState } from 'react';
import { IElixir } from '../models/Alchemist';
import { GET_RECENT_ACTIVITY } from '../graphql/alchemist.queries';
import { useQuery } from '@apollo/client';
import { CircularProgress, Tooltip } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { IAppConfig } from '../models/Base';
import { getAppConfig } from '../helpers/Utilities';
import moment from "moment";

const RecentActivity = () => {
  const config: IAppConfig = getAppConfig();
  const [elixirs, setElixirs] = useState<Array<IElixir>>([]);
  const { data: getElixirs, loading: getElixirsLoading } = useQuery(GET_RECENT_ACTIVITY, {
    pollInterval: 3000
  });

  useEffect(() => {
    if (getElixirs && getElixirs.elixirs) {
      setElixirs(getElixirs.elixirs);
    }
  }, [getElixirs]);

  return (
    <div className="RecentActivityContainer">
      <div className="RecentActivityHeaderContainer">
        <span className="RecentActivityHeaderTitle">Recent Activity</span>
      </div>
      <div className="RecentActivityItemsContainer">
        {getElixirsLoading ?
          <div className="PlatformSpinnerContainer">
            <CircularProgress color="secondary" size={80} />
          </div> :
          <>
            {elixirs.map((elixir: IElixir) => <div className="RecentActivityItemContainer" key={elixir.id}>
              {elixir.status === 'Split' ?
                <>
                  <CallSplitIcon className="RecentActivityItemIcon" fontSize="inherit" />
                  <div className="RecentActivityItemInfoContainer">
                    <span className="RecentActivityItemTitle">Split {formatUnits(elixir.amount, elixir.chyme?.symbol === 'STT' ? 8 : 18)} {elixir.chyme?.symbol}</span>
                    <div className="RecentActivityItemInfoDetailsContainer">
                      <span className="RecentActivityItemInfoTime">{moment(+elixir.dateSplit * 1000).format('DD MMMM yyyy')}</span>
                      <Tooltip title="View address on explorer">
                        <span className="RecentActivityItemInfoAddress" onClick={() => {
                          window.open(`${config.NETWORK.BLOCK_EXPLORER}/address/${elixir.owner}`, '_blank');
                        }}>{elixir.owner}</span>
                      </Tooltip>
                      <Tooltip title="View transaction on explorer">
                        <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" onClick={() => {
                          window.open(`${config.NETWORK.BLOCK_EXPLORER}/tx/${elixir.splitTxId}`, '_blank');
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
                      <span className="RecentActivityItemInfoTime">{moment(+elixir.dateMerged * 1000).format('DD MMMM yyyy')}</span>
                      <Tooltip title="View address on explorer">
                        <span className="RecentActivityItemInfoAddress" onClick={() => {
                          window.open(`${config.NETWORK.BLOCK_EXPLORER}/address/${elixir.owner}`, '_blank');
                        }}>{elixir.owner}</span>
                      </Tooltip>
                      <Tooltip title="View transaction on explorer">
                        <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" onClick={() => {
                          window.open(`${config.NETWORK.BLOCK_EXPLORER}/tx/${elixir.mergeTxId}`, '_blank');
                        }} />
                      </Tooltip>
                    </div>
                  </div>
                </>
              }
            </div>
            )}
          </>
        }
      </div>
    </div>
  );
}

export default RecentActivity;
