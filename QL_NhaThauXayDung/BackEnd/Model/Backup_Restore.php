<?php
require_once __DIR__ . '/../Config/Database.php';

class Backup_Restore {
    private $dbInfo;
    private $mysqldumpPath;
    private $mysqlPath;

    public function __construct($mysqldumpPath = null, $mysqlPath = null) {
        $this->dbInfo = [
            'host' => 'localhost',
            'dbname' => 'ql_nhathauxaydung',
            'user' => 'admin',
            'pass' => '123'
        ];

        $this->mysqldumpPath = $mysqldumpPath ?: $this->findExecutable('mysqldump');
        $this->mysqlPath = $mysqlPath ?: $this->findExecutable('mysql');

        if (!$this->mysqldumpPath || !$this->mysqlPath) {
            throw new Exception('Could not find mysqldump or mysql executable. Please specify paths (e.g., C:/xampp/mysql/bin/mysqldump.exe) or ensure they are in system PATH.');
        }
    }

    private function findExecutable($command) {
        $suffix = stripos(PHP_OS, 'WIN') !== false ? '.exe' : '';
        $commandWithSuffix = $command . $suffix;

        $path = exec('where ' . escapeshellarg($commandWithSuffix) . ' 2>&1', $output, $retval);
        
        if ($retval === 0 && $path && file_exists($path)) {
            return realpath($path);
        }

        $envPaths = explode(PATH_SEPARATOR, getenv('PATH'));
        foreach ($envPaths as $envPath) {
            $fullPath = rtrim($envPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $commandWithSuffix;
            if (file_exists($fullPath)) {
                return realpath($fullPath);
            }
        }

        $xamppPath = 'C:/xampp/mysql/bin/' . $commandWithSuffix;
        if (file_exists($xamppPath)) {
            return realpath($xamppPath);
        }

        return null;
    }

    public function backup() {
        $filename = __DIR__ . "/../../backups/backup_" . date("Ymd_His") . ".sql";
        
        $dir = dirname($filename);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        $command = '"' . $this->mysqldumpPath . '" -h ' . escapeshellarg($this->dbInfo['host']) . 
                   ' -u ' . escapeshellarg($this->dbInfo['user']) . 
                   ' -p' . escapeshellarg($this->dbInfo['pass']) . 
                   ' ' . escapeshellarg($this->dbInfo['dbname']) . 
                   ' --default-character-set=utf8mb4 --no-tablespaces --routines --events > ' . escapeshellarg($filename);
        
        exec($command . ' 2>&1', $output, $retval);
        
        if ($retval !== 0) {
            error_log("Backup failed: " . implode("\n", $output));
            return false;
        }
        
        if (!file_exists($filename) || filesize($filename) === 0) {
            error_log("Backup file not created or empty: $filename");
            return false;
        }
        
        return realpath($filename);
    }

 public function restore($filePath, $isUploadedFile = false, $originalFileName = null) {
    try {
        error_log("Restore method called with: filePath=$filePath, isUploadedFile=" . ($isUploadedFile ? 'true' : 'false') . ", originalFileName=$originalFileName");
        
        // For uploaded files, validate the original filename extension
        if ($isUploadedFile && $originalFileName) {
            $extension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));
            if ($extension !== 'sql') {
                error_log("Invalid uploaded file extension: $extension (Original: $originalFileName)");
                return false;
            }
        }
        
        // Clean and normalize file path for cross-platform compatibility (only for non-uploaded files)
        if (!$isUploadedFile) {
            $filePath = str_replace(['\\', '/'], DIRECTORY_SEPARATOR, $filePath);
            $filePath = trim($filePath);
            
            // Platform-specific path handling
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                // Windows path handling
                $filePath = str_replace('/', '\\', $filePath);
                
                // Validate Windows path format
                if (!preg_match('/^([A-Za-z]:|\\\\)/', $filePath)) {
                    error_log("Invalid Windows path format: $filePath");
                    return false;
                }
            } else {
                // Unix/Linux path handling
                $filePath = str_replace('\\', '/', $filePath);
            }
            
            // Validate file extension for file path method
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if ($extension !== 'sql') {
                error_log("Invalid file extension for path method: $extension (Path: $filePath)");
                return false;
            }
        }

        // Check file existence
        if (!file_exists($filePath)) {
            error_log("Restore file not found: $filePath");
            return false;
        }

        // Check file size
        $fileSize = filesize($filePath);
        if ($fileSize === false || $fileSize === 0) {
            error_log("Restore file is empty or unreadable: $filePath");
            return false;
        }

        // Check if file is readable
        if (!is_readable($filePath)) {
            error_log("Restore file is not readable: $filePath");
            return false;
        }

        error_log("Processing restore file: $filePath (Size: $fileSize bytes)");

        // Verify mysql executable
        if (!$this->mysqlPath) {
            error_log("MySQL executable not found. Ensure mysql is in system PATH or specify the path.");
            return false;
        }
        error_log("Using MySQL executable: {$this->mysqlPath}");

        // Test database connection first
        try {
            $dsn = "mysql:host={$this->dbInfo['host']};dbname={$this->dbInfo['dbname']};charset=utf8mb4";
            $pdo = new PDO($dsn, $this->dbInfo['user'], $this->dbInfo['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]);
            error_log("Database connection successful");
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            return false;
        }

        // Clear existing tables with better error handling
        try {
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($tables)) {
                error_log("Found " . count($tables) . " tables to drop");
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
                
                foreach ($tables as $table) {
                    try {
                        $pdo->exec("DROP TABLE IF EXISTS `" . $table . "`");
                        error_log("Dropped table: $table");
                    } catch (PDOException $e) {
                        error_log("Failed to drop table $table: " . $e->getMessage());
                        // Continue with other tables
                    }
                }
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
                error_log("All tables dropped successfully");
            }
        } catch (PDOException $e) {
            error_log("Failed to clear database before restore: " . $e->getMessage());
            return false;
        }

        // Build restore command with proper path escaping
        $host = escapeshellarg($this->dbInfo['host']);
        $user = escapeshellarg($this->dbInfo['user']);
        $pass = $this->dbInfo['pass']; // Don't escape password here
        $dbname = escapeshellarg($this->dbInfo['dbname']);

        // Platform-specific command building
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows command
            $mysqlExe = '"' . $this->mysqlPath . '"';
            $sqlFile = '"' . $filePath . '"';
            $command = "{$mysqlExe} -h {$host} -u {$user} -p\"{$pass}\" {$dbname} < {$sqlFile}";
        } else {
            // Unix/Linux command
            $mysqlExe = escapeshellarg($this->mysqlPath);
            $sqlFile = escapeshellarg($filePath);
            $passEscaped = escapeshellarg($pass);
            $command = "{$mysqlExe} -h {$host} -u {$user} -p{$passEscaped} {$dbname} < {$sqlFile}";
        }
        
        error_log("Executing restore command: " . preg_replace('/(-p)["\']?[^"\'\s]+["\']?/', '$1***', $command));
        
        // Execute command and capture output
        $output = [];
        $retval = 0;
        
        // Set working directory to the directory containing the SQL file
        $oldCwd = getcwd();
        $sqlDir = dirname($filePath);
        if (is_dir($sqlDir)) {
            chdir($sqlDir);
        }
        
        exec($command . ' 2>&1', $output, $retval);
        
        // Restore original working directory
        chdir($oldCwd);
        
        // Log command output
        if (!empty($output)) {
            error_log("Command output: " . implode("\n", $output));
        }
        
        if ($retval !== 0) {
            $errorOutput = implode("\n", $output);
            error_log("Restore command failed (exit code: $retval): $errorOutput");
            return false;
        }

        // Verify restore success
        try {
            $stmt = $pdo->query("SHOW TABLES");
            $tablesAfterRestore = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (empty($tablesAfterRestore)) {
                error_log("No tables found after restore operation");
                return false;
            }
            
            error_log("Restore verification: Found " . count($tablesAfterRestore) . " tables after restore");
            
            // Check if we can select from at least one table
            $firstTable = $tablesAfterRestore[0];
            try {
                $stmt = $pdo->query("SELECT COUNT(*) FROM `$firstTable`");
                $count = $stmt->fetchColumn();
                error_log("Sample table '$firstTable' has $count rows");
            } catch (PDOException $e) {
                error_log("Warning: Could not count rows in $firstTable: " . $e->getMessage());
                // This is not necessarily a failure
            }
            
        } catch (PDOException $e) {
            error_log("Failed to verify database after restore: " . $e->getMessage());
            return false;
        }

        error_log("Restore completed successfully for file: $filePath");
        return true;

    } catch (Exception $e) {
        error_log("Exception in restore method: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        return false;
    } catch (Error $e) {
        error_log("Fatal error in restore method: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        return false;
    }
}
}
?>