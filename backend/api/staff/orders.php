<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

session_start();
AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $orderId = $_GET['id'] ?? '';
    if (!$orderId) {
        echo json_encode(['success' => false, 'message' => 'id required']);
        exit;
    }
    $ok = $staff->deleteOrder($orderId);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Order deleted' : 'Delete failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input   = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['id']     ?? '';
    $status  = $input['status'] ?? '';

    if (!$orderId || !$status) {
        echo json_encode(['success' => false, 'message' => 'id and status required']);
        exit;
    }

    $ok = $staff->updateOrderStatus($orderId, $status);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Status updated' : 'Update failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $customerId = $input['customer_id'] ?? '';
    $items      = $input['items']       ?? [];

    if (!$customerId || empty($items)) {
        echo json_encode(['success' => false, 'message' => 'Customer and items required']);
        exit;
    }

    try {
        $orderRef = $staff->createOrder($customerId, $items);
        echo json_encode(['success' => true, 'order_ref' => $orderRef]);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// Default: GET all today's orders (Requested, Ongoing, Done)
$data = $staff->getAllTodayOrders();
echo json_encode(['success' => true, 'data' => $data]);
