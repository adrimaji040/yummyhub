<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\MealPlan;
use App\Models\MealPlanItem;
use App\Models\Recipe;
use App\Models\User;
    

class MealPlanController extends Controller
{
  
    public function index()
    {
        $mealPlans = Auth::user()->mealPlans;      

        return response()->json($mealPlans);
    }

   

    public function show($id)
    {        
        $user = Auth::user();

        if ($user instanceof User) {
           $mealPlan = $user ->mealPlans()
            ->with(['items.recipe'])
            ->findOrFail($id);           
        }   
        return response()->json($mealPlan);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'week_start_date' => 'required|date',
            'name' => 'string|max:255'
        ]);

       /* //Check if a meal plan exist for this user and week
        $existingMealPlan = MealPlan::where('user_id',$user->id) 
                            -> where('week_start_date',$request->week_start_date)
                            ->first();

        if($existingMealPlan){
            return response()->json([
                'message' => 'A meal plan already exist for this week.',
                'existing_meal_plan' => $existingMealPlan->load(['items.recipe'])
            ], 409 ); //409 Conflict status code
        }*/

        //Create the meal plan if it doesn't exist
        if ($user instanceof User){
              $mealPlan = $user->mealPlans()->create([
            'week_start_date' => $request->week_start_date,
            'name' => $request->name ?? 'My Meal Plan'
        ]);
        }      

        return response()->json($mealPlan->load(['items.recipe']), 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user instanceof User){
              $mealPlan = $user->mealPlans()->findOrFail($id);
        }
           
        $request->validate([
            'name' => 'string|max:255'
        ]);

        $mealPlan->update($request->only(['name']));

        return response()->json($mealPlan->load(['items.recipe']));
    }

    public function destroy($id)
    {
        $user = Auth::user();

         if ($user instanceof User){
            $mealPlan = $user->mealPlans()->findOrFail($id);
            $mealPlan->delete();
         }        

        return response()->json(['message' => 'Meal plan deleted successfully']);
    }

    public function addRecipe(Request $request, $id)
    {
        $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'meal_type' => 'required|in:breakfast,lunch,dinner',
            'recipe_id' => 'required|exists:recipes,id'
        ]);

         $user = Auth::user();

        if ($user instanceof User){
                $mealPlan = $user->mealPlans()->findOrFail($id);               
        }
        
         $item = $mealPlan->items()->updateOrCreate(
                [
                    'day_of_week' => $request->day_of_week,
                    'meal_type' => $request->meal_type
                ],
                [
                    'recipe_id' => $request->recipe_id,
                    'notes' => $request->notes
                ]
            );

        return response()->json($item->load('recipe'));
    }

    public function removeRecipe($id, $itemId)
    {
         $user = Auth::user();

          if ($user instanceof User){
            $mealPlan = $user->mealPlans()->findOrFail($id);
            $item = $mealPlan->items()->findOrFail($itemId);
            $item->delete();
          }
         return response()->json(['message' => 'Recipe removed from meal plan']);
    }
}
