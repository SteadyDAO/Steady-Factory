import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import ElixirNft from "./ElixirNft";
import { getABIs, getContractAddressByName } from "../helpers/Contract";
import { Button, CircularProgress, ToggleButton, ToggleButtonGroup } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from "@apollo/client";
import { GET_ALCHEMISTS, GET_ELIXIR_BY_ACCOUNT } from "../graphql/alchemist.queries";
import { IAlchemist, IElixir } from "../models/Alchemist";
import { EtherSWRConfig } from "ether-swr";
import TokenItem from "./TokenItem";
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "../helpers/Utilities";

const Merge = () => {
  const config: IAppConfig = getAppConfig();
  const { account, active, chainId, library } = useWeb3React();
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const academyContractAddress = getContractAddressByName('Academy');
  const [elixirNfts, setElixirNfts] = useState<Array<any>>([]);
  const [alchemists, setAlchemists] = useState<Array<IAlchemist>>([]);
  const [toggle, setToggle] = useState<string>('nfts');
  const { data: getAlchemists, loading: getAlchemistsLoading } = useQuery(GET_ALCHEMISTS, {
  });
  const { data: getElixirsByAccount, loading: getElixirsByAccountLoading, refetch: refetchElixirsByAccount } = useQuery(GET_ELIXIR_BY_ACCOUNT, {
    variables: {
      account
    },
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    if (getAlchemists && getAlchemists.alchemists) {
      setAlchemists(getAlchemists.alchemists);
    }
  }, [getAlchemists]);

  useEffect(() => {
    if (getElixirsByAccount && getElixirsByAccount.elixirs) {
      setElixirNfts(getElixirsByAccount.elixirs);
    }
  }, [getElixirsByAccount]);

  return (
    <>
      {active && chainId === config.NETWORK.CHAIN_ID ?
        <div className="MergeContainer">
          <div className="MergeTitleContainer">
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
              <ToggleButton className="MergeToggleButton" value="nfts">Elixirs</ToggleButton>
              <ToggleButton className="MergeToggleButton" value="tokens">Tokens</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {toggle === 'nfts' ?
            <>
              <div className="MergeActions">
                <Button color="secondary" variant="contained" onClick={() => {
                  refetchElixirsByAccount()
                  }}>
                  <RefreshIcon />
                  Refresh
                </Button>
              </div>
              {getElixirsByAccountLoading ?
                <div className="ElixirNftsSpinnerContainer">
                  <CircularProgress color="secondary" size={80} />
                </div> :
                <>
                  {elixirNfts.length > 0 ?
                    <div className="ElixirNftsContainer">
                      <EtherSWRConfig
                        value={{
                          web3Provider: library,
                          ABIs: new Map(getABIs([
                            { contractName: 'ElixirNft', contractAddress: elixirContractAddress },
                            { contractName: 'Academy', contractAddress: academyContractAddress },
                          ])),
                          refreshInterval: 1000
                        }}>
                        {elixirNfts.map((elixirNft: IElixir) => <ElixirNft key={elixirNft.id} elixirNft={elixirNft} />)}
                      </EtherSWRConfig>
                    </div> :
                    <span className="NoElixirNftMessage">Please try refreshing in a few minutes to see your Elixir's.</span>
                  }
                </>
              }
            </> :
            <>
              <div className="TokensContainer">
                <div className="TokensHeaderContainer">
                  <span className="TokensHeaderToken">Token</span>
                  <span className="TokensHeaderBalance">Agg. Balance</span>
                  <span className="TokensHeaderTotalSupply">Total Supply</span>
                </div>
                {getAlchemistsLoading ?
                  <div className="ElixirNftsSpinnerContainer">
                    <CircularProgress color="secondary" size={80} />
                  </div> :
                  <>
                    {alchemists && alchemists.length > 0 ?
                      <>
                        {alchemists.map((alchemist: IAlchemist) =>
                          <EtherSWRConfig
                            key={alchemist.id}
                            value={{
                              web3Provider: library,
                              ABIs: new Map(getABIs([
                                { contractName: 'SteadyToken', contractAddress: alchemist.chyme.steadyToken }
                              ])),
                              refreshInterval: 1000
                            }}>
                            <TokenItem steadyToken={alchemist.chyme.steadyToken} />
                          </EtherSWRConfig>)}
                      </> : <></>
                    }
                  </>
                }
              </div>
            </>
          }
          <></>
        </div> : <></>
      }
    </>
  );
}

export default Merge;
