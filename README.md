# Gagan Kumar - Portfolio

Full-stack portfolio application built with Laravel (API) and React (Frontend).

## 🚀 Tech Stack

### Backend (Laravel API)
- **Framework:** Laravel 11
- **Database:** MySQL (Local) / PostgreSQL (Production)
- **API:** RESTful with Resource transformers
- **Features:** CORS enabled, optimized queries, JSON responses

### Frontend (React + Vite)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## 📦 Project Structure

```
portfolio-Gagan_Kumar/
├── portfolio-api/          # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   └── Resources/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── portfolio-frontend/     # React frontend
    ├── components/
    ├── services/
    ├── hooks/
    ├── config/
    └── types.ts
```

## 🛠️ Setup Instructions

### Backend Setup

```bash
cd portfolio-api

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_DATABASE=portfolio_db
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed
php artisan migrate:fresh --seed

# Start server
php artisan serve
```

API will be available at: `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd portfolio-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.development .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🔌 API Endpoints

- `GET /api/profile` - Get profile information
- `GET /api/experiences` - List all work experiences
- `GET /api/education` - List education records
- `GET /api/projects` - List portfolio projects
- `GET /api/skills?grouped=1` - List skills grouped by category

## 🌟 Features

- ✅ Dynamic content from database
- ✅ RESTful API with clean JSON responses
- ✅ React Query for efficient data fetching & caching
- ✅ TypeScript for type safety
- ✅ Loading states & error handling
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support
- ✅ CORS configured for local development

## 📝 Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=portfolio_db
```

### Frontend (.env.development)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## 🚀 Deployment

### Production Environment

**Backend:** Supports PostgreSQL for production
**Frontend:** Build with `npm run build`, deploy to Vercel/Netlify

See `.env.production.example` files for production configuration.

## 📄 License

Personal portfolio project.

## 👤 Author

**Gagan Kumar**
- GitHub: [@Gagan1015](https://github.com/Gagan1015)
