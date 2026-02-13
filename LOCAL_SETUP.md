# Library Management System — Local Setup (XAMPP/LAMP)

## Quick Start (5 minutes)

### Prerequisites
- **XAMPP** (Windows/Mac) or **LAMP** (Linux) installed with PHP 7.4+ and MySQL
  - Download XAMPP: https://www.apachefriends.org/
  - Or use LAMP: `sudo apt-get install apache2 mysql-server php php-mysql`

### Step 1: Start Servers

**Windows (XAMPP Control Panel):**
```
1. Open XAMPP Control Panel
2. Click "Start" next to Apache
3. Click "Start" next to MySQL
4. Confirm both show green "Running"
```

**macOS (XAMPP):**
```bash
# If using XAMPP
sudo /Applications/XAMPP/xamppfiles/bin/mysql.server start
# Then use XAMPP Control Panel to start Apache
```

**Linux (LAMP):**
```bash
sudo systemctl start apache2
sudo systemctl start mysql
```

### Step 2: Place Project Files

**Windows XAMPP:**
```
Copy entire project to: C:\xampp\htdocs\Library-Management-System
```

**macOS XAMPP:**
```bash
cp -r /path/to/Library-Management-System /Applications/XAMPP/htdocs/
```

**Linux (Apache):**
```bash
sudo cp -r /path/to/Library-Management-System /var/www/html/
sudo chown -R www-data:www-data /var/www/html/Library-Management-System
```

### Step 3: Create Database

**Using phpMyAdmin (Easiest):**
```
1. Open browser: http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: library_db
4. Collation: utf8mb4_unicode_ci
5. Click "Create"
```

**OR Using MySQL Command Line:**
```bash
mysql -u root -p
# (Press Enter if no password)

CREATE DATABASE library_db;
USE library_db;
exit;
```

### Step 4: Run Setup Script

**Open in Browser:**
```
http://localhost/Library-Management-System/Back-End/setup.php
```

You should see:
```
✓ Setup Successful!
- Table 'users' created or already exists.
- Table 'books' created or already exists.
- Table 'book_requests' created or already exists.
- Table 'transactions' created or already exists.
- Sample books inserted.
- Sample users inserted.
```

### Step 5: Access Application

**Home Page:**
```
http://localhost/Library-Management-System/index.html
```

**Login:**
- Email: `student@example.com`
- Password: `student123`

OR

- Email: `librarian@example.com`
- Password: `librarian123`

---

## Verify Everything Works

### 1. Test Login
1. Go to home page → Click "Student Login"
2. Enter: `student@example.com` / `student123`
3. Should redirect to Student Dashboard

### 2. Test Catalog
1. From Student Dashboard → Click "Catalog" button (blue, top right)
2. Should see book cards with titles and authors
3. Try searching (e.g., "Hunger")
4. Click a card → Detail modal should open
5. Click "Request" → Should show "Requested"

### 3. Test Requests
1. From Student Dashboard → "Requests" button shows count
2. Click it → Should see your requested books
3. Try canceling a request

### 4. Test Librarian Dashboard
1. Go home → Click "Librarian Login"
2. Enter: `librarian@example.com` / `librarian123`
3. Should see Librarian Dashboard with book table
4. Try adding a new book
5. Search for it
6. Delete it

---

## Troubleshooting

### "Cannot GET /Library-Management-System/..."
- **Solution**: Ensure Apache is running (XAMPP Control Panel shows green)
- Check URL is correct: `http://localhost/Library-Management-System/index.html`

### "Database connection failed"
- **Solution**: 
  1. Ensure MySQL is running (XAMPP Control Panel)
  2. Check `Back-End/includes/config.php` has correct credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root');
     define('DB_PASS', '');      // Often empty for local XAMPP
     define('DB_NAME', 'library_db');
     ```
  3. Run setup.php again

### "CORS error" in browser console
- **Solution**: This is expected for local CORS. The backend and frontend are on same localhost, so sessions work fine. If you still see fetch errors, check:
  1. Apache/PHP is running
  2. API endpoint URLs are correct (they should be `http://localhost/...`)

### "Login doesn't work"
- **Solution**:
  1. Check database was created: Open phpMyAdmin, look for `library_db`
  2. Check users table has data: In phpMyAdmin, go to `library_db` → `users` → should show 2 rows
  3. Try setup.php again to re-insert sample data

### MySQL says "Access denied for user 'root'@'localhost'"
- **Solution**: XAMPP's MySQL might use a different password. Try:
  ```bash
  mysql -u root
  # (no password flag)
  ```
  If that works, the password is empty. Update `config.php`:
  ```php
  define('DB_PASS', '');
  ```

---

## API Endpoints (Local)

Once backend is running, you can test endpoints using browser or curl:

### Test in Browser (GET requests)
```
http://localhost/Library-Management-System/Back-End/api/books.php?action=list
http://localhost/Library-Management-System/Back-End/api/books.php?action=detail&id=1
```

### Test with curl (POST requests)
```bash
# Login
curl -X POST http://localhost/Library-Management-System/Back-End/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student123"}' \
  -c cookies.txt

# List books (with session)
curl -X GET http://localhost/Library-Management-System/Back-End/api/books.php?action=list \
  -b cookies.txt
```

---

## Database Configuration (config.php)

For **most XAMPP setups**, this is correct:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           // Usually empty for local XAMPP
define('DB_NAME', 'library_db');
```

If you set a MySQL password, update `DB_PASS`:
```php
define('DB_PASS', 'your_password');
```

---

## File Structure

```
Library-Management-System/
├── index.html                  (Home page)
├── Front-End/
│   ├── Login-system/           (Login pages)
│   ├── Student/                (Student dashboard + catalog)
│   └── Librarian/              (Librarian dashboard)
├── Back-End/
│   ├── includes/config.php     (Database config)
│   ├── setup.php               (One-click database setup)
│   ├── api/
│   │   ├── auth.php            (Login/register/logout)
│   │   ├── books.php           (List/search/detail books)
│   │   └── requests.php        (Create/list/cancel requests)
│   └── README.md               (Full API docs)
```

---

## Stop/Restart Servers

### XAMPP (Windows/Mac)
```
1. Open XAMPP Control Panel
2. Click "Stop" next to Apache and MySQL
3. To restart: Click "Start"
```

### Linux
```bash
# Stop
sudo systemctl stop apache2
sudo systemctl stop mysql

# Start
sudo systemctl start apache2
sudo systemctl start mysql

# Restart
sudo systemctl restart apache2
sudo systemctl restart mysql
```

---

## Next Steps

✓ Backend setup complete (local)
✓ Database schema created
✓ Sample data inserted

→ Frontend is already wired to work with both localStorage (fallback) and backend APIs
→ Test the application by logging in and trying the flows above

If something doesn't work, check the browser console (F12 → Console tab) for JavaScript errors or network issues.

---

**You're all set! Enjoy your Library Management System!** 📚
