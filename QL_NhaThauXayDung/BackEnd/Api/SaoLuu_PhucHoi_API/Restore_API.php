<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Check if required files exist
    if (!file_exists(__DIR__ . '/../../Config/Database.php')) {
        throw new Exception('Database config file not found');
    }
    if (!file_exists(__DIR__ . '/../../Model/Backup_Restore.php')) {
        throw new Exception('Backup_Restore model file not found');
    }

    require_once __DIR__ . '/../../Config/Database.php';
    require_once __DIR__ . '/../../Model/Backup_Restore.php';

    // Initialize Backup_Restore with error handling
    if (!class_exists('Backup_Restore')) {
        throw new Exception('Backup_Restore class not found');
    }
    
    $tool = new Backup_Restore();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method. Please use POST.');
    }

    // Check if file is uploaded via form-data
    if (!isset($_FILES['sql_file'])) {
        throw new Exception('No SQL file uploaded. Please upload a .sql file.');
    }

    if ($_FILES['sql_file']['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'File too large (exceeds upload_max_filesize)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (exceeds MAX_FILE_SIZE)',
            UPLOAD_ERR_PARTIAL => 'File upload incomplete',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        $error = $uploadErrors[$_FILES['sql_file']['error']] ?? 'Unknown upload error';
        throw new Exception($error);
    }

    $filePath = $_FILES['sql_file']['tmp_name'];
    $originalFileName = $_FILES['sql_file']['name'];
    $fileSize = $_FILES['sql_file']['size'];

    error_log("Uploaded SQL file received: $filePath (Original: $originalFileName, Size: $fileSize bytes)");

    // Validate file extension
    $extension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));
    if ($extension !== 'sql') {
        throw new Exception("Uploaded file is not a valid SQL file. Extension: $extension (File: $originalFileName)");
    }

    // Check file size
    if ($fileSize === 0) {
        throw new Exception("SQL file is empty: $originalFileName");
    }

    // Check if file is readable
    if (!is_readable($filePath)) {
        throw new Exception("SQL file is not readable: $filePath");
    }

    // Log file info for debugging
    error_log("Processing uploaded file: $originalFileName (Size: $fileSize bytes)");
    
    // Log first 500 bytes of file content for debugging
    $content = file_get_contents($filePath, false, null, 0, 500);
    if ($content === false) {
        throw new Exception("Cannot read SQL file content: $filePath");
    }
    error_log("SQL file content (first 500 bytes): " . substr($content, 0, 500));

    // Perform restore
    $result = $tool->restore($filePath, true, $originalFileName);
    
    if ($result === true) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success', 
            'message' => "Database restore completed successfully from file: $originalFileName"
        ]);
    } else {
        throw new Exception('Restore operation failed. Check server error logs for details.');
    }

} catch (Exception $e) {
    http_response_code(500);
    $errorMessage = 'Error: ' . $e->getMessage();
    error_log("Restore API Error: $errorMessage");
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'status' => 'error', 
        'message' => $errorMessage,
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} catch (Error $e) {
    http_response_code(500);
    $errorMessage = 'Fatal Error: ' . $e->getMessage();
    error_log("Restore API Fatal Error: $errorMessage");
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'status' => 'error', 
        'message' => $errorMessage,
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>