# Laravel Portfolio API - Setup Guide

This guide contains all the code you need to set up your Laravel backend API.

## Step 1: Database Migrations

Navigate to `c:\Users\admin\Downloads\portfolio-api\database\migrations\` and update the migration files:

### 1. Profiles Table Migration

File: `2025_11_22_XXXXXX_create_profiles_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('title');
            $table->text('bio');
            $table->text('summary');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('location');
            $table->string('avatar')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('website_url')->nullable();
            $table->integer('years_of_experience')->default(0);
            $table->enum('availability_status', ['available', 'busy', 'not_available'])->default('available');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
```

### 2. Experiences Table Migration

File: `2025_11_22_XXXXXX_create_experiences_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->string('location')->nullable();
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'freelance'])->default('full_time');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description');
            $table->json('responsibilities')->nullable();
            $table->json('technologies')->nullable();
            $table->string('company_logo')->nullable();
            $table->string('company_website')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            
            $table->index(['is_published', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
```

### 3. Education Table Migration

File: `2025_11_22_XXXXXX_create_education_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');
            $table->string('field_of_study');
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->string('grade')->nullable();
            $table->text('description')->nullable();
            $table->json('achievements')->nullable();
            $table->string('institution_logo')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            
            $table->index(['is_published', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};
```

### 4. Projects Table Migration

File: `2025_11_22_XXXXXX_create_projects_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description');
            $table->text('full_description');
            $table->string('category');
            $table->json('tags')->nullable();
            $table->json('technologies');
            $table->string('featured_image');
            $table->json('gallery_images')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('client_name')->nullable();
            $table->date('project_date');
            $table->string('duration')->nullable();
            $table->string('role')->nullable();
            $table->integer('team_size')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->integer('views_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->index(['is_published', 'is_featured']);
            $table->index('slug');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
```

### 5. Skills Table Migration

File: `2025_11_22_XXXXXX_create_skills_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['frontend', 'backend', 'database', 'devops', 'design', 'other'])->default('other');
            $table->enum('proficiency', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
            $table->integer('proficiency_percentage')->default(50);
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->decimal('years_of_experience', 4, 1)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            
            $table->index(['category', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
```

### 6. Settings Table Migration

File: `2025_11_22_XXXXXX_create_settings_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->enum('type', ['string', 'text', 'number', 'boolean', 'json'])->default('string');
            $table->string('group')->default('general');
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index('key');
            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
```

## Step 2: Run Migrations

```bash
cd c:\Users\admin\Downloads\portfolio-api
php artisan migrate
```

## Step 3: Create Models

### 1. Profile Model

File: `app/Models/Profile.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
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
```

### 2. Experience Model

File: `app/Models/Experience.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company',
        'position',
        'location',
        'employment_type',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'responsibilities',
        'technologies',
        'company_logo',
        'company_website',
        'order',
        'is_published',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_published' => 'boolean',
        'responsibilities' => 'array',
        'technologies' => 'array',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('order');
    }
}
```

### 3. Education Model

File: `app/Models/Education.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = [
        'institution',
        'degree',
        'field_of_study',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'grade',
        'description',
        'achievements',
        'institution_logo',
        'order',
        'is_published',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_published' => 'boolean',
        'achievements' => 'array',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('order');
    }
}
```

### 4. Project Model

File: `app/Models/Project.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'full_description',
        'category',
        'tags',
        'technologies',
        'featured_image',
        'gallery_images',
        'demo_url',
        'github_url',
        'client_name',
        'project_date',
        'duration',
        'role',
        'team_size',
        'is_featured',
        'order',
        'views_count',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'project_date' => 'date',
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'tags' => 'array',
        'technologies' => 'array',
        'gallery_images' => 'array',
        'order' => 'integer',
        'views_count' => 'integer',
        'team_size' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('order');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
```

### 5. Skill Model

File: `app/Models/Skill.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
        'proficiency',
        'proficiency_percentage',
        'icon',
        'color',
        'years_of_experience',
        'is_featured',
        'order',
        'is_published',
    ];

    protected $casts = [
        'proficiency_percentage' => 'integer',
        'years_of_experience' => 'decimal:1',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('order');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
```

### 6. Setting Model

File: `app/Models/Setting.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'number' => (int) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function set($key, $value, $type = 'string', $group = 'general')
    {
        $value = match ($type) {
            'boolean' => $value ? '1' : '0',
            'json' => json_encode($value),
            default => (string) $value,
        };

        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );
    }
}
```

## Step 4: Create API Resources

### 1. Profile Resource

File: `app/Http/Resources/ProfileResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
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
            'avatar' => $this->avatar ? url('storage/' . $this->avatar) : null,
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
```

### 2. Experience Resource

File: `app/Http/Resources/ExperienceResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'position' => $this->position,
            'location' => $this->location,
            'employment_type' => $this->employment_type,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => $this->is_current,
            'description' => $this->description,
            'responsibilities' => $this->responsibilities,
            'technologies' => $this->technologies,
            'company_logo' => $this->company_logo ? url('storage/' . $this->company_logo) : null,
            'company_website' => $this->company_website,
        ];
    }
}
```

### 3. Education Resource

File: `app/Http/Resources/EducationResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EducationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution' => $this->institution,
            'degree' => $this->degree,
            'field_of_study' => $this->field_of_study,
            'location' => $this->location,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => $this->is_current,
            'grade' => $this->grade,
            'description' => $this->description,
            'achievements' => $this->achievements,
            'institution_logo' => $this->institution_logo ? url('storage/' . $this->institution_logo) : null,
        ];
    }
}
```

### 4. Project Resource

File: `app/Http/Resources/ProjectResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'full_description' => $this->when($request->routeIs('api.projects.show'), $this->full_description),
            'category' => $this->category,
            'tags' => $this->tags,
            'technologies' => $this->technologies,
            'featured_image' => url('storage/' . $this->featured_image),
            'gallery_images' => $this->when(
                $request->routeIs('api.projects.show') && $this->gallery_images,
                collect($this->gallery_images)->map(fn($img) => url('storage/' . $img))
            ),
            'demo_url' => $this->demo_url,
            'github_url' => $this->github_url,
            'client_name' => $this->when($request->routeIs('api.projects.show'), $this->client_name),
            'project_date' => $this->project_date->format('Y-m-d'),
            'duration' => $this->when($request->routeIs('api.projects.show'), $this->duration),
            'role' => $this->when($request->routeIs('api.projects.show'), $this->role),
            'team_size' => $this->when($request->routeIs('api.projects.show'), $this->team_size),
            'is_featured' => $this->is_featured,
        ];
    }
}
```

### 5. Skill Resource

File: `app/Http/Resources/SkillResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'proficiency' => $this->proficiency,
            'proficiency_percentage' => $this->proficiency_percentage,
            'icon' => $this->icon ? url('storage/' . $this->icon) : null,
            'color' => $this->color,
            'years_of_experience' => $this->years_of_experience,
            'is_featured' => $this->is_featured,
        ];
    }
}
```

## Step 5: Create API Controllers

Run these commands:

```bash
php artisan make:controller Api/ProfileController
php artisan make:controller Api/ExperienceController
php artisan make:controller Api/EducationController
php artisan make:controller Api/ProjectController
php artisan make:controller Api/SkillController
php artisan make:controller Api/SettingController
```

### 1. ProfileController

File: `app/Http/Controllers/Api/ProfileController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::first();
        
        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        return new ProfileResource($profile);
    }
}
```

### 2. ExperienceController

File: `app/Http/Controllers/Api/ExperienceController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::published()->get();
        
        return ExperienceResource::collection($experiences);
    }
}
```

### 3. EducationController

File: `app/Http/Controllers/Api/EducationController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Models\Education;

class EducationController extends Controller
{
    public function index()
    {
        $education = Education::published()->get();
        
        return EducationResource::collection($education);
    }
}
```

### 4. ProjectController

File: `app/Http/Controllers/Api/ProjectController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::published();

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $projects = $query->get();
        
        return ProjectResource::collection($projects);
    }

    public function show($slug)
    {
        $project = Project::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Increment view count
        $project->increment('views_count');

        return new ProjectResource($project);
    }
}
```

### 5. SkillController

File: `app/Http/Controllers/Api/SkillController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $query = Skill::published();

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        $skills = $query->get();
        
        return SkillResource::collection($skills);
    }
}
```

### 6. SettingController

File: `app/Http/Controllers/Api/SettingController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        return response()->json(['data' => $settings]);
    }

    public function show($key)
    {
        $value = Setting::get($key);
        
        if ($value === null) {
            return response()->json([
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json(['data' => $value]);
    }
}
```

## Step 6: Configure API Routes

File: `routes/api.php`

```php
<?php

use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SkillController;
use Illuminate\Support\Facades\Route;

// Profile
Route::get('/profile', [ProfileController::class, 'index']);

// Experiences
Route::get('/experiences', [ExperienceController::class, 'index']);

// Education
Route::get('/education', [EducationController::class, 'index']);

// Projects
Route::get('/projects', [ProjectController::class, 'index'])->name('api.projects.index');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('api.projects.show');

// Skills
Route::get('/skills', [SkillController::class, 'index']);

// Settings
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{key}', [SettingController::class, 'show']);
```

## Step 7: Configure CORS

File: `config/cors.php`

Update the paths and allowed_origins:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
```

## Step 8: Create Storage Link

```bash
php artisan storage:link
```

## Step 9: Create Seeders

### Database Seeder

File: `database/seeders/DatabaseSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProfileSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            ProjectSeeder::class,
            SkillSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
```

### Profile Seeder

Create: `database/seeders/ProfileSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::create([
            'full_name' => 'Alex Sterling',
            'title' => 'Frontend Architect',
            'bio' => 'Passionate about creating beautiful and functional web experiences.',
            'summary' => 'Crafting intersectional digital experiences with geometric precision, reactivity, and generative intelligence.',
            'email' => 'hello@alexsterling.dev',
            'phone' => '+1 (555) 019-2834',
            'location' => 'San Francisco, CA',
            'github_url' => 'https://github.com',
            'linkedin_url' => 'https://linkedin.com',
            'years_of_experience' => 7,
            'availability_status' => 'available',
        ]);
    }
}
```

### Experience Seeder

Create: `database/seeders/ExperienceSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        Experience::create([
            'company' => 'TechCorp',
            'position' => 'Senior Frontend Developer',
            'location' => 'San Francisco, CA',
            'employment_type' => 'full_time',
            'start_date' => '2021-01-15',
            'end_date' => null,
            'is_current' => true,
            'description' => 'Leading frontend development initiatives and mentoring junior developers.',
            'technologies' => ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
            'responsibilities' => [
                'Architected scalable React applications',
                'Led team of 5 developers',
                'Implemented CI/CD pipelines',
            ],
            'order' => 1,
        ]);

        Experience::create([
            'company' => 'StartupXYZ',
            'position' => 'Frontend Developer',
            'location' => 'Remote',
            'employment_type' => 'full_time',
            'start_date' => '2018-06-01',
            'end_date' => '2020-12-31',
            'is_current' => false,
            'description' => 'Built responsive web applications for various clients.',
            'technologies' => ['Vue.js', 'JavaScript', 'SCSS'],
            'order' => 2,
        ]);
    }
}
```

### Education Seeder

Create: `database/seeders/EducationSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Education;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        Education::create([
            'institution' => 'Stanford University',
            'degree' => 'Bachelor of Science',
            'field_of_study' => 'Computer Science',
            'location' => 'Stanford, CA',
            'start_date' => '2013-09-01',
            'end_date' => '2017-06-15',
            'grade' => '3.8 GPA',
            'description' => 'Focused on web technologies and software engineering.',
            'achievements' => [
                'Dean\'s List all semesters',
                'Best CS Project Award 2017',
            ],
            'order' => 1,
        ]);
    }
}
```

### Project Seeder

Create: `database/seeders/ProjectSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'title' => 'E-Commerce Platform',
            'slug' => 'ecommerce-platform',
            'short_description' => 'Modern e-commerce solution with real-time inventory management',
            'full_description' => 'Comprehensive e-commerce platform built with React and Laravel, featuring real-time inventory tracking, payment integration, and advanced analytics.',
            'category' => 'web',
            'tags' => ['E-Commerce', 'React', 'Laravel'],
            'technologies' => ['React', 'Laravel', 'MySQL', 'Redis', 'Stripe'],
            'featured_image' => 'projects/ecommerce-hero.jpg',
            'demo_url' => 'https://demo.example.com',
            'github_url' => 'https://github.com/example/ecommerce',
            'project_date' => '2023-06-01',
            'duration' => '6 months',
            'role' => 'Lead Developer',
            'team_size' => 4,
            'is_featured' => true,
            'is_published' => true,
            'published_at' => now(),
            'order' => 1,
        ]);

        Project::create([
            'title' => 'Portfolio CMS',
            'slug' => 'portfolio-cms',
            'short_description' => 'Content management system for creative professionals',
            'full_description' => 'Custom CMS tailored for designers and developers to showcase their work.',
            'category' => 'cms',
            'tags' => ['CMS', 'Portfolio', 'Admin Panel'],
            'technologies' => ['React', 'TypeScript', 'Filament', 'Laravel'],
            'featured_image' => 'projects/cms-hero.jpg',
            'project_date' => '2024-01-15',
            'duration' => '3 months',
            'role' => 'Full Stack Developer',
            'is_featured' => true,
            'is_published' => true,
            'published_at' => now(),
            'order' => 2,
        ]);
    }
}
```

### Skill Seeder

Create: `database/seeders/SkillSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'React', 'category' => 'frontend', 'proficiency' => 'expert', 'proficiency_percentage' => 95, 'years_of_experience' => 5, 'is_featured' => true, 'order' => 1],
            ['name' => 'TypeScript', 'category' => 'frontend', 'proficiency' => 'expert', 'proficiency_percentage' => 90, 'years_of_experience' => 4, 'is_featured' => true, 'order' => 2],
            ['name' => 'Laravel', 'category' => 'backend', 'proficiency' => 'advanced', 'proficiency_percentage' => 85, 'years_of_experience' => 3, 'is_featured' => true, 'order' => 3],
            ['name' => 'Node.js', 'category' => 'backend', 'proficiency' => 'advanced', 'proficiency_percentage' => 80, 'years_of_experience' => 4, 'is_featured' => false, 'order' => 4],
            ['name' => 'MySQL', 'category' => 'database', 'proficiency' => 'advanced', 'proficiency_percentage' => 85, 'years_of_experience' => 5, 'is_featured' => false, 'order' => 5],
            ['name' => 'Docker', 'category' => 'devops', 'proficiency' => 'intermediate', 'proficiency_percentage' => 70, 'years_of_experience' => 2, 'is_featured' => false, 'order' => 6],
            ['name' => 'Tailwind CSS', 'category' => 'frontend', 'proficiency' => 'expert', 'proficiency_percentage' => 95, 'years_of_experience' => 3, 'is_featured' => true, 'order' => 7],
            ['name' => 'Figma', 'category' => 'design', 'proficiency' => 'advanced', 'proficiency_percentage' => 80, 'years_of_experience' => 4, 'is_featured' => false, 'order' => 8],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
```

### Setting Seeder

Create: `database/seeders/SettingSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::set('site_title', 'Alex Sterling - Portfolio', 'string', 'general');
        Setting::set('site_tagline', 'Frontend Architect & Developer', 'string', 'general');
        Setting::set('contact_email', 'hello@alexsterling.dev', 'string', 'contact');
        Setting::set('analytics_id', 'G-XXXXXXXXXX', 'string', 'integrations');
    }
}
```

## Step 10: Run Seeders

```bash
php artisan db:seed
```

## Step 11: Test the API

Start the Laravel server:

```bash
php artisan serve
```

Test endpoints in browser or Postman:

- `http://localhost:8000/api/profile`
- `http://localhost:8000/api/experiences`
- `http://localhost:8000/api/education`
- `http://localhost:8000/api/projects`
- `http://localhost:8000/api/skills`
- `http://localhost:8000/api/settings`

## Next Steps

1. **Enable PHP intl extension** to install Filament admin panel
2. **Create admin user** for managing content
3. **Set up image upload** functionality
4. **Connect React frontend** to these API endpoints

Your Laravel backend API is now ready! 🎉
