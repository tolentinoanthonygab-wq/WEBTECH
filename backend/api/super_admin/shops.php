<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'OPTIONS']);
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

// ── PUT: toggle shop status ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input  = json_decode(file_get_contents('php://input'), true);
    $id     = $input['id']     ?? '';
    $status = $input['status'] ?? '';
    if (!$id || !$status) {
        echo json_encode(['success' => false, 'message' => 'id and status required']);
        exit;
    }
    $ok = $controller->setShopStatus($id, $status);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Shop status updated' : 'Update failed']);
    exit;
}

// ── POST: create shop + owner ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $shopName    = trim($input['shop_name']        ?? '');
    $shopAddress = trim($input['shop_address']     ?? '');
    $shopContact = trim($input['shop_contact']     ?? '');
    $ownerFName  = trim($input['owner_first_name'] ?? '');
    $ownerLName  = trim($input['owner_last_name']  ?? '');
    $ownerEmail  = trim($input['owner_email']      ?? '');
    $ownerPass   = trim($input['owner_password']   ?? '');
    if (!$shopName || !$ownerFName || !$ownerLName || !$ownerEmail || !$ownerPass) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    try {
        $ok = $controller->createShopWithOwner(
            $shopName, $shopAddress, $shopContact,
            $ownerFName, $ownerLName, $ownerEmail, $ownerPass,
            $_SESSION['user_id']
        );
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Shop and owner created!' : 'Creation failed']);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// ── GET: list all shops ──────────────────────────────────────
echo json_encode(['success' => true, 'data' => $controller->getAllShops()]);
