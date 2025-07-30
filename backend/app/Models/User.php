<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\MealPlan;
use App\Models\Recipe;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function votes() {
        return $this->hasMany(Vote::class);
    }

    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Recipe::class, 'favorites')->withTimestamps();
    }

    /*Get all meal plans for this */
    public function mealPlans(): HasMany
    {
        return $this->hasMany(MealPlan::class);
    }
}
