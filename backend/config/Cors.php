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
        set_exception_handler(static function (Throwable $e): void {
            error_log('[WeLaund API] ' . $e::class . ': ' . $e->getMessage());
            if (!headers_sent()) {
                http_response_code(500);
                header('Content-Type: application/json');
            }
            echo json_encode([
                'success' => false,
                'message' => 'Server error. Please check the backend logs.',
            ]);
            exit;
        });

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
