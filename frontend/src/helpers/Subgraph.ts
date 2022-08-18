import { ApolloClient, InMemoryCache } from "@apollo/client";
import { IAppConfig } from "../models/Base";
import { getAppConfig } from "./Utilities";


const config: IAppConfig = getAppConfig();

export const steadyApolloClient = new ApolloClient({
  uri: config.STEADY_SUBGRAPH_URL,
  cache: new InMemoryCache()
});