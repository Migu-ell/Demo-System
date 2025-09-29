# 🚀 Laravel Setup Guide for Your Scholarship System

## 📋 **Prerequisites (Install These First):**

### **1. PHP (Required for Laravel)**
- **Download**: [PHP 8.1+](https://www.php.net/downloads.php)
- **Or use XAMPP**: Includes PHP + MySQL + Apache
- **Check if installed**: Open PowerShell → `php --version`

### **2. Composer (PHP Package Manager)**
- **Download**: [getcomposer.org](https://getcomposer.org/download/)
- **Check if installed**: `composer --version`

### **3. Node.js (For Tailwind + JavaScript)**
- **Download**: [nodejs.org](https://nodejs.org/) (LTS version)
- **Check if installed**: `node --version` and `npm --version`

### **4. Git (Optional but recommended)**
- **Download**: [git-scm.com](https://git-scm.com/)

---

## 🏗️ **Step-by-Step Laravel Setup:**

### **Step 1: Install Laravel**
```powershell
# Create new Laravel project
composer create-project laravel/laravel scholarship-system

# Navigate to project
cd scholarship-system

# Start development server
php artisan serve
# Your app will be at: http://localhost:8000
```

### **Step 2: Install Tailwind CSS**
```powershell
# Install Tailwind via npm
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms

# Initialize Tailwind config
npx tailwindcss init -p

# Install Laravel Mix or Vite dependencies
npm install
```

### **Step 3: Configure Tailwind**
Create/update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'university': {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### **Step 4: Add Tailwind to CSS**
In `resources/css/app.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles */
.btn-university {
    @apply bg-university-500 hover:bg-university-600 text-white px-4 py-2 rounded-lg transition-colors;
}
```

### **Step 5: Update Vite Configuration**
In `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js'
            ],
            refresh: true,
        }),
    ],
});
```

---

## 🗃️ **Database Setup:**

### **Option 1: Use SQLite (Easiest for development)**
In `.env` file:
```env
DB_CONNECTION=sqlite
# Comment out these lines:
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

Create database file:
```powershell
# Create SQLite database
touch database/database.sqlite
# Or on Windows: New-Item database/database.sqlite
```

### **Option 2: Use MySQL (via XAMPP)**
In `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=scholarship_system
DB_USERNAME=root
DB_PASSWORD=
```

---

## 📁 **Project Structure You'll Have:**

```
scholarship-system/
├── app/
│   ├── Http/Controllers/     # Your Laravel controllers
│   ├── Models/              # Database models
│   └── ...
├── database/
│   ├── migrations/          # Database structure
│   └── seeders/            # Sample data
├── resources/
│   ├── views/              # Blade templates (HTML)
│   ├── css/app.css         # Tailwind CSS
│   └── js/app.js           # JavaScript
├── routes/
│   ├── web.php             # Web routes
│   └── api.php             # API routes
├── .env                    # Environment config
└── ...
```

---

## 🎯 **Essential Laravel Commands:**

```powershell
# Start development server
php artisan serve

# Create database migration
php artisan make:migration create_scholarships_table

# Create model + migration
php artisan make:model Scholarship -m

# Create controller
php artisan make:controller ScholarshipController

# Run migrations (create tables)
php artisan migrate

# Create seeder (sample data)
php artisan make:seeder ScholarshipSeeder

# Compile assets (Tailwind + JS)
npm run dev

# Watch for changes (auto-compile)
npm run dev -- --watch
```

---

## 🔧 **Quick Start Commands:**

```powershell
# 1. Install everything
composer create-project laravel/laravel scholarship-system
cd scholarship-system
npm install
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init -p

# 2. Set up database
php artisan migrate

# 3. Start servers (need 2 terminals)
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
```

---

## 📱 **Integration with Your Current Demo:**

You can convert your current HTML demo to Laravel:

### **Convert `index.html` to Laravel Blade:**
1. Move HTML to `resources/views/dashboard.blade.php`
2. Replace CSS with Tailwind classes
3. Add Laravel authentication
4. Connect to database

### **Example Blade Template:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>UniScholar</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
    <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center py-8">
            University Scholarship Portal
        </h1>
        
        <!-- Your existing HTML but with Tailwind classes -->
    </div>
</body>
</html>
```

---

## ⚡ **Pro Tips:**

1. **Use XAMPP**: Easiest way to get PHP + MySQL running
2. **Laravel Breeze**: Adds authentication out of the box
   ```powershell
   composer require laravel/breeze --dev
   php artisan breeze:install
   ```
3. **Laravel Tinker**: Test database queries interactively
   ```powershell
   php artisan tinker
   ```

## 🎓 **For Your Final Project:**

1. ✅ **Keep your current HTML demo** (it's great!)
2. ✅ **Build Laravel version alongside** for backend demo
3. ✅ **Show both versions** to professors
4. ✅ **Explain how they connect** (API endpoints)

Want me to help you create the Laravel models and migrations for your scholarship system?