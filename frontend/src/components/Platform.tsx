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
      <h2>Platforms</h2>
      {getPlatformsLoading ?
        <div className="ElixirNftsSpinnerContainer">
          <CircularProgress color="secondary" size={80} />
        </div> :
        <div className="PlatformListContainer">
          {platforms.map((platform: IPlatform) => <PlatformItem key={platform.id} platform={platform} />)}
        </div>
      }
    </div>
  );
}

export default Platform;
