<?php

use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SkillController;
use Illuminate\Support\Facades\Route;

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

// Resume endpoints
Route::get('/resume/download', [ResumeController::class, 'download']);
Route::post('/resume/upload', [ResumeController::class, 'upload']);

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

// Blog endpoints (order matters: specific routes before wildcard {slug})
Route::get('/blog', [BlogPostController::class, 'index']);
Route::get('/blog/featured', [BlogPostController::class, 'featured']);
Route::get('/blog/categories', [BlogPostController::class, 'categories']);
Route::get('/blog/{slug}', [BlogPostController::class, 'show']);
