<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

session_start();
AuthController::requireRole('owner');

$owner = new OwnerController($_SESSION['shop_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name  = $input['shop_name']       ?? '';
    $addr  = $input['address']          ?? '';
    $cn    = $input['contact_number']   ?? '';
    $gn    = $input['gcash_number']     ?? '';
    $gm    = $input['gcash_name']       ?? '';

    if (!$name || !$addr) {
        echo json_encode(['success' => false, 'message' => 'Shop name and address required']);
        exit;
    }

    $ok = $owner->updateShopSettings($name, $addr, $cn, $gn, $gm);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Settings saved' : 'Failed to save settings']);
    exit;
}

// Default: GET current shop settings
$data = $owner->getShop();
echo json_encode(['success' => true, 'data' => $data]);
