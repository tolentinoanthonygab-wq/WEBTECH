<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'OPTIONS']);

session_start();

if (!empty($_SESSION['logged_in'])) {
    echo json_encode([
        'success' => true,
        'data'    => [
            'user_id'    => $_SESSION['user_id'],
            'user_name'  => $_SESSION['user_name'],
            'first_name' => $_SESSION['first_name'] ?? '',
            'email'      => $_SESSION['email'],
            'role'       => $_SESSION['role'],
            'shop_id'    => $_SESSION['shop_id'],
            'shop_name'  => $_SESSION['shop_name'],
            'status'     => $_SESSION['status'] ?? 'active',
        ],
    ]);
} else {
    echo json_encode(['success' => false, 'data' => null, 'message' => 'Not authenticated']);
}
