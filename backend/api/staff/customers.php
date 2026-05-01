<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'staff') {
    http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input      = json_decode(file_get_contents('php://input'), true);
    $customerId = $input['id'] ?? $input['customer_id'] ?? '';
    $status     = $input['status'] ?? '';
    if (!$customerId || !$status) {
        http_response_code(400); echo json_encode(['success'=>false,'message'=>'id and status required']); exit;
    }
    $ok = $staff->updateCustomerStatus($customerId, $status);
    echo json_encode(['success'=>$ok,'message'=>$ok?'Status updated':'Update failed']); exit;
}

$pending  = $staff->getPendingCustomers();
$approved = $staff->getApprovedCustomers();
echo json_encode(['success'=>true,'data'=>array_merge($pending,$approved),'message'=>'']);
