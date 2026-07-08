<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$db   = 'vnmetiva_sistem_kepegawaian';
$user = 'vnmetiva_admin';
$pass = 'CYBORG15A13V';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT initials, message, score FROM guestbook_entries ORDER BY score DESC LIMIT 100");
        $entries = $stmt->fetchAll();
        echo json_encode($entries);
    } catch (\Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $initials = isset($input['initials']) ? strtoupper(trim($input['initials'])) : '';
    $message = isset($input['message']) ? trim($input['message']) : '';
    $score = isset($input['score']) ? intval($input['score']) : 0;
    
    if (strlen($initials) !== 3 || !preg_match('/^[A-Z0-9]{3}$/', $initials)) {
        echo json_encode(["success" => false, "error" => "Initials must be exactly 3 alphanumeric characters."]);
        exit;
    }
    if (empty($message)) {
        echo json_encode(["success" => false, "error" => "Message cannot be empty."]);
        exit;
    }
    if (strlen($message) > 100) {
        echo json_encode(["success" => false, "error" => "Message cannot exceed 100 characters."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO guestbook_entries (initials, message, score) VALUES (?, ?, ?)");
        $stmt->execute([$initials, $message, $score]);
        
        echo json_encode([
            "success" => true,
            "entry" => [
                "initials" => $initials,
                "message" => $message,
                "score" => $score
            ]
        ]);
    } catch (\Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
