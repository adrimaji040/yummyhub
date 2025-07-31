<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MealPlan;
use App\Models\MealPlanItem;
use App\Models\Recipe;

class MealPlanItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                $mealPlan = MealPlan::first();
        
        if (!$mealPlan) {
            $this->command->info('No meal plans found. Please run MealPlanSeeder first.');
            return;
        }

        // Get some recipes (assuming you have recipes in your database)
        $recipes = Recipe::limit(10)->get();
        
        if ($recipes->count() == 0) {
            $this->command->info('No recipes found. Creating some sample meal plan items without recipes.');
        }

        // Sample meal plan items for the week
        $sampleItems = [
            ['day_of_week' => 0, 'meal_type' => 'breakfast', 'notes' => 'Sunday breakfast'],
            ['day_of_week' => 0, 'meal_type' => 'lunch', 'notes' => 'Sunday lunch'],
            ['day_of_week' => 0, 'meal_type' => 'dinner', 'notes' => 'Sunday dinner'],
            ['day_of_week' => 1, 'meal_type' => 'breakfast', 'notes' => 'Monday breakfast'],
            ['day_of_week' => 1, 'meal_type' => 'dinner', 'notes' => 'Monday dinner'],
            ['day_of_week' => 2, 'meal_type' => 'lunch', 'notes' => 'Tuesday lunch'],
            ['day_of_week' => 3, 'meal_type' => 'breakfast', 'notes' => 'Wednesday breakfast'],
        ];

        foreach ($sampleItems as $item) {
            MealPlanItem::create([
                'meal_plan_id' => $mealPlan->id,
                'day_of_week' => $item['day_of_week'],
                'meal_type' => $item['meal_type'],
                'recipe_id' => $recipes->count() > 0 ? $recipes->random()->id : null,
                'notes' => $item['notes']
            ]);
        }

        $this->command->info('Meal plan items created successfully!');
    }    
}
