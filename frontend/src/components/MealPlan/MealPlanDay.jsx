import React from "react";
import MealSlot from "./MealSlot";

const MealPlanDay = ({ day, mealPlanId, items, onUpdateMealPlan }) => {
  const mealTypes = ["breakfast", "lunch", "dinner"];

  // Get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  };

  // Find existing item for a specific meal type
  const getExistingItem = (mealType) => {
    return items.find((item) => item.meal_type === mealType);
  };

  // Add or update recipe in meal plan
  const handleAddRecipe = async (dayOfWeek, mealType, recipeId, notes = "") => {
    try {
      const token = getAuthToken();

      const response = await fetch(`/api/mealplans/${mealPlanId}/recipes`, {
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
      });

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
        `/api/mealplans/${mealPlanId}/items/${itemId}`,
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

      const response = await fetch(`/api/mealplans/${mealPlanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="text-center">
          <div className="font-semibold text-gray-800 text-lg">{day.name}</div>
          <div className="text-sm text-gray-600">{formatDate(day.date)}</div>
        </div>
      </div>

      {/* Meal Slots */}
      <div className="p-4 space-y-4">
        {mealTypes.map((mealType) => (
          <MealSlot
            key={mealType}
            mealPlanId={mealPlanId}
            dayOfWeek={day.dayOfWeek}
            mealType={mealType}
            existingItem={getExistingItem(mealType)}
            onAddRecipe={handleAddRecipe}
            onRemoveRecipe={handleRemoveRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanDay;
