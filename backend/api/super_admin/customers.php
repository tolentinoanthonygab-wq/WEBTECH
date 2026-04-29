<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'PUT', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';

session_start();
AuthController::requireRole('super_admin');

$controller = new SuperAdminController();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input  = json_decode(file_get_contents('php://input'), true);
    $id     = $input['id']     ?? '';
    $status = $input['status'] ?? '';

    if (!$id || !$status) {
        echo json_encode(['success' => false, 'message' => 'id and status required']);
        exit;
    }
    $ok = $controller->setCustomerStatus($id, $status);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Status updated' : 'Update failed']);
    exit;
}

// GET: return all customers
echo json_encode(['success' => true, 'data' => $controller->getAllCustomers()]);
