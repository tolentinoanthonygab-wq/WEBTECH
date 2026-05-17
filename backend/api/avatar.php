<?php
// Serves avatar images securely from backend/assets/img/avatars/
declare(strict_types=1);

$file     = basename($_GET['file'] ?? '');
$filePath = __DIR__ . '/../assets/img/avatars/' . $file;

if (!$file || !file_exists($filePath)) {
    // Return a default SVG avatar
    header('Content-Type: image/svg+xml');
    echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#e2e8f0"/>
        <circle cx="50" cy="38" r="18" fill="#94a3b8"/>
        <ellipse cx="50" cy="85" rx="28" ry="20" fill="#94a3b8"/>
    </svg>';
    exit;
}

$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($filePath);
header('Content-Type: ' . $mimeType);
header('Cache-Control: public, max-age=86400');
readfile($filePath);
