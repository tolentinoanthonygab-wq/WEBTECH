<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
AuthController::requireRole('owner');

$owner = new OwnerController($_SESSION['shop_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name  = $input['shop_name']       ?? '';
    $addr  = $input['address']          ?? '';
    $cn    = $input['contact_number']   ?? '';
    $gn    = $input['gcash_number']     ?? '';
    $gm    = $input['gcash_name']       ?? '';
    $da    = (bool)($input['delivery_available'] ?? true);
    $df    = (float)($input['delivery_fee']       ?? 0);

    if (!$name || !$addr) {
        echo json_encode(['success' => false, 'message' => 'Shop name and address required']);
        exit;
    }

    $ok = $owner->updateShopSettings($name, $addr, $cn, $gn, $gm, $da, $df);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Settings saved' : 'Failed to save settings']);
    exit;
}

// Default: GET current shop settings
$data = $owner->getShop();
if ($data) {
    $data['delivery_available'] = (bool)$data['delivery_available'];
    $data['delivery_fee']       = (float)$data['delivery_fee'];
}
echo json_encode(['success' => true, 'data' => $data]);
