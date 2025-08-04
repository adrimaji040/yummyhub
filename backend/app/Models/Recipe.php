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
     * Adriana - Get the full URL for the cover photo.
     * This accessor will automatically convert relative paths to full URLs.
     */
    public function getCoverPhotoUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        
        // Convert relative path to full URL
        return asset('storage/' . $value);
    }


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

    public function recipeIngredients()
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }


}
