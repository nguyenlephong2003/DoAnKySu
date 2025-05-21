<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/Backup_Restore.php';

$tool = new Backup_Restore();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['sql_file'])) {
    $file = $_FILES['sql_file']['tmp_name'];
    try {
        if ($tool->restore($file)) {
            http_response_code(200);
            echo json_encode(['message' => 'Phục hồi thành công']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Phục hồi thất bại']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Lỗi: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Vui lòng tải lên file SQL']);
}
?>
