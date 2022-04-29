import { injectedConnector } from "../consts/Networks";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";

export const connectWallet = (activate: any) => {
  activate(injectedConnector);
}

export const getWeb3Provider = (provider: ExternalProvider | JsonRpcFetchFunc) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 3000;
  return library;
}

export const shorterAddress = (str: string | null | undefined) => str && str.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str;
