<?php
require_once __DIR__ . '/../Config/Database.php';

class Backup_Restore {
    private $dbInfo;

    public function __construct() {
        $this->dbInfo = [
            'host' => 'localhost',
            'dbname' => 'ql_nhathauxaydung',
            'user' => 'admin',
            'pass' => '123'
        ];
    }

   public function backup() {
    $filename = __DIR__ . "/../../backups/backup_" . date("Ymd_His") . ".sql";
    
    // Đảm bảo thư mục tồn tại
    $dir = dirname($filename);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // Sử dụng đường dẫn đầy đủ đến mysqldump trong Ampps
    $mysqldump = 'D:/PHP/Ampps/mysql/bin/mysqldump';
    $command = '"' . $mysqldump . '" -h ' . escapeshellarg($this->dbInfo['host']) . 
               ' -u ' . escapeshellarg($this->dbInfo['user']) . 
               ' -p' . escapeshellarg($this->dbInfo['pass']) . 
               ' ' . escapeshellarg($this->dbInfo['dbname']) . 
               ' > ' . escapeshellarg($filename);
    
    exec($command, $output, $retval);
    
    if ($retval !== 0) {
        error_log("Backup failed: " . implode("\n", $output));
        return false;
    }
    
    if (!file_exists($filename)) {
        error_log("Backup file not created: $filename");
        return false;
    }
    
    return $filename;
}

 public function restore($filePath) {
    if (!file_exists($filePath)) {
        error_log("Restore file not found: $filePath");
        return false;
    }

    // Sử dụng đường dẫn đầy đủ đến mysql trong Ampps
    $mysql = 'D:/PHP/Ampps/mysql/bin/mysql';
    $command = '"' . $mysql . '" -h ' . escapeshellarg($this->dbInfo['host']) . 
               ' -u ' . escapeshellarg($this->dbInfo['user']) . 
               ' -p' . escapeshellarg($this->dbInfo['pass']) . 
               ' ' . escapeshellarg($this->dbInfo['dbname']) . 
               ' < ' . escapeshellarg($filePath);
    
    exec($command, $output, $retval);
    
    if ($retval !== 0) {
        error_log("Restore failed: " . implode("\n", $output));
        return false;
    }
    
    return true;
}
}
?>
