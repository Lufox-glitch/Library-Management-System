# 🔐 Admin Panel - Complete Setup Guide

## Overview

Your Library Management System now has a **complete Admin Panel** where only authorized administrators can:

✅ **Create Librarian Accounts** - Register new librarians (only admin can do this)
✅ **Manage Users** - View, and delete student/librarian accounts
✅ **View Statistics** - Dashboard with system overview
✅ **Monitor Activity** - See all users, books, and book requests

---

## 🚀 Quick Start

### Admin Login Credentials

```
Email: admin@library.local
Password: admin123
```

### Access Admin Panel

1. **Open Admin Login:**
   ```
   http://localhost/Library-Management-System/Front-End/Admin/admin-login.html
   ```

2. **Enter Credentials:**
   - Email: `admin@library.local`
   - Password: `admin123`

3. **You're In!**
   - Access the admin dashboard
   - Create librarians
   - Manage users
   - View statistics

---

## 📊 Admin Dashboard Features

### 1. **Dashboard Tab**
   - View system statistics
   - See total users (admins, librarians, students)
   - Monitor books in system
   - Track book requests (total & pending)

### 2. **Create Librarian Tab**
   - **Form Fields:**
     - Full Name
     - Email Address
     - Password (min 6 characters)
   
   - **Process:**
     1. Fill in librarian details
     2. Click "Create Librarian"
     3. Librarian account created with secure password
     4. Success message confirms creation

### 3. **Librarians Tab**
   - View all librarians in system
   - Shows: ID, Name, Email, Role, Created Date
   - **Delete button** to remove librarian accounts
   - Shows "No librarians created yet" if empty

### 4. **Students Tab**
   - View all students in system
   - Shows: ID, Name, Email, Role, Created Date
   - **Delete button** to remove student accounts
   - Shows "No students registered yet" if empty

### 5. **All Users Tab**
   - View complete user list (all roles)
   - Color-coded badges:
     - 🔴 Red: Admin accounts
     - 🔵 Blue: Librarian accounts
     - 🟢 Green: Student accounts
   - Delete functionality for non-admin users

---

## 🔑 Account Roles

### **Admin (You)**
```
✓ Create librarian accounts
✓ View all users
✓ Delete user accounts
✓ Access admin dashboard
✓ View system statistics
✗ Cannot delete own account (safety feature)
```

### **Librarian** (Created by Admin)
```
✓ Approve/reject book requests
✓ View student requests
✓ Manage book catalog
✓ Process book returns
✗ Cannot create other librarians
✗ Cannot access admin panel
```

### **Student** (Self Registration)
```
✓ Register own account
✓ View book catalog
✓ Request books
✓ View request status
✗ Cannot create accounts for others
✗ Cannot access admin panel
```

---

## 🛠️ Admin API Endpoints

All endpoints require admin authentication (role = 'admin').

### Create Librarian
```bash
POST /Back-End/api/admin.php?action=create_librarian
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@library.local",
  "password": "secure123"
}

Response:
{
  "success": true,
  "message": "Librarian created successfully",
  "user": {
    "id": 7,
    "name": "John Smith",
    "email": "john@library.local",
    "role": "librarian"
  }
}
```

### List All Users
```bash
GET /Back-End/api/admin.php?action=list_users

Response:
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "student",
      "created_at": "2026-02-15 10:00:00"
    }
  ],
  "total": 5
}
```

### List Librarians
```bash
GET /Back-End/api/admin.php?action=list_librarians

Response:
{
  "success": true,
  "librarians": [...],
  "total": 3
}
```

### List Students
```bash
GET /Back-End/api/admin.php?action=list_students

Response:
{
  "success": true,
  "students": [...],
  "total": 12
}
```

### Get Dashboard Statistics
```bash
GET /Back-End/api/admin.php?action=stats

Response:
{
  "success": true,
  "stats": {
    "total_users": 5,
    "total_librarians": 2,
    "total_students": 2,
    "total_books": 100,
    "total_requests": 3,
    "pending_requests": 1
  }
}
```

### Delete User
```bash
POST /Back-End/api/admin.php?action=delete_user
Content-Type: application/json

{
  "user_id": 5
}

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🔄 User Management Workflow

### Creating a Librarian

```
Admin Logs In
    ↓
Admin Panel → Create Librarian Tab
    ↓
Enter Librarian Details:
  - Name: "Sarah Johnson"
  - Email: "sarah@library.local"
  - Password: "secure456"
    ↓
Click "Create Librarian"
    ↓
Password is hashed with bcrypt
    ↓
Account saved to database
    ↓
Success message shown
    ↓
Librarian can now login with those credentials
```

### Deleting a User

```
Admin Views User List
    ↓
Finds user to delete
    ↓
Clicks "Delete" button
    ↓
Confirmation dialog appears
    ↓
Confirms deletion
    ↓
User record removed from database
    ↓
User list refreshed
    ↓
Success message shown
```

---

## 🔐 Security Features

✅ **Admin-Only Access**
   - Admin panel requires admin role
   - Non-admin users redirected to login
   - Automatic logout on browser close

✅ **Password Security**
   - All passwords hashed with bcrypt
   - Bcrypt uses random salt each time
   - Passwords never stored in plain text
   - Secure password verification

✅ **Input Validation**
   - Email format validation
   - Password length minimum (6 characters)
   - Required field validation
   - HTML input type restrictions

✅ **SQL Injection Protection**
   - Prepared statements on all queries
   - Parameterized inputs
   - No raw SQL concatenation

✅ **Session Management**
   - PHP session cookies
   - HTTP-only cookies
   - Session validation
   - Auto-logout capability

✅ **Referential Integrity**
   - Foreign key constraints
   - Cascade delete for related records
   - Data consistency maintained

---

## 📝 Sample Workflow

### Step 1: First Login
1. Open: `http://localhost/Library-Management-System/Front-End/Admin/admin-login.html`
2. Enter:
   - Email: `admin@library.local`
   - Password: `admin123`
3. Click "Login"

### Step 2: Create First Librarian
1. Click "Create Librarian" tab
2. Fill form:
   - Name: `Ms. Emily Brown`
   - Email: `emily@library.local`
   - Password: `library123`
3. Click "Create Librarian"
4. See success message

### Step 3: View Created Librarian
1. Click "Librarians" tab
2. See table with new librarian:
   - ID: 7
   - Name: Ms. Emily Brown
   - Email: emily@library.local
   - Role: Librarian
   - Created: Today

### Step 4: Create Another Librarian (Optional)
Repeat Step 2 with different details

### Step 5: Monitor System
1. Click "Dashboard" tab
2. View statistics:
   - Total Users: 3 (1 admin + 2 librarians)
   - Total Books: 100
   - Pending Requests: 0

---

## 🚨 Important Notes

### ⚠️ Safety Features
- **Cannot delete own account** - Prevents accidental admin lockout
- **Admin accounts protected** - Admin badges shown but cannot be deleted
- **Confirmation dialogs** - Confirm before deleting users
- **Success messages** - Confirmation of all actions

### ⚠️ Password Requirements
- Minimum 6 characters
- Can contain letters, numbers, special characters
- Must be memorable (users need to remember it)
- Example: `library123`, `secure456`, `Books2026!`

### ⚠️ Email Must Be Unique
- No two users can have same email
- Email serves as username for login
- Check existing emails before creating new accounts

### ⚠️ Database Backup
- Regularly backup your database
- Keep admin credentials secure
- Don't share admin password

---

## 🔗 Navigation Links

### Admin Panel
- **Login:** http://localhost/Library-Management-System/Front-End/Admin/admin-login.html
- **Dashboard:** http://localhost/Library-Management-System/Front-End/Admin/admin-dashboard.html

### Student Portal
- **Login:** http://localhost/Library-Management-System/Front-End/Login-system/student-login.html
- **Register:** http://localhost/Library-Management-System/Front-End/Login-system/student-registration.html

### Librarian Portal
- **Login:** http://localhost/Library-Management-System/Front-End/Login-system/librarian-login.html

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- Bcrypt hash
  role ENUM('student', 'librarian', 'admin') DEFAULT 'student',
  phone VARCHAR(15),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(role)
)
```

### Current Admin Account
```
ID: 6
Name: System Admin
Email: admin@library.local
Password: admin123 (hashed)
Role: admin
Created: 2026-02-15
```

---

## ✅ What's Implemented

✅ **Admin Panel Complete**
   - Login page (admin-login.html)
   - Dashboard (admin-dashboard.html)
   - Admin API (api/admin.php)

✅ **Librarian Management**
   - Create librarian accounts
   - View all librarians
   - Delete librarian accounts

✅ **User Management**
   - List all users
   - View students
   - View librarians
   - Delete users (except admin)

✅ **Statistics & Monitoring**
   - Total users count
   - Librarians count
   - Students count
   - Books count
   - Requests tracking

✅ **Security**
   - Admin authentication required
   - Password hashing (bcrypt)
   - SQL injection protection
   - Session management

---

## 🎯 Next Steps

1. **Login with Admin Credentials**
   - Email: `admin@library.local`
   - Password: `admin123`

2. **Create Your First Librarian**
   - Go to "Create Librarian" tab
   - Fill in librarian details
   - Click "Create Librarian"

3. **Share Librarian Credentials**
   - Give librarian their login credentials
   - They can login at librarian-login.html
   - They can manage book requests

4. **Monitor Dashboard**
   - View system statistics
   - Track user registrations
   - Monitor book requests

5. **Change Admin Password** (Recommended)
   - Update default admin password
   - Use strong, unique password

---

## 📞 Support

For issues or questions:
1. Check admin dashboard for system stats
2. Verify all users are created correctly
3. Check that roles are assigned properly
4. Ensure passwords meet requirements
5. Review API responses for errors

---

## ✨ Your System is Ready!

Admin Panel is **fully functional** and ready to:
- Create librarian accounts
- Manage users
- Monitor system activity
- View statistics

**Happy managing!** 🎉

