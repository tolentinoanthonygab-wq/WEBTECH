<?php
require_once __DIR__ . '/config/Database.php';
$db = Database::getConnection();
$stmt = $db->query("SELECT column_name FROM information_schema.columns WHERE table_name='services'");
while($row = $stmt->fetch()) {
    echo $row['column_name'] . "\n";
}
