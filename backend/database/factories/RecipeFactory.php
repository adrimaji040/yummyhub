<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
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
            'title' => $this->faker->sentence(5),
            'description' => $this->faker->paragraph(3),
            'instructions' => $this->faker->text,
            'cover_photo_url' => "/upload/default.jpg",
            'cooking_time' => $this->faker->numberBetween(10, 180), // minutes
            'servings' => $this->faker->numberBetween(1, 5),
            'category_id' => $this->faker->numberBetween(1, 10), // assumes Category factory is defined
            'user_id' => $this->faker->numberBetween(1,10), // assumes Creator factory is defined
            'created_at' => now(),
            'updated_at' => now(),
            'rating' => $this->faker->numberBetween(0, 5), // Aquí el rating

        ];
    }
}
