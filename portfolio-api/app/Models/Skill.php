<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'proficiency_level',
        'years_of_experience',
        'icon',
        'description',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'years_of_experience' => 'integer',
        'proficiency_level' => 'integer',
        'is_published' => 'boolean',
        'display_order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
