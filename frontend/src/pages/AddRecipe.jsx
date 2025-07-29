// src/components/AddRecipe.js
import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormRecipe from "../components/FormRecipe";

const AddRecipe = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);

  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState(1);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default category ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError("Failed to load user data.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError("Failed to load categories.", error.message);
      }
    };

    fetchUser();
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("User data not loaded yet.");
      return;
    }

    const userId = user.id;

    const formData = new FormData();
    formData.append("title", title);
    if (coverPhoto) {
      formData.append("cover_photo_url", coverPhoto);
    }
    formData.append("description", description);
    formData.append("instructions", instructions);
    formData.append("cooking_time", cookingTime);
    formData.append("servings", servings);
    formData.append("category_id", selectedCategory); // Add selected category ID
    formData.append("user_id", userId);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][id]`, ingredient.id);
      formData.append(
        `ingredients[${index}][quantity]`,
        parseInt(ingredient.quantity)
      );
      formData.append(`ingredients[${index}][unit_id]`, ingredient.unit_id);
    });

    console.log(Array.from(formData.entries()));

    fetch(`http://127.0.0.1:8000/api/recipe/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos del servidor:", data);
        if (data.id) {
          navigate("/profile");
        } else {
          setError(data.message || "Unknown error occurred");
          console.error(data); // Para depuración
        }
      })
      .catch((error) => setError("Error: Failed to fetch"));
  };

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      <Typography variant="h4" gutterBottom>
        Add Recipe
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <FormRecipe
        title={title}
        setTitle={setTitle}
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
        ingredients={ingredients}
        setIngredients={setIngredients}
        units={units}
        setUnits={setUnits}
        description={description}
        setDescription={setDescription}
        instructions={instructions}
        setInstructions={setInstructions}
        cookingTime={cookingTime}
        setCookingTime={setCookingTime}
        servings={servings}
        setServings={setServings}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        handleSubmit={handleSubmit}
      />
    </Container>
  );
};

export default AddRecipe;
