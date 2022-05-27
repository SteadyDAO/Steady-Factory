import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import ElixirNft from "./ElixirNft";
import config from '../config/config.json';
import { IOpenseaAsset, OpenseaResponse } from "../models/Ethereum";
import { getABIs, getContractAddressByName } from "../helpers/Contract";
import { Button, CircularProgress, ToggleButton, ToggleButtonGroup } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { connectWallet } from "../helpers/Wallet";
import { useQuery } from "@apollo/client";
import { GET_ALCHEMISTS } from "../graphql/alchemist.queries";
import { IAlchemist } from "../models/Alchemist";
import { EtherSWRConfig } from "ether-swr";
import TokenItem from "./TokenItem";
import ConnectWallet from "./ConnectWallet";

const Merge = () => {
  const { account, active, activate, chainId, library } = useWeb3React();
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const academyContractAddress = getContractAddressByName('Academy');
  const [elixirNfts, setElixirNfts] = useState<Array<IOpenseaAsset>>([]);
  const [isLoadingElixirNfts, setIsLoadingElixirNfts] = useState<boolean>(false);
  const [alchemists, setAlchemists] = useState<Array<IAlchemist>>([]);
  const [toggle, setToggle] = useState<string>('nfts');
  const { data: getAlchemists, loading } = useQuery(GET_ALCHEMISTS, {
    pollInterval: 30000
  });

  useEffect(() => {
    if (account) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [account]);

  useEffect(() => {
    if (getAlchemists && getAlchemists.alchemists) {
      setAlchemists(getAlchemists.alchemists);
    }
  }, [getAlchemists]);

  const fetchData = () => {
    setIsLoadingElixirNfts(true);
    return fetch(`${config.OPENSEA_API_URL}/assets?owner=${account}`, { cache: 'no-cache' })
      .then((response) => response.json())
      .then((data: OpenseaResponse) => {
        const nfts = data.assets.filter(
          (asset: IOpenseaAsset) => asset.asset_contract.address.toLocaleLowerCase() === elixirContractAddress.toLocaleLowerCase()
        );
        setElixirNfts(nfts);
      }).finally(() => {
        setIsLoadingElixirNfts(false);
      });
  }

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
              <ToggleButton className="MergeToggleButton" value="nfts">NFTS</ToggleButton>
              <ToggleButton className="MergeToggleButton" value="tokens">TOKENS</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {toggle === 'nfts' ?
            <>
              <div className="MergeActions">
                <Button color="secondary" variant="contained" onClick={fetchData}>
                  <RefreshIcon />
                  Refresh
                </Button>
              </div>
              {isLoadingElixirNfts ?
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
                        {elixirNfts.map((elixirNft: IOpenseaAsset) => <ElixirNft key={elixirNft.id} elixirNft={elixirNft} />)}
                      </EtherSWRConfig>
                    </div> :
                    <span className="NoElixirNftMessage">You have no Elixir NFT yet.</span>
                  }
                </>
              }
            </> :
            <>
              <div className="TokensContainer">
                <div className="TokensHeaderContainer">
                  <span className="TokensHeaderToken">Token</span>
                  <span className="TokensHeaderBalance">Balance</span>
                  <span className="TokensHeaderTotalSupply">Total Supply</span>
                </div>
                {loading ?
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
                      </> :
                      <span className="NoElixirNftMessage">You have no steady token yet.</span>
                    }
                  </>
                }
              </div>
            </>
          }
          <></>
        </div> :
        <div className="MergeActions">
          <ConnectWallet />
        </div>
      }
    </>
  );
}

export default Merge;
