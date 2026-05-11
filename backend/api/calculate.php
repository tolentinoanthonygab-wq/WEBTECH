<?php
// ============================================================
//  api/calculate.php — Endpoint for AJAX order calculation
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['service_id']) || !isset($input['weight'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing service_id or weight']);
    exit;
}

$serviceId = $input['service_id'];
$weight = (float) $input['weight'];

if ($weight <= 0) {
    echo json_encode(['subtotal' => 0]);
    exit;
}

try {
    $db = Database::getConnection();
    $stmt = $db->prepare('SELECT price_per_unit FROM services WHERE id = :id AND status = \'active\' LIMIT 1');
    $stmt->execute([':id' => $serviceId]);
    $service = $stmt->fetch();

    if (!$service) {
        http_response_code(404);
        echo json_encode(['error' => 'Service not found or inactive']);
        exit;
    }

    $price = (float) $service['price_per_unit'];
    $subtotal = round($price * $weight, 2);

    echo json_encode(['subtotal' => $subtotal, 'price_per_unit' => $price]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
