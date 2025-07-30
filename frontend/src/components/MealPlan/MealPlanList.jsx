import React, { useState, useEffect } from "react";
import MealPlanWeek from "./MealPlanWeek";

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token (adjust this based on how you store your token)
  const getAuthToken = () => {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  };

  // API call to fetch meal plans
  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch("/api/mealplans", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meal plans");
      }

      const data = await response.json();
      setMealPlans(data);

      // Select the first meal plan by default
      if (data.length > 0) {
        setSelectedMealPlan(data[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching meal plans:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new meal plan
  const createMealPlan = async () => {
    try {
      const token = getAuthToken();
      const currentDate = new Date();
      const sunday = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );

      const response = await fetch("/api/mealplans", {
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
    setMealPlans(
      mealPlans.map((plan) =>
        plan.id === updatedMealPlan.id ? updatedMealPlan : plan
      )
    );
    setSelectedMealPlan(updatedMealPlan);
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading meal plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Meal Plans</h1>
          <button
            onClick={createMealPlan}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Create New Meal Plan
          </button>
        </div>

        {/* Meal Plan Selector */}
        {mealPlans.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Meal Plan:
            </label>
            <select
              value={selectedMealPlan?.id || ""}
              onChange={(e) => {
                const selected = mealPlans.find(
                  (plan) => plan.id === parseInt(e.target.value)
                );
                setSelectedMealPlan(selected);
              }}
              className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {mealPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} -{" "}
                  {new Date(plan.week_start_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Display Selected Meal Plan */}
      {selectedMealPlan ? (
        <MealPlanWeek
          mealPlan={selectedMealPlan}
          onUpdateMealPlan={handleMealPlanUpdate}
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No meal plans found</div>
          <button
            onClick={createMealPlan}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Your First Meal Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default MealPlanList;
