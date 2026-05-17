<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Cors.php';
Cors::handle(['POST', 'OPTIONS']);

require_once __DIR__ . '/../config/Session.php';
start_session();

require_once __DIR__ . '/../config/Database.php';

// Must be logged in
if (empty($_SESSION['logged_in'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$role   = $_SESSION['role']   ?? '';
$userId = $_SESSION['user_id'] ?? '';

if (!in_array($role, ['customer', 'staff', 'owner'], true) || !$userId) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Forbidden']);
    exit;
}

if (empty($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}

$file     = $_FILES['avatar'];
$maxSize  = 3 * 1024 * 1024; // 3 MB
$allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Validate size
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File too large. Max 3MB.']);
    exit;
}

// Validate MIME type using finfo (not just extension)
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
if (!in_array($mimeType, $allowed, true)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed.']);
    exit;
}

$ext      = match($mimeType) {
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    default      => 'jpg'
};

$uploadDir = __DIR__ . '/../assets/img/avatars/';
$filename  = $role . '_' . $userId . '.' . $ext;
$destPath  = $uploadDir . $filename;

// Remove old avatar files for this user (any extension)
foreach (glob($uploadDir . $role . '_' . $userId . '.*') as $old) {
    @unlink($old);
}

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit;
}

// Save path to DB
$db    = Database::getConnection();
$table = match($role) {
    'customer' => 'customers',
    'staff'    => 'staff',
    'owner'    => 'owners',
    default    => 'customers'
};
$stmt  = $db->prepare("UPDATE {$table} SET profile_photo = :photo WHERE id = :id");
$ok    = $stmt->execute([':photo' => $filename, ':id' => $userId]);

$photoUrl = '/api/avatar.php?file=' . urlencode($filename);

echo json_encode([
    'success'   => $ok,
    'message'   => $ok ? 'Avatar updated' : 'DB update failed',
    'photo_url' => $photoUrl
]);
