<?php
/**
 * Admin API Endpoints
 * ==================
 * Only admin users can access these endpoints
 * Used for: Creating librarians, managing users, system settings
 */

header('Content-Type: application/json');
session_start();

require_once '../includes/config.php';
require_once '../queries.php';

// Check if user is authenticated and is admin
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized: Please login first'
    ]);
    exit;
}

// Get current user
$user = getUserById($_SESSION['user_id']);
if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Forbidden: Admin access required'
    ]);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'create_librarian') {
            // Create new librarian account
            $name = $input['name'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            // Validation
            if (empty($name) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name, email, and password are required'
                ]);
                exit;
            }

            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Password must be at least 6 characters'
                ]);
                exit;
            }

            // Check if email already exists
            $existing = getUserByEmail($email);
            if ($existing) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Email already exists'
                ]);
                exit;
            }

            // Create librarian account
            $user_id = createUser($name, $email, $password, 'librarian');
            if ($user_id) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Librarian created successfully',
                    'user' => [
                        'id' => $user_id,
                        'name' => $name,
                        'email' => $email,
                        'role' => 'librarian'
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create librarian'
                ]);
            }
        } elseif ($action === 'create_admin') {
            // Create new admin account (only for initial setup)
            $name = $input['name'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            // Validation
            if (empty($name) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Name, email, and password are required'
                ]);
                exit;
            }

            if (strlen($password) < 6) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Password must be at least 6 characters'
                ]);
                exit;
            }

            // Check if email already exists
            $existing = getUserByEmail($email);
            if ($existing) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Email already exists'
                ]);
                exit;
            }

            // Create admin account
            $user_id = createUser($name, $email, $password, 'admin');
            if ($user_id) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Admin created successfully',
                    'user' => [
                        'id' => $user_id,
                        'name' => $name,
                        'email' => $email,
                        'role' => 'admin'
                    ]
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create admin'
                ]);
            }
        } elseif ($action === 'delete_user') {
            // Delete a user account
            $user_id = $input['user_id'] ?? '';

            if (empty($user_id)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'User ID is required'
                ]);
                exit;
            }

            // Cannot delete yourself
            if ($user_id == $_SESSION['user_id']) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Cannot delete your own account'
                ]);
                exit;
            }

            // Delete user
            $conn = getDBConnection();
            $stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
            $stmt->bind_param('i', $user_id);
            $success = $stmt->execute();

            if ($success) {
                echo json_encode([
                    'success' => true,
                    'message' => 'User deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete user'
                ]);
            }
        }
    } elseif ($method === 'GET') {
        if ($action === 'list_users') {
            // Get all users
            $conn = getDBConnection();
            $result = $conn->query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
            $users = [];

            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }

            echo json_encode([
                'success' => true,
                'users' => $users,
                'total' => count($users)
            ]);
        } elseif ($action === 'list_librarians') {
            // Get all librarians
            $conn = getDBConnection();
            $result = $conn->query("SELECT id, name, email, role, created_at FROM users WHERE role = 'librarian' ORDER BY id DESC");
            $librarians = [];

            while ($row = $result->fetch_assoc()) {
                $librarians[] = $row;
            }

            echo json_encode([
                'success' => true,
                'librarians' => $librarians,
                'total' => count($librarians)
            ]);
        } elseif ($action === 'list_students') {
            // Get all students
            $conn = getDBConnection();
            $result = $conn->query("SELECT id, name, email, role, created_at FROM users WHERE role = 'student' ORDER BY id DESC");
            $students = [];

            while ($row = $result->fetch_assoc()) {
                $students[] = $row;
            }

            echo json_encode([
                'success' => true,
                'students' => $students,
                'total' => count($students)
            ]);
        } elseif ($action === 'stats') {
            // Get admin dashboard statistics
            $conn = getDBConnection();

            // Total users
            $users_result = $conn->query('SELECT COUNT(*) as count FROM users');
            $users_count = $users_result->fetch_assoc()['count'];

            // Total librarians
            $librarians_result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'librarian'");
            $librarians_count = $librarians_result->fetch_assoc()['count'];

            // Total students
            $students_result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
            $students_count = $students_result->fetch_assoc()['count'];

            // Total books
            $books_result = $conn->query('SELECT COUNT(*) as count FROM books');
            $books_count = $books_result->fetch_assoc()['count'];

            // Total requests
            $requests_result = $conn->query('SELECT COUNT(*) as count FROM book_requests');
            $requests_count = $requests_result->fetch_assoc()['count'];

            // Pending requests
            $pending_result = $conn->query("SELECT COUNT(*) as count FROM book_requests WHERE status = 'pending'");
            $pending_count = $pending_result->fetch_assoc()['count'];

            echo json_encode([
                'success' => true,
                'stats' => [
                    'total_users' => $users_count,
                    'total_librarians' => $librarians_count,
                    'total_students' => $students_count,
                    'total_books' => $books_count,
                    'total_requests' => $requests_count,
                    'pending_requests' => $pending_count
                ]
            ]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
