import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_PLATFORMS } from "../graphql/alchemist.queries";
import { IPlatform } from "../models/Alchemist";
import PlatformItem from "./PlatformItem";

const Platform = () => {
  const [platforms, setPlatforms] = useState<Array<IPlatform>>([]);
  const { data: getPlatforms, loading: getPlatformsLoading } = useQuery(GET_PLATFORMS, {
    pollInterval: 3000
  });

  useEffect(() => {
    if (getPlatforms && getPlatforms.platforms) {
      setPlatforms(getPlatforms.platforms);
    }
  }, [getPlatforms]);

  return (
    <div className="PlatformContainer">
      <div className="PlatformHeaderContainer">
        <span className="PlatformHeaderTitle">Tokens</span>
      </div>
      <div className="PlatformScrollxContainer">
        <div className="PlatformTokensContainer">
          <div className="PlatformTokensHeaderContainer">
            <span className="PlatformTokensHeaderToken">Token</span>
            <span className="PlatformTokensHeaderTotalValueLocked">Total Value Locked</span>
            <span className="PlatformTokensHeaderTotalSplit">Total Split</span>
            <span className="PlatformTokensHeaderTotalMerged">Total Merged</span>
          </div>
          {getPlatformsLoading ?
            <div className="PlatformSpinnerContainer">
              <CircularProgress color="secondary" size={80} />
            </div> :
            <>
              {platforms.map((platform: IPlatform) => <PlatformItem key={platform.id} platform={platform} />)}
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default Platform;
