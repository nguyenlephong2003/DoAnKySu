<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // 24 hours
    http_response_code(200);
    exit();
}

// Regular request headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/DeXuat.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$dexuat = new DeXuat($db);
$verifyToken = new VerifyToken();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode([
        'status' => 'error',
        'message' => "Yêu cầu không hợp lệ: thiếu tham số action"
    ]);
    http_response_code(400);
    exit;
}

// Xác thực token
$tokenValidation = $verifyToken->validate();
if (!$tokenValidation['valid']) {
    echo json_encode([
        'status' => 'error',
        'message' => $tokenValidation['message']
    ]);
    http_response_code(401);
    exit;
}

switch ($method) {
    case 'GET':
        if ($action === 'GET_ALL') {
            $stmt = $dexuat->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status' => 'success', 'data' => $result]);
        } elseif ($action === 'GET_BY_ID') {
            $dexuat->MaDeXuat = $_GET['MaDeXuat'] ?? null;
            if ($dexuat->MaDeXuat) {
                $data = $dexuat->readSingle();
                echo json_encode(['status' => 'success', 'data' => $data]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Thiếu MaDeXuat']);
                http_response_code(400);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Action không hợp lệ']);
            http_response_code(400);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaDeXuat, $data->NgayLap, $data->NgayGiaoDuKien, $data->MaNhanVien, $data->LoaiDeXuat, $data->TrangThai)) {
            echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không đầy đủ']);
            http_response_code(400);
            exit;
        }
        $dexuat->MaDeXuat = $data->MaDeXuat;
        $dexuat->NgayLap = $data->NgayLap;
        $dexuat->NgayGiaoDuKien = $data->NgayGiaoDuKien;
        $dexuat->MaNhanVien = $data->MaNhanVien;
        $dexuat->LoaiDeXuat = $data->LoaiDeXuat;
        $dexuat->TrangThai = $data->TrangThai;
        $dexuat->GhiChu = $data->GhiChu ?? null;
        if ($dexuat->create()) {
            echo json_encode(['status' => 'success', 'message' => 'Tạo đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Tạo đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaDeXuat)) {
            echo json_encode(['status' => 'error', 'message' => 'Thiếu MaDeXuat']);
            http_response_code(400);
            exit;
        }
        $dexuat->MaDeXuat = $data->MaDeXuat;
        $dexuat->NgayLap = $data->NgayLap ?? null;
        $dexuat->NgayGiaoDuKien = $data->NgayGiaoDuKien ?? null;
        $dexuat->MaNhanVien = $data->MaNhanVien ?? null;
        $dexuat->LoaiDeXuat = $data->LoaiDeXuat ?? null;
        $dexuat->TrangThai = $data->TrangThai ?? null;
        $dexuat->GhiChu = $data->GhiChu ?? null;
        if ($dexuat->update()) {
            echo json_encode(['status' => 'success', 'message' => 'Cập nhật đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Cập nhật đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaDeXuat)) {
            echo json_encode(['status' => 'error', 'message' => 'Thiếu MaDeXuat']);
            http_response_code(400);
            exit;
        }
        $dexuat->MaDeXuat = $data->MaDeXuat;
        if ($dexuat->delete()) {
            echo json_encode(['status' => 'success', 'message' => 'Xóa đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Xóa đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Phương thức không được hỗ trợ']);
        http_response_code(405);
        break;
}
