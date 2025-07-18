<?php

namespace App\Http\Controllers;
use App\Models\Category;

use Illuminate\Http\Request;

class CateroryController extends Controller
{

    public function index(){
        $categories = Category::all();
        return response()->json($categories,200);
    }

    //
    public function getRecipesByCategory($id)
    {
        // Find the category by ID
        $category = Category::find($id);

        // Check if category exists
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Get recipes associated with the category
        $recipes = $category->recipes;

        // Return recipes as JSON response
        return response()->json($recipes,200);
    }
}
