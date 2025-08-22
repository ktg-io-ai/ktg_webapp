<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'ktg_local_dev';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $avatarData = $input['avatarData'] ?? [];
    $doorChoice = $input['doorChoice'] ?? 'blue';
    
    if (empty($email) || empty($avatarData)) {
        echo json_encode(['error' => 'Missing required data']);
        exit;
    }
    
    try {
        // First, find or create user
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            // Create user
            $walletId = 'wallet_' . time() . '_' . rand(1000, 9999);
            $stmt = $pdo->prepare("INSERT INTO users (email, wallet_id, created_at) VALUES (?, ?, NOW())");
            $stmt->execute([$email, $walletId]);
            $userId = $pdo->lastInsertId();
            
            // Create wallet
            $stmt = $pdo->prepare("INSERT INTO wallets (user_id, wallet_id, created_at) VALUES (?, ?, NOW())");
            $stmt->execute([$userId, $walletId]);
        } else {
            $userId = $user['id'];
            // Get wallet_id
            $stmt = $pdo->prepare("SELECT wallet_id FROM wallets WHERE user_id = ?");
            $stmt->execute([$userId]);
            $wallet = $stmt->fetch();
            $walletId = $wallet['wallet_id'] ?? 'wallet_' . time() . '_' . rand(1000, 9999);
        }
        
        // Create avatar with door choice
        $stmt = $pdo->prepare("INSERT INTO avatars (wallet_id, name, gender, tagline, door_choice, image_url, generation_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $walletId,
            $avatarData['name'] ?? '',
            $avatarData['gender'] ?? 'other',
            $avatarData['tagline'] ?? '',
            $doorChoice,
            $avatarData['imageUrl'] ?? '',
            $avatarData['generationCount'] ?? 1
        ]);
        
        $avatarId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'avatarId' => $avatarId,
            'walletId' => $walletId,
            'doorChoice' => $doorChoice,
            'message' => 'Avatar saved successfully'
        ]);
        
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Only POST method allowed']);
}
?>