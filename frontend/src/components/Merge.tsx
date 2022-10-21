import { useEffect, useState } from "react";
import ElixirNft from "./ElixirNft";
import { CircularProgress, IconButton, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from "@apollo/client";
import { GET_ALCHEMISTS, GET_ELIXIR_BY_ACCOUNT } from "../graphql/alchemist.queries";
import { IAlchemist, IElixir } from "../models/Alchemist";
import TokenItem from "./TokenItem";
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "../helpers/Utilities";
import { useAccount, useNetwork } from "wagmi";

const Merge = () => {
  const config: IAppConfig = getAppConfig();
  const [elixirNfts, setElixirNfts] = useState<Array<any>>([]);
  const [alchemists, setAlchemists] = useState<Array<IAlchemist>>([]);
  const [toggle, setToggle] = useState<string>('tokens');
  const [nftsFiltersItems, setNftsFiltersItems] = useState<Array<string>>([]);
  const [nftsFiltersValue, setNftsFiltersValue] = useState<Array<string>>([]);
  const { data: getAlchemists, loading: getAlchemistsLoading, refetch: refetchAlchemists } = useQuery(GET_ALCHEMISTS, {
    notifyOnNetworkStatusChange: true
  });

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: getElixirsByAccount, loading: getElixirsByAccountLoading, refetch: refetchElixirsByAccount } = useQuery(GET_ELIXIR_BY_ACCOUNT, {
    variables: {
      account: address,
      chymeIds: []
    },
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    if (getAlchemists && getAlchemists.alchemists) {
      setAlchemists(getAlchemists.alchemists);
      setNftsFiltersItems([
        ...getAlchemists.alchemists.map((alchemist: IAlchemist) => alchemist.chyme.symbol)
      ]);
      setNftsFiltersValue([
        ...getAlchemists.alchemists.map((alchemist: IAlchemist) => alchemist.chyme.symbol)
      ]);
      const chymeIds: Array<string> = getAlchemists.alchemists.map((alchemist: IAlchemist) => alchemist.chyme.id);
      refetchElixirsByAccount({
        account: address,
        chymeIds: chymeIds as any
      });
    }
    // eslint-disable-next-line
  }, [getAlchemists]);

  useEffect(() => {
    if (getElixirsByAccount && getElixirsByAccount.elixirs) {
      setElixirNfts(getElixirsByAccount.elixirs);
    }
  }, [getElixirsByAccount]);

  const onFiltersChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    setNftsFiltersValue(
      typeof value === 'string' ? value.split(',') : value,
    );
    const alcmists: Array<IAlchemist> = alchemists.filter(alchemist => value.find((vl: string) => alchemist.chyme.symbol === vl));
    const chymeIds: Array<string> = alcmists.map((alc: IAlchemist) => alc.chyme.id);
    refetchElixirsByAccount({
      account: address,
      chymeIds: chymeIds as any
    });
  }

  return (
    <>
      <div className="MergeContainer">
        <div className="MergeHeaderContainer">
          <div className="MergeHeaderTitleContainer">
            <span className="MergeHeaderTitle">Assets</span>
            <IconButton color="primary" onClick={() => {
              if (toggle === 'tokens') {
                refetchAlchemists();
              } else {
                refetchElixirsByAccount();
              }
            }}>
              <RefreshIcon />
            </IconButton>
          </div>
          <ToggleButtonGroup
            className="MergeToggleButtons"
            color="primary"
            value={toggle}
            exclusive
            onChange={(event: any, newValue: string) => {
              if (newValue) {
                setToggle(newValue);
              }
            }}
          >
            <ToggleButton className="MergeToggleButton" value="tokens">Steady Tokens</ToggleButton>
            <ToggleButton className="MergeToggleButton" value="nfts">Leveraged Tokens</ToggleButton>
          </ToggleButtonGroup>
        </div>
        {toggle === 'tokens' ?
          <div className="MergeSteadyTokensScrollxContainer">
            <div className="MergeSteadyTokensContainer">
              <div className="MergeSteadyTokensHeaderContainer">
                <span className="MergeSteadyTokensHeaderToken">Token</span>
                <span className="MergeSteadyTokensHeaderBalance">My Agg. Balance</span>
                <span className="MergeSteadyTokensHeaderTotalSupply">Total Supply</span>
              </div>
              {getAlchemistsLoading ?
                <div className="MergeSpinnerContainer">
                  <CircularProgress color="secondary" size={80} />
                </div> :
                <>
                  {alchemists && alchemists.length > 0 ?
                    <>
                      {alchemists.map((alchemist: IAlchemist) =>
                        <TokenItem key={alchemist.id} steadyToken={alchemist.chyme.steadyToken} />
                      )}
                    </> : <></>
                  }
                </>
              }
            </div>
          </div> :
          <div className="MergeLeveragedTokensContainer">
            {getElixirsByAccountLoading ?
              <div className="ElixirNftsSpinnerContainer">
                <CircularProgress color="secondary" size={80} />
              </div> :
              <>
                {elixirNfts.length > 0 ?
                  <>
                    <span className="NoElixirNftMessage">Please note that it will take a while for these NFT's to appear here and on Opensea!</span>
                    <div className="ElixirNftsContainer">
                      {elixirNfts.map((elixirNft: IElixir) => <ElixirNft key={elixirNft.id} elixirNft={elixirNft} />)}
                    </div>
                  </> : <span className="NoElixirNftMessage">Please try refreshing in a few minutes to see your Elixir's.</span>
                }
              </>
            }
          </div>
        }
      </div>
    </>
  );
}

export default Merge;
