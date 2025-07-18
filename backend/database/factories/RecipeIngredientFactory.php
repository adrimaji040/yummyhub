<?php

namespace Database\Factories;
use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RecipeIngredient>
 */
class RecipeIngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'recipe_id' => $this->faker->numberBetween(1, 30), 
            'ingredient_id' =>  $this->faker->numberBetween(1, 20),
            'quantity' => rand(1, 5),
            'unit_id' =>  $this->faker->numberBetween(1, 9),
        ];
    }
}
