import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="HomePageContainer">
      <div className="LaunchAppContainer">
          <Button color="secondary" variant="contained" onClick={() => {
            navigate('/split');
          }}>Launch App</Button>
      </div>
    </div>
  );
}

export default HomePage;
