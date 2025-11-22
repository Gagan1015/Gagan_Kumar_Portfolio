<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'full_name' => $this->full_name,
            'title' => $this->title,
            'bio' => $this->bio,
            'summary' => $this->summary,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'avatar' => $this->avatar,
            'resume_url' => $this->resume_url,
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'twitter_url' => $this->twitter_url,
            'website_url' => $this->website_url,
            'years_of_experience' => $this->years_of_experience,
            'availability_status' => $this->availability_status,
        ];
    }
}
