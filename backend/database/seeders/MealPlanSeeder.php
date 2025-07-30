<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MealPlan;
use Carbon\Carbon;

class MealPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
       public function run()
    {
        // Get the first user (assuming you have users in your database)
        $user = User::first();
        
        if (!$user) {
            $this->command->info('No users found. Please create a user first.');
            return;
        }

        // Create a meal plan for this week
        $thisWeek = Carbon::now()->startOfWeek(Carbon::SUNDAY);
        
        MealPlan::create([
            'user_id' => $user->id,
            'week_start_date' => $thisWeek,
            'name' => 'This Week\'s Meal Plan'
        ]);

        // Create a meal plan for next week
        $nextWeek = $thisWeek->copy()->addWeek();
        
        MealPlan::create([
            'user_id' => $user->id,
            'week_start_date' => $nextWeek,
            'name' => 'Next Week\'s Meal Plan'
        ]);

        $this->command->info('Meal plans created successfully!');
    }
}
