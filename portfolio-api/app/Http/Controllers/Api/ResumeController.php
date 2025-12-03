<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ResumeController extends Controller
{
    /**
     * Download the resume PDF file.
     */
    public function download()
    {
        $profile = Profile::first();

        if (!$profile || !$profile->resume_url) {
            return response()->json([
                'message' => 'Resume not available',
            ], 404);
        }

        try {
            $resumePath = $profile->resume_url;
            
            $cloudName = config('filesystems.disks.cloudinary.cloud');
            
            // Use stored path as-is (includes .pdf extension)
            $cleanPath = ltrim($resumePath, '/');
            
            // Build the proper Cloudinary URL for raw resources (PDFs)
            $publicUrl = "https://res.cloudinary.com/{$cloudName}/raw/upload/fl_attachment/{$cleanPath}";
            
            // Download the file from the public URL
            $fileResponse = Http::timeout(30)->get($publicUrl);
            
            if (!$fileResponse->successful()) {
                // Try without fl_attachment flag
                $publicUrl = "https://res.cloudinary.com/{$cloudName}/raw/upload/{$cleanPath}";
                $fileResponse = Http::timeout(30)->get($publicUrl);
                
                if (!$fileResponse->successful()) {
                    return response()->json([
                        'message' => 'Failed to download file from Cloudinary',
                        'status' => $fileResponse->status(),
                        'url' => $publicUrl,
                        'path' => $cleanPath
                    ], 500);
                }
            }
            
            // Return the PDF with proper headers
            return response($fileResponse->body())
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="Gagan_Kumar_Resume.pdf"')
                ->header('Cache-Control', 'no-cache, must-revalidate');

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
