<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'PUT', 'OPTIONS']);
require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';
require_once __DIR__ . '/../../config/Session.php';
start_session();
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'super_admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
$ctrl = new SuperAdminController();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $i  = json_decode(file_get_contents('php://input'), true);
    $ok = $ctrl->setOrderStatus($i['id'] ?? '', $i['status'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Order updated' : 'Failed']);
    exit;
}

echo json_encode(['success' => true, 'data' => $ctrl->getAllOrdersGlobal()]);
