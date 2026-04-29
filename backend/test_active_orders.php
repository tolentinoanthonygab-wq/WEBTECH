<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/controllers/StaffController.php';

$shopId = '87611362-3ecf-4dee-8f9b-955b147824e3';
$staffId = 'some-id';

$staff = new StaffController($shopId, $staffId);
$active = $staff->getActiveOrders();

echo "Active Orders Count: " . count($active) . "\n";
echo "Active Orders Data: " . json_encode($active, JSON_PRETTY_PRINT) . "\n";
