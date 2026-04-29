<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);
require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';
session_start();
AuthController::requireRole('super_admin');
$ctrl = new SuperAdminController();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $i  = json_decode(file_get_contents('php://input'), true);
    $ok = $ctrl->setPaymentStatus($i['id'] ?? '', $i['status'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Payment updated' : 'Failed']);
    exit;
}

echo json_encode(['success' => true, 'data' => $ctrl->getAllPaymentsGlobal()]);
