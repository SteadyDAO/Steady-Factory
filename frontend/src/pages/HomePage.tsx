import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { steadyApolloClient } from "../helpers/Subgraph";
import { ApolloProvider } from "@apollo/client";
import Platform from "../components/Platform";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="HomePageContainer">
      <div className="HomepageIntroContainer">
        <h2>Steady DAO</h2>
        <h3>DAO for gold backed stablecoin forging and DeFi.</h3>
        <Button className="HomepageLaunchAppButton" color="primary" variant="contained" onClick={() => {
          navigate('/split');
        }}>
          <RocketLaunchIcon fontSize="medium" />
          <span className="HomepageLaunchAppButtonText">Launch App</span>
        </Button>
      </div>

      <ApolloProvider client={steadyApolloClient}>
        <Platform />
      </ApolloProvider>
    </div>
  );
}

export default HomePage;
