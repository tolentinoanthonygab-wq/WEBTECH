<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(0);
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/Cors.php';

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/CustomerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
AuthController::requireRole('customer');

$customer = new CustomerController($_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profile = $customer->getProfile();
    echo json_encode(['success' => true, 'data' => $profile]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $customer->updateProfile($input);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Profile updated' : 'Update failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $customer->updatePassword($input['current'] ?? '', $input['new'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Password changed' : 'Incorrect current password']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $input  = json_decode(file_get_contents('php://input'), true);
    $result = $customer->updateEmail($input['new_email'] ?? '', $input['current_password'] ?? '');
    echo json_encode($result);
    exit;
}
