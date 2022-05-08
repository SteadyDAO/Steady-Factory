import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import ElixirNft from "./ElixirNft";
import config from '../config/config.json';
import { IOpenseaAsset, OpenseaResponse } from "../models/Ethereum";
import { getContractAddressByName } from "../helpers/Contract";

const Merge = () => {
  const { account, active, activate, chainId, library } = useWeb3React();
  const elixirContractAddress = getContractAddressByName('ElixirNft');
  const [elixirNfts, setElixirNfts] = useState<Array<IOpenseaAsset>>([]);

  useEffect(() => {
    if (account) {
      fetchData(`${config.OPENSEA_API_URL}/assets?owner=${account}`);
    }
    // eslint-disable-next-line
  }, [account]);

  const fetchData = (url: string) => {
    return fetch(url)
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
      <div className="ElixirNftsContainer">
        {elixirNfts.map((elixirNft: IOpenseaAsset) => <ElixirNft key={elixirNft.id} imageUri={elixirNft.image_preview_url} />)}
      </div>
    </div>
  );
}

export default Merge;
