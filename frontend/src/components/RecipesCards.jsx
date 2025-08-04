// src/components/Recipes.js
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
  Rating,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const apiUrl = "http://localhost:8000/api/recipes";

const StarRating = styled("div")(({ votes }) => ({
  display: "inline-block",
  "&::before": {
    content: `"${"★".repeat(Math.round(votes / 20))}${"☆".repeat(
      5 - Math.round(votes / 20)
    )}"`,
    color: "gold",
  },
}));

const RecipesCards = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Adriana - Helper function to get the full image URL
  const getImageUrl = (relativePath) => {
    if (!relativePath) {
      return "/images/placeholder-recipe.jpg"; // Fallback image
    }

    // If it's already a full URL, return as is
    if (relativePath.startsWith("http")) {
      return relativePath;
    }

    // Convert relative path to full URL
    return `${backendUrl}/storage/${relativePath}`;
  };

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const limitedRecipes = data.slice(0, 4); // Limitar a las primeras 4 recetas
        console.log(limitedRecipes);
        setRecipes(limitedRecipes);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  //Adriana - to show fallback images if loading fails
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = "/images/placeholder-recipe.jpg"; // Fallback on error
  };

  return (
    <Container sx={{ my: 10 }}>
      <Box sx={{ mt: 6, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              Effortless Eats
            </Typography>
            <Typography component="h2">
              Satisfy your cravings in a flash! Explore our Quick & Easy Meals
              for effortless recipes without compromising on mouthwatering
              taste.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} alignItems="center">
            <Typography
              align="right"
              sx={{
                textDecoration: "none", // Quita el subrayado
                fontSize: "14px", // Ajusta el tamaño de la fuente
              }}
            >
              <Link
                to="/recipes" // Usar 'to' en lugar de 'href' si estás usando React Router
                variant="body1"
                color="primary"
                textDecoration="none"
              >
                VIEW ALL RECIPES
              </Link>
              <ArrowForwardIcon sx={{ ml: 1, fontSize: "14px" }} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item size={3} key={recipe.id}>
            {console.log(recipe)}
            <Card
              onClick={() => handleCardClick(recipe.id)}
              sx={{
                cursor: "pointer",
                height: 340,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {console.log(
                "Image URL for",
                recipe.title,
                ":",
                recipe.cover_photo_url
              )}
              <CardMedia
                component="img"
                height="160"
                image={recipe.cover_photo_url}
                alt={recipe.title}
                sx={{ objectFit: "cover" }}
                onError={handleImageError}
                onLoad={() =>
                  console.log("Image loaded successfully:", recipe.title)
                }
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography gutterBottom component="div" fontWeight={450}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Time: {recipe.cooking_time} mins
                </Typography>
                <Rating name="read-only" value={recipe.rating} readOnly />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipesCards;
