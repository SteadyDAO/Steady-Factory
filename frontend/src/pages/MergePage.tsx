import { ApolloProvider } from "@apollo/client";
import Merge from "../components/Merge";
import { steadyApolloClient } from "../helpers/Subgraph";

const MergePage = () => {
  return (
    <div className="MergePageContainer">
      <ApolloProvider client={steadyApolloClient}>
        <Merge />
      </ApolloProvider>
    </div>
  );
}

export default MergePage;
