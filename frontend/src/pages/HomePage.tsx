import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { steadyApolloClient } from "../helpers/Subgraph";
import { ApolloProvider } from "@apollo/client";
import Platform from "../components/Platform";
import steadyIntroGif from '../assets/images/steady-intro.gif';
import RecentActivity from "../components/RecentActivity";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="HomePageContainer">
      <div className="HomepageIntroContainer">
        <div className="HomepageIntroSection">
        <h2>Steady DAO</h2>
        <h3>Steady DAO forges steady coins for any asset that has a chainlink price feed. You are free to add tokens to the system, but subject to governance approval.</h3>
        <Button className="HomepageLaunchAppButton" color="secondary" variant="contained" onClick={() => {
          navigate('/split');
        }}>
          <RocketLaunchIcon fontSize="medium" />
          <span className="HomepageLaunchAppButtonText">Launch App</span>
        </Button>
        </div>
        <div className="HomepageIntroSection">
          <img className="SteadyIntroGif" src={steadyIntroGif} alt="Steady Intro Gif" />
          </div>
      </div>

      <ApolloProvider client={steadyApolloClient}>
        <Platform />
        <RecentActivity />
      </ApolloProvider>
    </div>
  );
}

export default HomePage;
