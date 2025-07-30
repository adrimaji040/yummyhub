import React, { useState, useEffect } from "react";
import MealPlanDay from "./MealPlanDay";
import ShoppingList from "./ShoppingList";

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
    <div className="space-y-6">
      {/* Week Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {mealPlan.name}
        </h2>
        <div className="text-gray-600">{getWeekRange()}</div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <MealPlanDay
            key={`day-${day.dayOfWeek}-${mealPlan.id}`}
            day={day}
            mealPlanId={mealPlan.id}
            items={
              mealPlan.items?.filter(
                (item) => item.day_of_week === day.dayOfWeek
              ) || []
            }
            onUpdateMealPlan={onUpdateMealPlan}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Week Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-600">Total Meals</div>
            <div className="text-lg font-semibold text-blue-600">
              {mealPlan.items?.length || 0} / 21
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Breakfasts</div>
            <div className="text-lg font-semibold text-yellow-600">
              {mealPlan.items?.filter((item) => item.meal_type === "breakfast")
                .length || 0}{" "}
              / 7
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Lunches</div>
            <div className="text-lg font-semibold text-green-600">
              {mealPlan.items?.filter((item) => item.meal_type === "lunch")
                .length || 0}{" "}
              / 7
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Dinners</div>
            <div className="text-lg font-semibold text-blue-600">
              {mealPlan.items?.filter((item) => item.meal_type === "dinner")
                .length || 0}{" "}
              / 7
            </div>
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <ShoppingList mealPlan={mealPlan} />
    </div>
  );
};

export default MealPlanWeek;
