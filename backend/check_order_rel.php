<?php
require_once __DIR__ . '/config/Database.php';
$db = Database::getConnection();
$stmt = $db->query("SELECT * FROM orders WHERE order_ref = 'REQ-050509'");
$order = $stmt->fetch();
echo "Order: " . json_encode($order, JSON_PRETTY_PRINT) . "\n";

if ($order) {
    $stmt = $db->prepare("SELECT * FROM customers WHERE id = ?");
    $stmt->execute([$order['customer_id']]);
    $customer = $stmt->fetch();
    echo "Customer: " . json_encode($customer, JSON_PRETTY_PRINT) . "\n";
}
