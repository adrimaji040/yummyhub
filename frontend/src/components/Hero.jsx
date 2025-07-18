import { Typography, Container } from "@mui/material";
import RecipeSearch from "../components/RecipeSearch";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    navigate(`/recipes?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="hero-container">
      <div className="overlay" />
      <div className="content">
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            Fuel your body & soul -<br></br> find recipes that taste amazing!
          </Typography>
          <RecipeSearch onSearch={handleSearch} bg={"white"} />
        </Container>
      </div>
    </div>
  );
}

export default Hero;
