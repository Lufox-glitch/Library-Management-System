<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query('SELECT id, name, author, publisher, pages, serial, created_at FROM books ORDER BY id DESC');
    $books = $stmt->fetchAll();
    echo json_encode($books);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch books']);
}
