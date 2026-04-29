<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'OPTIONS']);
require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';
session_start();
AuthController::requireRole('super_admin');
$ctrl = new SuperAdminController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $i = json_decode(file_get_contents('php://input'), true);
    if (empty($i['username']) || empty($i['email']) || empty($i['password'])) {
        echo json_encode(['success' => false, 'message' => 'All fields required']); exit;
    }
    try {
        $ok = $ctrl->createSuperAdmin($i['username'], $i['email'], $i['password']);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Super Admin created' : 'Creation failed']);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $i  = json_decode(file_get_contents('php://input'), true);
    $ok = $ctrl->setSuperAdminStatus($i['id'] ?? '', $i['status'] ?? '');
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Updated' : 'Failed']);
    exit;
}

echo json_encode(['success' => true, 'data' => $ctrl->getAllSuperAdmins()]);
