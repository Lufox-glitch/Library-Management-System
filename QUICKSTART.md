# ⚡ QUICKSTART — Library Management System (Local Only)

## 60-Second Setup

### 1. Start Servers (XAMPP on Mac/Windows)

**Windows:**
```
1. Open XAMPP Control Panel
2. Click "Start" for Apache (you'll see green "Running")
3. Click "Start" for MySQL (you'll see green "Running")
```

**Mac:**
```
Same as Windows — use XAMPP Control Panel GUI
```

**Linux:**
```bash
sudo systemctl start apache2
sudo systemctl start mysql
```

### 2. Create Database (phpMyAdmin)

```
1. Open: http://localhost/phpmyadmin
2. Click "New" (left sidebar)
3. Enter: library_db
4. Collation: utf8mb4_unicode_ci
5. Click "Create"
```

### 3. Initialize Backend

```
Open in browser: http://localhost/Library-Management-System/Back-End/setup.php

Should show green "✓ Setup Successful!"
```

### 4. Open App

```
http://localhost/Library-Management-System/index.html
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `student@example.com` | `student123` |
| Librarian | `librarian@example.com` | `librarian123` |

---

## Key Features to Test

### Student Flow
1. Login with student account
2. Click blue "Catalog" button → See books
3. Search for "Hunger" → Results appear
4. Click a card → Detail modal opens
5. Click "Request" → Book is requested
6. Your "Requests" count increases (top button)

### Librarian Flow
1. Login with librarian account
2. Add a new book (form on left)
3. Search for it in the table
4. Delete it using the × button

---

## If Something Doesn't Work

### Error: "Cannot GET /Library-Management-System"
- ✓ Confirm Apache is running (green in XAMPP)
- ✓ Use correct URL: `http://localhost/Library-Management-System/index.html`

### Error: "Database connection failed"
- ✓ Confirm MySQL is running (green in XAMPP)
- ✓ Confirm database `library_db` exists (check phpMyAdmin)
- ✓ Run setup.php again

### Error: Login doesn't work or "Invalid email/password"
- ✓ Run setup.php again to ensure tables exist
- ✓ Check credentials match above table
- ✓ Open browser Console (F12) → Console tab → Look for errors

### Fetch errors in Console (red lines with "GET /Back-End/api")
- ✓ This is fine — means frontend tried to use API (which works)
- ✓ If you see "Not authenticated" error, ensure you're logged in

---

## File Locations

Everything is in:
```
/Users/prashnawaibatamang/Documents/Library-Management-System/Library-Management-System-1/
├── index.html                    ← Home page
├── Front-End/                    ← Student/Librarian pages
└── Back-End/                     ← PHP API + database
```

In XAMPP it's available at:
```
http://localhost/Library-Management-System/
```

---

## Stop Servers (When Done)

**XAMPP:**
- Open XAMPP Control Panel
- Click "Stop" for Apache and MySQL

**Linux:**
```bash
sudo systemctl stop apache2
sudo systemctl stop mysql
```

---

## Need Help?

1. Check the main `LOCAL_SETUP.md` for detailed troubleshooting
2. Check browser Console (F12) for JavaScript errors
3. Check `Back-End/README.md` for API details

---

**You're ready! Happy testing!** 🎉
