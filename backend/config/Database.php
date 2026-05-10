<?php
// ============================================================
#  config/Database.php — PDO Singleton, reads from .env or DATABASE_URL
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

            // Support Railway/Heroku style DATABASE_URL
            $dbUrl = getenv('DATABASE_URL') ?: Env::get('DATABASE_URL');
            
            if ($dbUrl) {
                // Parse: postgresql://user:pass@host:port/dbname
                $parsed = parse_url($dbUrl);
                $host = $parsed['host'];
                $port = (string)($parsed['port'] ?? '5432');
                $user = $parsed['user'];
                $pass = $parsed['pass'] ?? '';
                $name = ltrim($parsed['path'], '/');
            } else {
                $host = Env::get('DB_HOST', 'localhost');
                $port = Env::get('DB_PORT', '5432');
                $name = Env::get('DB_NAME', 'welaund');
                $user = Env::get('DB_USER', 'postgres');
                $pass = Env::get('DB_PASS', 'postgres');
            }

            $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $name);
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                error_log('[WeLaund DB Error] ' . $e->getMessage());
                throw new RuntimeException('Database connection failed.');
            }
        }

        return self::$instance;
    }
}
