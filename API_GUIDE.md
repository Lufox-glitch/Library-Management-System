/**
 * API ENDPOINTS QUICK REFERENCE GUIDE
 * ===================================
 * Your Library Management System API is now fully functional
 */

// ========================================
// AUTHENTICATION API
// ========================================
POST /Back-End/api/auth.php?action=login
{
    "email": "student@example.com",
    "password": "student123"
}
Response: { success, user: {id, name, email, role} }

POST /Back-End/api/auth.php?action=register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"  // or "librarian"
}
Response: { success, user: {id, name, email, role} }

GET /Back-End/api/auth.php?action=logout
Response: { success, message }

GET /Back-End/api/auth.php?action=me
Response: { id, name, email, role }


// ========================================
// BOOKS API
// ========================================
GET /Back-End/api/books.php?action=list&limit=20&offset=0
Response: { success, books: [], total, offset, limit }

GET /Back-End/api/books.php?action=list&q=Harry+Potter&limit=20
Response: { success, books: [filtered], total, offset, limit }

GET /Back-End/api/books.php?action=list&category=Fiction&limit=20
Response: { success, books: [filtered], total, offset, limit }

GET /Back-End/api/books.php?action=detail&id=1
Response: { success, book: {...} }


// ========================================
// BOOK REQUESTS API (requires authentication)
// ========================================
POST /Back-End/api/requests.php?action=create
{
    "book_id": 5
}
Response: { success, message }

GET /Back-End/api/requests.php?action=list
Response: { success, requests: [] }
// Librarians see all pending requests, Students see only their requests

POST /Back-End/api/requests.php?action=cancel
{
    "request_id": 3
}
Response: { success, message }

POST /Back-End/api/requests.php?action=approve (LIBRARIAN ONLY)
{
    "request_id": 5,
    "due_date": "2026-03-15"  // optional, defaults to 14 days from now
}
Response: { success, message }


// ========================================
// USING IN JAVASCRIPT (Frontend)
// ========================================

// Login
fetch('Back-End/api/auth.php?action=login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'student@example.com',
        password: 'student123'
    })
})
.then(r => r.json())
.then(data => console.log(data));

// Get all books
fetch('Back-End/api/books.php?action=list?limit=20&offset=0')
.then(r => r.json())
.then(data => console.log(data.books));

// Search books
fetch('Back-End/api/books.php?action=list&q=Harry&limit=20')
.then(r => r.json())
.then(data => console.log(data.books));

// Request a book (requires login)
fetch('Back-End/api/requests.php?action=create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: 5 }),
    credentials: 'include'  // Include cookies for session
})
.then(r => r.json())
.then(data => console.log(data));

// Get my requests (requires login)
fetch('Back-End/api/requests.php?action=list', {
    credentials: 'include'  // Include cookies for session
})
.then(r => r.json())
.then(data => console.log(data.requests));


// ========================================
// SAMPLE TEST DATA (Already in DB)
// ========================================
Test Student: student@example.com / student123
Test Librarian: librarian@example.com / librarian123

Books in database:
- The Hunger Games by Suzanne Collins
- Harry Potter by J.K. Rowling
- To Kill a Mockingbird by Harper Lee
- Pride and Prejudice by Jane Austen
- 1984 by George Orwell
- The Great Gatsby by F. Scott Fitzgerald


// ========================================
// KEY FEATURES
// ========================================
✓ Student Login & Registration
✓ Librarian Login
✓ Book Browsing & Search
✓ Category Filtering
✓ Book Request System
✓ Request Approval (Librarian)
✓ Session Management
✓ SQL Injection Protection (Prepared Statements)
✓ Password Security (Bcrypt)

