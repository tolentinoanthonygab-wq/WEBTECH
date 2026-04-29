<?php
// ============================================================
//  config/Env.php — Loads backend/.env into getenv()
// ============================================================
declare(strict_types=1);

class Env
{
    private static bool $loaded = false;

    public static function load(): void
    {
        if (self::$loaded) return;

        $envFile = __DIR__ . '/../.env';
        if (!file_exists($envFile)) return;

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            // Skip comments and empty lines
            if ($line === '' || str_starts_with($line, '#')) continue;

            [$key, $value] = array_map('trim', explode('=', $line, 2));
            if (!empty($key)) {
                putenv("$key=$value");
                $_ENV[$key]    = $value;
                $_SERVER[$key] = $value;
            }
        }

        self::$loaded = true;
    }

    public static function get(string $key, string $default = ''): string
    {
        self::load();
        return getenv($key) !== false ? (string) getenv($key) : $default;
    }
}
