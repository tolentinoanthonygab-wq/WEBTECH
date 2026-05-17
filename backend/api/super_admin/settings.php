<?php
declare(strict_types=1);
require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);
require_once __DIR__ . '/../../controllers/SuperAdminController.php';
require_once __DIR__ . '/../../config/Session.php';
start_session();

if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'super_admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$ctrl = new SuperAdminController();
$id   = (string) $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profile = $ctrl->getSuperAdminProfile($id);
    echo json_encode(['success' => (bool)$profile, 'data' => $profile]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $i      = json_decode(file_get_contents('php://input'), true);
    $action = $i['action'] ?? '';

    if ($action === 'update_email') {
        if (empty($i['new_email']) || empty($i['current_password'])) {
            echo json_encode(['success' => false, 'message' => 'Email and current password required.']);
            exit;
        }
        $result = $ctrl->updateSuperAdminEmail($id, $i['new_email'], $i['current_password']);
        echo json_encode($result);
        exit;
    }

    if ($action === 'update_password') {
        if (empty($i['current_password']) || empty($i['new_password'])) {
            echo json_encode(['success' => false, 'message' => 'All password fields required.']);
            exit;
        }
        if (strlen($i['new_password']) < 8) {
            echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters.']);
            exit;
        }
        $ok = $ctrl->updateSuperAdminPassword($id, $i['current_password'], $i['new_password']);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Password updated.' : 'Incorrect current password.']);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}
