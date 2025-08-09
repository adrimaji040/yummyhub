import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import RecipesByUserCards from "../components/RecipesByUserCards";
import AllRecipes from "../components/AllRecipes";
import { UserContext } from "../store/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext); // has user.token
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [errorFavs, setErrorFavs] = useState("");

  // Load current user
  useEffect(() => {
    const ac = new AbortController();
    async function getUser() {
      try {
        setLoadingUser(true);
        setErrorUser("");
        const res = await fetch("http://localhost:8000/api/user", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setCurrentUser(data);
      } catch (e) {
        if (e.name !== "AbortError") setErrorUser(e.message);
      } finally {
        setLoadingUser(false);
      }
    }
    if (user?.token) getUser();
    return () => ac.abort();
  }, [user]);

  // Load current user's favorites
  useEffect(() => {
    const ac = new AbortController();
    async function getFavorites() {
      try {
        setLoadingFavs(true);
        setErrorFavs("");
        const res = await fetch("http://localhost:8000/api/favorites", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        // If backend ever paginates, swap to: setFavorites(data.data ?? [])
        setFavorites(Array.isArray(data) ? data : data?.data ?? []);
      } catch (e) {
        if (e.name !== "AbortError") setErrorFavs(e.message);
      } finally {
        setLoadingFavs(false);
      }
    }
    if (user?.token) getFavorites();
    return () => ac.abort();
  }, [user]);

  if (loadingUser)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );

  if (errorUser) return <Typography color="error">{errorUser}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Profile</Typography>
        {currentUser ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Welcome, {currentUser.name}!</Typography>
            <Typography>Email: {currentUser.email}</Typography>
          </Box>
        ) : (
          <Typography>No user data available.</Typography>
        )}
      </Box>

      {/* Created by me */}
      <Typography variant="h4" gutterBottom>
        My Recipes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ mb: 3 }}>
          {currentUser && <RecipesByUserCards userId={currentUser.id} />}
        </Grid>
      </Grid>

      {/* Favorited by me */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        My Favorite Recipes
      </Typography>
      <AllRecipes recipes={favorites} loading={loadingFavs} error={errorFavs} />
    </Container>
  );
};

export default Profile;
