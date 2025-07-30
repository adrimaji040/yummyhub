// Optional: Add authentication check in MealPlanListPage.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from ".../src/store/UserProvider"; // Adjust import path ----????
import MealPlanList from "../components/MealPlan/MealPlanList";

const MealPlanListPage = () => {
  const { user } = useContext(UserContext); // Adjust if you use different context structure

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MealPlanList />
    </div>
  );
};

export default MealPlanListPage;
