<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Session.php';
start_session();

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'owner') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$shopId = $_SESSION['shop_id'] ?? '';
if (!$shopId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No shop associated.']);
    exit;
}

$year  = (int)($_GET['year']  ?? date('Y'));
$month = (int)($_GET['month'] ?? date('n'));

$controller = new OwnerController($shopId);
$data = $controller->getDailyIncomeByMonth($year, $month);

echo json_encode(['success' => true, 'data' => $data]);
