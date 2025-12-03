<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ResumeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Profile endpoint (single resource)
Route::get('/profile', [ProfileController::class, 'index']);

// Resume download endpoint
Route::get('/resume/download', [ResumeController::class, 'download']);

// Debug endpoint - remove after testing
Route::get('/resume/debug', function() {
    $profile = \App\Models\Profile::first();
    if (!$profile) {
        return response()->json(['message' => 'No profile found'], 404);
    }
    
    $cloudName = config('filesystems.disks.cloudinary.cloud');
    $resumePath = $profile->resume_url;
    $cleanPath = ltrim($resumePath, '/');
    $constructedUrl = "https://res.cloudinary.com/{$cloudName}/raw/upload/{$cleanPath}";
    
    return response()->json([
        'raw_resume_url' => $resumePath,
        'cloud_name' => $cloudName,
        'clean_path' => $cleanPath,
        'constructed_url' => $constructedUrl,
        'note' => 'Path stored WITH .pdf extension, used as-is'
    ]);
});

// Experience endpoints
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/experiences/{id}', [ExperienceController::class, 'show']);

// Education endpoints
Route::get('/education', [EducationController::class, 'index']);
Route::get('/education/{id}', [EducationController::class, 'show']);

// Project endpoints
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);

// Skill endpoints
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/skills/{id}', [SkillController::class, 'show']);

// Settings endpoints
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{key}', [SettingController::class, 'show']);
