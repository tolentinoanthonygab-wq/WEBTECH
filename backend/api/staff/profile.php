<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

session_start();
AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $staff->updateProfile($input['first_name'] ?? '', $input['last_name'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Profile updated' : 'Update failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $staff->updatePassword($input['current'] ?? '', $input['new'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Password changed' : 'Incorrect current password']);
    exit;
}
