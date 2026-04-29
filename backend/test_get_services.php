<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/controllers/StaffController.php';

// Sarah's Shop ID
$shopId = '87611362-3ecf-4dee-8f9b-955b147824e3';
$staffId = 'some-id';

$staff = new StaffController($shopId, $staffId);
$services = $staff->getServices();

header('Content-Type: application/json');
echo json_encode($services, JSON_PRETTY_PRINT);
