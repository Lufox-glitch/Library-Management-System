-- ========================================
-- Library Management System Database
-- ========================================
-- This SQL file contains all table definitions and useful queries
-- for the Library Management System


-- ========================================
-- 1. CREATE DATABASE
-- ========================================
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;


-- ========================================
-- 2. CREATE TABLES
-- ========================================

-- Users Table (Students and Librarians only)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'librarian') DEFAULT 'student',
    phone VARCHAR(15),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(email),
    INDEX(role),
    INDEX(is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    pages INT,
    serial VARCHAR(50) UNIQUE NOT NULL,
    isbn VARCHAR(20),
    category VARCHAR(50),
    summary TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    added_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX(name),
    INDEX(author),
    INDEX(category),
    INDEX(serial),
    INDEX(isbn),
    INDEX(is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Book Requests Table (Students requesting books)
CREATE TABLE IF NOT EXISTS book_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approved_by INT,
    due_date DATE,
    return_date DATE,
    notes TEXT,
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX(student_id),
    INDEX(book_id),
    INDEX(status),
    INDEX(request_date),
    UNIQUE KEY unique_pending (student_id, book_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Book Transactions Table (Checkout and return history)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    return_date DATE,
    is_returned BOOLEAN DEFAULT FALSE,
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    checked_out_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_out_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX(student_id),
    INDEX(book_id),
    INDEX(is_returned),
    INDEX(checkout_date),
    INDEX(due_date),
    INDEX(fine_paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================
-- 3. USEFUL QUERIES FOR THE SYSTEM
-- ========================================

-- ========== AUTHENTICATION QUERIES ==========

-- Get user by email (for login)
-- SELECT id, name, email, password, role FROM users WHERE email = 'student@example.com';

-- Get all librarians
-- SELECT id, name, email, phone, created_at FROM users WHERE role = 'librarian' AND is_active = TRUE;


-- ========== BOOK MANAGEMENT QUERIES ==========

-- Get all available books with count
-- SELECT id, name, author, category, available_copies, total_copies FROM books WHERE is_active = TRUE ORDER BY name ASC;

-- Search books by title or author
-- SELECT id, name, author, publisher, pages, category, available_copies FROM books 
-- WHERE (name LIKE '%search_term%' OR author LIKE '%search_term%') AND is_active = TRUE;

-- Get books by category
-- SELECT id, name, author, category, available_copies FROM books WHERE category = 'Fiction' AND is_active = TRUE;

-- Get books with low stock (less than 3 copies)
-- SELECT id, name, author, available_copies, total_copies FROM books WHERE available_copies < 3 AND is_active = TRUE;

-- Get book details with author and publisher info
-- SELECT id, name, author, publisher, isbn, pages, category, summary, available_copies, total_copies FROM books WHERE id = 1;


-- ========== REQUEST MANAGEMENT QUERIES ==========

-- Get all pending requests
-- SELECT br.id, br.student_id, u.name as student_name, br.book_id, b.name as book_name, br.request_date, br.due_date
-- FROM book_requests br
-- JOIN users u ON br.student_id = u.id
-- JOIN books b ON br.book_id = b.id
-- WHERE br.status = 'pending'
-- ORDER BY br.request_date DESC;

-- Get requests for a specific student
-- SELECT br.id, b.name as book_name, br.status, br.request_date, br.due_date, br.return_date
-- FROM book_requests br
-- JOIN books b ON br.book_id = b.id
-- WHERE br.student_id = 1
-- ORDER BY br.request_date DESC;

-- Get approved requests (active checkouts)
-- SELECT br.id, br.student_id, u.name as student_name, br.book_id, b.name as book_name, br.due_date
-- FROM book_requests br
-- JOIN users u ON br.student_id = u.id
-- JOIN books b ON br.book_id = b.id
-- WHERE br.status = 'approved'
-- ORDER BY br.due_date ASC;

-- Get overdue requests
-- SELECT br.id, u.name as student_name, b.name as book_name, br.due_date, DATEDIFF(CURDATE(), br.due_date) as days_overdue
-- FROM book_requests br
-- JOIN users u ON br.student_id = u.id
-- JOIN books b ON br.book_id = b.id
-- WHERE br.status = 'approved' AND br.due_date < CURDATE()
-- ORDER BY br.due_date ASC;

-- Check if student has duplicate pending request for same book
-- SELECT COUNT(*) as count FROM book_requests WHERE student_id = 1 AND book_id = 5 AND status = 'pending';

-- Get student's approved books (checked out)
-- SELECT br.id, b.name, b.author, b.category, br.due_date, DATEDIFF(br.due_date, CURDATE()) as days_remaining
-- FROM book_requests br
-- JOIN books b ON br.book_id = b.id
-- WHERE br.student_id = 1 AND br.status = 'approved'
-- ORDER BY br.due_date ASC;


-- ========== TRANSACTION QUERIES ==========

-- Get checkout history for a student
-- SELECT t.id, b.name as book_name, b.author, t.checkout_date, t.due_date, t.return_date, t.is_returned, t.fine_amount
-- FROM transactions t
-- JOIN books b ON t.book_id = b.id
-- WHERE t.student_id = 1
-- ORDER BY t.checkout_date DESC;

-- Get all active checkouts (not returned)
-- SELECT t.id, u.name as student_name, b.name as book_name, t.due_date, DATEDIFF(CURDATE(), t.due_date) as days_overdue
-- FROM transactions t
-- JOIN users u ON t.student_id = u.id
-- JOIN books b ON t.book_id = b.id
-- WHERE t.is_returned = FALSE
-- ORDER BY t.due_date ASC;

-- Get overdue books
-- SELECT t.id, u.name as student_name, b.name as book_name, t.due_date, DATEDIFF(CURDATE(), t.due_date) as days_overdue
-- FROM transactions t
-- JOIN users u ON t.student_id = u.id
-- JOIN books b ON t.book_id = b.id
-- WHERE t.is_returned = FALSE AND t.due_date < CURDATE()
-- ORDER BY t.due_date ASC;

-- Get transactions with unpaid fines
-- SELECT t.id, u.name as student_name, b.name as book_name, t.fine_amount, t.return_date
-- FROM transactions t
-- JOIN users u ON t.student_id = u.id
-- JOIN books b ON t.book_id = b.id
-- WHERE t.fine_amount > 0 AND t.fine_paid = FALSE;

-- Calculate total fines for a student
-- SELECT student_id, u.name, SUM(fine_amount) as total_fines
-- FROM transactions t
-- JOIN users u ON t.student_id = u.id
-- WHERE fine_amount > 0
-- GROUP BY student_id;

-- Get book checkout count (most borrowed books)
-- SELECT b.id, b.name, b.author, COUNT(t.id) as times_borrowed
-- FROM transactions t
-- RIGHT JOIN books b ON t.book_id = b.id
-- GROUP BY b.id
-- ORDER BY times_borrowed DESC
-- LIMIT 10;

-- Get student borrowing activity
-- SELECT u.id, u.name, COUNT(t.id) as books_borrowed, SUM(CASE WHEN t.is_returned = FALSE THEN 1 ELSE 0 END) as current_books
-- FROM users u
-- LEFT JOIN transactions t ON u.id = t.student_id
-- WHERE u.role = 'student'
-- GROUP BY u.id
-- ORDER BY books_borrowed DESC;


-- ========== STATISTICS QUERIES ==========

-- Total books in library
-- SELECT COUNT(*) as total_books FROM books WHERE is_active = TRUE;

-- Total available books
-- SELECT SUM(available_copies) as total_available FROM books WHERE is_active = TRUE;

-- Total students
-- SELECT COUNT(*) as total_students FROM users WHERE role = 'student' AND is_active = TRUE;

-- Total active checkouts
-- SELECT COUNT(*) as active_checkouts FROM transactions WHERE is_returned = FALSE;

-- Books checked out per day (this week)
-- SELECT DATE(checkout_date) as date, COUNT(*) as checkouts
-- FROM transactions
-- WHERE checkout_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
-- GROUP BY DATE(checkout_date)
-- ORDER BY date DESC;

-- Most popular book categories
-- SELECT category, COUNT(*) as checkout_count
-- FROM transactions t
-- JOIN books b ON t.book_id = b.id
-- WHERE category IS NOT NULL
-- GROUP BY category
-- ORDER BY checkout_count DESC;

-- Student with most books checked out
-- SELECT u.id, u.name, COUNT(t.id) as books_borrowed
-- FROM users u
-- JOIN transactions t ON u.id = t.student_id
-- GROUP BY u.id
-- ORDER BY books_borrowed DESC
-- LIMIT 1;

-- Library dashboard stats
-- SELECT
--     (SELECT COUNT(*) FROM books WHERE is_active = TRUE) as total_books,
--     (SELECT SUM(available_copies) FROM books WHERE is_active = TRUE) as available_books,
--     (SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = TRUE) as total_students,
--     (SELECT COUNT(*) FROM transactions WHERE is_returned = FALSE) as active_checkouts,
--     (SELECT COUNT(*) FROM book_requests WHERE status = 'pending') as pending_requests,
--     (SELECT COALESCE(SUM(fine_amount), 0) FROM transactions WHERE fine_amount > 0 AND fine_paid = FALSE) as total_pending_fines;


-- ========== ADMIN/LIBRARIAN QUERIES ==========

-- Get requests approved by specific librarian
-- SELECT br.id, u.name as student_name, b.name as book_name, br.request_date, br.due_date
-- FROM book_requests br
-- JOIN users u ON br.student_id = u.id
-- JOIN books b ON br.book_id = b.id
-- WHERE br.approved_by = 2 AND br.status = 'approved'
-- ORDER BY br.request_date DESC;

-- Books added by specific librarian
-- SELECT id, name, author, serial, isbn, created_at FROM books WHERE added_by = 2 AND is_active = TRUE ORDER BY created_at DESC;

-- Books needing restock
-- SELECT id, name, author, available_copies, total_copies, (total_copies - available_copies) as borrowed
-- FROM books
-- WHERE available_copies < (total_copies * 0.25) AND is_active = TRUE
-- ORDER BY available_copies ASC;


-- ========================================
-- 4. SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample users (passwords are hashed with bcrypt, these are examples)
-- INSERT INTO users (name, email, password, role, phone) VALUES
-- ('Librarian One', 'librarian@library.com', '$2y$10$hashedpassword2', 'librarian', '0123456790'),
-- ('John Doe', 'john@student.com', '$2y$10$hashedpassword3', 'student', '0123456791'),
-- ('Jane Smith', 'jane@student.com', '$2y$10$hashedpassword4', 'student', '0123456792');

-- Insert sample books
-- INSERT INTO books (name, author, publisher, pages, serial, isbn, category, summary, total_copies, available_copies, added_by) VALUES
-- ('The Great Gatsby', 'F. Scott Fitzgerald', 'Penguin', 180, 'B001', '978-0743273565', 'Fiction', 'A classic American novel', 3, 2, 2),
-- ('To Kill a Mockingbird', 'Harper Lee', 'Penguin', 324, 'B002', '978-0061120084', 'Fiction', 'A gripping tale of racial injustice', 2, 1, 2),
-- ('1984', 'George Orwell', 'Penguin', 328, 'B003', '978-0451524935', 'Science Fiction', 'A dystopian novel', 4, 2, 2),
-- ('Python Basics', 'Robert Lafore', 'Prentice Hall', 752, 'B004', '978-0134498942', 'Programming', 'Learn Python programming', 2, 2, 2);


-- ========================================
-- 5. IMPORTANT NOTES
-- ========================================

-- FOREIGN KEYS:
-- - book_requests.student_id -> users.id (CASCADE DELETE)
-- - book_requests.book_id -> books.id (CASCADE DELETE)
-- - book_requests.approved_by -> users.id (SET NULL if librarian deleted)
-- - transactions.student_id -> users.id (CASCADE DELETE)
-- - transactions.book_id -> books.id (CASCADE DELETE)
-- - transactions.checked_out_by -> users.id (SET NULL if librarian deleted)

-- UNIQUE CONSTRAINTS:
-- - users.email (prevent duplicate emails)
-- - books.serial (each book has unique serial number)
-- - book_requests (student_id, book_id, status) - prevents duplicate pending requests

-- INDEXES:
-- - Added on frequently searched columns (email, role, status, dates)
-- - Added on foreign key columns for join performance

-- COLLATION:
-- - utf8mb4_unicode_ci for proper international character support

-- ========================================
