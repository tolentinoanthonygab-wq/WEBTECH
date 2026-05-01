<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);
require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';
require_once __DIR__ . '/../../config/Session.php';
start_session();
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'super_admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$controller = new SuperAdminController();
$stats = $controller->getPlatformStats();

echo json_encode(['success' => true, 'data' => $stats]);
