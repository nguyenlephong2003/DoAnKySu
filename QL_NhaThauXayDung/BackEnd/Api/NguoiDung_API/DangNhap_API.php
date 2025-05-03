<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NguoiDung/TaiKhoan.php';
require_once __DIR__ . '/../../Model/NguoiDung/NguoiDungAll.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

use Firebase\JWT\JWT;

// Kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConn();
$taikhoan = new TaiKhoan($db);
$manager = new NguoiDungAll($db);

// Chỉ chấp nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit;
}

// Nhận dữ liệu đăng nhập
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra dữ liệu
if (!isset($data->MaNhanVien, $data->MatKhau)) {
    echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
    http_response_code(400);
    exit;
}

// Tìm tài khoản của nhân viên
$taikhoan->MaNhanVien = $data->MaNhanVien;
$taiKhoanStmt = $taikhoan->getByNhanVien();
$taiKhoanInfo = $taiKhoanStmt->fetch(PDO::FETCH_ASSOC);

if (!$taiKhoanInfo) {
    echo json_encode(["message" => "Nhân viên không có tài khoản"]);
    http_response_code(401);
    exit;
}

// Thiết lập thông tin tài khoản
$taikhoan->MaTaiKhoan = $taiKhoanInfo['MaTaiKhoan'];
$taikhoan->MatKhau = $data->MatKhau;

// Thực hiện đăng nhập
$result = $taikhoan->login();
if ($result) {
    // Loại bỏ mật khẩu trong kết quả trả về
    unset($result['MatKhau']);
    
    // Lấy thông tin nhân viên
    $nhanVienStmt = $manager->getNhanVienById($result['MaNhanVien']);
    $nhanVien = $nhanVienStmt->fetch(PDO::FETCH_ASSOC);
    
    // Lấy thông tin loại nhân viên
    $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
    $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
    
    // Thêm thông tin vào nhân viên
    $nhanVien['loainhanvien'] = [
        $loaiNhanVien
    ];
    
    $nhanVien['taikhoan'] = [
        [
            'MaTaiKhoan' => $result['MaTaiKhoan'],
            'MaNhanVien' => $result['MaNhanVien'],
            'TenNhanVien' => $result['TenNhanVien']
        ]
    ];
    
    // Tạo JWT
    $secretKey = "your_secret_key_nhathau_xaydung_2024"; // Thay đổi thành khóa bí mật của bạn
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; // JWT tồn tại trong 1 giờ (3600 giây)
    $payload = [
        'iat' => $issuedAt,          // Thời gian tạo token
        'exp' => $expirationTime,     // Thời gian hết hạn token
        'data' => [
            'MaTaiKhoan' => $result['MaTaiKhoan'],
            'MaNhanVien' => $result['MaNhanVien'],
            'TenNhanVien' => $result['TenNhanVien'],
            'MaLoaiNhanVien' => $nhanVien['MaLoaiNhanVien']
        ]
    ];
    
    $jwt = JWT::encode($payload, $secretKey, 'HS256');
    
    echo json_encode([
        "message" => "success",
        "token" => $jwt,
        "expires" => $expirationTime,
        "nhanvien" => [$nhanVien]
    ]);
} else {
    echo json_encode(["message" => "Mã nhân viên hoặc mật khẩu không đúng"]);
    http_response_code(401);
}
?>