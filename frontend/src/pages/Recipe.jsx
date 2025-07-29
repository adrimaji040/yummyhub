// src/pages/RecipePage.js
import {
  Avatar,
  Box,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card"; // Asegúrate de que la ruta sea correcta
import Comments from "../components/Comments";
import { red } from "@mui/material/colors";
import FavoriteButton from "../components/FavouriteButton"; // Asegúrate de que la ruta sea correcta

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const { id } = useParams(); // Obtén el ID de la URL
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Aquí podrías también hacer un POST o DELETE a tu API para guardar el estado
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      const apiUrl = `http://localhost:8000/api/recipe/${id}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchRelatedRecipes = async () => {
      const apiUrl = `http://localhost:8000/api/related-recipes/${id}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setRelatedRecipes(data);
      } catch (error) {
        console.error("Error fetching related recipes:", error);
      }
    };

    fetchRecipe();
    fetchRelatedRecipes();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {console.log(recipe)}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Grid size={11}>
            <Typography variant="h4">{recipe.title}</Typography>
            <Grid
              size={4}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {recipe.user_name?.charAt(0).toUpperCase() || "R"}
              </Avatar>
              <Typography>{recipe.user_name}</Typography>
            </Grid>
          </Grid>
          <Grid size={1}>
            <FavoriteButton recipeId={recipe.id} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%" }}>
        <img
          src={
            recipe.cover_photo_url
              ? recipe.cover_photo_url
              : "/upload/default.jpg"
          }
          alt={recipe.title}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f5f5f5",
          width: "100%",
          height: "100px",
          borderRadius: "8px",
          alignItems: "center",
          padding: "0 16px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, textAlign: "center", zIndex: 1 }}>
          <Typography variant="h6">Cooking time:</Typography>
          <span>Total Time: {recipe.cooking_time} mins</span>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center", zIndex: 1 }}>
          <Typography variant="h6">Category:</Typography>
          <span>{recipe.category_name}</span>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center", zIndex: 1 }}>
          <Typography variant="h6">Servings:</Typography>
          <span>{recipe.servings}</span>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center", zIndex: 1 }}>
          <Typography variant="h6">Rating:</Typography>
          <Rating name="read-only" value={recipe.rating} readOnly />
        </Box>
      </Box>

      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        Description:
      </Typography>
      {recipe.description}
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        Instructions:
      </Typography>
      {recipe.instructions}

      <Comments recipeId={recipe.id} />

      <Typography variant="h4" sx={{ pt: 10 }}>
        Related Recipes:
      </Typography>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {relatedRecipes.map((relatedRecipe) => (
          <Grid size={4} key={relatedRecipe.id}>
            <Card recipe={relatedRecipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Recipe;
