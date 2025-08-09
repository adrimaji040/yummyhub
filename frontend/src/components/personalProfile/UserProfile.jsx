import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import RecipesByUserCards from "../RecipesByUserCards";
import AllRecipes from "../AllRecipes"; 

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // favorites state
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`http://localhost:8000/api/users/${id}`, {
      headers: { Accept: "application/json" },
      signal: ac.signal,
    })
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Error loading user:", err);
      })
      .finally(() => setLoadingUser(false));
    return () => ac.abort();
  }, [id]);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`http://localhost:8000/api/users/${id}/favorites`, {
      headers: { Accept: "application/json" },
      signal: ac.signal,
    })
      .then((res) => res.json())
      .then((data) => setFavorites(Array.isArray(data) ? data : data?.data ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Error loading favorites:", err);
      })
      .finally(() => setLoadingFavs(false));
    return () => ac.abort();
  }, [id]);

  if (loadingUser)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!user?.id) return <Typography>User not found.</Typography>;

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        {user.name}'s Profile
      </Typography>

      {user.profile_picture && (
        <img
          src={`http://localhost:8000/storage/${user.profile_picture}`}
          alt="Profile"
          style={{ width: 120, borderRadius: "50%", marginBottom: 20 }}
        />
      )}

      {/* Created by user */}
      <Typography variant="h5" gutterBottom>
        Recipes by {user.name}
      </Typography>
      <Grid container>
        <Grid item xs={12}>
          <RecipesByUserCards userId={user.id} />
        </Grid>
      </Grid>

      {/* Favorited by user */}
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        {user.name}'s Favorite Recipes
      </Typography>
      <AllRecipes recipes={favorites} loading={loadingFavs} error={null} />
    </Container>
  );
}
