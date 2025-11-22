<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'image_url' => $this->image_url,
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
}
