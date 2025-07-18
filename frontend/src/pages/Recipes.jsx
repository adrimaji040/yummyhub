// src/components/Recipes.js
import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import AllRecipes from "../components/AllRecipes";
import RecipeSearch from "../components/RecipeSearch";
import CategoryList from "../components/CategoryList";
import { useLocation } from "react-router-dom";

const Recipes = () => {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searching, setSearching] = useState(false); // Estado para indicar si se está buscando
  const location = useLocation();

  // Función para obtener todas las recetas
  const fetchRecipes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/recipes");
      if (!response.ok) throw new Error("Failed to fetch recipes");

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
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError("No categories found");
      }
    };

    fetchCategories();
    fetchRecipes();
  }, []);

  // Filtrar recetas por categoría
  const handleCategorySelect = async (categoryId) => {
    let updatedSelectedCategories;
    if (selectedCategories.includes(categoryId)) {
      updatedSelectedCategories = selectedCategories.filter(
        (id) => id !== categoryId
      );
    } else {
      updatedSelectedCategories = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updatedSelectedCategories);

    if (updatedSelectedCategories.length === 0) {
      fetchRecipes();
    } else {
      try {
        const responses = await Promise.all(
          updatedSelectedCategories.map((id) =>
            fetch(`http://localhost:8000/api/category/${id}`)
          )
        );

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        const combinedRecipes = data.flat();
        const uniqueRecipes = combinedRecipes.filter(
          (recipe, index, self) =>
            index === self.findIndex((r) => r.id === recipe.id)
        );

        setRecipes(uniqueRecipes);
      } catch (error) {
        setError("Failed to fetch recipes by category");
        setRecipes([]);
      }
    }
  };

  // Filtrar recetas por búsqueda
  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/recipes?search=${searchTerm}`
      );
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("No recipes found");
    }
  };

  // Detectar cambios en la búsqueda en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const category = params.get("category");
    if (search) {
      setSearching(true);
      handleSearch(search);
    } else if (category) {
      setSearching(false);
      handleCategorySelect(parseInt(category));
    } else {
      setSearching(false);
      fetchRecipes();
    }
  }, [location.search]);

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        <Grid size={3}>
          <CategoryList
            categories={categories}
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
          />
        </Grid>
        <Grid size={9}>
          <RecipeSearch onSearch={handleSearch} />
          <AllRecipes recipes={recipes} loading={loading} error={error} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Recipes;
