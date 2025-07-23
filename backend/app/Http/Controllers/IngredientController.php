<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IngredientController extends Controller
{
    public function index() {
            return response()->json(Ingredient::all(),200);

    }

    public function show($id) {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found'], 404);
        }

        return response()->json($ingredient, 200);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name',
        ]);

        $ingredient = Ingredient::create([
            'name' => $request->input('name'),
        ]);

        return response()->json($ingredient, 201);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name,' . $id,
        ]);

        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found'], 404);
        }

        $ingredient->name = $request->input('name');
        $ingredient->save();

        return response()->json($ingredient, 200);
    }

    public function destroy($id) {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json(['message' => 'Ingredient not found'], 404);
        }

        $ingredient->delete();

        return response()->json(['message' => 'Ingredient deleted successfully'], 200);
    }

    public function getIngredients($recipeId): JsonResponse
    {
        $ingredients = DB::table('recipe_ingredients')
            ->join('ingredients', 'recipe_ingredients.ingredient_id', '=', 'ingredients.id')
            ->where('recipe_ingredients.recipe_id', $recipeId)
            ->select('ingredients.name', 'recipe_ingredients.quantity', 'recipe_ingredients.unit')
            ->get();

        return response()->json($ingredients);
    }
}

