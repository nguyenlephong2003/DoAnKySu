<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/ChiTietDeXuat.php';

$database = new Database();
$db = $database->getConn();
$ctdx = new ChiTietDeXuat($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

switch ($method) {
    case 'GET':
        if ($action === 'GET_BY_DEXUAT') {
            $ctdx->MaDeXuat = $_GET['MaDeXuat'] ?? null;
            if ($ctdx->MaDeXuat) {
                $stmt = $ctdx->readByDeXuat();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Thiếu MaDeXuat']);
                http_response_code(400);
            }
        } elseif ($action === 'GET_BY_ID') {
            $ctdx->MaChiTietDeXuat = $_GET['MaChiTietDeXuat'] ?? null;
            if ($ctdx->MaChiTietDeXuat) {
                $data = $ctdx->readSingle();
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
        $ctdx->MaDeXuat = $data->MaDeXuat;
        $ctdx->MaThietBiVatTu = $data->MaThietBiVatTu;
        $ctdx->SoLuong = $data->SoLuong;
        $ctdx->DonGia = $data->DonGia;
        $ctdx->MaNhaCungCap = $data->MaNhaCungCap;
        if ($ctdx->create()) {
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
        $ctdx->MaChiTietDeXuat = $data->MaChiTietDeXuat;
        $ctdx->MaDeXuat = $data->MaDeXuat ?? null;
        $ctdx->MaThietBiVatTu = $data->MaThietBiVatTu ?? null;
        $ctdx->SoLuong = $data->SoLuong ?? null;
        $ctdx->DonGia = $data->DonGia ?? null;
        $ctdx->MaNhaCungCap = $data->MaNhaCungCap ?? null;
        if ($ctdx->update()) {
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
        $ctdx->MaChiTietDeXuat = $data->MaChiTietDeXuat;
        if ($ctdx->delete()) {
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
