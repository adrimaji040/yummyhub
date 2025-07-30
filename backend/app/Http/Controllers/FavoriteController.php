<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Recipe;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $favorites = Recipe::select(
                'recipes.*',
                'categories.name as category_name',
                'users.name as user_name',
                'users.id as user_id'
            )
            ->join('favorites', 'recipes.id', '=', 'favorites.recipe_id')
            ->join('categories', 'recipes.category_id', '=', 'categories.id')
            ->join('users', 'recipes.user_id', '=', 'users.id')
            ->where('favorites.user_id', $user->id)
            ->get();

        return response()->json($favorites, 200);
    }

    public function isFavorite($recipeId, Request $request)
    {
        $user = $request->user();

    $favorite = Favorite::where('user_id', $user->id)
        ->where('recipe_id', $recipeId)
        ->first();

    if ($favorite) {
        // Ya está marcado como favorito, lo quitamos
        $favorite->delete();
        return response()->json(['message' => 'Removed from favorites']);
    } else {
        // No está, lo agregamos
        Favorite::create([
            'user_id' => $user->id,
            'recipe_id' => $recipeId,
        ]);
        return response()->json(['message' => 'Added to favorites']);
    }
    }
}
