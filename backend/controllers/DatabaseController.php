<?php
// ============================================================
//  controllers/DatabaseController.php
//  Handles database backup (export) and restore (import)
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../config/Env.php';
require_once __DIR__ . '/../config/Database.php';

class DatabaseController
{
    private string $host;
    private string $port;
    private string $name;
    private string $user;
    private string $pass;

    public function __construct()
    {
        Env::load();
        $this->host = Env::get('DB_HOST', 'localhost');
        $this->port = Env::get('DB_PORT', '5432');
        $this->name = Env::get('DB_NAME', 'welaund');
        $this->user = Env::get('DB_USER', 'postgres');
        $this->pass = Env::get('DB_PASS', 'postgres');
    }

    /**
     * Generate a SQL backup file and return the path or content.
     */
    public function backup(): array
    {
        $backupDir = __DIR__ . '/../database/backups';
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0777, true);
        }

        $filename = 'welaund_backup_' . date('Y-m-d_H-i-s') . '.sql';
        $filePath = $backupDir . '/' . $filename;

        // Use PGPASSWORD env var to avoid password prompt
        putenv("PGPASSWORD=" . $this->pass);

        // Command for pg_dump
        // --clean: Drop database objects before creating them
        // --if-exists: Use IF EXISTS when dropping objects
        $command = sprintf(
            'pg_dump -h %s -p %s -U %s --clean --if-exists %s > %s 2>&1',
            escapeshellarg($this->host),
            escapeshellarg($this->port),
            escapeshellarg($this->user),
            escapeshellarg($this->name),
            escapeshellarg($filePath)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        putenv("PGPASSWORD"); // Clear password from env

        if ($returnVar !== 0) {
            return [
                'success' => false,
                'message' => 'Backup failed: ' . implode("\n", $output),
            ];
        }

        return [
            'success' => true,
            'message' => 'Backup created successfully.',
            'file_path' => $filePath,
            'filename' => $filename,
        ];
    }

    /**
     * Restore database from a SQL file.
     */
    public function restore(string $filePath): array
    {
        if (!file_exists($filePath)) {
            return [
                'success' => false,
                'message' => 'Backup file not found.',
            ];
        }

        putenv("PGPASSWORD=" . $this->pass);

        // Command for psql to restore
        $command = sprintf(
            'psql -h %s -p %s -U %s %s < %s 2>&1',
            escapeshellarg($this->host),
            escapeshellarg($this->port),
            escapeshellarg($this->user),
            escapeshellarg($this->name),
            escapeshellarg($filePath)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        putenv("PGPASSWORD"); // Clear password from env

        if ($returnVar !== 0) {
            return [
                'success' => false,
                'message' => 'Restore failed: ' . implode("\n", $output),
            ];
        }

        return [
            'success' => true,
            'message' => 'Database restored successfully.',
        ];
    }

    /**
     * List all available backups.
     */
    public function listBackups(): array
    {
        $backupDir = __DIR__ . '/../database/backups';
        if (!is_dir($backupDir)) {
            return [];
        }

        $files = glob($backupDir . '/*.sql');
        $backups = [];
        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'size' => filesize($file),
                'created_at' => date('Y-m-d H:i:s', filemtime($file)),
            ];
        }

        // Sort by date descending
        usort($backups, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return $backups;
    }
}
