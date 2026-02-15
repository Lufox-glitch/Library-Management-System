<?php
/**
 * API: Books (list, search, detail)
 */

require_once '../includes/config.php';
require_once '../queries.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'list' && $method === 'GET') {
    $search = sanitize($_GET['q'] ?? '');
    $category = sanitize($_GET['category'] ?? '');
    $limit = intval($_GET['limit'] ?? 20);
    $offset = intval($_GET['offset'] ?? 0);

    $books = [];
    $total = 0;

    if ($search) {
        $books = searchBooks($search, $limit, $offset);
        // Count total for search
        $conn = getDBConnection();
        $search_param = '%' . $search . '%';
        $count_stmt = $conn->prepare('SELECT COUNT(*) as total FROM books WHERE (name LIKE ? OR author LIKE ? OR publisher LIKE ?)');
        $count_stmt->bind_param('sss', $search_param, $search_param, $search_param);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result()->fetch_assoc();
        $count_stmt->close();
        $conn->close();
        $total = $count_result['total'];
    } elseif ($category) {
        $books = getBooksByCategory($category, $limit, $offset);
        // Count total for category
        $conn = getDBConnection();
        $count_stmt = $conn->prepare('SELECT COUNT(*) as total FROM books WHERE category = ?');
        $count_stmt->bind_param('s', $category);
        $count_stmt->execute();
        $count_result = $count_stmt->get_result()->fetch_assoc();
        $count_stmt->close();
        $conn->close();
        $total = $count_result['total'];
    } else {
        $books = getAllBooks($limit, $offset);
        // Count total books
        $conn = getDBConnection();
        $count_result = $conn->query('SELECT COUNT(*) as total FROM books')->fetch_assoc();
        $conn->close();
        $total = $count_result['total'];
    }

    sendJSON([
        'success' => true,
        'books' => $books,
        'total' => $total,
        'offset' => $offset,
        'limit' => $limit
    ]);

} elseif ($action === 'detail' && $method === 'GET') {
    $book_id = intval($_GET['id'] ?? 0);

    if (!$book_id) {
        sendJSON(['error' => 'Book ID required'], 400);
    }

    $book = getBookById($book_id);

    if (!$book) {
        sendJSON(['error' => 'Book not found'], 404);
    }

    sendJSON([
        'success' => true,
        'book' => $book
    ]);

} else {
    sendJSON(['error' => 'Invalid action'], 400);
}
?>
