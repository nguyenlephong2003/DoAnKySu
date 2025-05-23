<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400"); // 24 hours
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NhaCungCap.php';

$database = new Database();
$db = $database->getConn();
$nhacungcap = new NhaCungCap($db);

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

    default:
        echo json_encode([
            'status' => 'error',
            'message' => "Phương thức không được hỗ trợ"
        ]);
        http_response_code(405);
        break;
} 