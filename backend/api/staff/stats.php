<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

AuthController::requireRole('staff');

session_start();
$shopId = $_SESSION['shop_id'] ?? '';
$staffId = $_SESSION['user_id'] ?? '';

if (!$shopId || !$staffId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing session data.']);
    exit;
}

$controller = new StaffController($shopId, $staffId);

echo json_encode([
    'success' => true,
    'data'    => [
        'daily_total'      => $controller->getDailyTotal(),
        'active_orders'    => count($controller->getActiveOrders()),
        'pending_approvals' => count($controller->getPendingCustomers()),
        'recent_orders'    => array_slice($controller->getActiveOrders(), 0, 5)
    ]
]);
