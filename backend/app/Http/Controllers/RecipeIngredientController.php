<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecipeIngredientController extends Controller
{
    public function index($recipeId) {
        $recipe = Recipe::find($recipeId);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        $ingredients = $recipe->ingredients()->get();

        return response()->json($ingredients, 200);
    }

    public function store(Request $request, $recipeId) {
        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|integer',
            'unit' => 'nullable|string|max:255',
        ]);

        $recipe = Recipe::find($recipeId);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Attach the ingredient to the recipe with pivot data
        $recipe->ingredients()->attach($request->input('ingredient_id'), [
            'quantity' => $request->input('quantity'),
            'unit' => $request->input('unit'),
        ]);

        return response()->json(['message' => 'Ingredient added to recipe'], 201);
    }

    public function update(Request $request, $recipeId, $ingredientId) {
        $request->validate([
            'quantity' => 'required|integer',
            'unit' => 'nullable|string|max:255',
        ]);

        $recipe = Recipe::find($recipeId);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Check if the ingredient is attached to the recipe
        $ingredient = $recipe->ingredients()->where('ingredient_id', $ingredientId)->first();

        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found in this recipe'], 404);
        }

        // Update the pivot table data
        $recipe->ingredients()->updateExistingPivot($ingredientId, [
            'quantity' => $request->input('quantity'),
            'unit' => $request->input('unit'),
        ]);

        return response()->json(['message' => 'Ingredient updated in recipe'], 200);
    }

    public function destroy($recipeId, $ingredientId) {
        $recipe = Recipe::find($recipeId);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Detach the ingredient from the recipe
        $recipe->ingredients()->detach($ingredientId);
        return response()->json(['message' => 'Ingredient removed from recipe'], 200);
    }
}
