<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';

if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'staff') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input      = json_decode(file_get_contents('php://input'), true);
        $customerId = $input['id'] ?? $input['customer_id'] ?? '';
        $status     = $input['status'] ?? '';
        if (!$customerId || !$status) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'id and status required']);
            exit;
        }
        $ok = $staff->updateCustomerStatus($customerId, $status);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Status updated' : 'Update failed']);
        exit;
    }

    $type = $_GET['type'] ?? 'all';

    if ($type === 'approved') {
        $customers = $staff->getApprovedCustomers();
    } elseif ($type === 'pending') {
        $customers = $staff->getPendingCustomers();
    } else {
        $customers = array_merge($staff->getPendingCustomers(), $staff->getApprovedCustomers());
    }

    echo json_encode(['success' => true, 'data' => $customers, 'message' => '']);

} catch (Throwable $e) {
    error_log('[customers.php] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
