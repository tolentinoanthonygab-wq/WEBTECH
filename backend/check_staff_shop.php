<?php
require_once __DIR__ . '/config/Database.php';
$db = Database::getConnection();
$stmt = $db->query("SELECT s.id, s.first_name, s.shop_id, ls.shop_name FROM staff s JOIN laundry_shops ls ON ls.id = s.shop_id");
while($row = $stmt->fetch()) {
    echo "Staff: {$row['first_name']} | Shop ID: {$row['shop_id']} | Shop Name: {$row['shop_name']}\n";
}
