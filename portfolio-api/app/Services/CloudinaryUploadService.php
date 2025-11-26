<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryUploadService
{
    /**
     * Upload a file to Cloudinary with proper resource type detection
     */
    public function uploadResume(UploadedFile $file): array
    {
        $extension = $file->getClientOriginalExtension();
        $filename = 'Gagan_Kumar_Resume_' . now()->timestamp;
        
        // Upload with explicit resource_type for non-images
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder' => 'resumes',
            'public_id' => $filename,
            'resource_type' => 'raw', // Explicitly set as raw for PDFs
            'type' => 'upload',
            'format' => $extension, // Ensure format is preserved
        ]);
        
        // Return the public_id without extension (Cloudinary standard)
        return [
            'public_id' => $result->getPublicId(),
            'secure_url' => $result->getSecurePath(),
            'format' => $result->getExtension(),
            'resource_type' => 'raw',
        ];
    }
    
    /**
     * Delete a file from Cloudinary
     */
    public function deleteResume(string $publicId): void
    {
        Cloudinary::destroy($publicId, [
            'resource_type' => 'raw',
        ]);
    }
    
    /**
     * Get the full URL for a resume
     */
    public function getResumeUrl(string $publicId, string $format = 'pdf'): string
    {
        $cloudName = config('filesystems.disks.cloudinary.cloud');
        
        // Remove any existing extension from public_id
        $cleanPublicId = preg_replace('/\\.pdf$/i', '', $publicId);
        
        // Build proper Cloudinary URL for raw resources
        return "https://res.cloudinary.com/{$cloudName}/raw/upload/{$cleanPublicId}.{$format}";
    }
}
