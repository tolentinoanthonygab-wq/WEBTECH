<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['POST', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';

session_start();

$input    = json_decode(file_get_contents('php://input'), true);
$email    = trim($input['email']    ?? '');
$password = $input['password'] ?? '';
$role     = $input['role']     ?? 'auto';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

$auth   = new AuthController();
$result = $auth->login($email, $password, $role);

if ($result === true) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data'    => [
            'user_id'   => $_SESSION['user_id'],
            'user_name' => $_SESSION['user_name'],
            'email'     => $_SESSION['email'],
            'role'      => $_SESSION['role'],
            'shop_id'   => $_SESSION['shop_id'],
            'shop_name' => $_SESSION['shop_name'],
        ],
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => $result]);
}
