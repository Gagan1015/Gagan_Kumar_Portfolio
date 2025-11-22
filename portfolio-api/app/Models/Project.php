<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'long_description',
        'image_url',
        'gallery_images',
        'technologies',
        'features',
        'github_url',
        'demo_url',
        'website_url',
        'start_date',
        'end_date',
        'client',
        'role',
        'status',
        'is_featured',
        'display_order',
        'is_published',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'gallery_images' => 'array',
        'technologies' => 'array',
        'features' => 'array',
        'display_order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('created_at', 'desc');
    }
}
