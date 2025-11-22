<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'title',
        'bio',
        'summary',
        'email',
        'phone',
        'location',
        'avatar',
        'resume_url',
        'github_url',
        'linkedin_url',
        'twitter_url',
        'website_url',
        'years_of_experience',
        'availability_status',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'years_of_experience' => 'integer',
    ];
}
