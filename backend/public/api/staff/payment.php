<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['POST', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'staff') {
    http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed']); exit;
}
$input  = json_decode(file_get_contents('php://input'), true);
$method = $input['payment_method'] ?? 'Manual';
if ($method === 'GCash') {
    $ref = $input['transaction_reference'] ?? '';
    $ok  = $staff->verifyGcashPayment($input['order_id'], $ref, (float)($input['amount_paid'] ?? 0));
} else {
    require_once __DIR__ . '/../../config/Database.php';
    $db = Database::getConnection();
    $db->beginTransaction();
    try {
        $db->prepare("INSERT INTO payments (order_id,amount_paid,payment_method,verified_by,status) VALUES (:oid,:amt,'Manual',:staff,'Verified')")
           ->execute([':oid'=>$input['order_id'],':amt'=>(float)($input['amount_paid']??0),':staff'=>$_SESSION['user_id']]);
        $db->prepare("UPDATE orders SET payment_status='Paid' WHERE id=:oid")->execute([':oid'=>$input['order_id']]);
        $db->commit(); $ok = true;
    } catch (\Exception $e) { $db->rollBack(); $ok = false; }
}
echo json_encode(['success'=>$ok,'message'=>$ok?'Payment recorded':'Payment failed']);
