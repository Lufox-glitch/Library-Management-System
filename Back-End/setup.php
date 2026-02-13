<?php
/**
 * Database Setup Script
 * Run this once to create tables
 * Access via: Back-End/setup.php in your browser
 */

require_once 'includes/config.php';

$conn = getDBConnection();
$errors = [];
$success = [];

// SQL to create tables
$tables = [
    'users' => "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('student', 'librarian', 'admin') DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX(email),
            INDEX(role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ",
    'books' => "
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            author VARCHAR(100) NOT NULL,
            publisher VARCHAR(100),
            pages INT,
            serial VARCHAR(50) UNIQUE,
            isbn VARCHAR(20),
            category VARCHAR(50),
            summary TEXT,
            total_copies INT DEFAULT 1,
            available_copies INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX(name),
            INDEX(author),
            INDEX(category),
            INDEX(serial)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ",
    'book_requests' => "
        CREATE TABLE IF NOT EXISTS book_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            book_id INT NOT NULL,
            request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
            due_date DATE,
            return_date DATE,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            INDEX(student_id),
            INDEX(book_id),
            INDEX(status),
            UNIQUE KEY unique_pending (student_id, book_id, status) -- prevents duplicate pending requests
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ",
    'transactions' => "
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            book_id INT NOT NULL,
            checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            due_date DATE,
            return_date DATE,
            is_returned BOOLEAN DEFAULT FALSE,
            fine_amount DECIMAL(10, 2) DEFAULT 0,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            INDEX(student_id),
            INDEX(is_returned),
            INDEX(checkout_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    "
];

// Create tables
foreach ($tables as $table_name => $sql) {
    if ($conn->query($sql) === TRUE) {
        $success[] = "Table '$table_name' created or already exists.";
    } else {
        $errors[] = "Error creating table '$table_name': " . $conn->error;
    }
}

// Insert sample data (books)
$sample_books = [
    ["The Hunger Games", "Suzanne Collins", "Alfa", 478, "1", "978-0439023481", "Fiction", "A dystopian novel about survival and revolution."],
    ["Harry Potter", "J.K. Rowling", "Beta", 398, "2", "978-0439708180", "Fantasy", "A young wizard's journey at Hogwarts."],
    ["To Kill a Mockingbird", "Harper Lee", "Omega", 685, "3", "978-0061120084", "Fiction", "A classic exploring racial injustice."],
    ["Pride and Prejudice", "Jane Austen", "Sky", 425, "4", "978-0141439518", "Romance", "A novel about manners and marriage."],
    ["1984", "George Orwell", "Signet", 328, "24", "978-0451524935", "Fiction", "A dystopian masterpiece."],
    ["The Great Gatsby", "F. Scott Fitzgerald", "Scribner", 180, "56", "978-0743273565", "Fiction", "Jazz Age romance and tragedy."],
];

$insert_sql = "INSERT IGNORE INTO books (name, author, publisher, pages, serial, isbn, category, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insert_sql);

if ($stmt === FALSE) {
    $errors[] = "Prepare error: " . $conn->error;
} else {
    foreach ($sample_books as $book) {
        $stmt->bind_param("sssisss", $book[0], $book[1], $book[2], $book[3], $book[4], $book[5], $book[6], $book[7]);
        if (!$stmt->execute()) {
            $errors[] = "Error inserting book: " . $stmt->error;
        }
    }
    $stmt->close();
    $success[] = "Sample books inserted.";
}

// Insert sample users (mock for testing)
$insert_user_sql = "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
$user_stmt = $conn->prepare($insert_user_sql);

if ($user_stmt === FALSE) {
    $errors[] = "Prepare error: " . $conn->error;
} else {
    $sample_users = [
        ["Demo Student", "student@example.com", hashPassword("student123"), "student"],
        ["Demo Librarian", "librarian@example.com", hashPassword("librarian123"), "librarian"],
    ];
    
    foreach ($sample_users as $user) {
        $user_stmt->bind_param("ssss", $user[0], $user[1], $user[2], $user[3]);
        if (!$user_stmt->execute()) {
            $errors[] = "Error inserting user: " . $user_stmt->error;
        }
    }
    $user_stmt->close();
    $success[] = "Sample users inserted.";
}

$conn->close();

// Display results
?>
<!DOCTYPE html>
<html>
<head>
    <title>Library Backend Setup</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .success { background: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Library Management System — Database Setup</h1>
    
    <?php if (empty($errors) && !empty($success)): ?>
        <h2 style="color: green;">✓ Setup Successful!</h2>
        <?php foreach ($success as $msg): ?>
            <div class="success"><?php echo htmlspecialchars($msg); ?></div>
        <?php endforeach; ?>
        <hr>
        <h3>Next Steps:</h3>
        <ol>
            <li>Update <strong>Back-End/includes/config.php</strong> with your actual database credentials (if not using defaults).</li>
            <li>Test login: <strong>Email: student@example.com</strong> | <strong>Password: student123</strong></li>
            <li>Update frontend API URL in your JavaScript files (currently using localStorage mocks).</li>
        </ol>
    <?php else: ?>
        <h2 style="color: red;">⚠ Setup Issues</h2>
        <?php foreach ($errors as $err): ?>
            <div class="error"><?php echo htmlspecialchars($err); ?></div>
        <?php endforeach; ?>
        <?php foreach ($success as $msg): ?>
            <div class="success"><?php echo htmlspecialchars($msg); ?></div>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>
