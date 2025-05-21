<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/Backup_Restore.php';

$tool = new Backup_Restore();

try {
    $filename = $tool->backup();
    if ($filename) {
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
        header('Content-Length: ' . filesize($filename));
        readfile($filename);
        unlink($filename); // Xóa file sau khi tải về
        exit();
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Sao lưu thất bại']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Lỗi: ' . $e->getMessage()]);
}
?>
