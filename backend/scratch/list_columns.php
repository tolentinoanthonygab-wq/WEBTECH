<?php
require_once __DIR__ . '/../config/database.php';
try {
    $db = Database::getConnection();
    $stmt = $db->query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo implode(", ", $columns);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
