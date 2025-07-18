<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
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
