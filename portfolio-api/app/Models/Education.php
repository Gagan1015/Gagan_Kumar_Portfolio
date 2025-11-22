<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'education';

    protected $fillable = [
        'institution',
        'degree',
        'field_of_study',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'grade',
        'description',
        'activities',
        'logo',
        'website_url',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_published' => 'boolean',
        'activities' => 'array',
        'display_order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('start_date', 'desc');
    }
}
