<?php
/**
 * API: Book Requests (create, list, cancel, approve)
 */

require_once '../includes/config.php';
require_once '../queries.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Check authentication
if (!isset($_SESSION['user_id'])) {
    sendJSON(['error' => 'Not authenticated'], 401);
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? 'student';

if ($action === 'create' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $book_id = intval($input['book_id'] ?? 0);

    if (!$book_id) {
        sendJSON(['error' => 'Book ID required'], 400);
    }

    $success = requestBook($user_id, $book_id);

    if ($success) {
        sendJSON([
            'success' => true,
            'message' => 'Request created successfully'
        ]);
    } else {
        sendJSON(['error' => 'You have already requested this book or request failed'], 400);
    }

} elseif ($action === 'list' && $method === 'GET') {
    $requests = [];

    if ($user_role === 'librarian') {
        // Librarians see all requests
        $requests = getPendingRequests();
    } else {
        // Students see only their requests
        $requests = getStudentRequests($user_id);
    }

    sendJSON([
        'success' => true,
        'requests' => $requests
    ]);

} elseif ($action === 'cancel' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $request_id = intval($input['request_id'] ?? 0);

    if (!$request_id) {
        sendJSON(['error' => 'Request ID required'], 400);
    }

    $success = cancelRequest($request_id, $user_id);

    if ($success) {
        sendJSON(['success' => true, 'message' => 'Request cancelled successfully']);
    } else {
        sendJSON(['error' => 'Failed to cancel request or request not found'], 400);
    }

} elseif ($action === 'approve' && $method === 'POST') {
    if ($user_role !== 'librarian') {
        sendJSON(['error' => 'Only librarians can approve requests'], 403);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $request_id = intval($input['request_id'] ?? 0);
    $due_date = sanitize($input['due_date'] ?? date('Y-m-d', strtotime('+14 days')));

    if (!$request_id) {
        sendJSON(['error' => 'Request ID required'], 400);
    }

    $success = approveRequest($request_id, $due_date, $user_id);

    if ($success) {
        sendJSON(['success' => true, 'message' => 'Request approved successfully']);
    } else {
        sendJSON(['error' => 'Failed to approve request or request not found'], 400);
    }

} else {
    sendJSON(['error' => 'Invalid action'], 400);
}
?>
