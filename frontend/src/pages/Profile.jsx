import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Skeleton,
  Grid,
} from "@mui/material";
import RecipesByUserCards from "../components/RecipesByUserCards";
import { UserContext } from "../store/UserContext";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(UserContext);

  const getUser = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getUser();
    }
  }, [user]);

  if (loading)
    return (
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
    );

  if (error) return <Typography color="error">{error}</Typography>;

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

      <Typography variant="h4" gutterBottom>
        My recipes
      </Typography>
      <Grid container>
        <Grid size={12} sx={{ mb: 3 }}>
          {currentUser && <RecipesByUserCards userId={currentUser.id} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
