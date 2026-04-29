<?php
// ============================================================
//  config/Database.php — PDO Singleton, reads from .env
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/Env.php';

class Database
{
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            Env::load();

            $dsn = sprintf(
                'pgsql:host=%s;port=%s;dbname=%s',
                Env::get('DB_HOST', 'localhost'),
                Env::get('DB_PORT', '5432'),
                Env::get('DB_NAME', 'welaund')
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO(
                    $dsn,
                    Env::get('DB_USER', 'postgres'),
                    Env::get('DB_PASS', 'postgres'),
                    $options
                );
            } catch (PDOException $e) {
                error_log('[WeLaund DB] ' . $e->getMessage());
                throw new RuntimeException('Database connection failed. Please try again later.');
            }
        }

        return self::$instance;
    }
}
