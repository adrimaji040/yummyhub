// Optional: Add authentication check in MealPlanListPage.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserProvider } from "../store/UserProvider";
import { UserContext } from "../store/UserContext";
import MealPlanList from "../components/MealPlan/MealPlanList";
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

const MealPlanListPage = () => {
  const { user } = useContext(UserContext); // Adjust if you use different context structure

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.100" }}>
      <MealPlanList />
    </Box>
  );
};

export default MealPlanListPage;
