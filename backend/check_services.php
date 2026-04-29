<?php
require_once __DIR__ . '/config/Database.php';
$db = Database::getConnection();
$stmt = $db->query("SELECT * FROM services");
while($row = $stmt->fetch()) {
    echo "ID: {$row['id']} | Name: {$row['service_name']} | Status: {$row['status']} | Shop: {$row['shop_id']}\n";
}
