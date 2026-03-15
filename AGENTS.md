# AGENTS.md - Portfolio (Gagan Kumar)

Full-stack portfolio: Laravel 12 API (`portfolio-api/`) + React 19 + TypeScript frontend (`portfolio-frontend/`).
Admin panel via Filament 4.0 at `/admin`. Database: SQLite (dev), MySQL/PostgreSQL (prod). File storage: Cloudinary.

## Project Structure

```
portfolio-Gagan_Kumar/
  portfolio-api/          # Laravel 12 PHP backend
    app/Http/Controllers/Api/   # API controllers (ProfileController, ProjectController, etc.)
    app/Http/Resources/         # JSON API resource transformers
    app/Models/                 # Eloquent models (Profile, Experience, Project, Skill, BlogPost, etc.)
    app/Services/               # CloudinaryUploadService
    app/Filament/Resources/     # Admin panel resources (domain-organized: Pages/, Schemas/, Tables/)
    routes/api.php              # All API routes (public, no auth)
    database/migrations/        # Anonymous-class migrations
    database/seeders/           # DatabaseSeeder, PortfolioDataSeeder, ProductionDataSeeder
    tests/                      # PHPUnit tests (mostly scaffolded examples)
  portfolio-frontend/     # React 19 + TypeScript + Vite
    App.tsx                     # Root component, routing, QueryClient, theme hook
    index.tsx                   # Entry point, React StrictMode
    types.ts                    # All TypeScript interfaces and enums
    constants.ts                # Static fallback data
    components/                 # React components (Hero, Header, Experience, Skills, BlogPost, etc.)
    hooks/usePortfolio.ts       # TanStack Query hooks for all API endpoints
    services/                   # api.ts (Axios client), portfolioService.ts, gemini.ts (AI chat)
    config/api.config.ts        # API base URL, endpoints, headers
    utils/cloudinary.ts         # Cloudinary image URL optimizer
    styles/custom.css           # Custom CSS (animations, dark mode, blog prose)
    app.css                     # Tailwind v4 imports, @theme config, font-face declarations
```

## Build / Dev / Test Commands

### Backend (portfolio-api/)

```bash
composer install                          # Install PHP dependencies
composer setup                            # Full setup: install, .env, key:generate, migrate, npm
composer dev                              # Start all dev services (serve + queue + pail + vite)
composer test                             # Clear config + run artisan test
php artisan serve                         # Start dev server on :8000
php artisan migrate                       # Run database migrations
php artisan migrate:fresh --seed          # Reset DB + seed sample data
php artisan db:seed --class=ProductionDataSeeder  # Seed real production data
php artisan test                          # Run PHPUnit test suite
php artisan test --filter=ExampleTest     # Run a single test class
php artisan test --filter=test_example    # Run a single test method
php artisan pint                          # Fix code style (PSR-12 via Laravel Pint)
npm run build                             # Build Vite assets (Filament admin)
```

Tests use in-memory SQLite (`DB_DATABASE=:memory:`) configured in `phpunit.xml`.
Test suites: `tests/Unit/` and `tests/Feature/`.

### Frontend (portfolio-frontend/)

```bash
npm install                               # Install Node dependencies
npm run dev                               # Start Vite dev server on :3000
npm run build                             # Production build (output: dist/)
npm run preview                           # Preview production build
```

No test runner is configured for the frontend. No ESLint or Prettier config files exist.
TypeScript checking: `tsconfig.json` targets ES2022, uses `bundler` module resolution, `noEmit` only.

### Docker (root)

```bash
docker-compose up                         # Start all services (db, api, frontend)
docker-compose up --build                 # Rebuild and start
```

## Code Style Guidelines

### PHP (Laravel API)

- **Formatter**: Laravel Pint (PSR-12). Run `php artisan pint` before committing.
- **EditorConfig**: 4-space indent, UTF-8, LF line endings, trailing newline. YAML uses 2-space indent.
- **PHP version**: ^8.2. Use typed properties, union types, nullsafe operator (`?->`).
- **Namespace**: PSR-4 autoloading. Controllers: `App\Http\Controllers\Api\`. Models: `App\Models\`.

#### Naming Conventions

| Element            | Convention                       | Example                          |
|--------------------|----------------------------------|----------------------------------|
| Models             | Singular PascalCase              | `BlogPost`, `Experience`         |
| Controllers        | Singular PascalCase + Controller | `ProjectController`              |
| API Resources      | Singular PascalCase + Resource   | `ProfileResource`                |
| Database columns   | snake_case                       | `is_published`, `display_order`  |
| Database tables    | Plural snake_case                | `blog_posts`, `experiences`      |
| Migrations         | Anonymous class syntax           | `return new class extends Migration` |
| Filament resources | Domain-organized subdirectories  | `Filament/Resources/BlogPosts/`  |

#### Model Patterns

- Always use `$fillable` (mass assignment whitelist), never `$guarded`.
- Use `$casts` for type casting: booleans, dates, JSON arrays, integers.
- Define named scopes for filtering: `published()`, `ordered()`, `featured()`, `byCategory()`.
- JSON columns for array data: `technologies`, `features`, `tags`, `responsibilities`.
- No soft deletes. No model relationships (flat structure).

#### Controller Patterns

- Thin controllers. Business logic in model scopes and services.
- Return data wrapped in API Resources (`JsonResource`) for structured responses.
- Use `findOrFail()` for automatic 404 responses, or manual null checks with `response()->json(['message' => '...'], 404)`.
- No Form Request classes -- validation is inline in controllers.
- Error handling: try/catch for external service calls (Cloudinary). Let Laravel handle model not found exceptions.

#### API Resource Patterns

- Return type: `array<string, mixed>`.
- Format dates with nullsafe: `$this->start_date?->format('Y-m-d')`.
- Strip internal fields (`is_published`, `display_order`) from API output.
- Handle image URLs: check for full URLs, fall back to Cloudinary disk, then placeholder images.

### TypeScript / React (Frontend)

#### File & Component Naming

| Element          | Convention                       | Example                          |
|------------------|----------------------------------|----------------------------------|
| Components       | PascalCase `.tsx` files          | `Hero.tsx`, `BlogPost.tsx`       |
| Hooks            | camelCase `use` prefix           | `usePortfolio.ts`                |
| Services         | camelCase `.ts` files            | `portfolioService.ts`, `api.ts`  |
| Utils            | camelCase `.ts` files            | `cloudinary.ts`                  |
| Types            | Single `types.ts` at root        | Interfaces + enums + type aliases|
| Config           | camelCase `.config.ts`           | `api.config.ts`                  |

#### Import Order

1. React and React libraries (`react`, `react-dom`, `react-router-dom`)
2. Third-party libraries (`@tanstack/react-query`, `axios`, `@google/genai`)
3. Local components (`./components/Header`)
4. Local types, hooks, services (`./types`, `./hooks/usePortfolio`, `./services/...`)
5. Styles (CSS imports)

#### Component Patterns

- **Named exports** for components: `export const Hero: React.FC = () => { ... }`.
- Type components with `React.FC` or `React.FC<Props>`.
- Define prop interfaces inline or above the component: `interface HeaderProps { ... }`.
- Use lazy loading with `React.lazy()` + `Suspense` for code splitting below-the-fold sections.
- Lazy imports use `.then(m => ({ default: m.ComponentName }))` pattern for named exports.

#### TypeScript Types

- Use `interface` for object shapes (not `type` aliases for objects).
- Use `enum` for fixed sets: `enum SectionId { Hero = 'hero', ... }`.
- Use `type` for unions: `type Theme = 'light' | 'dark' | 'system'`.
- All API response types are defined in root `types.ts`, matching Laravel Resources.
- Nullable fields use `T | null` (not optional `?`), matching API responses.

#### State Management & Data Fetching

- TanStack Query (React Query) for all API data fetching.
- Custom hooks in `hooks/usePortfolio.ts` wrap `useQuery` calls.
- Query config: `staleTime: 5min`, `gcTime: 10min`, `refetchOnWindowFocus: false`.
- Services in `services/portfolioService.ts` are object literals with async methods.
- Axios client configured in `services/api.ts` with interceptors for error logging.
- All service methods extract `response.data.data` (Laravel's resource wrapper).

#### Styling

- **Tailwind CSS v4** via Vite plugin (no `tailwind.config.js` -- config in `app.css` `@theme` block).
- Dark mode: class-based (`dark:` prefix). Toggle cycles: light -> dark -> system.
- Custom CSS in `styles/custom.css` for complex animations and blog prose typography.
- Custom theme colors defined in `@theme`: `geo-black`, `geo-dark-bg`, `geo-dark-card`, `geo-dark-border`.
- Fonts: `Inter` (sans), `Space Grotesk` (display) -- self-hosted woff2.
- Pattern: utility-first Tailwind in JSX, custom CSS classes for animations/hover effects.
- Always include `transition-colors duration-300` on theme-sensitive containers.
- Respect `prefers-reduced-motion` in custom CSS animations.

#### Error Handling

- Components check `isLoading` and `error` from React Query hooks.
- Loading state: render skeleton/pulse placeholders (`animate-pulse`).
- Error state: render simple error message in red.
- API errors logged via Axios response interceptor (console.error).
- Gemini AI chat: graceful degradation with try/catch, fallback system instruction.

#### Path Aliases

- `@/*` maps to project root (configured in `tsconfig.json` and `vite.config.ts`).
- Prefer relative imports for local files within the same directory tree.

## Environment Variables

### Backend (.env)
- `APP_KEY`, `APP_ENV`, `APP_URL`, `APP_DEBUG`
- `DB_CONNECTION` (sqlite/mysql/pgsql), `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend (.env.development / .env.production)
- `VITE_API_URL` -- API base URL (default: `http://127.0.0.1:8000/api`)
- `VITE_API_TIMEOUT` -- Request timeout in ms (default: 30000)
- `GEMINI_API_KEY` -- Google Gemini API key for AI chat

**Never commit `.env` files. Use `.env.example` as reference.**

## API Endpoints

All routes are public (no auth). Prefix: `/api`.

| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| GET    | `/api/profile`          | Profile info                   |
| GET    | `/api/experiences`      | Work experiences               |
| GET    | `/api/education`        | Education records              |
| GET    | `/api/projects`         | Projects (filterable: `?category=`, `?featured`) |
| GET    | `/api/projects/{id}`    | Single project                 |
| GET    | `/api/skills`           | Skills (filterable: `?category=`, `?grouped=true`) |
| GET    | `/api/blog`             | Blog posts (paginated, filterable) |
| GET    | `/api/blog/featured`    | Featured blog posts            |
| GET    | `/api/blog/categories`  | Blog categories                |
| GET    | `/api/blog/{slug}`      | Single blog post by slug       |
| GET    | `/api/settings`         | All settings (key-value)       |
| GET    | `/api/resume/download`  | Download resume PDF            |
