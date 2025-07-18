<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipe_id',
        'content'
    ];

    /**
     * Relationship: comment belongs to a user.
     */
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Comment belongs to a recipe.
     */
    public function recipe():BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
