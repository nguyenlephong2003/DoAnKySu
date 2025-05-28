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
require_once __DIR__ . '/../../Model/ChiTietDeXuat.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$chitietdexuat = new ChiTietDeXuat($db);
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
        if ($action === 'GET_BY_DEXUAT') {
            $chitietdexuat->MaDeXuat = $_GET['MaDeXuat'] ?? null;
            if ($chitietdexuat->MaDeXuat) {
                $stmt = $chitietdexuat->readByDeXuat();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Thiếu MaDeXuat']);
                http_response_code(400);
            }
        } elseif ($action === 'GET_BY_ID') {
            $chitietdexuat->MaChiTietDeXuat = $_GET['MaChiTietDeXuat'] ?? null;
            if ($chitietdexuat->MaChiTietDeXuat) {
                $data = $chitietdexuat->readSingle();
                echo json_encode(['status' => 'success', 'data' => $data]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Thiếu MaChiTietDeXuat']);
                http_response_code(400);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Action không hợp lệ']);
            http_response_code(400);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaDeXuat, $data->MaThietBiVatTu, $data->SoLuong, $data->DonGia, $data->MaNhaCungCap)) {
            echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không đầy đủ']);
            http_response_code(400);
            exit;
        }
        $chitietdexuat->MaDeXuat = $data->MaDeXuat;
        $chitietdexuat->MaThietBiVatTu = $data->MaThietBiVatTu;
        $chitietdexuat->SoLuong = $data->SoLuong;
        $chitietdexuat->DonGia = $data->DonGia;
        $chitietdexuat->MaNhaCungCap = $data->MaNhaCungCap;
        if ($chitietdexuat->create()) {
            echo json_encode(['status' => 'success', 'message' => 'Tạo chi tiết đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Tạo chi tiết đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaChiTietDeXuat)) {
            echo json_encode(['status' => 'error', 'message' => 'Thiếu MaChiTietDeXuat']);
            http_response_code(400);
            exit;
        }
        $chitietdexuat->MaChiTietDeXuat = $data->MaChiTietDeXuat;
        $chitietdexuat->MaDeXuat = $data->MaDeXuat ?? null;
        $chitietdexuat->MaThietBiVatTu = $data->MaThietBiVatTu ?? null;
        $chitietdexuat->SoLuong = $data->SoLuong ?? null;
        $chitietdexuat->DonGia = $data->DonGia ?? null;
        $chitietdexuat->MaNhaCungCap = $data->MaNhaCungCap ?? null;
        if ($chitietdexuat->update()) {
            echo json_encode(['status' => 'success', 'message' => 'Cập nhật chi tiết đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Cập nhật chi tiết đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->MaChiTietDeXuat)) {
            echo json_encode(['status' => 'error', 'message' => 'Thiếu MaChiTietDeXuat']);
            http_response_code(400);
            exit;
        }
        $chitietdexuat->MaChiTietDeXuat = $data->MaChiTietDeXuat;
        if ($chitietdexuat->delete()) {
            echo json_encode(['status' => 'success', 'message' => 'Xóa chi tiết đề xuất thành công']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Xóa chi tiết đề xuất thất bại']);
            http_response_code(500);
        }
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Phương thức không được hỗ trợ']);
        http_response_code(405);
        break;
}
