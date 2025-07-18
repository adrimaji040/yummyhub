<?php

namespace Database\Seeders;
use App\Models\Ingredient;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $ingredients = [
            'Salt',
            'Sugar',
            'Flour',
            'Butter',
            'Eggs',
            'Milk',
            'Olive oil',
            'Garlic',
            'Onion',
            'Tomato',
            'Chicken breast',
            'Beef',
            'Carrot',
            'Potato',
            'Basil',
            'Parsley',
            'Black pepper',
            'Cinnamon',
            'Cheese',
            'Lemon',
        ];

        foreach ($ingredients as $name) {
            Ingredient::create(['name' => $name]);
        }
    }
}
