export interface IAlchemist {
  id: string;
  count: string;
  alchemist: string;
  chyme: IChyme;
  elixir: IElixir;
}

export interface IChyme {
  id: string;
  alchemists: Array<IAlchemist>;
  symbol: string;
  priceOracle: string;
  steadyToken: string;
}

export interface IElixir {
  id: string;
  tokenId: string;
  ratio: IRatio;
  chyme: IChyme;
}

export interface IRatio {
  label: string;
  value: number;
};

export interface IStrike {
  strikePrice: number;
  forgePrice: number;
  ratio: number;
  alchemist: string;
  priceOracle: string;
}
