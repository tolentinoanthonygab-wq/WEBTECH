<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS']);
require_once __DIR__ . '/../../config/Session.php';
start_session();
require_once __DIR__ . '/../../controllers/StaffController.php';
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'staff') {
    http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit;
}
$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profile = $staff->getProfile();
    echo json_encode(['success' => true, 'data' => $profile]); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $staff->updateProfile($input['first_name'] ?? '', $input['last_name'] ?? '');
    echo json_encode(['success'=>$ok,'message'=>$ok?'Profile updated':'Update failed']); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $ok = $staff->updatePassword($input['current'] ?? '', $input['new'] ?? '');
    echo json_encode(['success'=>$ok,'message'=>$ok?'Password changed':'Incorrect current password']); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $input  = json_decode(file_get_contents('php://input'), true);
    $result = $staff->updateEmail($input['new_email'] ?? '', $input['current_password'] ?? '');
    echo json_encode($result); exit;
}
