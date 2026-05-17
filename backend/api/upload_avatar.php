<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(0);
header('Content-Type: application/json');

require_once __DIR__ . '/../config/Cors.php';
Cors::handle(['POST', 'OPTIONS']);

require_once __DIR__ . '/../config/Session.php';
start_session();

require_once __DIR__ . '/../config/Database.php';

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

$file    = $_FILES['avatar'];
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$finfo   = new finfo(FILEINFO_MIME_TYPE);
$mime    = $finfo->file($file['tmp_name']);

if (!in_array($mime, $allowed, true)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed.']);
    exit;
}

// ── Cloudinary credentials ──
$cloudName = 'duirgj4eq';
$apiKey    = '589946995928989';
$apiSecret = 'rl69uXLa8YskcphM-JyBk9Cyjlg';

// ── Build signed upload params ──
$timestamp  = time();
$publicId   = 'avatars/' . $role . '_' . $userId;
$paramsToSign = [
    'overwrite'   => 'true',
    'public_id'   => $publicId,
    'timestamp'   => $timestamp,
    'transformation' => 'c_fill,w_400,h_400,q_auto',
];
ksort($paramsToSign);
$signStr = '';
foreach ($paramsToSign as $k => $v) {
    $signStr .= $k . '=' . $v . '&';
}
$signStr  = rtrim($signStr, '&') . $apiSecret;
$signature = sha1($signStr);

// ── POST to Cloudinary ──
$postFields = [
    'file'           => new CURLFile($file['tmp_name'], $mime, 'avatar'),
    'api_key'        => $apiKey,
    'timestamp'      => $timestamp,
    'public_id'      => $publicId,
    'overwrite'      => 'true',
    'transformation' => 'c_fill,w_400,h_400,q_auto',
    'signature'      => $signature,
];

$ch = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode !== 200 || empty($result['secure_url'])) {
    error_log('[upload_avatar] Cloudinary error: ' . $response);
    echo json_encode(['success' => false, 'message' => 'Cloudinary upload failed.']);
    exit;
}

$photoUrl = $result['secure_url'];

// ── Save URL to DB ──
$db    = Database::getConnection();
$table = match($role) {
    'customer' => 'customers',
    'staff'    => 'staff',
    'owner'    => 'owners',
    default    => 'customers'
};

$stmt = $db->prepare("UPDATE {$table} SET profile_photo = :photo WHERE id = :id");
$ok   = $stmt->execute([':photo' => $photoUrl, ':id' => $userId]);

echo json_encode([
    'success'   => $ok,
    'message'   => $ok ? 'Avatar updated' : 'DB update failed',
    'photo_url' => $photoUrl,
]);
