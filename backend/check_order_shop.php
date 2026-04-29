<?php
require_once __DIR__ . '/config/Database.php';
$db = Database::getConnection();
$stmt = $db->query("SELECT shop_id FROM orders WHERE order_ref = 'REQ-050509'");
echo "Order REQ-050509 Shop ID: " . $stmt->fetchColumn() . "\n";
