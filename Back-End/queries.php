<?php
/**
 * Database Query Helper Functions
 * Use these functions in your API endpoints for all database operations
 */

require_once 'includes/config.php';

// ========================================
// AUTHENTICATION QUERIES
// ========================================

/**
 * Get user by email (for login)
 */
function getUserByEmail($email) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, email, password, role FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->num_rows > 0 ? $result->fetch_assoc() : null;
    $stmt->close();
    $conn->close();
    return $user;
}

/**
 * Get user by ID
 */
function getUserById($id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->num_rows > 0 ? $result->fetch_assoc() : null;
    $stmt->close();
    $conn->close();
    return $user;
}

/**
 * Create new user
 */
function createUser($name, $email, $password, $role = 'student') {
    $conn = getDBConnection();
    $hashed_password = hashPassword($password);
    $stmt = $conn->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $name, $email, $hashed_password, $role);
    $success = $stmt->execute();
    $user_id = $conn->insert_id;
    $stmt->close();
    $conn->close();
    return $success ? $user_id : false;
}


// ========================================
// BOOK QUERIES
// ========================================

/**
 * Get all books with pagination
 */
function getAllBooks($limit = 20, $offset = 0) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, author, publisher, pages, serial, category, summary, available_copies, total_copies FROM books ORDER BY name ASC LIMIT ? OFFSET ?');
    $stmt->bind_param('ii', $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}

/**
 * Search books by keyword
 */
function searchBooks($search_term, $limit = 20, $offset = 0) {
    $conn = getDBConnection();
    $search_param = '%' . $search_term . '%';
    $stmt = $conn->prepare('SELECT id, name, author, publisher, pages, category, summary, available_copies FROM books WHERE (name LIKE ? OR author LIKE ? OR publisher LIKE ?) ORDER BY name ASC LIMIT ? OFFSET ?');
    $stmt->bind_param('sssii', $search_param, $search_param, $search_param, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}

/**
 * Get books by category
 */
function getBooksByCategory($category, $limit = 20, $offset = 0) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, author, category, available_copies FROM books WHERE category = ? ORDER BY name ASC LIMIT ? OFFSET ?');
    $stmt->bind_param('sii', $category, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}

/**
 * Get single book details
 */
function getBookById($id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, author, publisher, isbn, pages, category, summary, available_copies, total_copies FROM books WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $book = $result->num_rows > 0 ? $result->fetch_assoc() : null;
    $stmt->close();
    $conn->close();
    return $book;
}

/**
 * Get books with low stock
 */
function getLowStockBooks() {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, author, available_copies, total_copies FROM books WHERE available_copies < 3 ORDER BY available_copies ASC');
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}

/**
 * Add new book (librarian only)
 */
function addBook($name, $author, $publisher, $pages, $serial, $isbn, $category, $summary, $total_copies = 1) {
    $conn = getDBConnection();
    $available_copies = $total_copies;
    $stmt = $conn->prepare('INSERT INTO books (name, author, publisher, pages, serial, isbn, category, summary, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssissssii', $name, $author, $publisher, $pages, $serial, $isbn, $category, $summary, $total_copies, $available_copies);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Update book details (librarian only)
 */
function updateBook($id, $name, $author, $publisher, $pages, $category, $summary, $total_copies) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('UPDATE books SET name = ?, author = ?, publisher = ?, pages = ?, category = ?, summary = ?, total_copies = ? WHERE id = ?');
    $stmt->bind_param('ssisssii', $name, $author, $publisher, $pages, $category, $summary, $total_copies, $id);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}


// ========================================
// BOOK REQUEST QUERIES
// ========================================

/**
 * Get all pending requests (librarian view)
 */
function getPendingRequests() {
    $conn = getDBConnection();
    $sql = 'SELECT br.id, br.student_id, u.name as student_name, br.book_id, b.name as book_name, br.request_date, br.due_date
            FROM book_requests br
            JOIN users u ON br.student_id = u.id
            JOIN books b ON br.book_id = b.id
            WHERE br.status = "pending"
            ORDER BY br.request_date DESC';
    $result = $conn->query($sql);
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $requests;
}

/**
 * Get student's requests
 */
function getStudentRequests($student_id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT br.id, b.name as book_name, br.status, br.request_date, br.due_date, br.return_date
                           FROM book_requests br
                           JOIN books b ON br.book_id = b.id
                           WHERE br.student_id = ?
                           ORDER BY br.request_date DESC');
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $requests;
}

/**
 * Create book request
 */
function requestBook($student_id, $book_id) {
    $conn = getDBConnection();
    
    // Check if student already has a pending request for this book
    $check_stmt = $conn->prepare('SELECT COUNT(*) as count FROM book_requests WHERE student_id = ? AND book_id = ? AND status = "pending"');
    $check_stmt->bind_param('ii', $student_id, $book_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result()->fetch_assoc();
    $check_stmt->close();
    
    if ($check_result['count'] > 0) {
        $conn->close();
        return false; // Duplicate pending request
    }
    
    // Create new request
    $stmt = $conn->prepare('INSERT INTO book_requests (student_id, book_id) VALUES (?, ?)');
    $stmt->bind_param('ii', $student_id, $book_id);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Approve book request (librarian)
 */
function approveRequest($request_id, $due_date, $librarian_id) {
    $conn = getDBConnection();
    
    // Get book_id from request
    $get_stmt = $conn->prepare('SELECT book_id FROM book_requests WHERE id = ?');
    $get_stmt->bind_param('i', $request_id);
    $get_stmt->execute();
    $book_data = $get_stmt->get_result()->fetch_assoc();
    $get_stmt->close();
    
    if (!$book_data) return false;
    
    $book_id = $book_data['book_id'];
    
    // Update request status
    $stmt = $conn->prepare('UPDATE book_requests SET status = "approved", due_date = ?, approved_by = ? WHERE id = ?');
    $stmt->bind_param('sii', $due_date, $librarian_id, $request_id);
    $success = $stmt->execute();
    $stmt->close();
    
    // Decrease available copies
    if ($success) {
        $update_stmt = $conn->prepare('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?');
        $update_stmt->bind_param('i', $book_id);
        $update_stmt->execute();
        $update_stmt->close();
    }
    
    $conn->close();
    return $success;
}

/**
 * Reject book request (librarian)
 */
function rejectRequest($request_id, $reason = '') {
    $conn = getDBConnection();
    $status = 'rejected';
    $stmt = $conn->prepare('UPDATE book_requests SET status = ?, rejection_reason = ? WHERE id = ?');
    $stmt->bind_param('ssi', $status, $reason, $request_id);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Cancel student's pending request
 */
function cancelRequest($request_id, $student_id) {
    $conn = getDBConnection();
    $status = 'cancelled';
    $stmt = $conn->prepare('UPDATE book_requests SET status = ? WHERE id = ? AND student_id = ? AND status = "pending"');
    $stmt->bind_param('sii', $status, $request_id, $student_id);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Get overdue requests
 */
function getOverdueRequests() {
    $conn = getDBConnection();
    $sql = 'SELECT br.id, u.name as student_name, b.name as book_name, br.due_date, DATEDIFF(CURDATE(), br.due_date) as days_overdue
            FROM book_requests br
            JOIN users u ON br.student_id = u.id
            JOIN books b ON br.book_id = b.id
            WHERE br.status = "approved" AND br.due_date < CURDATE()
            ORDER BY br.due_date ASC';
    $result = $conn->query($sql);
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $requests;
}

/**
 * Get student's active books
 */
function getStudentActiveBooks($student_id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT br.id, b.id as book_id, b.name, b.author, b.category, br.due_date, DATEDIFF(br.due_date, CURDATE()) as days_remaining
                           FROM book_requests br
                           JOIN books b ON br.book_id = b.id
                           WHERE br.student_id = ? AND br.status = "approved"
                           ORDER BY br.due_date ASC');
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}


// ========================================
// TRANSACTION QUERIES
// ========================================

/**
 * Get checkout history for a student
 */
function getStudentTransactionHistory($student_id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT t.id, b.name as book_name, b.author, t.checkout_date, t.due_date, t.return_date, t.is_returned, t.fine_amount
                           FROM transactions t
                           JOIN books b ON t.book_id = b.id
                           WHERE t.student_id = ?
                           ORDER BY t.checkout_date DESC');
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $transactions = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $transactions;
}

/**
 * Get all active checkouts (not returned)
 */
function getActiveCheckouts() {
    $conn = getDBConnection();
    $sql = 'SELECT t.id, u.name as student_name, b.name as book_name, t.due_date, DATEDIFF(CURDATE(), t.due_date) as days_overdue
            FROM transactions t
            JOIN users u ON t.student_id = u.id
            JOIN books b ON t.book_id = b.id
            WHERE t.is_returned = FALSE
            ORDER BY t.due_date ASC';
    $result = $conn->query($sql);
    $transactions = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $transactions;
}

/**
 * Record book checkout
 */
function checkoutBook($student_id, $book_id, $due_date) {
    $conn = getDBConnection();
    $is_returned = false;
    $stmt = $conn->prepare('INSERT INTO transactions (student_id, book_id, due_date, is_returned) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('iisb', $student_id, $book_id, $due_date, $is_returned);
    $success = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Record book return
 */
function returnBook($transaction_id, $fine_amount = 0) {
    $conn = getDBConnection();
    $return_date = date('Y-m-d');
    $is_returned = true;
    $stmt = $conn->prepare('UPDATE transactions SET is_returned = ?, return_date = ?, fine_amount = ? WHERE id = ?');
    $stmt->bind_param('bsdi', $is_returned, $return_date, $fine_amount, $transaction_id);
    $success = $stmt->execute();
    
    if ($success) {
        // Get book_id to increase available copies
        $get_stmt = $conn->prepare('SELECT book_id FROM transactions WHERE id = ?');
        $get_stmt->bind_param('i', $transaction_id);
        $get_stmt->execute();
        $book_data = $get_stmt->get_result()->fetch_assoc();
        $get_stmt->close();
        
        if ($book_data) {
            $book_id = $book_data['book_id'];
            $update_stmt = $conn->prepare('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?');
            $update_stmt->bind_param('i', $book_id);
            $update_stmt->execute();
            $update_stmt->close();
        }
    }
    
    $stmt->close();
    $conn->close();
    return $success;
}

/**
 * Get overdue transactions
 */
function getOverdueTransactions() {
    $conn = getDBConnection();
    $sql = 'SELECT t.id, u.name as student_name, b.name as book_name, t.due_date, DATEDIFF(CURDATE(), t.due_date) as days_overdue
            FROM transactions t
            JOIN users u ON t.student_id = u.id
            JOIN books b ON t.book_id = b.id
            WHERE t.is_returned = FALSE AND t.due_date < CURDATE()
            ORDER BY t.due_date ASC';
    $result = $conn->query($sql);
    $transactions = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $transactions;
}

/**
 * Get unpaid fines
 */
function getUnpaidFines() {
    $conn = getDBConnection();
    $sql = 'SELECT t.id, u.name as student_name, b.name as book_name, t.fine_amount, t.return_date
            FROM transactions t
            JOIN users u ON t.student_id = u.id
            JOIN books b ON t.book_id = b.id
            WHERE t.fine_amount > 0 AND t.is_returned = TRUE
            ORDER BY t.return_date DESC';
    $result = $conn->query($sql);
    $transactions = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $transactions;
}


// ========================================
// STATISTICS QUERIES
// ========================================

/**
 * Get library dashboard stats
 */
function getDashboardStats() {
    $conn = getDBConnection();
    
    $stats = [];
    
    // Total books
    $total_books = $conn->query('SELECT COUNT(*) as count FROM books')->fetch_assoc()['count'];
    $stats['total_books'] = $total_books;
    
    // Available books
    $available_books = $conn->query('SELECT SUM(available_copies) as count FROM books')->fetch_assoc()['count'];
    $stats['available_books'] = $available_books ?: 0;
    
    // Total students
    $total_students = $conn->query('SELECT COUNT(*) as count FROM users WHERE role = "student"')->fetch_assoc()['count'];
    $stats['total_students'] = $total_students;
    
    // Active checkouts
    $active_checkouts = $conn->query('SELECT COUNT(*) as count FROM transactions WHERE is_returned = FALSE')->fetch_assoc()['count'];
    $stats['active_checkouts'] = $active_checkouts;
    
    // Pending requests
    $pending_requests = $conn->query('SELECT COUNT(*) as count FROM book_requests WHERE status = "pending"')->fetch_assoc()['count'];
    $stats['pending_requests'] = $pending_requests;
    
    // Overdue books
    $overdue_books = $conn->query('SELECT COUNT(*) as count FROM book_requests WHERE status = "approved" AND due_date < CURDATE()')->fetch_assoc()['count'];
    $stats['overdue_books'] = $overdue_books;
    
    $conn->close();
    return $stats;
}

/**
 * Get most borrowed books
 */
function getMostBorrowedBooks($limit = 10) {
    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT b.id, b.name, b.author, COUNT(t.id) as times_borrowed
                           FROM transactions t
                           RIGHT JOIN books b ON t.book_id = b.id
                           GROUP BY b.id
                           ORDER BY times_borrowed DESC
                           LIMIT ?');
    $stmt->bind_param('i', $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();
    return $books;
}

/**
 * Get categories statistics
 */
function getCategoriesStats() {
    $conn = getDBConnection();
    $sql = 'SELECT category, COUNT(*) as books_count, SUM(available_copies) as available
            FROM books
            WHERE category IS NOT NULL
            GROUP BY category
            ORDER BY books_count DESC';
    $result = $conn->query($sql);
    $categories = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $categories;
}

/**
 * Get student borrowing stats
 */
function getStudentBorrowingStats() {
    $conn = getDBConnection();
    $sql = 'SELECT u.id, u.name, COUNT(t.id) as books_borrowed, SUM(CASE WHEN t.is_returned = FALSE THEN 1 ELSE 0 END) as current_books
            FROM users u
            LEFT JOIN transactions t ON u.id = t.student_id
            WHERE u.role = "student"
            GROUP BY u.id
            ORDER BY books_borrowed DESC';
    $result = $conn->query($sql);
    $students = $result->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    return $students;
}

?>
