<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{

    public function index(){
        $comments = Comment::all();
        return response()->json(@$comments,200);
    }
    /**
     * Store a new comment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Ensure the user is authenticated
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Validate the request
        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'content' => 'required|string|max:1000',
        ]);

        // Create a new comment
        $comment = Comment::create([
            'user_id' => $user->id, // Get the ID of the authenticated user
            'recipe_id' => $request->input('recipe_id'),
            'content' => $request->input('content'),
        ]);

        return response()->json($comment, 201);
    }


    /**
     * Update an existing comment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Find the comment by ID
        $comment = Comment::find($id);

        // Check if the comment exists
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Validate the request
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // Update the comment
        $comment->content = $request->input('content');
        $comment->save();

        return response()->json($comment);
    }

    /**
     * Delete a comment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Find the comment by ID
        $comment = Comment::find($id);

        // Check if the comment exists
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Delete the comment
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    /**
     * Get all comments for a specific recipe.
     *
     * @param  int  $recipeId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCommentsByRecipe($recipeId)
{
    // Find the recipe by ID
    $recipe = Recipe::find($recipeId);

    // Check if recipe exists
    if (!$recipe) {
        return response()->json(['message' => 'Recipe not found'], 404);
    }

    // Get comments associated with the recipe, including user details
    $comments = $recipe->comments()->with('user')->get();

    // Return comments as JSON response
    return response()->json($comments);
}

}
