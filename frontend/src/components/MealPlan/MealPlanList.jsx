import React, { useState, useEffect } from "react";
import MealPlanWeek from "./MealPlanWeek";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { red } from "@mui/material/colors";

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token (adjust this based on how you store your token)
  const getAuthToken = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    return token;
  };

  // API call to fetch meal plans
  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      console.log(
        "MealPlanList - Fetching meal plans with token:",
        token ? "Yes" : "No"
      );

      // Try fetching with items included
      const response = await fetch(
        "http://localhost:8000/api/mealplans?include_items=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meal plans");
      }

      const data = await response.json();
      console.log("MealPlanList - Fetched meal plans:", data);

      // fetch each meal plan individually
      if (data.length > 0 && !data[0].items) {
        console.log(
          "MealPlanList - Items not included, fetching individual meal plans"
        );
        const mealPlansWithItems = await Promise.all(
          data.map(async (plan) => {
            const detailResponse = await fetch(
              `http://localhost:8000/api/mealplans/${plan.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
            if (detailResponse.ok) {
              return await detailResponse.json();
            }
            return plan; // fallback to plan without items
          })
        );
        setMealPlans(mealPlansWithItems);
        if (mealPlansWithItems.length > 0) {
          setSelectedMealPlan(mealPlansWithItems[0]);
        }
      } else {
        setMealPlans(data);
        if (data.length > 0) {
          setSelectedMealPlan(data[0]);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching meal plans:", err);
    } finally {
      setLoading(false);
    }
  };
  //end new fetch

  // ONLY ONE useEffect
  useEffect(() => {
    console.log("MealPlanList - Component mounted, fetching meal plans");
    fetchMealPlans();
  }, []);

  // Create new meal plan
  const createMealPlan = async () => {
    try {
      const token = getAuthToken();
      const currentDate = new Date();
      const sunday = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );

      const response = await fetch("http://localhost:8000/api/mealplans", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          week_start_date: sunday.toISOString().split("T")[0],
          name: `Meal Plan - Week of ${sunday.toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meal plan");
      }

      const newMealPlan = await response.json();
      setMealPlans([newMealPlan, ...mealPlans]);
      setSelectedMealPlan(newMealPlan);
    } catch (err) {
      setError(err.message);
      console.error("Error creating meal plan:", err);
    }
  };

  // Update meal plan (callback from child components)
  const handleMealPlanUpdate = (updatedMealPlan) => {
    console.log("MealPlanList - Updating meal plan:", updatedMealPlan);
    setMealPlans(
      mealPlans.map((plan) =>
        plan.id === updatedMealPlan.id ? updatedMealPlan : plan
      )
    );
    setSelectedMealPlan(updatedMealPlan);
  };

  // Add useEffect to monitor selectedMealPlan changes
  useEffect(() => {
    console.log("MealPlanList - Selected meal plan changed:", selectedMealPlan);
  }, [selectedMealPlan]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading meal plans...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 4, py: 8 }}>
      <Box sx={{ mb: 8 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Meal Plans
          </Typography>
          <Button variant="contained" color="primary" onClick={createMealPlan}>
            Create New Meal Plan
          </Button>
        </Box>

        {/* Meal Plan Selector */}
        {mealPlans.length > 0 && (
          <Box sx={{ mb: 6, maxWidth: "400px" }}>
            <InputLabel id="meal-plan-label" sx={{ mb: 1 }}>
              Select Meal Plan:
            </InputLabel>
            <FormControl fullWidth>
              <Select
                labelId="meal-plan-label"
                value={selectedMealPlan?.id || ""}
                onChange={(e) => {
                  const selected = mealPlans.find(
                    (plan) => plan.id === parseInt(e.target.value)
                  );
                  setSelectedMealPlan(selected);
                }}
              >
                {mealPlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name} –{" "}
                    {new Date(plan.week_start_date).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Display Selected Meal Plan */}
      {selectedMealPlan ? (
        <MealPlanWeek
          key={selectedMealPlan.id} // Add key to force re-render when meal plan changes
          mealPlan={selectedMealPlan}
          onUpdateMealPlan={handleMealPlanUpdate}
        />
      ) : (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No meal plans found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={createMealPlan}
          >
            Create Your First Meal Plan
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MealPlanList;
