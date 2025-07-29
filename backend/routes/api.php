<?php

use App\Http\Controllers\CateroryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\RecipeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RecipeIngredientController;
use App\Http\Controllers\UnitController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->apiResource('user.recipes', RecipeController::class);
Route::middleware('auth:sanctum')->post('/change-password/{id}', [UserController::class, 'updatePassword']);


Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
//Register new user
Route::post('/register', [UserController::class, 'register']);

Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Get recipes by category ID
Route::get('/category/{id}', [CateroryController::class, 'getRecipesByCategory']);
//Get all categories
Route::get('/categories', [CateroryController::class, 'index']);
//get related recipes
Route::get('/related-recipes/{id}', [RecipeController::class, 'getRelatedRecipes']);



//Gett all recipes
Route::get('/recipes', [RecipeController::class, 'index']);
//Search a word in recipes
//Route::get('/recipes', [RecipeController::class, 'searchWord']);
Route::get('/recipe/{id}', [RecipeController::class, 'show']);
Route::get('/latest-recipe', [RecipeController::class, 'latest']);

//create new recipe
Route::middleware('auth:sanctum')->post('/recipe/add', [RecipeController::class, 'store']);
Route::middleware('auth:sanctum')->put('/recipe/update/{id}', [RecipeController::class, 'update']);
//Route::put('/recipe/update/{id}', [RecipeController::class, 'update']);

//delete recipe
Route::middleware('auth:sanctum')->delete('/recipe/{id}', [RecipeController::class, 'destroy']);

//get all categories
Route::get('/categories', [CateroryController::class, 'index']);
//get by id
Route::get('/category/{id}', [CateroryController::class, 'getRecipesByCategory']);


// get comments by recipe id
Route::get('/recipe/{recipeId}/comments', [CommentController::class, 'getCommentsByRecipe']);

// Create new comment
Route::post('/comments', [CommentController::class, 'store'])->middleware('auth:sanctum');

// Delete comment
Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->middleware('auth:sanctum');


//Ingredients
Route::get('/ingredients', [IngredientController::class, 'index']);




//Units
Route::get('/units', [UnitController::class, 'index']);


//Rating
Route::get('/recipes/{id}/rating', [RecipeController::class, 'getAverageRating']);

//Favorite recipes
Route::middleware('auth:sanctum')->post('/recipe/{id}/favorite', [RecipeController::class, 'toggleFavorite']);
Route::middleware('auth:sanctum')->get('/favorites', [RecipeController::class, 'getFavorites']);


//rating
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/votes', [VoteController::class, 'store']);
    Route::get('/votes/user/{recipe_id}', [VoteController::class, 'getUserVote']);
});

Route::get('/votes/average/{recipe_id}', [VoteController::class, 'getAverageRating']);