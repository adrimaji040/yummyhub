import React, { useState, useEffect } from "react";

const ShoppingList = ({ mealPlan }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Generate shopping list from meal plan
  const generateShoppingList = () => {
    if (!mealPlan || !mealPlan.items) return;

    setLoading(true);

    // Create a map to aggregate ingredients
    const ingredientMap = new Map();

    // Process each meal plan item
    mealPlan.items.forEach((item) => {
      if (item.recipe && item.recipe.recipe_ingredients) {
        item.recipe.recipe_ingredients.forEach((recipeIngredient) => {
          const ingredient = recipeIngredient.ingredient;
          const key = `${ingredient.id}-${
            recipeIngredient.unit?.id || "no-unit"
          }`;

          if (ingredientMap.has(key)) {
            // Add to existing quantity
            const existing = ingredientMap.get(key);
            existing.quantity += parseFloat(recipeIngredient.quantity);
          } else {
            // Add new ingredient
            ingredientMap.set(key, {
              id: ingredient.id,
              name: ingredient.name,
              quantity: parseFloat(recipeIngredient.quantity),
              unit: recipeIngredient.unit,
              category: ingredient.category || "Other",
              recipes: [item.recipe.name],
            });
          }
        });
      }
    });

    // Convert map to array and group by category
    const ingredients = Array.from(ingredientMap.values());
    const groupedIngredients = ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient);
      return acc;
    }, {});

    setShoppingList(groupedIngredients);
    setLoading(false);
  };

  // Toggle item checked status
  const toggleItemChecked = (ingredientId) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(ingredientId)) {
      newCheckedItems.delete(ingredientId);
    } else {
      newCheckedItems.add(ingredientId);
    }
    setCheckedItems(newCheckedItems);
  };

  // Clear all checked items
  const clearCheckedItems = () => {
    setCheckedItems(new Set());
  };

  // Generate shopping list when meal plan changes
  useEffect(() => {
    generateShoppingList();
  }, [mealPlan]);

  // Format quantity for display
  const formatQuantity = (quantity, unit) => {
    const formattedQuantity =
      quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2);
    return unit ? `${formattedQuantity} ${unit.name}` : formattedQuantity;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shopping List</h2>
        <div className="text-center py-8">
          <div className="text-gray-500">Generating shopping list...</div>
        </div>
      </div>
    );
  }

  if (Object.keys(shoppingList).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shopping List</h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No ingredients found</div>
          <div className="text-sm text-gray-400">
            Add recipes to your meal plan to generate a shopping list
          </div>
        </div>
      </div>
    );
  }

  const totalItems = Object.values(shoppingList).flat().length;
  const checkedCount = checkedItems.size;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Shopping List</h2>
          <div className="text-sm text-gray-600">
            {checkedCount} / {totalItems} items
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  totalItems > 0 ? (checkedCount / totalItems) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={clearCheckedItems}
            disabled={checkedCount === 0}
            className={`px-3 py-1 text-sm rounded ${
              checkedCount > 0
                ? "text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400"
                : "text-gray-400 border border-gray-200 cursor-not-allowed"
            }`}
          >
            Clear Checked
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-400 rounded"
          >
            Print List
          </button>
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="p-6">
        {Object.entries(shoppingList).map(([category, ingredients]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
              {category}
            </h3>
            <div className="space-y-2">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-50 ${
                    checkedItems.has(ingredient.id)
                      ? "line-through text-gray-500 bg-gray-50"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.has(ingredient.id)}
                    onChange={() => toggleItemChecked(ingredient.id)}
                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <div className="flex-grow">
                    <div className="font-medium">
                      {formatQuantity(ingredient.quantity, ingredient.unit)}{" "}
                      {ingredient.name}
                    </div>
                    {ingredient.recipes && ingredient.recipes.length > 0 && (
                      <div className="text-xs text-gray-500">
                        For: {ingredient.recipes.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;
