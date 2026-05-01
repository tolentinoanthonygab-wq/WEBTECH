<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';
if (empty($_SESSION['logged_in']) || !in_array($_SESSION['role'] ?? '', ['staff','customer'])) {
    http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
$id    = $_GET['id'] ?? '';
if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Order ID required']); exit; }
$order = $staff->getOrder($id);
if (!$order) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Order not found']); exit; }
echo json_encode(['success'=>true,'data'=>$order]);
