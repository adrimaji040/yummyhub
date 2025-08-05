import React, { useState, useEffect } from "react";
import RecipeSelector from "./RecipeSelector";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const MealSlot = ({
  mealPlanId,
  dayOfWeek,
  mealType,
  existingItem,
  onAddRecipe,
  onRemoveRecipe,
}) => {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState(existingItem); //Add state for the current item

  //Add useEffect to update currenItem when existingItem prop changes
  useEffect(() => {
    console.log(`MealSlot ${mealType} - existingItem updated:`, existingItem);
    setCurrentItem(existingItem);
  }, [existingItem, mealType]);

  const handleAddRecipe = async (recipeId, notes = "") => {
    setLoading(true);
    try {
      await onAddRecipe(dayOfWeek, mealType, recipeId, notes);
      setShowRecipeSelector(false);
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async () => {
    if (currentItem) {
      setLoading(true);
      try {
        await onRemoveRecipe(currentItem.id);
      } catch (error) {
        console.error("Error removing recipe:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case "breakfast":
        return {
          borderLeft: "4px solid",
          borderColor: "warning.main", // yellow
          bgcolor: "warning.light", // yellow background
        };
      case "lunch":
        return {
          borderLeft: "4px solid",
          borderColor: "success.main", // green
          bgcolor: "success.light",
        };
      case "dinner":
        return {
          borderLeft: "4px solid",
          borderColor: "primary.main", // blue
          bgcolor: "primary.light",
        };
      default:
        return {
          borderLeft: "4px solid",
          borderColor: "grey.400",
          bgcolor: "grey.50",
        };
    }
  };

  const formatMealType = (mealType) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  const handleImageError = (e) => {
    console.error("Recipe image failed to load:", e.target.src);
    e.target.style.display = "none"; // Hide broken image
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...getMealTypeColor(mealType),
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderLeft: "4px solid",
        borderColor: getMealTypeColor(mealType),
        borderRadius: 2,
        minHeight: "120px",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 1 }}
        >
          {formatMealType(mealType)}
        </Typography>

        {currentItem && (
          <IconButton
            onClick={handleRemoveRecipe}
            size="small"
            sx={{ color: "error.main" }}
            title="Remove recipe"
          >
            ✕
          </IconButton>
        )}
      </Box>

      {/* Content */}
      {currentItem && currentItem.recipe ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Recipe Image */}
          {currentItem.recipe.cover_photo_url && (
            <Box sx={{ flexShrink: 0 }}>
              <CardMedia
                component="img"
                height="80"
                width="80"
                image={currentItem.recipe.cover_photo_url}
                alt={currentItem.recipe.name || currentItem.recipe.title}
                onError={handleImageError}
                sx={{
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                }}
              />
            </Box>
          )}

          {/*Recipe Details*/}
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography fontWeight="medium" color="text.primary">
              {currentItem.recipe.name || currentItem.recipe.title}
            </Typography>
            {currentItem.recipe.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {currentItem.recipe.description}
              </Typography>
            )}
            {currentItem.recipe.cooking_time && (
              <Typography variant="caption" color="text.disabled">
                ⏱️ {currentItem.recipe.cooking_time} mins
              </Typography>
            )}
            {currentItem.notes && (
              <Typography
                variant="body2"
                color="text.disabled"
                fontStyle="italic"
              >
                Note: {currentItem.notes}
              </Typography>
            )}
            <Button
              onClick={() => setShowRecipeSelector(true)}
              variant="text"
              size="small"
              sx={{
                color: "primary.main",
                textTransform: "none",
                alignSelf: "start",
              }}
            >
              Change Recipe
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.disabled",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" mb={1}>
            +
          </Typography>
          <Button
            onClick={() => setShowRecipeSelector(true)}
            size="small"
            sx={{
              color: "primary.main",
              fontWeight: "medium",
              textTransform: "none",
            }}
          >
            Add Recipe
          </Button>
        </Box>
      )}

      {/* Recipe Selector Dialog */}
      {showRecipeSelector && (
        <Dialog
          open={showRecipeSelector}
          onClose={() => setShowRecipeSelector(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Select Recipe for {formatMealType(mealType)}
            <IconButton
              onClick={() => setShowRecipeSelector(false)}
              sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
            >
              ✕
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: "70vh" }}>
            <RecipeSelector
              onSelectRecipe={handleAddRecipe}
              onCancel={() => setShowRecipeSelector(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default MealSlot;
