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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $services = $customer->getShopServices($_SESSION['shop_id']);
    $shop     = $customer->getShop();
    if ($shop) {
        $shop['delivery_available'] = (bool)$shop['delivery_available'];
        $shop['delivery_fee']       = (float)$shop['delivery_fee'];
    }
    echo json_encode(['success' => true, 'data' => $services, 'shop' => $shop]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $type  = $input['type']           ?? 'Pickup';
    $pm    = $input['payment_method'] ?? 'Manual';
    $notes = $input['notes']          ?? '';
    $refNum = $input['reference_number'] ?? '';
    $dAddr  = $input['delivery_address'] ?? '';
    $dFee   = (float)($input['delivery_fee'] ?? 0);

    try {
        $ref = $customer->createRequest($_SESSION['shop_id'], $type, $pm, $notes, $refNum, $dAddr, $dFee);
        echo json_encode(['success' => true, 'ref' => $ref, 'message' => 'Request sent!']);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to send request: ' . $e->getMessage()]);
    }
    exit;
}
