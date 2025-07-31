import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Checkbox,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const ShoppingList = ({ mealPlan }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Generate shopping list from meal plan
  const generateShoppingList = () => {
    if (!mealPlan || !mealPlan.items) return;

    setLoading(true);

    // Create a map to aggregate ingredients
    const ingredientMap = new Map();

    // Process each meal plan item
    mealPlan.items.forEach((item) => {
      if (item.recipe && item.recipe.recipe_ingredients) {
        item.recipe.recipe_ingredients.forEach((recipeIngredient) => {
          const ingredient = recipeIngredient.ingredient;
          const key = `${ingredient.id}-${
            recipeIngredient.unit?.id || "no-unit"
          }`;

          if (ingredientMap.has(key)) {
            // Add to existing quantity
            const existing = ingredientMap.get(key);
            existing.quantity += parseFloat(recipeIngredient.quantity);
          } else {
            // Add new ingredient
            ingredientMap.set(key, {
              id: ingredient.id,
              name: ingredient.name,
              quantity: parseFloat(recipeIngredient.quantity),
              unit: recipeIngredient.unit,
              category: ingredient.category || "Other",
              recipes: [item.recipe.name],
            });
          }
        });
      }
    });

    // Convert map to array and group by category
    const ingredients = Array.from(ingredientMap.values());
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient);
      return acc;
    }, {});

    setShoppingList(groupedIngredients);
    setLoading(false);
  };

  // Toggle item checked status
  const toggleItemChecked = (ingredientId) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(ingredientId)) {
      newCheckedItems.delete(ingredientId);
    } else {
      newCheckedItems.add(ingredientId);
    }
    setCheckedItems(newCheckedItems);
  };

  // Clear all checked items
  const clearCheckedItems = () => {
    setCheckedItems(new Set());
  };

  // Generate shopping list when meal plan changes
  useEffect(() => {
    generateShoppingList();
  }, [mealPlan]);

  // Format quantity for display
  const formatQuantity = (quantity, unit) => {
    const formattedQuantity =
      quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);
    return unit ? `${formattedQuantity} ${unit.name}` : formattedQuantity;
  };

  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "grey.200",
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          sx={{ mb: 2 }}
        >
          Shopping List
        </Typography>

        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">
            Generating shopping list...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (Object.keys(shoppingList).length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "grey.200",
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
          sx={{ mb: 2 }}
        >
          Shopping List
        </Typography>

        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No ingredients found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Add recipes to your meal plan to generate a shopping list
          </Typography>
        </Box>
      </Paper>
    );
  }

  const totalItems = Object.values(shoppingList).flat().length;
  const checkedCount = checkedItems.size;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        border: 1,
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: "grey.200",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Shopping List
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {checkedCount} / {totalItems} items
          </Typography>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": {
              bgcolor: "success.main",
              transition: "width 0.3s ease",
            },
          }}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} mt={3}>
          <Button
            onClick={clearCheckedItems}
            disabled={checkedCount === 0}
            variant="outlined"
            size="small"
            sx={{
              color: checkedCount > 0 ? "text.primary" : "text.disabled",
              borderColor: checkedCount > 0 ? "grey.300" : "grey.200",
              "&:hover": {
                borderColor: checkedCount > 0 ? "grey.400" : undefined,
                color: checkedCount > 0 ? "text.primary" : undefined,
              },
              cursor: checkedCount === 0 ? "not-allowed" : "pointer",
            }}
          >
            Clear Checked
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outlined"
            size="small"
            sx={{
              color: "primary.main",
              borderColor: "primary.light",
              "&:hover": {
                color: "primary.dark",
                borderColor: "primary.main",
              },
            }}
          >
            Print List
          </Button>
        </Stack>
      </Box>

      {/* Shopping List Items */}
      <Box sx={{ p: 3 }}>
        {Object.entries(shoppingList).map(([category, ingredients]) => (
          <Box key={category} sx={{ mb: 4, "&:last-child": { mb: 0 } }}>
            <Typography
              variant="subtitle2"
              fontWeight="600"
              color="text.secondary"
              sx={{
                mb: 1,
                textTransform: "uppercase",
                borderBottom: 1,
                borderColor: "grey.200",
                pb: 0.5,
                letterSpacing: 1,
              }}
            >
              {category}
            </Typography>

            <Stack spacing={1}>
              {ingredients.map((ingredient) => {
                const isChecked = checkedItems.has(ingredient.id);
                return (
                  <Box
                    key={ingredient.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      bgcolor: isChecked ? "grey.100" : "inherit",
                      textDecoration: isChecked ? "line-through" : "none",
                      color: isChecked ? "text.disabled" : "text.primary",
                      "&:hover": {
                        bgcolor: "grey.50",
                      },
                    }}
                    onClick={() => toggleItemChecked(ingredient.id)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleItemChecked(ingredient.id)}
                      sx={{
                        color: "success.main",
                        "&.Mui-checked": {
                          color: "success.main",
                        },
                        mr: 1,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight="medium">
                        {formatQuantity(ingredient.quantity, ingredient.unit)}{" "}
                        {ingredient.name}
                      </Typography>
                      {ingredient.recipes && ingredient.recipes.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          For: {ingredient.recipes.join(", ")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;
