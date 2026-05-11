<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/Database.php';

header('Content-Type: application/json');

try {
    $db = Database::getConnection();
    $currentDb = $db->query("SELECT current_database()")->fetchColumn();
    
    $stmt = $db->query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $adminCount = 0;
    if (in_array('super_admins', $tables)) {
        $adminCount = $db->query("SELECT COUNT(*) FROM super_admins")->fetchColumn();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful',
        'connected_to_db' => $currentDb,
        'tables' => $tables,
        'super_admin_count' => $adminCount
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $e->getMessage()
    ]);
}
