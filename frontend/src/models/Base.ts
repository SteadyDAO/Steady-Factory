export interface IAppConfig {
  NETWORK: {
    CHAIN_ID: number;
    NAME: string;
    RPC_URL: string;
    BLOCK_EXPLORER: string;
  },
  STEADY_SUBGRAPH_URL: string;
  OPENSEA_ASSETS_URL: string;
  CONTRACTS_ADDRESS: {
    Academy: string;
    ElixirNft: string;
  }
}
