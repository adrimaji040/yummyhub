import { useState, useEffect } from "react";
import { Alert, Collapse, IconButton, Tooltip, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useUser } from "../store/UserContext";

export default function FavoriteButton({ recipeId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { user } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("http://localhost:8000/api/favorites", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((favorites) => {
        const found = favorites.some((recipe) => recipe.id === recipeId);
        setIsFavorite(found);
      })
      .catch((err) => console.error("Error", err));
  }, [recipeId, isLoggedIn]);

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Ocultar después de 3 seg
      return;
    }

    fetch(`http://localhost:8000/api/recipe/${recipeId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsFavorite((prev) => !prev);
        }
      })
      .catch((err) => console.error("Error al actualizar favorito:", err));
  };

  return (
    <Box>
      <Tooltip title={isLoggedIn ? "" : "Please log in to favorite recipes"}>
        <span>
          <IconButton onClick={toggleFavorite} color="error">
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
