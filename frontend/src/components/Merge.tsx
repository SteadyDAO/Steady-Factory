import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import ElixirNft from "./ElixirNft";
import config from '../config/config.json';
import { IOpenseaAsset, OpenseaResponse } from "../models/Ethereum";
import { getContractAddressByName } from "../helpers/Contract";
import { Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const Merge = () => {
  const { account, active, activate, chainId, library } = useWeb3React();
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const [elixirNfts, setElixirNfts] = useState<Array<IOpenseaAsset>>([]);

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  const fetchData = () => {
    return fetch(`${config.OPENSEA_API_URL}/assets?owner=${account}`)
      .then((response) => response.json())
      .then((data: OpenseaResponse) => {
        const nfts = data.assets.filter(
          (asset: IOpenseaAsset) => asset.asset_contract.address.toLocaleLowerCase() === elixirContractAddress.toLocaleLowerCase()
        );
        setElixirNfts(nfts);
      });
  }

  return (
    <div className="MergeContainer">
      <div className="MergeTitleContainer">
        <span className="MergeTitle">Elixir Nfts</span>
      </div>
      <div className="MergeActions">
        <Button color="secondary" variant="contained" onClick={fetchData}>
          <RefreshIcon />
          Refresh
        </Button>
      </div>
      {elixirNfts.length > 0 ?
      <div className="ElixirNftsContainer">
        {elixirNfts.map((elixirNft: IOpenseaAsset) => <ElixirNft key={elixirNft.id} imageUri={elixirNft.image_preview_url} permalink={elixirNft.permalink} />)}
      </div> :
      <span className="NoElixirNftMessage">You have no Elixir NFT yet.</span>
      }
    </div>
  );
}

export default Merge;
