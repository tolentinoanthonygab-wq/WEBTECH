<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

session_start();
AuthController::requireRole('owner');

$owner = new OwnerController($_SESSION['shop_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input    = json_decode(file_get_contents('php://input'), true);
    $name     = $input['name']     ?? '';
    $unit     = $input['unit']     ?? 'per_kg';
    $price    = (float)($input['price'] ?? 0);
    $category = $input['category'] ?? '';

    if (!$name || $price <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valid name and price required']);
        exit;
    }

    $ok = $owner->createService($name, $unit, $price, $category);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Service added' : 'Failed to add service']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id     = $input['id']     ?? '';
    $status = $input['status'] ?? '';

    if (!$id || !$status) {
        echo json_encode(['success' => false, 'message' => 'id and status required']);
        exit;
    }

    $ok = $owner->updateServiceStatus($id, $status);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Status updated' : 'Update failed']);
    exit;
}

// Default: GET all services
$data = $owner->getServices();
echo json_encode(['success' => true, 'data' => $data]);
