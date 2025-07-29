// src/components/Recipes.js
import { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import AllRecipes from "../components/AllRecipes";

import { useContext } from "react";
import { UserContext } from "../store/UserContext";

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(UserContext);

  // Función para obtener todas las recetas
  const fetchRecipes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/favorites", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`, // el token del usuario logueado
        },
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data = await response.json();

      const sortedRecipes = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setRecipes(sortedRecipes.slice(0, 12));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchRecipes();
    }
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container>
        <Grid size={12} sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Favorites
          </Typography>
          <AllRecipes recipes={recipes} loading={loading} error={error} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Favorites;
