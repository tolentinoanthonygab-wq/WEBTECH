<?php
declare(strict_types=1);

// Ensure PHP errors never corrupt JSON output
ini_set('display_errors', '0');
error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/CustomerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
AuthController::requireRole('customer');

try {
    $customer = new CustomerController($_SESSION['user_id']);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $ok = $customer->updateProfile($input);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Profile updated' : 'Failed to update']);
        exit;
    }

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
} catch (Throwable $e) {
    error_log('[customer/dashboard.php] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
