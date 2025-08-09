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
  Button,
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
  const handleShare = async (e, recipe) => {
    e.stopPropagation(); // prevent card click
    const url = `${window.location.origin}/recipe/${recipe.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: "Check out this recipe on YummyHub!",
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } else {
        // very old browsers
        window.prompt("Copy this link:", url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
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

                 {/* Uploader name -> navigate to /user/:id; only render if data exists */}
                {recipe.user_id && recipe.user_name && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${recipe.user_id}`);
                    }}
                    title={`View ${recipe.user_name}'s profile`}
                  >
                    By {recipe.user_name}
                  </Typography>
                )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                My Recipes
              </Typography>
              <Grid container>
                <Grid item xs={12} sx={{ mb: 3 }}>
                  {currentUser && <RecipesByUserCards userId={currentUser.id} />}
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                My Favorite Recipes
              </Typography>
              <Grid container spacing={2}>
                {favorites.length > 0 ? (
                  favorites.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                      <Box
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          p: 2,
                          height: "100%",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {recipe.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {recipe.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Typography>No favorites yet.</Typography>
                )}
              </Grid>
            </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipesCards;
