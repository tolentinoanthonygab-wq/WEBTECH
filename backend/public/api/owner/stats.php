<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Session.php';
start_session();

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

AuthController::requireRole('owner');

$shopId = $_SESSION['shop_id'] ?? '';

if (!$shopId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No shop associated with this owner.']);
    exit;
}

$controller = new OwnerController($shopId);

$customers = $controller->getTotalCustomers();

echo json_encode([
    'success' => true,
    'data'    => [
        'daily'    => $controller->getDailyIncome(),
        'monthly'  => $controller->getMonthlyIncome(),
        'yearly'   => $controller->getYearlyIncome(),
        'stats'    => [
            'total_staff'        => count($controller->getAllStaff()),
            'total_services'     => count($controller->getServices()),
            'total_customers'    => (int)($customers['total']    ?? 0),
            'approved_customers' => (int)($customers['approved'] ?? 0),
            'pending_customers'  => (int)($customers['pending']  ?? 0),
        ]
    ]
]);
