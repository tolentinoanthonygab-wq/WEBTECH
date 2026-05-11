<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['POST', 'GET', 'OPTIONS']);

require_once __DIR__ . '/../../config/Session.php';
start_session();
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out']);
