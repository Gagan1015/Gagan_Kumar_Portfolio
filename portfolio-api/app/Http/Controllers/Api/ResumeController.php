<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Support\CloudinaryUrl;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    /**
     * Upload resume PDF to Cloudinary (for admin use)
     */
    public function upload(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('resume');

            // Upload to Cloudinary with resource_type: raw for PDFs
            $result = Cloudinary::uploadFile($file->getRealPath(), [
                'folder' => 'resumes',
                'public_id' => 'Gagan_Kumar_Resume_'.now()->timestamp,
                'resource_type' => 'raw',
            ]);

            $publicId = $result->getPublicId();

            // Update profile with new resume path
            $profile = Profile::first();
            if ($profile) {
                $profile->resume_url = $publicId.'.pdf';
                $profile->save();
            }

            return response()->json([
                'message' => 'Resume uploaded successfully',
                'path' => $publicId.'.pdf',
                'url' => $result->getSecurePath(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload failed: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download the resume PDF file.
     */
    public function download()
    {
        $profile = Profile::first();

        if (! $profile || ! $profile->resume_url) {
            return response()->json([
                'message' => 'Resume not available',
            ], 404);
        }

        try {
            $publicUrl = CloudinaryUrl::resumeAttachment($profile->resume_url);

            if (! $publicUrl) {
                return response()->json([
                    'message' => 'Resume URL is invalid',
                ], 500);
            }

            return redirect()->away($publicUrl);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: '.$e->getMessage(),
            ], 500);
        }
    }
}
