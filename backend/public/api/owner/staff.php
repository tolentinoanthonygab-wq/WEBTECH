<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

require_once __DIR__ . '/../../config/Session.php';
start_session();
AuthController::requireRole('owner');

$owner = new OwnerController($_SESSION['shop_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $fname = $input['first_name'] ?? '';
    $lname = $input['last_name']  ?? '';
    $email = $input['email']       ?? '';
    $pass  = $input['password']    ?? 'Admin@123';

    if (!$fname || !$lname || !$email) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        exit;
    }

    $ok = $owner->createStaff($fname, $lname, $email, $pass);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Staff created' : 'Email already exists']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input   = json_decode(file_get_contents('php://input'), true);
    $staffId = $input['id']     ?? '';
    $status  = $input['status'] ?? '';

    if (!$staffId || !$status) {
        echo json_encode(['success' => false, 'message' => 'id and status required']);
        exit;
    }

    $ok = $owner->updateStaffStatus($staffId, $status);
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Status updated' : 'Failed to update']);
    exit;
}

// Default: GET all staff for this owner's shop
$data = $owner->getAllStaff();
echo json_encode(['success' => true, 'data' => $data]);
