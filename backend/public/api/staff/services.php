<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'staff') {
    http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
$staff    = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
$services = $staff->getServices();
$shopId   = $_SESSION['shop_id'] ?? 'MISSING';
echo json_encode(['success'=>true,'data'=>$services,'count'=>count($services),'message'=>"Fetched ".count($services)." services for Shop ID: $shopId"]);
