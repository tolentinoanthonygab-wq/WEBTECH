<?php
// ============================================================
//  config/Cors.php — Sets CORS headers from .env
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/Env.php';

class Cors
{
    public static function handle(array $methods = ['GET', 'POST', 'OPTIONS']): void
    {
        $origin = Env::get('FRONTEND_URL', 'http://localhost:3000');

        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: ' . implode(', ', $methods));
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
