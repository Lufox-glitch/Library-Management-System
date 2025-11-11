<?php
/**
 * create_sample_users.php
 *
 * This helper generates sample librarian and student accounts and prints
 * SQL INSERT statements. By default it only shows the queries and the
 * plaintext credentials. To actually insert into the database, call it
 * with ?apply=1 in the browser or --apply=1 on the CLI.
 */

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$samples = [
    'librarian' => [
        'email' => 'pratikhumagain17@gmail.com',
        'password' => 'pratik123',
        'name' => 'Pratik Humagain',
        'role' => 'librarian',
    ],
    'student' => [
        'email' => 'student1@example.com',
        'password' => 'student123',
        'name' => 'John Doe',
    ],
];

$apply = false;
if (php_sapi_name() === 'cli') {
    foreach ($argv as $arg) if (strpos($arg, '--apply=1') === 0) $apply = true;
} else {
    $apply = isset($_GET['apply']) && $_GET['apply'] == '1';
}

echo "Sample accounts (plaintext credentials):\n\n";
foreach ($samples as $type => $u) {
    echo strtoupper($type) . "\n";
    echo "  email: {$u['email']}\n";
    echo "  password: {$u['password']}\n\n";
}

echo "Generated SQL (use with caution):\n\n";

foreach ($samples as $type => $u) {
    $email = strtolower($u['email']);
    $name = $u['name'];
    $plain = $u['password'];
    $hash = password_hash($plain, PASSWORD_DEFAULT);

    if ($type === 'librarian') {
        $role = $u['role'];
        echo "INSERT INTO librarians (name, email, password, role) VALUES ('" . addslashes($name) . "', '" . addslashes($email) . "', '" . addslashes($hash) . "', '" . addslashes($role) . "');\n";
    } else {
        echo "INSERT INTO students (name, email, password) VALUES ('" . addslashes($name) . "', '" . addslashes($email) . "', '" . addslashes($hash) . "');\n";
    }
}

if ($apply) {
    echo "\nApplying inserts to database...\n";
    try {
        $pdo->beginTransaction();
        foreach ($samples as $type => $u) {
            $email = strtolower($u['email']);
            $name = $u['name'];
            $plain = $u['password'];
            $hash = password_hash($plain, PASSWORD_DEFAULT);

            if ($type === 'librarian') {
                // skip if exists
                $stmt = $pdo->prepare('SELECT id FROM librarians WHERE email = ? LIMIT 1');
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    echo "librarian {$email} already exists, skipping.\n";
                    continue;
                }
                $stmt = $pdo->prepare('INSERT INTO librarians (name, email, password, role) VALUES (?, ?, ?, ?)');
                $stmt->execute([$name, $email, $hash, $u['role']]);
                echo "Inserted librarian {$email}\n";
            } else {
                $stmt = $pdo->prepare('SELECT id FROM students WHERE email = ? LIMIT 1');
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    echo "student {$email} already exists, skipping.\n";
                    continue;
                }
                $stmt = $pdo->prepare('INSERT INTO students (name, email, password) VALUES (?, ?, ?)');
                $stmt->execute([$name, $email, $hash]);
                echo "Inserted student {$email}\n";
            }
        }
        $pdo->commit();
        echo "Done.\n";
    } catch (Exception $e) {
        $pdo->rollBack();
        echo "Failed to insert: " . $e->getMessage() . "\n";
    }
} else {
    echo "\nTo actually insert these accounts into the database run this script with apply=1:\n";
    echo "  - In browser: /Back-End/create_sample_users.php?apply=1\n";
    echo "  - On CLI: php Back-End/create_sample_users.php --apply=1\n";
}

?>
