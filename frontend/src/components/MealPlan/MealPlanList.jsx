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
  Paper,
  Container,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { red } from "@mui/material/colors";

// Styled Components
const HeaderSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(5),
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    transform: "translate(50%, -50%)",
  },
}));

const SelectorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.05)",
  marginBottom: theme.spacing(4),
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1.5),
    backgroundColor: "white",
    "& fieldset": {
      borderColor: "rgba(0,0,0,0.1)",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: theme.spacing(3),
  boxShadow: "0 3px 15px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 56,
  padding: "0 30px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px 2px rgba(255, 105, 135, .4)",
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(8),
  backgroundColor: "white",
  borderRadius: theme.spacing(3),
  border: "2px dashed #e0e0e0",
  marginTop: theme.spacing(4),
}));

const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  backgroundColor: "white",
  borderRadius: theme.spacing(3),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
}));

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token
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
            return plan;
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

      /* //Validation if the meal plan exist
      const weekStartDate = sunday.toISOString().split("T")[0];
      const existingPlan = mealPlans.find(
        (plan) => plan.week_start_date.split("T")[0] === weekStartDate
      );

      if (existingPlan) {
        setError(
          `A meal plan already exists for the week of ${sunday.toLocaleDateString}`
        );
        setSelectedMealPlan(existingPlan); //Select the existing one
        return;
      }*/

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

  // Update meal plan
  const handleMealPlanUpdate = (updatedMealPlan) => {
    console.log("MealPlanList - Updating meal plan:", updatedMealPlan);
    setMealPlans(
      mealPlans.map((plan) =>
        plan.id === updatedMealPlan.id ? updatedMealPlan : plan
      )
    );
    setSelectedMealPlan(updatedMealPlan);
  };

  useEffect(() => {
    console.log("MealPlanList - Selected meal plan changed:", selectedMealPlan);
  }, [selectedMealPlan]);

  // Format date for display
  const formatDateRange = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <LoadingWrapper>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your meal plans...
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Please wait while we fetch your data
          </Typography>
        </LoadingWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={fetchMealPlans}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <HeaderSection>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <RestaurantMenuIcon sx={{ fontSize: 40 }} />
              <Typography variant="h3" fontWeight="bold">
                Meal Plans
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Plan your meals for the week and stay organized
            </Typography>
            <Chip
              label={`${mealPlans.length} meal plan${
                mealPlans.length !== 1 ? "s" : ""
              } created`}
              sx={{
                mt: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
              }}
            />
          </Box>

          <CreateButton
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={createMealPlan}
          >
            Create New Meal Plan
          </CreateButton>
        </Stack>
      </HeaderSection>

      {/* Meal Plan Selector */}
      {mealPlans.length > 0 && (
        <SelectorCard elevation={0}>
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={600}
            color="text.primary"
          >
            <CalendarTodayIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Select Meal Plan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose which meal plan you'd like to view and edit
          </Typography>

          <FormControl fullWidth>
            <StyledSelect
              value={selectedMealPlan?.id || ""}
              onChange={(e) => {
                const selected = mealPlans.find(
                  (plan) => plan.id === parseInt(e.target.value)
                );
                setSelectedMealPlan(selected);
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Choose a meal plan to get started</em>
              </MenuItem>
              {mealPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ mr: 2, color: "primary.main", fontSize: 20 }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {plan.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateRange(plan.week_start_date)}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </SelectorCard>
      )}

      <Divider sx={{ my: 4, borderColor: "rgba(0,0,0,0.08)" }} />

      {/* Display Selected Meal Plan */}
      {selectedMealPlan ? (
        <Box sx={{ mb: 4 }}>
          <MealPlanWeek
            key={selectedMealPlan.id}
            mealPlan={selectedMealPlan}
            onUpdateMealPlan={handleMealPlanUpdate}
          />
        </Box>
      ) : (
        <EmptyState>
          <RestaurantMenuIcon
            sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
          />
          <Typography
            variant="h5"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            No meal plans found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            Get started by creating your first meal plan. You can organize your
            meals for the entire week and never wonder what to cook again.
          </Typography>
          <CreateButton
            size="large"
            startIcon={<AddIcon />}
            onClick={createMealPlan}
          >
            Create Your First Meal Plan
          </CreateButton>
        </EmptyState>
      )}
    </Container>
  );
};

export default MealPlanList;
