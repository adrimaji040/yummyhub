import React, { useState, useEffect } from "react";

const RecipeSelector = ({ onSelectRecipe, onCancel }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  };

  // Fetch all user recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch("/api/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, recipes]);

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSelectRecipe = () => {
    if (selectedRecipeId) {
      onSelectRecipe(selectedRecipeId, notes);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={fetchRecipes}
          className="text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No recipes found</div>
        <div className="text-sm text-gray-400">
          Create some recipes first to add them to your meal plan
        </div>
        <div className="mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Recipe List */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        {filteredRecipes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recipes match your search
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedRecipeId === recipe.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
              onClick={() => setSelectedRecipeId(recipe.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="recipe"
                  value={recipe.id}
                  checked={selectedRecipeId === recipe.id}
                  onChange={() => setSelectedRecipeId(recipe.id)}
                  className="text-blue-600"
                />
                <div className="flex-grow">
                  <div className="font-medium text-gray-800">{recipe.name}</div>
                  {recipe.description && (
                    <div className="text-sm text-gray-600 truncate">
                      {recipe.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notes Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes for this meal..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSelectRecipe}
          disabled={!selectedRecipeId}
          className={`px-4 py-2 rounded font-medium ${
            selectedRecipeId
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeSelector;
