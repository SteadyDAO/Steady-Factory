export interface IAlchemist {
  id: string;
  count: string;
  alchemist: string;
  chyme: IChyme;
  elixir: IElixir;
}

export interface IChyme {
  id: string;
  alchemist: IAlchemist;
  symbol: string;
  priceOracle: string;
  steadyToken: string;
}

export interface IElixir {
  id: string;
  tokenId: string;
  status: IStatus;
  chyme: IChyme;
  ratioOfSteady: number;
  forgeConstant: string;
  amount: string;
  dateSplit: string;
  dateMerged: string;
  vault: string;
  owner: string;
}

export type IStatus = 'Split' | 'Merged';

export interface IRatio {
  label: string;
  value: number;
};

export interface IPlatform {
  id: string;
  totalValueLocked: string;
  totalSplit: string;
  totalMerged: string;
};
