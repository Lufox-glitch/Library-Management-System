# Library Management System — Backend (PHP + MySQL)

## Overview
This is a full PHP/MySQL backend for the Library Management System with RESTful APIs for:
- **Authentication** (login, register, logout)
- **Books** (list, search, detail)
- **Requests** (create, list, cancel, approve)

## Setup Instructions

### 1. Prerequisites
- PHP 7.4+ with mysqli extension
- MySQL 5.7+
- InfinityFree or any PHP hosting

### 2. Local Development Setup (XAMPP/LAMP)

#### Step 1: Copy Files
1. Extract/clone this project into your web root:
   - **XAMPP**: `C:\xampp\htdocs\Library-Management-System`
   - **Linux**: `/var/www/html/Library-Management-System`

#### Step 2: Create Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `library_db`
3. Leave it empty (the setup script will create tables)

#### Step 3: Run Setup
1. Open your browser: `http://localhost/Library-Management-System/Back-End/setup.php`
2. Check for "✓ Setup Successful!" message
3. Tables and sample data will be created

#### Step 4: Update Config (if needed)
Edit `Back-End/includes/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // your MySQL user
define('DB_PASS', '');            // your MySQL password
define('DB_NAME', 'library_db');
```

### 3. Deploy to InfinityFree

#### Step 1: Upload Files
1. Log in to InfinityFree cPanel
2. Use File Manager to upload the entire `Back-End/` folder to your public_html or a subdirectory
3. Ensure all PHP files are world-readable

#### Step 2: Create Database
1. In cPanel, go to **MySQL Databases**
2. Create a new database (e.g., `username_library_db`)
3. Create a new user and grant all privileges
4. Note the credentials

#### Step 3: Update Config
Edit `Back-End/includes/config.php` with your InfinityFree credentials:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'username_dbuser');
define('DB_PASS', 'your_password');
define('DB_NAME', 'username_library_db');
```

#### Step 4: Run Setup
1. Visit: `https://yourdomain.infinityfree.app/Back-End/setup.php`
2. Confirm tables are created

---

## API Endpoints

### Authentication

#### Login
**POST** `/Back-End/api/auth.php?action=login`

```json
{
  "email": "student@example.com",
  "password": "student123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Demo Student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

#### Register
**POST** `/Back-End/api/auth.php?action=register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "role": "student"
}
```

#### Get Current User
**GET** `/Back-End/api/auth.php?action=me`

Returns current authenticated user info (requires session).

#### Logout
**GET** `/Back-End/api/auth.php?action=logout`

Destroys session.

---

### Books

#### List Books
**GET** `/Back-End/api/books.php?action=list&q=search_term&category=Fiction&limit=20&offset=0`

Query Parameters:
- `q` (optional): Search in title, author, publisher
- `category` (optional): Filter by category
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "success": true,
  "books": [
    {
      "id": 1,
      "name": "The Hunger Games",
      "author": "Suzanne Collins",
      "publisher": "Alfa",
      "pages": 478,
      "serial": "1",
      "category": "Fiction",
      "summary": "...",
      "available_copies": 1
    }
  ],
  "total": 100,
  "offset": 0,
  "limit": 20
}
```

#### Get Book Detail
**GET** `/Back-End/api/books.php?action=detail&id=1`

---

### Book Requests

#### Create Request
**POST** `/Back-End/api/requests.php?action=create`

```json
{
  "book_id": 1
}
```

Response:
```json
{
  "success": true,
  "message": "Request created",
  "request_id": 5
}
```

#### List Requests
**GET** `/Back-End/api/requests.php?action=list`

- **Students** see only their own requests
- **Librarians** see all requests

Response:
```json
{
  "success": true,
  "requests": [
    {
      "id": 5,
      "student_id": 1,
      "book_id": 1,
      "request_date": "2026-02-13 10:30:00",
      "status": "pending",
      "due_date": null,
      "book_name": "The Hunger Games",
      "author": "Suzanne Collins"
    }
  ]
}
```

#### Cancel Request
**POST** `/Back-End/api/requests.php?action=cancel`

```json
{
  "request_id": 5
}
```

#### Approve Request (Librarian only)
**POST** `/Back-End/api/requests.php?action=approve`

```json
{
  "request_id": 5,
  "due_date": "2026-02-28"
}
```

---

## Sample Login Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Demo Student | `student@example.com` | `student123` | student |
| Demo Librarian | `librarian@example.com` | `librarian123` | librarian |

---

## Database Schema

### users
```
id (INT, PK)
name (VARCHAR)
email (VARCHAR, UNIQUE)
password (VARCHAR, hashed)
role (ENUM: student, librarian, admin)
created_at, updated_at (TIMESTAMP)
```

### books
```
id (INT, PK)
name (VARCHAR)
author (VARCHAR)
publisher (VARCHAR)
pages (INT)
serial (VARCHAR, UNIQUE)
isbn (VARCHAR)
category (VARCHAR)
summary (TEXT)
total_copies, available_copies (INT)
created_at, updated_at (TIMESTAMP)
```

### book_requests
```
id (INT, PK)
student_id (FK → users)
book_id (FK → books)
request_date (TIMESTAMP)
status (ENUM: pending, approved, rejected, cancelled)
due_date, return_date (DATE)
notes (TEXT)
created_at, updated_at (TIMESTAMP)
```

### transactions
```
id (INT, PK)
student_id (FK → users)
book_id (FK → books)
checkout_date (TIMESTAMP)
due_date, return_date (DATE)
is_returned (BOOLEAN)
fine_amount (DECIMAL)
notes (TEXT)
created_at (TIMESTAMP)
```

---

## Frontend Integration

To connect the frontend (JavaScript) to this backend:

1. Update `Front-End/Login-system/student-login.js`:
   ```javascript
   const API_BASE = 'http://yourdomain.com/Back-End/api';
   // Change login logic to call: POST API_BASE + '/auth.php?action=login'
   ```

2. Update `Front-End/Student/catalog.js`:
   ```javascript
   const API_BASE = 'http://yourdomain.com/Back-End/api';
   // Replace BOOKS_DATABASE with API calls to: GET API_BASE + '/books.php?action=list'
   ```

3. Example JavaScript fetch:
   ```javascript
   fetch('http://yourdomain.com/Back-End/api/auth.php?action=login', {
       method: 'POST',
       credentials: 'include', // important for cookies/sessions
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'student@example.com', password: 'student123' })
   })
   .then(r => r.json())
   .then(data => console.log(data));
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check config.php credentials; ensure MySQL is running |
| "CORS error" in browser console | Check CORS headers in config.php are set correctly |
| "Session not persisting" | Ensure cookies enabled in browser; check `Set-Cookie` headers |
| "Permission denied" on InfinityFree | Ensure file permissions are 644 for PHP files |

---

## Next Steps

1. ✓ Backend setup complete
2. → Connect frontend to backend APIs
3. → Test login flow, book search, requests
4. → Deploy frontend to same server or CDN

---

**Support**: Review inline PHP comments in `api/` and `includes/` files for more details.
