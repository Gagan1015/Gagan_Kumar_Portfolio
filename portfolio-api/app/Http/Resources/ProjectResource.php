<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
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
            'category' => $this->category,
            'description' => $this->description,
            'long_description' => $this->long_description,
            'image_url' => $this->image_url ? $this->getImageUrl($this->image_url) : null,
            'gallery_images' => $this->gallery_images,
            'technologies' => $this->technologies,
            'features' => $this->features,
            'github_url' => $this->github_url,
            'demo_url' => $this->demo_url,
            'website_url' => $this->website_url,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'client' => $this->client,
            'role' => $this->role,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
        ];
    }

    /**
     * Get the full URL for the image
     */
    private function getImageUrl(?string $path): ?string
    {
        if (!$path) {
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
            try {
                return Storage::disk('cloudinary')->url($path);
            } catch (\Exception $e) {
                // If Cloudinary fails, fall through to placeholder
            }
        }
        
        // For public disk, check if file exists
        if ($disk === 'public' && Storage::disk('public')->exists($path)) {
            return url('storage/' . $path);
        }

        // Return a placeholder image if file doesn't exist
        // Using a consistent placeholder based on project ID
        $placeholders = [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Tech/Business
            'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop', // Dating/Social
            'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop', // Immigration/Services
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop', // E-commerce
        ];
        
        // Use project ID to consistently map to a placeholder
        $index = ($this->id - 1) % count($placeholders);
        return $placeholders[$index];
    }
}
