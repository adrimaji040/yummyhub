import React, { useEffect } from "react";
import MealSlot from "./MealSlot";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const MealPlanDay = ({ day, mealPlanId, items, onUpdateMealPlan }) => {
  const mealTypes = ["breakfast", "lunch", "dinner"];

  // Add debugging useEffect
  useEffect(() => {
    console.log(`MealPlanDay ${day.name} - Props updated:`, {
      dayOfWeek: day.dayOfWeek,
      mealPlanId,
      itemsCount: items?.length || 0,
      items: items,
    });
  }, [day, mealPlanId, items]);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Find existing item for a specific meal type
  const getExistingItem = (mealType) => {
    const existingItem = items.find((item) => item.meal_type === mealType);
    console.log(
      `MealPlanDay ${day.name} - getExistingItem(${mealType}):`,
      existingItem
    );
    return existingItem;
  };

  // Add or update recipe in meal plan
  const handleAddRecipe = async (dayOfWeek, mealType, recipeId, notes = "") => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `http://localhost:8000/api/mealplans/${mealPlanId}/recipes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            day_of_week: dayOfWeek,
            meal_type: mealType,
            recipe_id: recipeId,
            notes: notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add recipe to meal plan");
      }

      // Refresh the meal plan data
      await fetchUpdatedMealPlan();
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  };

  // Remove recipe from meal plan
  const handleRemoveRecipe = async (itemId) => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `http://localhost:8000/api/mealplans/${mealPlanId}/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove recipe from meal plan");
      }

      // Refresh the meal plan data
      await fetchUpdatedMealPlan();
    } catch (error) {
      console.error("Error removing recipe:", error);
      throw error;
    }
  };

  // Fetch updated meal plan data
  const fetchUpdatedMealPlan = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `http://localhost:8000/api/mealplans/${mealPlanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch updated meal plan");
      }

      const updatedMealPlan = await response.json();
      onUpdateMealPlan(updatedMealPlan);
    } catch (error) {
      console.error("Error fetching updated meal plan:", error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 1,
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      {/* Day Header */}
      <Box
        sx={{
          backgroundColor: "grey.50",
          px: 4,
          py: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {day.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(day.date)}
        </Typography>
      </Box>

      {/* Meal Slots */}
      <Box sx={{ p: 4 }}>
        <Stack spacing={4}>
          {mealTypes.map((mealType) => (
            <MealSlot
              key={`${day.dayOfWeek}-${mealType}`} // More specific key
              mealPlanId={mealPlanId}
              dayOfWeek={day.dayOfWeek}
              mealType={mealType}
              existingItem={getExistingItem(mealType)}
              onAddRecipe={handleAddRecipe}
              onRemoveRecipe={handleRemoveRecipe}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default MealPlanDay;
