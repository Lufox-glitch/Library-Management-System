<?php
/**
 * API: Book Requests (create, list, cancel, approve)
 */

require_once '../includes/config.php';

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

    $conn = getDBConnection();

    // Check if already requested
    $check_stmt = $conn->prepare('SELECT id FROM book_requests WHERE student_id = ? AND book_id = ? AND status IN ("pending", "approved")');
    $check_stmt->bind_param('ii', $user_id, $book_id);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        sendJSON(['error' => 'You have already requested this book'], 400);
    }
    $check_stmt->close();

    // Create request
    $stmt = $conn->prepare('INSERT INTO book_requests (student_id, book_id) VALUES (?, ?)');
    $stmt->bind_param('ii', $user_id, $book_id);

    if ($stmt->execute()) {
        $request_id = $conn->insert_id;
        $stmt->close();
        $conn->close();

        sendJSON([
            'success' => true,
            'message' => 'Request created',
            'request_id' => $request_id
        ]);
    } else {
        sendJSON(['error' => 'Failed to create request'], 500);
    }

} elseif ($action === 'list' && $method === 'GET') {
    $conn = getDBConnection();

    if ($user_role === 'librarian') {
        // Librarians see all requests
        $sql = "
            SELECT br.id, br.student_id, br.book_id, br.request_date, br.status, br.due_date, br.notes,
                   u.name as student_name, u.email as student_email,
                   b.name as book_name, b.author, b.serial
            FROM book_requests br
            JOIN users u ON br.student_id = u.id
            JOIN books b ON br.book_id = b.id
            ORDER BY br.request_date DESC
        ";
        $result = $conn->query($sql);
    } else {
        // Students see only their requests
        $stmt = $conn->prepare("
            SELECT br.id, br.student_id, br.book_id, br.request_date, br.status, br.due_date, br.notes,
                   b.name as book_name, b.author, b.serial
            FROM book_requests br
            JOIN books b ON br.book_id = b.id
            WHERE br.student_id = ?
            ORDER BY br.request_date DESC
        ");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
    }

    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    if ($user_role === 'librarian') {
        // no close needed for query
    } else {
        $stmt->close();
    }
    $conn->close();

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

    $conn = getDBConnection();

    // Check ownership
    $check_stmt = $conn->prepare('SELECT student_id, status FROM book_requests WHERE id = ?');
    $check_stmt->bind_param('i', $request_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();

    if ($result->num_rows === 0) {
        sendJSON(['error' => 'Request not found'], 404);
    }

    $req = $result->fetch_assoc();
    if ($req['student_id'] != $user_id && $user_role !== 'librarian') {
        sendJSON(['error' => 'Unauthorized'], 403);
    }

    $check_stmt->close();

    if ($req['status'] === 'cancelled') {
        sendJSON(['error' => 'Request already cancelled'], 400);
    }

    // Cancel request
    $stmt = $conn->prepare('UPDATE book_requests SET status = "cancelled" WHERE id = ?');
    $stmt->bind_param('i', $request_id);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendJSON(['success' => true, 'message' => 'Request cancelled']);
    } else {
        sendJSON(['error' => 'Failed to cancel request'], 500);
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

    $conn = getDBConnection();

    // Update request status
    $stmt = $conn->prepare('UPDATE book_requests SET status = "approved", due_date = ? WHERE id = ?');
    $stmt->bind_param('si', $due_date, $request_id);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendJSON(['success' => true, 'message' => 'Request approved']);
    } else {
        sendJSON(['error' => 'Failed to approve request'], 500);
    }

} else {
    sendJSON(['error' => 'Invalid action'], 400);
}
?>
