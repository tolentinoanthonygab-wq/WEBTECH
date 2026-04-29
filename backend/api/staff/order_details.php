<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

session_start();
AuthController::requireRole('staff', 'customer'); // both roles can view receipts

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
$id    = $_GET['id'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Order ID required']);
    exit;
}

$order = $staff->getOrder($id);

if (!$order) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Order not found']);
    exit;
}

echo json_encode(['success' => true, 'data' => $order]);
