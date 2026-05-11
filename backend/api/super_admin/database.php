<?php
// ============================================================
//  api/super_admin/database.php
//  API endpoint for database backup and restore
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../config/Cors.php';
Cors::handle(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

require_once __DIR__ . '/../../controllers/DatabaseController.php';
require_once __DIR__ . '/../../config/Session.php';

start_session();

// Only super_admin allowed
if (empty($_SESSION['logged_in']) || ($_SESSION['role'] ?? '') !== 'super_admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$controller = new DatabaseController();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: List backups or Download ────────────────────────────
if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list';
    
    if ($action === 'download') {
        $filename = $_GET['filename'] ?? '';
        if (!$filename) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Filename required']);
            exit;
        }
        
        $filename = basename($filename);
        $filePath = __DIR__ . '/../../database/backups/' . $filename;
        
        if (file_exists($filePath)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'File not found']);
            exit;
        }
    }
    
    // Default: list backups
    echo json_encode(['success' => true, 'data' => $controller->listBackups()]);
    exit;
}

// ── POST: Create new backup ──────────────────────────────────
if ($method === 'POST') {
    $result = $controller->backup();
    echo json_encode($result);
    exit;
}

// ── PUT: Restore from backup ─────────────────────────────────
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = $input['filename'] ?? '';
    
    if (!$filename) {
        echo json_encode(['success' => false, 'message' => 'Filename required']);
        exit;
    }
    
    $filename = basename($filename);
    $filePath = __DIR__ . '/../../database/backups/' . $filename;
    
    $result = $controller->restore($filePath);
    echo json_encode($result);
    exit;
}

// ── DELETE: Remove backup file ───────────────────────────────
if ($method === 'DELETE') {
    $filename = $_GET['filename'] ?? '';
    
    if (!$filename) {
        echo json_encode(['success' => false, 'message' => 'Filename required']);
        exit;
    }
    
    $filename = basename($filename);
    $filePath = __DIR__ . '/../../database/backups/' . $filename;
    
    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            echo json_encode(['success' => true, 'message' => 'Backup file deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Could not delete file']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'File not found']);
    }
    exit;
}
