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

            $host = Env::get('DB_HOST', 'localhost');
            $port = Env::get('DB_PORT', '5432');
            $name = Env::get('DB_NAME', 'welaund');
            $user = Env::get('DB_USER', 'postgres');
            $pass = Env::get('DB_PASS', 'postgres');

            $dsn = sprintf(
                'pgsql:host=%s;port=%s;dbname=%s',
                $host,
                $port,
                $name
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO(
                    $dsn,
                    $user,
                    $pass,
                    $options
                );
            } catch (PDOException $e) {
                error_log(sprintf(
                    '[WeLaund DB] %s | host=%s port=%s db=%s user=%s pass_len=%d env=%s',
                    $e->getMessage(),
                    $host,
                    $port,
                    $name,
                    $user,
                    strlen($pass),
                    Env::loadedFile() ?? 'not loaded'
                ));
                throw new RuntimeException('Database connection failed. Please try again later.');
            }
        }

        return self::$instance;
    }
}
