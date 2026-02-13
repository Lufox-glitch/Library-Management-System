<?php
/**
 * API: Books (list, search, detail)
 */

require_once '../includes/config.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'list' && $method === 'GET') {
    $search = sanitize($_GET['q'] ?? '');
    $category = sanitize($_GET['category'] ?? '');
    $limit = intval($_GET['limit'] ?? 20);
    $offset = intval($_GET['offset'] ?? 0);

    $conn = getDBConnection();

    // Build query
    $where = [];
    $params = [];
    $types = '';

    if ($search) {
        $search_param = '%' . $search . '%';
        $where[] = '(name LIKE ? OR author LIKE ? OR publisher LIKE ?)';
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $types .= 'sss';
    }

    if ($category) {
        $where[] = 'category = ?';
        $params[] = $category;
        $types .= 's';
    }

    $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM books $where_clause";
    if (!empty($params)) {
        $count_stmt = $conn->prepare($count_sql);
        $count_stmt->bind_param($types, ...$params);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result()->fetch_assoc();
        $count_stmt->close();
    } else {
        $count_result = $conn->query($count_sql)->fetch_assoc();
    }

    // Get books
    $sql = "SELECT id, name, author, publisher, pages, serial, category, summary, available_copies FROM books $where_clause ORDER BY name ASC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    $stmt->close();
    $conn->close();

    sendJSON([
        'success' => true,
        'books' => $books,
        'total' => $count_result['total'],
        'offset' => $offset,
        'limit' => $limit
    ]);

} elseif ($action === 'detail' && $method === 'GET') {
    $book_id = intval($_GET['id'] ?? 0);

    if (!$book_id) {
        sendJSON(['error' => 'Book ID required'], 400);
    }

    $conn = getDBConnection();
    $stmt = $conn->prepare('SELECT id, name, author, publisher, pages, serial, isbn, category, summary, total_copies, available_copies FROM books WHERE id = ?');
    $stmt->bind_param('i', $book_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendJSON(['error' => 'Book not found'], 404);
    }

    $book = $result->fetch_assoc();
    $stmt->close();
    $conn->close();

    sendJSON([
        'success' => true,
        'book' => $book
    ]);

} else {
    sendJSON(['error' => 'Invalid action'], 400);
}
?>
