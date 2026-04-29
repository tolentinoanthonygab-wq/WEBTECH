<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'OPTIONS']);

require_once __DIR__ . '/../../config/Database.php';

$db = Database::getConnection();

// GET: Return list of active shops
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $shops = $db->query("SELECT id, shop_name as name FROM laundry_shops WHERE status = 'active' ORDER BY shop_name ASC")->fetchAll();
    echo json_encode(['success' => true, 'data' => $shops]);
    exit;
}

// POST: Handle registration
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    $shopId    = $input['shop_id'] ?? '';
    $fname     = $input['first_name'] ?? '';
    $mname     = $input['middle_name'] ?? '';
    $lname     = $input['last_name'] ?? '';
    $email     = $input['email'] ?? '';
    $password  = $input['password'] ?? '';
    $contact   = $input['contact_number'] ?? '';
    $address   = $input['address'] ?? '';

    if (empty($shopId) || empty($fname) || empty($lname) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
        exit;
    }

    try {
        $chk = $db->prepare("SELECT id FROM customers WHERE email = :email LIMIT 1");
        $chk->execute([':email' => $email]);
        if ($chk->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already exists.']);
            exit;
        }

        $stmt = $db->prepare(
            "INSERT INTO customers (shop_id, first_name, middle_name, last_name, email, password_hash, contact_number, address, status)
             VALUES (:sid, :fn, :mn, :ln, :em, :pw, :cn, :ad, 'Pending')"
        );
        $stmt->execute([
            ':sid' => $shopId,
            ':fn'  => $fname,
            ':mn'  => $mname,
            ':ln'  => $lname,
            ':em'  => strtolower(trim((string)$email)),
            ':pw'  => password_hash((string)$password, PASSWORD_BCRYPT),
            ':cn'  => $contact,
            ':ad'  => $address
        ]);

        echo json_encode(['success' => true, 'message' => 'Registration successful! Waiting for approval.']);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}
