import React, { useState, useEffect } from "react";
import {
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import CardWithMenu from "./CardWithMenu"; // Importa el componente CardWithMenu

const RecipesByUserCards = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/${userId}/recipes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchRecipes();
  }, [userId]);

  const handleEdit = (recipe) => {
    console.log("Edit", recipe);
  };

  const handleDelete = async (recipe) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/recipe/${recipe.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setRecipes(recipes.filter((r) => r.id !== recipe.id));
        setSnackbarMessage("Recipe deleted successfully");
        setSnackbarSeverity("success");
      } else {
        const errorText = await response.text();
        setSnackbarMessage(`Error deleting recipe: ${errorText}`);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setSnackbarMessage("Error deleting recipe: " + error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true); // Show the snackbar
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {recipes.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 5 }}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={3} key={recipe.id}>
                  <CardWithMenu
                    recipe={recipe}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                It looks like you don't have any recipes yet. Start creating
                your first recipe!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                component="a"
                href="/recipe/add"
              >
                Add a Recipe
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position the Snackbar
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecipesByUserCards;
