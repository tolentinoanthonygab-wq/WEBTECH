<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['POST', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../config/Database.php';

if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'customer') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$input   = json_decode(file_get_contents('php://input'), true);
$orderId = $input['order_id'] ?? '';

if (!$orderId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'order_id required']);
    exit;
}

try {
    $db = Database::getConnection();

    // Only allow cancel if order belongs to this customer AND is still Requested
    $stmt = $db->prepare(
        "SELECT id, order_status FROM orders
         WHERE id = :id AND customer_id = :cid AND order_status = 'Requested'
         LIMIT 1"
    );
    $stmt->execute([':id' => $orderId, ':cid' => $_SESSION['user_id']]);
    $order = $stmt->fetch();

    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Order not found or cannot be cancelled. Only pending requests can be cancelled.']);
        exit;
    }

    $update = $db->prepare("UPDATE orders SET order_status = 'Cancelled', last_updated = NOW() WHERE id = :id");
    $update->execute([':id' => $orderId]);

    echo json_encode(['success' => true, 'message' => 'Order cancelled successfully.']);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error.']);
}
