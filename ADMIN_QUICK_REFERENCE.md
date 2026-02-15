# 🔐 Admin Panel - Quick Reference

## Admin Login
**URL:** `http://localhost/Library-Management-System/Front-End/Admin/admin-login.html`

**Default Credentials:**
```
Email: admin@library.local
Password: admin123
```

---

## Dashboard Tabs

### 1️⃣ Dashboard
- View system statistics
- Total users, librarians, students
- Total books and requests

### 2️⃣ Create Librarian
- Fill form with librarian details
- Name, Email, Password
- Password must be 6+ characters

### 3️⃣ Librarians
- View all librarians
- Delete librarian accounts

### 4️⃣ Students
- View all students
- Delete student accounts

### 5️⃣ All Users
- View everyone in system
- Color-coded by role

---

## User Roles

| Role | Can Create | Can Manage | Access |
|------|-----------|-----------|--------|
| **Admin** | Librarians | All users | Admin panel |
| **Librarian** | Nothing | Book requests | Librarian panel |
| **Student** | Nothing | Own profile | Student portal |

---

## Creating a Librarian (Step-by-Step)

1. Login to admin panel
2. Click **"Create Librarian"** tab
3. Enter librarian details:
   - **Full Name:** e.g., "Sarah Johnson"
   - **Email:** e.g., "sarah@library.local"
   - **Password:** e.g., "library123"
4. Click **"Create Librarian"** button
5. ✅ Success message appears
6. Librarian can now login

---

## Example Librarian Accounts

```
Name: Sarah Johnson
Email: sarah@library.local
Password: library123

Name: Mr. Ahmed Khan
Email: ahmed@library.local
Password: secure456

Name: Ms. Emily Davis
Email: emily@library.local
Password: books2026
```

---

## Admin Panel Features

✅ **Create Librarian** - Only admin can create librarians
✅ **View Users** - See all users in system
✅ **Delete Users** - Remove student/librarian accounts
✅ **View Stats** - System overview dashboard
✅ **Manage Accounts** - Full user control

---

## Security

🔒 **Password Hashing** - BCrypt encryption
🔒 **Session Management** - Secure authentication
🔒 **Admin Protection** - Cannot delete own account
🔒 **SQL Injection** - Protected with prepared statements
🔒 **Input Validation** - All fields validated

---

## Important

⚠️ **Default Admin Password** - Change after first login
⚠️ **Cannot Delete Admin** - Only manage other users
⚠️ **Email is Unique** - No duplicate emails allowed
⚠️ **Password Min 6 chars** - Requirement for all accounts

---

## Workflow: Admin Creates Librarian

```
Admin logins
    ↓
Opens Create Librarian tab
    ↓
Enters librarian information
    ↓
Clicks "Create Librarian"
    ↓
System hashes password (bcrypt)
    ↓
Account saved to database
    ↓
Success message shown
    ↓
Librarian can now login
    ↓
Librarian manages book requests
```

---

## API Endpoints (if needed)

### Create Librarian
```
POST /Back-End/api/admin.php?action=create_librarian
{
  "name": "John Smith",
  "email": "john@library.local",
  "password": "secure123"
}
```

### Get All Users
```
GET /Back-End/api/admin.php?action=list_users
```

### Get Statistics
```
GET /Back-End/api/admin.php?action=stats
```

### Delete User
```
POST /Back-End/api/admin.php?action=delete_user
{
  "user_id": 5
}
```

---

## Files Created

📁 `/Front-End/Admin/admin-login.html` - Admin login page
📁 `/Front-End/Admin/admin-dashboard.html` - Admin dashboard
📁 `/Back-End/api/admin.php` - Admin API endpoints

---

## Quick Links

- **Admin Login:** http://localhost/Library-Management-System/Front-End/Admin/admin-login.html
- **Student Login:** http://localhost/Library-Management-System/Front-End/Login-system/student-login.html
- **Librarian Login:** http://localhost/Library-Management-System/Front-End/Login-system/librarian-login.html

---

**Your Admin Panel is Ready to Use!** ✨

