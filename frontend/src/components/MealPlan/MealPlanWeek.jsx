import React, { useState, useEffect } from "react";
import MealPlanDay from "./MealPlanDay";
import ShoppingList from "./ShoppingList";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const MealPlanWeek = ({ mealPlan, onUpdateMealPlan }) => {
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    // Generate week days from Sunday to Saturday
    const startDate = new Date(mealPlan.week_start_date);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date,
        dayOfWeek: i,
        name: date.toLocaleDateString("en-US", { weekday: "long" }),
      });
    }

    setWeekDays(days);
  }, [mealPlan.week_start_date]);

  const getWeekRange = () => {
    if (weekDays.length === 0) return "";

    const startDate = weekDays[0].date;
    const endDate = weekDays[6].date;

    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Week Header */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
          {mealPlan.name}
        </Typography>
        <Typography color="text.secondary">{getWeekRange()}</Typography>
      </Box>

      {/* Week Grid */}
      <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 7 }}>
        {weekDays.map((day) => (
          <Grid item xs={1} key={`day-${day.dayOfWeek}-${mealPlan.id}`}>
            <MealPlanDay
              day={day}
              mealPlanId={mealPlan.id}
              items={
                mealPlan.items?.filter(
                  (item) => item.day_of_week === day.dayOfWeek
                ) || []
              }
              onUpdateMealPlan={onUpdateMealPlan}
            />
          </Grid>
        ))}
      </Grid>

      {/* Summary Stats */}
      <Box
        sx={{
          backgroundColor: "grey.50",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="medium"
          color="text.primary"
          mb={2}
        >
          Week Summary
        </Typography>

        <Grid
          container
          spacing={2}
          columns={{ xs: 2, md: 4 }}
          sx={{ fontSize: "0.875rem" }}
        >
          <Grid item xs={1}>
            <Typography fontWeight={500} color="text.secondary">
              Total Meals
            </Typography>
            <Typography fontWeight="bold" color="primary.main" variant="h6">
              {mealPlan.items?.length || 0} / 21
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography fontWeight={500} color="text.secondary">
              Breakfasts
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ color: "#f59e0b" }}
              variant="h6"
            >
              {mealPlan.items?.filter((item) => item.meal_type === "breakfast")
                .length || 0}{" "}
              / 7
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography fontWeight={500} color="text.secondary">
              Lunches
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ color: "#10b981" }}
              variant="h6"
            >
              {mealPlan.items?.filter((item) => item.meal_type === "lunch")
                .length || 0}{" "}
              / 7
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <Typography fontWeight={500} color="text.secondary">
              Dinners
            </Typography>
            <Typography fontWeight="bold" color="primary.main" variant="h6">
              {mealPlan.items?.filter((item) => item.meal_type === "dinner")
                .length || 0}{" "}
              / 7
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Shopping List */}
      <ShoppingList mealPlan={mealPlan} />
    </Box>
  );
};

export default MealPlanWeek;
