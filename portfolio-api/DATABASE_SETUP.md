# Portfolio API - Database Setup Instructions

## Local Development (MySQL)

### 1. Create the MySQL Database

You need to create the `portfolio_db` database. Choose one of these methods:

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Option B: Using phpMyAdmin
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Click "New" in the left sidebar
3. Enter database name: `portfolio_db`
4. Choose collation: `utf8mb4_unicode_ci`
5. Click "Create"

#### Option C: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Execute: `CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

### 2. Configure Environment
Your `.env` file is already configured for MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_db
DB_USERNAME=root
DB_PASSWORD=
```

Update `DB_PASSWORD` if your MySQL root user has a password.

### 3. Run Migrations and Seeders
```bash
# Navigate to the API directory
cd portfolio-api

# Run migrations to create tables
php artisan migrate

# Seed the database with portfolio data
php artisan db:seed

# Or run both in one command
php artisan migrate:fresh --seed
```

### 4. Start the Laravel Server
```bash
php artisan serve
```

The API will be available at: http://localhost:8000

### 5. Test the API Endpoints
```bash
# Test profile endpoint
curl http://localhost:8000/api/profile

# Test experiences endpoint
curl http://localhost:8000/api/experiences

# Test projects endpoint
curl http://localhost:8000/api/projects

# Test skills endpoint
curl http://localhost:8000/api/skills

# Test education endpoint
curl http://localhost:8000/api/education
```

---

## Production Setup (PostgreSQL)

For production deployment, you'll use PostgreSQL. A `.env.production.example` file has been created with PostgreSQL configuration.

### Steps for Production:

1. **Create PostgreSQL Database**
```sql
CREATE DATABASE portfolio_production;
```

2. **Copy and configure production environment**
```bash
cp .env.production.example .env.production
```

3. **Update .env.production with your credentials**
```
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=portfolio_production
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

4. **Run migrations on production**
```bash
php artisan migrate --env=production
php artisan db:seed --env=production
```

---

## Troubleshooting

### MySQL Connection Error
If you get "Access denied for user 'root'@'localhost'", update your `.env` file:
```
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### Port Already in Use
If port 8000 is busy, specify a different port:
```bash
php artisan serve --port=8001
```

### Check MySQL is Running
On Windows with XAMPP/WAMP, make sure MySQL service is started in the control panel.

---

## Next Steps After Setup

1. ✅ Database created and migrated
2. ✅ Sample data seeded
3. ✅ API server running
4. → Test API endpoints
5. → Integrate with React frontend
