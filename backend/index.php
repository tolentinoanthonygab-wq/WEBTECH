<?php
// ============================================================
//  backend/index.php — Gateway to Public Index
// ============================================================
declare(strict_types=1);

// This ensures that hitting the root of the backend redirects to the public index
require_once __DIR__ . '/public/index.php';
