import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const RecipeSelector = ({ onSelectRecipe, onCancel }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch all user recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch("http://localhost:8000/api/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, recipes]);

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSelectRecipe = () => {
    if (selectedRecipeId) {
      onSelectRecipe(selectedRecipeId, notes);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">Loading recipes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
        <Button
          variant="text"
          onClick={fetchRecipes}
          sx={{ color: "primary.main", "&:hover": { color: "primary.dark" } }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (recipes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No recipes found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Create some recipes first to add them to your meal plan
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            onClick={onCancel}
            variant="contained"
            sx={{
              bgcolor: "grey.500",
              "&:hover": {
                bgcolor: "grey.600",
              },
              color: "common.white",
              px: 3,
              py: 1,
              borderRadius: 1,
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Recipe List */}
      <Paper
        variant="outlined"
        sx={{
          maxHeight: 240,
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        {filteredRecipes.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
            No recipes match your search
          </Box>
        ) : (
          filteredRecipes.map((recipe) => (
            <Box
              key={recipe.id}
              onClick={() => setSelectedRecipeId(recipe.id)}
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "grey.100",
                cursor: "pointer",
                backgroundColor:
                  selectedRecipeId === recipe.id ? "blue.50" : "transparent",
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Radio
                  value={recipe.id}
                  checked={selectedRecipeId === recipe.id}
                  onChange={() => setSelectedRecipeId(recipe.id)}
                  color="primary"
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight="medium" color="text.primary">
                    {recipe.name}
                  </Typography>
                  {recipe.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {recipe.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Notes Input */}
      <Box>
        <Typography
          variant="body2"
          fontWeight="medium"
          color="text.secondary"
          mb={0.5}
        >
          Notes (optional)
        </Typography>
        <TextField
          multiline
          minRows={2}
          placeholder="Add any notes for this meal..."
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Box>

      {/* Action Buttons */}
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSelectRecipe}
          disabled={!selectedRecipeId}
          variant="contained"
          color="primary"
        >
          Add Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeSelector;
