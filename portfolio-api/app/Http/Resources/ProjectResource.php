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

        // If it's a storage path, generate the URL
        if (Storage::disk('public')->exists($path)) {
            return url('storage/' . $path);
        }

        return $path;
    }
}
