<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            'gram',
            'kilogram',
            'milliliter',
            'liter',
            'cup',
            'tablespoon',
            'teaspoon',
            'unit',
            'pinch',
        ];

        foreach ($units as $name) {
            Unit::create(['name' => $name]);
        }
    }
}
