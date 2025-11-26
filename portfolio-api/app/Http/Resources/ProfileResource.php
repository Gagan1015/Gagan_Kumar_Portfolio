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
        // Build full Cloudinary URL for resume if it's a path
        $resumeUrl = $this->resume_url;
        if ($resumeUrl && !filter_var($resumeUrl, FILTER_VALIDATE_URL)) {
            $cloudName = config('filesystems.disks.cloudinary.cloud');
            $secure = config('filesystems.disks.cloudinary.secure', true);
            $protocol = $secure ? 'https' : 'http';
            
            // Remove leading slash - stored path won't have .pdf extension
            $resumePath = ltrim($resumeUrl, '/');
            
            // Build URL with .pdf extension for raw resource type
            $resumeUrl = "{$protocol}://res.cloudinary.com/{$cloudName}/raw/upload/{$resumePath}.pdf";
        }

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
            'resume_url' => $resumeUrl,
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'twitter_url' => $this->twitter_url,
            'website_url' => $this->website_url,
            'years_of_experience' => $this->years_of_experience,
            'availability_status' => $this->availability_status,
        ];
    }
}
