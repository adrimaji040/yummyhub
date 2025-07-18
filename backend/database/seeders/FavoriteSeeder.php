<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
    {
        $favorites = [
            // user_id, recipe_id
            ['user_id' => 1, 'recipe_id' => 3],
            ['user_id' => 1, 'recipe_id' => 10],
            ['user_id' => 1, 'recipe_id' => 15],

            ['user_id' => 2, 'recipe_id' => 2],
            ['user_id' => 2, 'recipe_id' => 20],

            ['user_id' => 3, 'recipe_id' => 5],
            ['user_id' => 3, 'recipe_id' => 12],
            ['user_id' => 3, 'recipe_id' => 18],
            ['user_id' => 3, 'recipe_id' => 22],

            ['user_id' => 4, 'recipe_id' => 1],
            ['user_id' => 4, 'recipe_id' => 6],

            ['user_id' => 5, 'recipe_id' => 7],
            ['user_id' => 5, 'recipe_id' => 8],
            ['user_id' => 5, 'recipe_id' => 14],

            ['user_id' => 6, 'recipe_id' => 9],
            ['user_id' => 6, 'recipe_id' => 13],
            ['user_id' => 6, 'recipe_id' => 17],

            ['user_id' => 7, 'recipe_id' => 4],
            ['user_id' => 7, 'recipe_id' => 16],
            ['user_id' => 7, 'recipe_id' => 21],

            ['user_id' => 8, 'recipe_id' => 11],
            ['user_id' => 8, 'recipe_id' => 23],

            ['user_id' => 9, 'recipe_id' => 19],
            ['user_id' => 9, 'recipe_id' => 24],
            ['user_id' => 9, 'recipe_id' => 25],

            ['user_id' => 10, 'recipe_id' => 26],
            ['user_id' => 10, 'recipe_id' => 27],
            ['user_id' => 10, 'recipe_id' => 28],
            ['user_id' => 10, 'recipe_id' => 29],
            ['user_id' => 10, 'recipe_id' => 30],
        ];

        foreach ($favorites as $fav) {
            DB::table('favorites')->insert([
                'user_id' => $fav['user_id'],
                'recipe_id' => $fav['recipe_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
