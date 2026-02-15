<?php
// Database credentials
define('DB_HOST', 'localhost');          // localhost for local development
define('DB_USER', 'root');               // XAMPP default user
define('DB_PASS', '');                   // XAMPP default: empty password. Change if you set one during installation.
define('DB_NAME', 'library_db');         // Database name created in phpMyAdmin or MySQL

// Session settings
session_start();
ini_set('session.cookie_httponly', 1);  // Prevent JS access to cookies
ini_set('session.use_secure_cookies', 0); // Set to 1 if using HTTPS

// CORS headers (allow frontend to make requests)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper function to connect to database
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Helper function to send JSON response
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Helper function for secure password hashing
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// Helper function to verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Helper function to sanitize input
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>
