import { ApolloProvider } from "@apollo/client";
import Merge from "../components/Merge";
import Split from "../components/Split";
import { steadyApolloClient } from "../helpers/Subgraph";

const SplitPage = () => {
  return (
    <div className="SplitPageContainer">
      <ApolloProvider client={steadyApolloClient}>
        <Split />
        <Merge />
      </ApolloProvider>
    </div>
  );
}

export default SplitPage;
