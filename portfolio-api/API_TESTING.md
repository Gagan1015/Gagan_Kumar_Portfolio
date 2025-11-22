# Portfolio API - Quick Test Guide

## ✅ Database Setup Complete!

Your Laravel API is now fully configured with:
- ✅ MySQL database created and migrated
- ✅ All tables created with proper schema
- ✅ Sample portfolio data seeded
- ✅ API routes configured
- ✅ CORS enabled for frontend

## 🚀 Start the Server

Run this command:
```bash
cd portfolio-api
php artisan serve
```

Server will run at: **http://127.0.0.1:8000**

## 🧪 Test API Endpoints

### Option 1: Browser
Open these URLs in your browser:

- **Profile**: http://127.0.0.1:8000/api/profile
- **Experiences**: http://127.0.0.1:8000/api/experiences
- **Education**: http://127.0.0.1:8000/api/education
- **Projects**: http://127.0.0.1:8000/api/projects
- **Skills**: http://127.0.0.1:8000/api/skills
- **Skills (Grouped)**: http://127.0.0.1:8000/api/skills?grouped=1

### Option 2: PowerShell
```powershell
# Test profile endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/profile" | ConvertTo-Json

# Test experiences
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/experiences" | ConvertTo-Json

# Test projects
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/projects" | ConvertTo-Json

# Test skills (grouped by category)
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/skills?grouped=1" | ConvertTo-Json
```

### Option 3: Postman/Insomnia
Import these endpoints:
- GET `http://127.0.0.1:8000/api/profile`
- GET `http://127.0.0.1:8000/api/experiences`
- GET `http://127.0.0.1:8000/api/education`
- GET `http://127.0.0.1:8000/api/projects`
- GET `http://127.0.0.1:8000/api/skills`

## 📋 Expected Response Format

### Profile Response:
```json
{
  "data": {
    "id": 1,
    "full_name": "Gagan Kumar",
    "title": "Senior Product Engineer",
    "bio": "...",
    "email": "contact@gagankumar.dev",
    "github_url": "https://github.com/gagankumar",
    ...
  }
}
```

### Experiences Response:
```json
{
  "data": [
    {
      "id": 1,
      "company": "Vercel",
      "position": "Senior Frontend Engineer",
      "technologies": ["React", "Next.js", "TypeScript", "GraphQL"],
      ...
    }
  ]
}
```

## 📊 Database Seeded Data

The database now contains:
- 1 Profile (Gagan Kumar)
- 3 Experiences (Vercel, Stripe, Huge Inc.)
- 2 Education records (MIT)
- 4 Projects (Lumina Interface, Apex Finance, Mono Portfolio, Velvet AI)
- 18 Skills grouped in 3 categories

## 🔧 Useful Commands

```bash
# View routes
php artisan route:list --path=api

# Check database
php artisan db:show

# View migrations status
php artisan migrate:status

# Re-seed data (without dropping tables)
php artisan db:seed --class=PortfolioDataSeeder

# Fresh migration and seed
php artisan migrate:fresh --seed
```

## 📦 Next Step: Frontend Integration

Now that the backend is ready, you can:
1. Keep the Laravel server running (`php artisan serve`)
2. Navigate to the frontend folder
3. Create API service files to connect to these endpoints
4. Replace static data in React components with API calls

Would you like me to help set up the frontend API integration next?
