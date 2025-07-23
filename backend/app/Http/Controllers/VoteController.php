<?php
namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $vote = Vote::updateOrCreate(
            [
                'recipe_id' => $validated['recipe_id'],
                'user_id' => Auth::id(),
            ],
            [
                'rating' => $validated['rating'],
            ]
        );

        return response()->json($vote);
    }

    public function getUserVote($recipe_id)
    {
        $vote = Vote::where('recipe_id', $recipe_id)
            ->where('user_id', Auth::id())
            ->first();

        return response()->json($vote);
    }

    public function getAverageRating($recipe_id)
    {
        $avg = Vote::where('recipe_id', $recipe_id)->avg('rating');
        return response()->json(['average' => round($avg, 1)]);
    }
}
