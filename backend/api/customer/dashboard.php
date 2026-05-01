<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/CustomerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
AuthController::requireRole('customer');

$customer = new CustomerController($_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $customer->updateProfile($input);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Profile updated' : 'Failed to update']);
    exit;
}

// Default: GET dashboard data
$orders  = $customer->getOrders();
$profile = $customer->getProfile();
$shop    = $customer->getShop();

echo json_encode([
    'success' => true, 
    'data' => [
        'orders'  => $orders,
        'profile' => $profile,
        'shop'    => $shop,
    ]
]);
