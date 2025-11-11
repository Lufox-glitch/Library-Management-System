<?php
// Use InfinityFree MySQL host (not your site domain)
define('DB_HOST', 'sql102.infinityfree.com'); // <- change
define('DB_NAME', 'if0_40388745_librarydb');
define('DB_USER', 'if0_40388745');
define('DB_PASS', '5ZFtwMhi3bvH9Ow');
define('DB_CHARSET', 'utf8mb4');

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $dsn = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=".DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}