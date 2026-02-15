<?php
/**
 * API: User Authentication (login/register/logout)
 */

require_once '../includes/config.php';
require_once '../queries.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'login' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = sanitize($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        sendJSON(['error' => 'Email and password required'], 400);
    }

    $user = getUserByEmail($email);
    
    if (!$user) {
        sendJSON(['error' => 'Invalid email or password'], 401);
    }

    if (!verifyPassword($password, $user['password'])) {
        sendJSON(['error' => 'Invalid email or password'], 401);
    }

    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    sendJSON([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} elseif ($action === 'register' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = sanitize($input['name'] ?? '');
    $email = sanitize($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $role = $input['role'] ?? 'student';

    if (!$name || !$email || !$password) {
        sendJSON(['error' => 'Name, email and password required'], 400);
    }

    if (strlen($password) < 6) {
        sendJSON(['error' => 'Password must be at least 6 characters'], 400);
    }

    $user_id = createUser($name, $email, $password, $role);

    if ($user_id === false) {
        sendJSON(['error' => 'Email already registered or registration failed'], 400);
    }

    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $role;

    sendJSON([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'role' => $role
        ]
    ]);

} elseif ($action === 'logout') {
    session_destroy();
    sendJSON(['success' => true, 'message' => 'Logged out']);

} elseif ($action === 'me') {
    if (!isset($_SESSION['user_id'])) {
        sendJSON(['error' => 'Not authenticated'], 401);
    }
    sendJSON([
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role']
    ]);

} else {
    sendJSON(['error' => 'Invalid action'], 400);
}
?>
