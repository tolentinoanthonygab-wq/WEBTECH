<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

session_start();
AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

$services = $staff->getServices();
$shopId   = $_SESSION['shop_id'] ?? 'MISSING';
echo json_encode([
    'success' => true, 
    'data'    => $services, 
    'count'   => count($services),
    'message' => "Fetched " . count($services) . " services for Shop ID: $shopId"
]);
