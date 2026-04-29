<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['POST', 'DELETE', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

session_start();
AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId   = $input['order_id']   ?? '';
    $serviceId = $input['service_id'] ?? '';
    $qty       = (float)($input['quantity'] ?? 0);

    if (!$orderId || !$serviceId || $qty <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    $ok = $staff->addOrderItem($orderId, $serviceId, $qty);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Item added' : 'Failed to add item']);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $orderId = $_GET['order_id'] ?? '';
    $itemId  = $_GET['item_id']  ?? '';

    if (!$orderId || !$itemId) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    $ok = $staff->removeOrderItem($itemId, $orderId);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Item removed' : 'Failed to remove item']);
}
