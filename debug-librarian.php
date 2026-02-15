<?php
/**
 * Debug page to check librarian accounts
 */
require_once 'Back-End/includes/config.php';
require_once 'Back-End/queries.php';

$conn = getDBConnection();

echo "<h1>🔍 Librarian Account Debug</h1>";

echo "<h2>1. Checking for Librarians in Database:</h2>";
$result = $conn->query("SELECT id, name, email, role FROM users WHERE role IN ('librarian', 'admin')");

if ($result && $result->num_rows > 0) {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['email'] . "</td>";
        echo "<td>" . $row['role'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p style='color: red;'><strong>❌ No librarians or admins found!</strong></p>";
    echo "<p>You need to:</p>";
    echo "<ol>";
    echo "<li>Run setup: <a href='Back-End/setup.php'>http://localhost/Library-Management-System/Back-End/setup.php</a></li>";
    echo "<li>Or create librarian through admin panel</li>";
    echo "</ol>";
}

echo "<h2>2. Test Demo Librarian Login:</h2>";
echo "<p>Try logging in with these demo credentials:</p>";
echo "<ul>";
echo "<li><strong>Email:</strong> librarian@example.com</li>";
echo "<li><strong>Password:</strong> librarian123</li>";
echo "</ul>";

echo "<h2>3. API Connection Test:</h2>";
echo "<p>Testing API endpoint...</p>";
$test_result = testLogin("librarian@example.com", "librarian123");
if ($test_result['success']) {
    echo "<p style='color: green;'><strong>✅ API Works! User found:</strong></p>";
    echo "<pre>";
    echo "Name: " . $test_result['user']['name'] . "\n";
    echo "Email: " . $test_result['user']['email'] . "\n";
    echo "Role: " . $test_result['user']['role'] . "\n";
    echo "</pre>";
} else {
    echo "<p style='color: red;'><strong>❌ API Error:</strong> " . $test_result['error'] . "</p>";
}

function testLogin($email, $password) {
    require_once 'Back-End/includes/config.php';
    require_once 'Back-End/queries.php';
    
    $user = getUserByEmail($email);
    
    if (!$user) {
        return ['success' => false, 'error' => 'Email not found'];
    }
    
    if (!verifyPassword($password, $user['password'])) {
        return ['success' => false, 'error' => 'Password incorrect'];
    }
    
    return ['success' => true, 'user' => $user];
}

$conn->close();
?>
