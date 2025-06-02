<?php
// CORS headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173"); // Thay đổi thành domain của frontend
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Debug: Log request information
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request Headers: " . json_encode(getallheaders()));
error_log("Cookies: " . json_encode($_COOKIE));

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NguoiDungAll.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Kiểm tra phương thức
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Kiểm tra token trong cookie
if (!isset($_COOKIE['auth_token'])) {
    echo json_encode([
        "message" => "Unauthorized",
        "error" => "No token found in cookie"
    ]);
    http_response_code(401);
    exit;
}

try {
    $token = $_COOKIE['auth_token'];
    $secretKey = "your_secret_key_nhathau_xaydung_2024";

    // Verify token
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    
    // Kiểm tra token hết hạn
    if ($decoded->exp < time()) {
        echo json_encode([
            "message" => "Token expired",
            "error" => "Token has expired"
        ]);
        http_response_code(401);
        exit;
    }

    // Kiểm tra session ID
    $database = new Database();
    $db = $database->getConn();
    
    $checkSessionQuery = "SELECT SessionID FROM taikhoan WHERE MaTaiKhoan = :maTaiKhoan";
    $stmt = $db->prepare($checkSessionQuery);
    $stmt->execute([':maTaiKhoan' => $decoded->data->MaTaiKhoan]);
    $currentSession = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentSession || $currentSession['SessionID'] !== $decoded->data->SessionID) {
        echo json_encode([
            "message" => "Session invalid",
            "error" => "This session has been invalidated by a new login"
        ]);
        http_response_code(401);
        exit;
    }

    // Lấy thông tin nhân viên từ database
    $manager = new NguoiDungAll($db);
    $nhanVienStmt = $manager->getNhanVienById($decoded->data->MaNhanVien);
    $nhanVien = $nhanVienStmt->fetch(PDO::FETCH_ASSOC);

    if (!$nhanVien) {
        echo json_encode([
            "message" => "User not found",
            "error" => "No user found with ID: " . $decoded->data->MaNhanVien
        ]);
        http_response_code(401);
        exit;
    }

    // Lấy thông tin loại nhân viên
    $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
    $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);

    // Thêm thông tin loại nhân viên vào response
    $nhanVien['loainhanvien'] = [$loaiNhanVien];

    echo json_encode([
        "message" => "success",
        "nhanvien" => [$nhanVien]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "message" => "Invalid token",
        "error" => $e->getMessage()
    ]);
    http_response_code(401);
    exit;
}
?> 