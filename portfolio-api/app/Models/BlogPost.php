<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'category',
        'tags',
        'reading_time',
        'is_published',
        'is_featured',
        'published_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image',
        'display_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'reading_time' => 'integer',
        'display_order' => 'integer',
    ];

    /**
     * Boot the model and register event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from title if not provided
        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
            // Ensure slug uniqueness
            $post->slug = static::generateUniqueSlug($post->slug, $post->id);
            // Auto-calculate reading time
            $post->reading_time = static::calculateReadingTime($post->content);
        });

        static::updating(function ($post) {
            // Recalculate reading time on content change
            if ($post->isDirty('content')) {
                $post->reading_time = static::calculateReadingTime($post->content);
            }
            // Regenerate slug if title changed and slug not manually modified
            if ($post->isDirty('title') && !$post->isDirty('slug')) {
                $post->slug = static::generateUniqueSlug(Str::slug($post->title), $post->id);
            }
        });
    }

    /**
     * Generate a unique slug.
     */
    protected static function generateUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $originalSlug = $slug;
        $count = 1;

        $query = static::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $count;
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $count++;
        }

        return $slug;
    }

    /**
     * Calculate estimated reading time in minutes (~200 words per minute).
     */
    protected static function calculateReadingTime(?string $content): int
    {
        if (empty($content)) {
            return 0;
        }

        $wordCount = str_word_count(strip_tags($content));
        return max(1, (int) ceil($wordCount / 200));
    }

    // ─── Scopes ─────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->where(function ($q) {
                         $q->whereNull('published_at')
                           // Treat publish control as date-based to avoid timezone-related "today" mismatches.
                           ->orWhereDate('published_at', '<=', today());
                     });
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')
                     ->orderBy('published_at', 'desc')
                     ->orderBy('created_at', 'desc');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByTag($query, string $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }
}
