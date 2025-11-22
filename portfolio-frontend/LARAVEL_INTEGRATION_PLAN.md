# Laravel + React Portfolio Integration - Complete Architecture Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Architecture (Laravel)](#backend-architecture-laravel)
3. [Frontend Architecture (React + Vite)](#frontend-architecture-react--vite)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Admin Dashboard](#admin-dashboard)
7. [Authentication & Security](#authentication--security)
8. [File & Media Management](#file--media-management)
9. [Deployment Strategy](#deployment-strategy)
10. [Development Workflow](#development-workflow)

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│                  React + Vite Frontend                      │
│              (Port 5173 - Development)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS Requests
                         │ (JSON API)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Laravel Backend API                         │
│              (Port 8000 - Development)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (/api/*)                     │  │
│  │  • /api/profile                                      │  │
│  │  • /api/experiences                                  │  │
│  │  • /api/education                                    │  │
│  │  • /api/projects                                     │  │
│  │  • /api/skills                                       │  │
│  │  • /api/settings                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼────────────────────────────────┐ │
│  │           Controllers & Business Logic               │ │
│  │  • ProfileController                                 │ │
│  │  • ExperienceController                              │ │
│  │  • EducationController                               │ │
│  │  • ProjectController                                 │ │
│  │  • SkillController                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                         │                                   │
│  ┌──────────────────────▼────────────────────────────────┐ │
│  │              Eloquent ORM Models                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   MySQL Database                            │
│  • users                    • projects                      │
│  • profiles                 • skills                        │
│  • experiences              • settings                      │
│  • education                • media                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            Admin Dashboard (Laravel Backend)                │
│         Filament Admin Panel (Port 8000/admin)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Admin Authentication (Laravel Sanctum/Breeze)       │  │
│  │  • Login/Logout                                      │  │
│  │  • Session Management                                │  │
│  │  • CSRF Protection                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Content Management                                  │  │
│  │  • Profile Editor                                    │  │
│  │  • Experience Manager                                │  │
│  │  • Project Portfolio                                 │  │
│  │  • Skills Management                                 │  │
│  │  • Media Library                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              File Storage (Laravel Storage)                 │
│  • /storage/app/public/images                               │
│  • /storage/app/public/projects                             │
│  • /storage/app/public/documents                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture (Laravel)

### Technology Stack

```yaml
Framework: Laravel 10.x / 11.x
PHP Version: 8.1+
Database: MySQL 8.0+ / PostgreSQL
Cache: Redis (production) / File (development)
Queue: Redis / Database
Storage: Local / S3 / DigitalOcean Spaces
```

### Directory Structure

```
laravel-portfolio-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── ProfileController.php
│   │   │   │   ├── ExperienceController.php
│   │   │   │   ├── EducationController.php
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── SkillController.php
│   │   │   │   └── SettingController.php
│   │   │   └── Admin/
│   │   │       └── [Filament Resources]
│   │   ├── Requests/
│   │   │   ├── StoreExperienceRequest.php
│   │   │   ├── UpdateExperienceRequest.php
│   │   │   └── [Other validation requests]
│   │   └── Resources/
│   │       ├── ProfileResource.php
│   │       ├── ExperienceResource.php
│   │       ├── EducationResource.php
│   │       ├── ProjectResource.php
│   │       └── SkillResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Profile.php
│   │   ├── Experience.php
│   │   ├── Education.php
│   │   ├── Project.php
│   │   ├── Skill.php
│   │   ├── Setting.php
│   │   └── Media.php
│   └── Filament/
│       └── Resources/
│           ├── ProfileResource.php
│           ├── ExperienceResource.php
│           └── [Other admin resources]
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_profiles_table.php
│   │   ├── 2024_01_01_000002_create_experiences_table.php
│   │   ├── 2024_01_01_000003_create_education_table.php
│   │   ├── 2024_01_01_000004_create_projects_table.php
│   │   ├── 2024_01_01_000005_create_skills_table.php
│   │   ├── 2024_01_01_000006_create_settings_table.php
│   │   └── 2024_01_01_000007_create_media_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── AdminUserSeeder.php
│   │   └── DefaultContentSeeder.php
│   └── factories/
│       ├── ExperienceFactory.php
│       └── ProjectFactory.php
├── routes/
│   ├── api.php          # Public API routes
│   ├── web.php          # Admin routes
│   └── channels.php
├── config/
│   ├── cors.php         # CORS configuration
│   ├── filesystems.php  # Storage configuration
│   └── filament.php     # Admin panel config
└── storage/
    └── app/
        └── public/
            ├── images/
            ├── projects/
            └── documents/
```

### Core Features

#### 1. **RESTful API**
- **Purpose**: Serve portfolio content to frontend
- **Format**: JSON responses
- **Versioning**: `/api/v1/*` (optional for future)
- **Caching**: Response caching with Laravel Cache
- **Rate Limiting**: Throttle public endpoints

#### 2. **Admin Dashboard**
- **Framework**: Laravel Filament 3.x
- **Features**:
  - Resource CRUD operations
  - Rich text editors
  - Image upload widgets
  - Drag & drop ordering
  - Bulk actions
  - Advanced filtering
  - Export capabilities

#### 3. **File Upload Handling**
- **Storage Driver**: Local (dev) / S3 (production)
- **Image Processing**: Intervention Image package
- **Features**:
  - Image optimization
  - Multiple size variants (thumbnail, medium, large)
  - File validation (type, size)
  - Automatic cleanup on delete

#### 4. **Authentication & Authorization**
- **Admin Auth**: Laravel Breeze + Filament
- **API Auth**: Optional (public endpoints don't need auth)
- **Guards**: web (admin), api (optional)
- **Policies**: Resource-level permissions

---

## Frontend Architecture (React + Vite)

### Technology Stack

```yaml
Framework: React 18.x
Build Tool: Vite 5.x
Language: TypeScript 5.x
Styling: Tailwind CSS
State Management: React Query (TanStack Query)
HTTP Client: Axios
Routing: React Router (optional)
```

### Directory Structure

```
react-portfolio/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Profile.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Footer.tsx
│   │   └── AIChat.tsx
│   ├── services/
│   │   ├── api.ts           # Axios instance & config
│   │   ├── profileService.ts
│   │   ├── experienceService.ts
│   │   ├── educationService.ts
│   │   ├── projectService.ts
│   │   ├── skillService.ts
│   │   └── settingService.ts
│   ├── hooks/
│   │   ├── useProfile.ts
│   │   ├── useExperiences.ts
│   │   ├── useEducation.ts
│   │   ├── useProjects.ts
│   │   └── useSkills.ts
│   ├── types/
│   │   ├── api.ts           # API response types
│   │   ├── profile.ts
│   │   ├── experience.ts
│   │   ├── project.ts
│   │   └── index.ts
│   ├── config/
│   │   └── api.config.ts    # API endpoints & settings
│   ├── utils/
│   │   ├── imageHelper.ts   # Handle dynamic image URLs
│   │   └── errorHandler.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── constants.ts         # [TO BE REMOVED - replaced with API]
├── .env.development
├── .env.production
└── vite.config.ts
```

### Core Features

#### 1. **Dynamic Content Rendering**
- Replace static `constants.ts` with API data
- Components consume data from custom hooks
- Loading states during data fetch
- Error boundaries for failed requests

#### 2. **API Integration Layer**

**Services Pattern:**
```typescript
// services/api.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// services/profileService.ts
export const getProfile = () => apiClient.get('/profile');
export const getExperiences = () => apiClient.get('/experiences');
```

**Custom Hooks with React Query:**
```typescript
// hooks/useProfile.ts
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### 3. **Environment Configuration**

**.env.development**
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_CACHE=true
```

**.env.production**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=15000
VITE_ENABLE_CACHE=true
VITE_CDN_URL=https://cdn.yourdomain.com
```

#### 4. **Image Handling**
```typescript
// utils/imageHelper.ts
export const getImageUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_CDN_URL || 
                  import.meta.env.VITE_API_URL.replace('/api', '');
  return `${baseUrl}/storage/${path}`;
};
```

---

## Database Schema

### Tables Overview

```sql
-- Users Table (Admin Authentication)
users
├── id (bigint, PK)
├── name (varchar)
├── email (varchar, unique)
├── email_verified_at (timestamp, nullable)
├── password (varchar)
├── remember_token (varchar, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Profile Table (Personal Information)
profiles
├── id (bigint, PK)
├── full_name (varchar)
├── title (varchar)
├── bio (text)
├── summary (text)
├── email (varchar)
├── phone (varchar, nullable)
├── location (varchar)
├── avatar (varchar, nullable)
├── resume_url (varchar, nullable)
├── github_url (varchar, nullable)
├── linkedin_url (varchar, nullable)
├── twitter_url (varchar, nullable)
├── website_url (varchar, nullable)
├── years_of_experience (integer)
├── availability_status (enum: 'available', 'busy', 'not_available')
├── meta_title (varchar, nullable)
├── meta_description (text, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Experiences Table (Work History)
experiences
├── id (bigint, PK)
├── company (varchar)
├── position (varchar)
├── location (varchar, nullable)
├── employment_type (enum: 'full_time', 'part_time', 'contract', 'freelance')
├── start_date (date)
├── end_date (date, nullable)
├── is_current (boolean, default: false)
├── description (text)
├── responsibilities (json, nullable)
├── technologies (json, nullable)
├── company_logo (varchar, nullable)
├── company_website (varchar, nullable)
├── order (integer, default: 0)
├── is_published (boolean, default: true)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Education Table (Academic Background)
education
├── id (bigint, PK)
├── institution (varchar)
├── degree (varchar)
├── field_of_study (varchar)
├── location (varchar, nullable)
├── start_date (date)
├── end_date (date, nullable)
├── is_current (boolean, default: false)
├── grade (varchar, nullable)
├── description (text, nullable)
├── achievements (json, nullable)
├── institution_logo (varchar, nullable)
├── order (integer, default: 0)
├── is_published (boolean, default: true)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Projects Table (Portfolio Items)
projects
├── id (bigint, PK)
├── title (varchar)
├── slug (varchar, unique)
├── short_description (varchar)
├── full_description (text)
├── category (varchar)
├── tags (json, nullable)
├── technologies (json)
├── featured_image (varchar)
├── gallery_images (json, nullable)
├── demo_url (varchar, nullable)
├── github_url (varchar, nullable)
├── client_name (varchar, nullable)
├── project_date (date)
├── duration (varchar, nullable)
├── role (varchar, nullable)
├── team_size (integer, nullable)
├── is_featured (boolean, default: false)
├── order (integer, default: 0)
├── views_count (integer, default: 0)
├── is_published (boolean, default: true)
├── published_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Skills Table (Technical & Soft Skills)
skills
├── id (bigint, PK)
├── name (varchar)
├── category (enum: 'frontend', 'backend', 'database', 'devops', 'design', 'other')
├── proficiency (enum: 'beginner', 'intermediate', 'advanced', 'expert')
├── proficiency_percentage (integer, 1-100)
├── icon (varchar, nullable)
├── color (varchar, nullable)
├── years_of_experience (decimal, nullable)
├── is_featured (boolean, default: false)
├── order (integer, default: 0)
├── is_published (boolean, default: true)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Settings Table (Site Configuration)
settings
├── id (bigint, PK)
├── key (varchar, unique)
├── value (text, nullable)
├── type (enum: 'string', 'text', 'number', 'boolean', 'json')
├── group (varchar, default: 'general')
├── description (text, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Media Table (File Management)
media
├── id (bigint, PK)
├── model_type (varchar)
├── model_id (bigint)
├── collection_name (varchar)
├── file_name (varchar)
├── disk (varchar)
├── path (varchar)
├── mime_type (varchar)
├── size (bigint)
├── width (integer, nullable)
├── height (integer, nullable)
├── alt_text (varchar, nullable)
├── title (varchar, nullable)
├── order (integer, default: 0)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Database Relationships

```
User (1) ─────── (has many) ─────── Media

Profile (1) ────── (has many) ────── Media

Experience (1) ─── (has many) ────── Media

Education (1) ──── (has many) ────── Media

Project (1) ────── (has many) ────── Media

Skill (1) ──────── (has one) ─────── Media (icon)
```

---

## API Endpoints

### Public API Endpoints

#### Profile
```http
GET /api/profile
Response: {
  "data": {
    "id": 1,
    "full_name": "Alex Sterling",
    "title": "Frontend Architect",
    "bio": "...",
    "email": "hello@alexsterling.dev",
    "phone": "+1 (555) 019-2834",
    "location": "San Francisco, CA",
    "avatar": "images/profile/avatar.jpg",
    "github_url": "https://github.com/...",
    "linkedin_url": "https://linkedin.com/in/...",
    "years_of_experience": 7,
    "availability_status": "available"
  }
}
```

#### Experiences
```http
GET /api/experiences
Response: {
  "data": [
    {
      "id": 1,
      "company": "TechCorp",
      "position": "Senior Frontend Developer",
      "employment_type": "full_time",
      "start_date": "2021-01-15",
      "end_date": null,
      "is_current": true,
      "description": "...",
      "technologies": ["React", "TypeScript", "Node.js"],
      "company_logo": "images/companies/techcorp.png"
    }
  ],
  "meta": {
    "total": 5,
    "current_page": 1
  }
}
```

#### Education
```http
GET /api/education
Response: {
  "data": [
    {
      "id": 1,
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_date": "2013-09-01",
      "end_date": "2017-06-15",
      "grade": "3.8 GPA",
      "achievements": [...]
    }
  ]
}
```

#### Projects
```http
GET /api/projects
GET /api/projects?featured=true
GET /api/projects?category=web
GET /api/projects/{slug}

Response (List): {
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "slug": "ecommerce-platform",
      "short_description": "...",
      "category": "web",
      "tags": ["React", "Laravel", "MySQL"],
      "technologies": ["React", "Tailwind", "Laravel"],
      "featured_image": "images/projects/ecommerce-hero.jpg",
      "demo_url": "https://demo.com",
      "github_url": "https://github.com/...",
      "project_date": "2023-06-01",
      "is_featured": true
    }
  ],
  "meta": {
    "total": 12,
    "per_page": 6,
    "current_page": 1
  }
}

Response (Single): {
  "data": {
    "id": 1,
    "title": "E-Commerce Platform",
    "full_description": "...",
    "gallery_images": [
      "images/projects/ecommerce-1.jpg",
      "images/projects/ecommerce-2.jpg"
    ],
    ...
  }
}
```

#### Skills
```http
GET /api/skills
GET /api/skills?category=frontend
GET /api/skills?featured=true

Response: {
  "data": [
    {
      "id": 1,
      "name": "React",
      "category": "frontend",
      "proficiency": "expert",
      "proficiency_percentage": 95,
      "icon": "images/skills/react.svg",
      "years_of_experience": 5,
      "is_featured": true
    }
  ]
}
```

#### Settings
```http
GET /api/settings
GET /api/settings/{key}

Response: {
  "data": {
    "site_title": "Alex Sterling - Portfolio",
    "site_tagline": "Frontend Architect",
    "contact_email": "hello@alexsterling.dev",
    "social_links": {
      "github": "https://github.com/...",
      "linkedin": "https://linkedin.com/in/...",
      "twitter": "https://twitter.com/..."
    },
    "gemini_api_key": "[encrypted]",
    "analytics_id": "G-XXXXXXXXXX"
  }
}
```

### Response Standards

**Success Response:**
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Resource not found",
    "code": "RESOURCE_NOT_FOUND",
    "status": 404
  }
}
```

**Pagination:**
```json
{
  "data": [...],
  "meta": {
    "total": 50,
    "per_page": 10,
    "current_page": 1,
    "last_page": 5
  },
  "links": {
    "first": "/api/projects?page=1",
    "last": "/api/projects?page=5",
    "prev": null,
    "next": "/api/projects?page=2"
  }
}
```

---

## Admin Dashboard

### Technology: Laravel Filament

#### Installation
```bash
composer require filament/filament:"^3.0"
php artisan filament:install --panels
php artisan make:filament-user
```

#### Features

**1. Dashboard Overview**
- Total projects, experiences, education count
- Recent activity feed
- Quick stats (page views, skills count)
- System health status

**2. Profile Resource**
- Single record edit page
- Rich text editor for bio/summary
- Image upload for avatar
- URL validation for social links
- Email/phone formatting

**3. Experience Resource**
- Table with company, position, dates
- Filters: current position, employment type
- Bulk actions: publish/unpublish
- Drag & drop ordering
- Rich text editor for description
- JSON repeater for responsibilities
- Tag select for technologies

**4. Education Resource**
- Similar to Experience
- Date range validation
- Institution logo upload
- JSON for achievements

**5. Project Resource**
- Featured toggle
- Category & tag management
- Multiple image upload (gallery)
- Slug auto-generation from title
- Demo & GitHub URL fields
- Rich text for full description
- Publish scheduling
- View count tracking

**6. Skills Resource**
- Category grouping
- Proficiency slider (0-100)
- Icon upload/selection
- Color picker for UI theming
- Featured toggle
- Drag & drop ordering

**7. Settings Resource**
- Key-value pair management
- Type-specific inputs
- Group organization
- Help text/descriptions
- API key encryption

**8. Media Library**
- Global media browser
- Folder organization
- Image optimization on upload
- Alt text & title metadata
- Bulk upload
- Usage tracking

#### Admin Panel Configuration

**config/filament.php**
```php
return [
    'path' => 'admin',
    'default_filesystem_disk' => 'public',
    'auth' => [
        'guard' => 'web',
        'pages' => [
            'login' => App\Filament\Pages\Auth\Login::class,
        ],
    ],
    'navigation' => [
        'groups' => [
            'Content' => [
                'collapsed' => false,
            ],
            'Settings' => [
                'collapsed' => true,
            ],
        ],
    ],
];
```

---

## Authentication & Security

### Admin Authentication

**Laravel Breeze Installation:**
```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
```

**Guards Configuration (config/auth.php):**
```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

### API Security

**1. CORS Configuration**

**config/cors.php:**
```php
return [
    'paths' => ['api/*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Development
        'https://yourdomain.com', // Production
    ],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

**2. Rate Limiting**

**app/Http/Kernel.php:**
```php
protected $middlewareGroups = [
    'api' => [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':60,1',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

**3. API Versioning (Optional)**
```php
Route::prefix('v1')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index']);
    // ...
});
```

**4. Input Validation**
```php
// app/Http/Requests/UpdateProfileRequest.php
public function rules()
{
    return [
        'full_name' => 'required|string|max:255',
        'email' => 'required|email|unique:profiles,email',
        'phone' => 'nullable|regex:/^[0-9\-\+\(\)\s]+$/',
        'avatar' => 'nullable|image|max:2048',
    ];
}
```

**5. Content Security Policy**
```php
// Add middleware
return response()->json($data)
    ->header('X-Content-Type-Options', 'nosniff')
    ->header('X-Frame-Options', 'DENY')
    ->header('X-XSS-Protection', '1; mode=block');
```

---

## File & Media Management

### Laravel Storage Configuration

**config/filesystems.php:**
```php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
    
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
    ],
],
```

### Image Processing

**Installation:**
```bash
composer require intervention/image
```

**Image Optimization Service:**
```php
// app/Services/ImageService.php
class ImageService
{
    public function optimizeAndStore($image, $path)
    {
        $sizes = [
            'thumbnail' => [150, 150],
            'medium' => [600, 600],
            'large' => [1200, 1200],
        ];
        
        foreach ($sizes as $size => $dimensions) {
            Image::make($image)
                ->fit($dimensions[0], $dimensions[1])
                ->save(storage_path("app/public/{$path}/{$size}.jpg"), 80);
        }
    }
}
```

### File Upload Flow

```
1. User uploads file in admin panel
   ↓
2. Validate file (type, size, dimensions)
   ↓
3. Generate unique filename
   ↓
4. Create multiple image sizes (thumbnail, medium, large)
   ↓
5. Store metadata in media table
   ↓
6. Associate with model (polymorphic)
   ↓
7. Return public URL to frontend
```

### Frontend Image Handling

**TypeScript Helper:**
```typescript
// src/utils/imageHelper.ts
export const getImageUrl = (
  path: string, 
  size: 'thumbnail' | 'medium' | 'large' = 'medium'
): string => {
  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  const imagePath = path.replace(/\.[^/.]+$/, `_${size}$&`);
  return `${baseUrl}/storage/${imagePath}`;
};

// Usage
<img src={getImageUrl(project.featured_image, 'large')} />
```

---

## Deployment Strategy

### Option 1: Separate Deployments (Recommended)

**Backend (Laravel API):**
- **Hosting**: DigitalOcean, AWS, Laravel Forge
- **Server**: Ubuntu 22.04 + Nginx + PHP 8.1+
- **Database**: Managed MySQL/PostgreSQL
- **Storage**: S3 or DigitalOcean Spaces
- **Cache**: Redis
- **Domain**: `api.yourdomain.com`

**Frontend (React):**
- **Hosting**: Vercel, Netlify, CloudFlare Pages
- **Build**: Automatic on git push
- **CDN**: Global edge network
- **Domain**: `yourdomain.com`

**Advantages:**
- Separate scaling
- Frontend CDN benefits
- Independent deployments
- Better performance

### Option 2: Single Server Deployment

**Laravel serves React build:**
```
Laravel App (Port 80/443)
├── /public/           → Laravel public assets
├── /public/build/     → React production build
├── /api/*             → API routes
└── /*                 → React SPA (catch-all route)
```

**Build Process:**
```bash
# Build React
cd react-portfolio
npm run build

# Copy to Laravel public
cp -r dist/* ../laravel-api/public/build/

# Configure Laravel route
Route::get('/{any}', function () {
    return file_get_contents(public_path('build/index.html'));
})->where('any', '.*');
```

**Advantages:**
- Single server management
- Simpler deployment
- Lower hosting costs
- Unified SSL certificate

### Environment Variables

**Backend (.env):**
```env
APP_NAME="Portfolio API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=portfolio_db
DB_USERNAME=portfolio_user
DB_PASSWORD=secure_password

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=portfolio-media

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525

FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_CDN_URL=https://cdn.yourdomain.com
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Deployment Checklist

**Backend:**
- [ ] Install dependencies: `composer install --no-dev`
- [ ] Optimize autoloader: `composer dump-autoload --optimize`
- [ ] Cache config: `php artisan config:cache`
- [ ] Cache routes: `php artisan route:cache`
- [ ] Cache views: `php artisan view:cache`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Link storage: `php artisan storage:link`
- [ ] Set permissions: `chmod -R 755 storage bootstrap/cache`
- [ ] Configure queue worker
- [ ] Setup cron for scheduler
- [ ] Configure SSL certificate

**Frontend:**
- [ ] Install dependencies: `npm ci`
- [ ] Build production: `npm run build`
- [ ] Deploy to hosting
- [ ] Configure environment variables
- [ ] Setup custom domain
- [ ] Enable HTTPS
- [ ] Configure caching headers

---

## Development Workflow

### Local Development Setup

**Step 1: Backend Setup**
```bash
# Clone Laravel project
git clone <repo> laravel-portfolio-api
cd laravel-portfolio-api

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate
php artisan db:seed

# Storage link
php artisan storage:link

# Start server
php artisan serve
# Runs on http://localhost:8000
```

**Step 2: Frontend Setup**
```bash
# Clone React project
cd react-portfolio

# Install dependencies
npm install

# Environment setup
cp .env.example .env.development

# Start dev server
npm run dev
# Runs on http://localhost:5173
```

**Step 3: Admin Access**
```bash
# Create admin user
php artisan make:filament-user

# Access admin panel
# http://localhost:8000/admin
```

### Development Commands

**Backend:**
```bash
# Watch for file changes
php artisan serve

# Queue worker
php artisan queue:work

# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test

# Code style fix
./vendor/bin/pint
```

**Frontend:**
```bash
# Development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Git Workflow

```
main (production)
  ↑
develop (staging)
  ↑
feature/api-integration
feature/admin-dashboard
feature/image-optimization
```

### Testing Strategy

**Backend (PHPUnit):**
```php
// tests/Feature/Api/ProfileTest.php
public function test_can_fetch_profile()
{
    $response = $this->getJson('/api/profile');
    
    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data' => [
                     'id',
                     'full_name',
                     'email',
                     'bio',
                 ]
             ]);
}
```

**Frontend (Vitest):**
```typescript
// src/services/__tests__/profileService.test.ts
describe('Profile Service', () => {
  it('should fetch profile data', async () => {
    const data = await getProfile();
    expect(data).toHaveProperty('full_name');
  });
});
```

---

## Performance Optimization

### Backend Optimization

**1. Database Query Optimization**
```php
// Eager loading
Experience::with('media')->get();

// Select specific columns
Profile::select(['id', 'full_name', 'email'])->first();

// Pagination
Project::paginate(10);
```

**2. Response Caching**
```php
public function index()
{
    return Cache::remember('projects.all', 3600, function () {
        return ProjectResource::collection(
            Project::published()->get()
        );
    });
}
```

**3. Database Indexing**
```php
$table->index(['is_published', 'created_at']);
$table->index('slug');
$table->index('category');
```

### Frontend Optimization

**1. Code Splitting**
```typescript
// Lazy load components
const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
```

**2. Image Optimization**
```tsx
<img 
  src={getImageUrl(image, 'thumbnail')}
  srcSet={`
    ${getImageUrl(image, 'medium')} 600w,
    ${getImageUrl(image, 'large')} 1200w
  `}
  loading="lazy"
/>
```

**3. React Query Configuration**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Monitoring & Maintenance

### Logging

**Laravel:**
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
    ],
],
```

### Error Tracking

**Recommended Tools:**
- Sentry (error monitoring)
- Laravel Telescope (local debugging)
- New Relic (performance monitoring)

### Backup Strategy

**Database Backup:**
```bash
# Install package
composer require spatie/laravel-backup

# Configure schedule
php artisan backup:run
```

**Storage Backup:**
- Automated S3 versioning
- Daily snapshots
- 30-day retention

---

## Appendix

### Useful Packages

**Backend:**
- `spatie/laravel-medialibrary` - Media management
- `spatie/laravel-sluggable` - Auto slug generation
- `intervention/image` - Image manipulation
- `barryvdh/laravel-cors` - CORS handling
- `spatie/laravel-backup` - Automated backups

**Frontend:**
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `react-lazy-load-image-component` - Image lazy loading
- `framer-motion` - Animations
- `react-helmet-async` - SEO meta tags

### API Documentation Tools

- **Scribe** - Laravel API documentation generator
- **Postman** - API testing and documentation
- **Swagger/OpenAPI** - Interactive API docs

### Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev)

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**Author:** Portfolio Integration Team
