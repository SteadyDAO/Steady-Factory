import { useEffect, useState } from 'react';
import { IElixir } from '../models/Alchemist';
import { GET_RECENT_ACTIVITY } from '../graphql/alchemist.queries';
import { useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import RecentActivityItem from './RecentActivityItem';

const RecentActivity = () => {
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
            {elixirs.map((elixir: IElixir) => <RecentActivityItem key={elixir.id} elixir={elixir} />)}
          </>
        }
      </div>
    </div>
  );
}

export default RecentActivity;
