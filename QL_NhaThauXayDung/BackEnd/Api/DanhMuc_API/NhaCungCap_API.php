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
require_once __DIR__ . '/../../Model/NhaCungCap.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$nhacungcap = new NhaCungCap($db);
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

// Tiếp tục xử lý nếu token hợp lệ
switch ($method) {
    case 'GET':
        if ($action === "GET") {
            try {
                $stmt = $nhacungcap->read();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else if ($action === "GET_EQUIPMENT_TYPES") {
            try {
                $stmt = $nhacungcap->getAllEquipmentTypes();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy danh sách loại thiết bị: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else if ($action === "GET_BY_EQUIPMENT_TYPE") {
            $maLoaiThietBiVatTu = isset($_GET['maLoaiThietBiVatTu']) ? $_GET['maLoaiThietBiVatTu'] : null;
            
            if (!$maLoaiThietBiVatTu) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Thiếu mã loại thiết bị vật tư'
                ]);
                http_response_code(400);
                exit;
            }

            try {
                $stmt = $nhacungcap->getSuppliersByEquipmentType($maLoaiThietBiVatTu);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy danh sách nhà cung cấp: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else if ($action === "GET_EQUIPMENT_BY_SUPPLIER") {
            $maNhaCungCap = isset($_GET['maNhaCungCap']) ? $_GET['maNhaCungCap'] : null;
            
            if (!$maNhaCungCap) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Thiếu mã nhà cung cấp'
                ]);
                http_response_code(400);
                exit;
            }

            try {
                $nhacungcap->MaNhaCungCap = $maNhaCungCap;
                $stmt = $nhacungcap->getSuppliedEquipment();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy danh sách thiết bị: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ"
            ]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->TenNhaCungCap) || empty(trim($data->TenNhaCungCap))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên nhà cung cấp không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            $nhacungcap->TenNhaCungCap = $data->TenNhaCungCap;
            $nhacungcap->SoDT = $data->SoDT ?? '';
            $nhacungcap->Email = $data->Email ?? '';
            $nhacungcap->DiaChi = $data->DiaChi ?? '';
            $nhacungcap->LoaiHinhCungCap = $data->LoaiHinhCungCap ?? '';

            try {
                if ($nhacungcap->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhà cung cấp đã được thêm thành công",
                        'data' => [
                            "MaNhaCungCap" => $nhacungcap->MaNhaCungCap,
                            "TenNhaCungCap" => $nhacungcap->TenNhaCungCap,
                            "SoDT" => $nhacungcap->SoDT,
                            "Email" => $nhacungcap->Email,
                            "DiaChi" => $nhacungcap->DiaChi,
                            "LoaiHinhCungCap" => $nhacungcap->LoaiHinhCungCap
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm nhà cung cấp thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi thêm dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức POST"
            ]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaNhaCungCap, $data->TenNhaCungCap) || empty(trim($data->TenNhaCungCap))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            $nhacungcap->MaNhaCungCap = $data->MaNhaCungCap;
            $nhacungcap->TenNhaCungCap = $data->TenNhaCungCap;
            $nhacungcap->SoDT = $data->SoDT ?? '';
            $nhacungcap->Email = $data->Email ?? '';
            $nhacungcap->DiaChi = $data->DiaChi ?? '';
            $nhacungcap->LoaiHinhCungCap = $data->LoaiHinhCungCap ?? '';

            try {
                if ($nhacungcap->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhà cung cấp đã được cập nhật",
                        'data' => [
                            "MaNhaCungCap" => $nhacungcap->MaNhaCungCap,
                            "TenNhaCungCap" => $nhacungcap->TenNhaCungCap,
                            "SoDT" => $nhacungcap->SoDT,
                            "Email" => $nhacungcap->Email,
                            "DiaChi" => $nhacungcap->DiaChi,
                            "LoaiHinhCungCap" => $nhacungcap->LoaiHinhCungCap
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật nhà cung cấp thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi cập nhật dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức PUT"
            ]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        if ($action === "DELETE") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaNhaCungCap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaNhaCungCap"
                ]);
                http_response_code(400);
                exit;
            }

            $nhacungcap->MaNhaCungCap = $data->MaNhaCungCap;

            try {
                if ($nhacungcap->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhà cung cấp đã được xóa thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa nhà cung cấp thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi xóa dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức DELETE"
            ]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode([
            'status' => 'error',
            'message' => "Phương thức không được hỗ trợ"
        ]);
        http_response_code(405);
        break;
} 