// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipesByUserCards from "../components/RecipesByUserCards";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local

    if (!token) {
      navigate("/login"); // Redirigir a login si no hay token
      return;
    }

    fetch("http://127.0.0.1:8000/api/user", {
      // Endpoint to get the data info
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch user data.");
        setLoading(false);
      });
  }, [navigate]);

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
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4">Profile</Typography>
        {user ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Welcome, {user.name}!</Typography>
            <Typography>Email: {user.email}</Typography>
          </Box>
        ) : (
          <Typography>No user data available.</Typography>
        )}
      </Box>
      {user && <RecipesByUserCards userId={user.id} />}
    </Container>
  );
};

export default Profile;
