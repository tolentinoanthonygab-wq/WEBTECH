<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';

// Enforce role
AuthController::requireRole('super_admin');

$controller = new SuperAdminController();
$stats = $controller->getPlatformStats();

echo json_encode([
    'success' => true,
    'data'    => $stats
]);
