<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true) ?: [];

$name = trim($input['name'] ?? '');
$author = trim($input['author'] ?? '');
$publisher = trim($input['publisher'] ?? null);
$pages = isset($input['pages']) && $input['pages'] !== '' ? (int)$input['pages'] : null;
$serial = trim($input['serial'] ?? null);

if ($name === '' || $author === '') {
    http_response_code(400);
    echo json_encode(['error' => 'name and author are required']);
    exit;
}

try {
    $sql = 'INSERT INTO books (name, author, publisher, pages, serial) VALUES (:name, :author, :publisher, :pages, :serial)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':author' => $author,
        ':publisher' => $publisher ?: null,
        ':pages' => $pages ?: null,
        ':serial' => $serial ?: null,
    ]);
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT id, name, author, publisher, pages, serial, created_at FROM books WHERE id = ?');
    $stmt->execute([$id]);
    $book = $stmt->fetch();
    http_response_code(201);
    echo json_encode($book);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add book']);
}