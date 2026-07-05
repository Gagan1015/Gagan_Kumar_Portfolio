<?php

namespace App\Http\Resources;

use App\Support\CloudinaryUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BlogPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image' => $this->featured_image ? $this->getImageUrl($this->featured_image) : null,
            'category' => $this->category,
            'tags' => $this->tags,
            'reading_time' => $this->reading_time,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toISOString(),
            'formatted_date' => $this->published_at?->format('M d, Y') ?? $this->created_at->format('M d, Y'),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'og_image' => $this->og_image ? $this->getImageUrl($this->og_image) : null,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    /**
     * Get the full URL for the image.
     */
    private function getImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // If it's already a full URL (http/https), return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Get the configured filesystem disk
        $disk = config('filesystems.default');

        // For Cloudinary, return the URL directly
        if ($disk === 'cloudinary') {
            return CloudinaryUrl::image($path);
        }

        // For public disk, check if file exists
        if ($disk === 'public' && Storage::disk('public')->exists($path)) {
            return url('storage/'.$path);
        }

        // Return a placeholder image if file doesn't exist
        $placeholders = [
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop', // Blog/Writing
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop', // Tech/Laptop
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop', // Team/Tech
            'https://images.unsplash.com/photo-1504384764586-bb4cee aecf77?w=800&h=600&fit=crop', // Code
        ];

        $index = ($this->id - 1) % count($placeholders);

        return $placeholders[$index];
    }
}
