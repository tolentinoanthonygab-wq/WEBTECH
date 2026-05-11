<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
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
    $id    = $input['id'] ?? '';

    // If only status is provided, update only status
    if (count($input) === 2 && isset($input['status'])) {
        $ok = $owner->updateServiceStatus($id, $input['status']);
    } else {
        // Full update
        $name     = $input['name']     ?? '';
        $unit     = $input['unit']     ?? '';
        $price    = (float)($input['price'] ?? 0);
        $category = $input['category'] ?? '';

        if (!$id || !$name || $price <= 0) {
            echo json_encode(['success' => false, 'message' => 'Valid id, name and price required']);
            exit;
        }
        $ok = $owner->updateService($id, $name, $unit, $price, $category);
    }

    echo json_encode(['success' => $ok, 'message' => $ok ? 'Service updated' : 'Update failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id    = $input['id'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'id required']);
        exit;
    }

    $ok = $owner->deleteService($id);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Service deleted' : 'Delete failed']);
    exit;
}

// Default: GET all services
$data = $owner->getServices();
echo json_encode(['success' => true, 'data' => $data]);
