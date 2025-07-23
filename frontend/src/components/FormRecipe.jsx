// src/components/FormRecipe.js
import {
  Button,
  TextField,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";

const FormRecipe = ({
  title,
  setTitle,
  coverPhoto,
  setCoverPhoto,
  ingredients,
  setIngredients,
  units,
  setUnits,
  description,
  setDescription,
  instructions,
  setInstructions,
  cookingTime,
  setCookingTime,
  servings,
  setServings,
  selectedCategory,
  setSelectedCategory,
  categories,
  handleSubmit,
  coverPhotoUrl,
}) => {
  const base_path = (path) => `${window.location.origin}/${path}`;

  const [allUnits, setAllUnits] = useState([]);
  const [unitInput, setUnitInput] = useState(null);

  const [allIngredients, setAllIngredients] = useState([]); // ingredientes desde el backend
  const [ingredientInput, setIngredientInput] = useState(null);
  const [ingredientQty, setIngredientQty] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/ingredients").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/units").then((res) => res.json()),
    ])
      .then(([ingredientsData, unitsData]) => {
        setAllIngredients(ingredientsData);
        setAllUnits(unitsData); // asegúrate de tener este state creado
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid size={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            width: "100%",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            border: "1px solid #ddd",
            overflow: "hidden",
          }}
        >
          {coverPhoto ? (
            <img
              src={URL.createObjectURL(coverPhoto)}
              alt="Cover Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : coverPhotoUrl ? (
            <img
              src={`${base_path("")}${coverPhotoUrl}`}
              alt="Cover Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <Typography variant="h6" color="textSecondary">
              No image selected
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid size={8}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            type="file"
            margin="normal"
            variant="outlined"
            onChange={(e) => setCoverPhoto(e.target.files[0])}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Instructions"
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Cooking Time (minutes)"
            margin="normal"
            variant="outlined"
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
          <TextField
            fullWidth
            label="Servings"
            margin="normal"
            variant="outlined"
            type="number"
            inputProps={{ min: 1, max: 10 }}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <h2>Add ingredients</h2>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              value={ingredientQty}
              onChange={(e) => setIngredientQty(e.target.value)}
              sx={{ width: "20%" }}
            />
            <Autocomplete
              disablePortal
              options={allUnits}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setUnitInput(newValue)}
              sx={{ width: "40%" }}
              renderInput={(params) => <TextField {...params} label="Unit" />}
            />
            <Autocomplete
              disablePortal
              options={allIngredients}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setIngredientInput(newValue)}
              sx={{ width: "60%" }}
              renderInput={(params) => (
                <TextField {...params} label="Ingredient" />
              )}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (ingredientInput && ingredientQty && unitInput) {
                  setIngredients((prev) => [
                    ...prev,
                    {
                      ingredient: ingredientInput,
                      quantity: ingredientQty,
                      unit: unitInput,
                    },
                  ]);
                  setIngredientInput(null);
                  setIngredientQty("");
                  setUnits(null);
                }
              }}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            {ingredients.map((item, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#f9f9f9",
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={2}>
                    {item.quantity} {item.unit?.name || item.unit}
                  </Grid>
                  <Grid size={8}>{item.ingredient.name}</Grid>
                  <Grid size={1}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setIngredients((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default FormRecipe;
