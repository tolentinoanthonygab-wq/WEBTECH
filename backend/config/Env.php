<?php
// ============================================================
//  config/Env.php — Loads backend/.env into getenv()
// ============================================================
declare(strict_types=1);

class Env
{
    private static bool $loaded = false;
    private static ?string $loadedFile = null;
    private static array $values = [];

    public static function load(): void
    {
        if (self::$loaded) return;

        $envFile = realpath(__DIR__ . '/../.env') ?: __DIR__ . '/../.env';
        if (!file_exists($envFile)) return;

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            // Skip comments and empty lines
            if ($line === '' || str_starts_with($line, '#')) continue;

            if (!str_contains($line, '=')) continue;

            [$key, $value] = array_map('trim', explode('=', $line, 2));
            if (str_starts_with($key, 'export ')) {
                $key = trim(substr($key, 7));
            }

            if (
                strlen($value) >= 2 &&
                (($value[0] === '"' && $value[strlen($value) - 1] === '"') ||
                 ($value[0] === "'" && $value[strlen($value) - 1] === "'"))
            ) {
                $value = substr($value, 1, -1);
            }

            if (!empty($key)) {
                self::$values[$key] = $value;
                putenv("$key=$value");
                $_ENV[$key]    = $value;
                $_SERVER[$key] = $value;
            }
        }

        self::$loadedFile = $envFile;
        self::$loaded = true;
    }

    public static function get(string $key, string $default = ''): string
    {
        self::load();
        if (array_key_exists($key, self::$values)) {
            return (string) self::$values[$key];
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        return getenv($key) !== false ? (string) getenv($key) : $default;
    }

    public static function loadedFile(): ?string
    {
        self::load();
        return self::$loadedFile;
    }
}
