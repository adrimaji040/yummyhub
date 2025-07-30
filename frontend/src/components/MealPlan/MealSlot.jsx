import React, { useState } from 'react';
import RecipeSelector from './RecipeSelector';

const MealSlot = ({ 
  mealPlanId, 
  dayOfWeek, 
  mealType, 
  existingItem, 
  onAddRecipe, 
  onRemoveRecipe 
}) => {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddRecipe = async (recipeId, notes = '') => {
    setLoading(true);
    try {
      await onAddRecipe(dayOfWeek, mealType, recipeId, notes);
      setShowRecipeSelector(false);
    } catch (error) {
      console.error('Error adding recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async () => {
    if (existingItem) {
      setLoading(true);
      try {
        await onRemoveRecipe(existingItem.id);
      } catch (error) {
        console.error('Error removing recipe:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'lunch':
        return 'border-l-green-400 bg-green-50';
      case 'dinner':
        return 'border-l-blue-400 bg-blue-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const formatMealType = (mealType) => {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  };

  if (loading) {
    return (
      <div className={`p-4 border-l-4 rounded-lg ${getMealTypeColor(mealType)} min-h-[120px] flex items-center justify-center`}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`p-4 border-l-4 rounded-lg ${getMealTypeColor(mealType)} min-h-[120px] relative`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          {formatMealType(mealType)}
        </h4>
        
        {existingItem && (
          <button
            onClick={handleRemoveRecipe}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Remove recipe"
          >
            ✕
          </button>
        )}
      </div>

      {existingItem && existingItem.recipe ? (
        // Display existing recipe
        <div className="space-y-2">
          <div className="font-medium text-gray-800">
            {existingItem.recipe.name}
          </div>
          {existingItem.recipe.description && (
            <div className="text-sm text-gray-600">
              {existingItem.recipe.description}
            </div>
          )}
          {existingItem.notes && (
            <div className="text-sm text-gray-500 italic">
              Note: {existingItem.notes}
            </div>
          )}
          <button
            onClick={() => setShowRecipeSelector(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Change Recipe
          </button>
        </div>
      ) : (
        // Empty slot - show add button
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="text-2xl mb-2">+</div>
          <button
            onClick={() => setShowRecipeSelector(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Add Recipe
          </button>
        </div>
      )}

      {/* Recipe Selector Modal/Dropdown */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Select Recipe for {formatMealType(mealType)}
              </h3>
              <button
                onClick={() => setShowRecipeSelector(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <RecipeSelector
              onSelectRecipe={handleAddRecipe}
              onCancel={() => setShowRecipeSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSlot;