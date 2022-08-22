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
  status: IStatus;
  chyme: IChyme;
}

export type IStatus = 'Split' | 'Merged';

export interface IRatio {
  label: string;
  value: number;
};
