<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$email = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['error' => 'email and password are required']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT id, name, email, password FROM students WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }

    $stored = $user['password'] ?? '';
    $verified = false;

    if (password_get_info($stored)['algo'] !== 0) {
        $verified = password_verify($password, $stored);
    } else {
        $verified = ($password === $stored);
    }

    if (!$verified) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        exit;
    }

    unset($user['password']);

    echo json_encode(['success' => true, 'student' => $user]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}

?>
