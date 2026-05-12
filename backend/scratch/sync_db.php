<?php
require_once __DIR__ . '/../config/database.php';
try {
    $db = Database::getConnection();
    
    echo "Starting database sync...\n";
    
    // Add missing columns to 'orders' table if they don't exist
    $columns = [
        'notes' => 'TEXT',
        'payment_method' => 'VARCHAR(50)',
        'delivery_address' => 'TEXT',
        'delivery_fee' => 'NUMERIC(10,2) DEFAULT 0'
    ];
    
    foreach ($columns as $col => $type) {
        try {
            $db->exec("ALTER TABLE orders ADD COLUMN $col $type");
            echo "Added column: $col\n";
        } catch (Exception $e) {
            echo "Column $col already exists or error: " . $e->getMessage() . "\n";
        }
    }
    
    echo "Database sync complete!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
