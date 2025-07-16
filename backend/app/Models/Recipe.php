<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'instructions',
        'cover_photo_url',
        'cooking_time',
        'servings',
        'category_id',
    ];

    /**
     * Get the user that owns the recipe.
     */ 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the recipe belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class,'category_id');
    }

    /**
     * The ingredients that belong to the recipe.
     */
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('quantity', 'unit')
                    ->withTimestamps();
    }

    /**
     * Get the comments for the recipe.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the votes for the recipe.
     */
    public function votes():HasMany
    {
        return $this->hasMany(Vote::class, 'recipe_id');
    }

    /**
     * Calculate the average rating for the recipe.
     *
     * @return float
     */
    public function averageRating()
    {
        return $this->votes()->avg('rating');
    }
}
