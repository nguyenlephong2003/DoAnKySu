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

// Regular request headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/LoaiBaoGia.php';

$database = new Database();
$db = $database->getConn();
$loaibaogiao = new LoaiBaoGia($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode(["message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

switch ($method) {
    case 'GET':
        if ($action === "GET") {
            try {
                $stmt = $loaibaogiao->readAll();
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
        } elseif ($action === "getById") {
            $loaibaogiao->MaLoai = isset($_GET['MaLoai']) ? $_GET['MaLoai'] : null;
            
            if ($loaibaogiao->MaLoai) {
                try {
                    $loaibaogiao->readSingle();
                    
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaLoai' => $loaibaogiao->MaLoai,
                            'TenLoai' => $loaibaogiao->TenLoai
                        ]
                    ]);
                } catch (Exception $e) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
                    ]);
                    http_response_code(500);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoai"
                ]);
                http_response_code(400);
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
            
            if (!isset($data->TenLoai) || empty(trim($data->TenLoai))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên loại báo giá không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra trùng tên
            if ($loaibaogiao->isNameExists($data->TenLoai)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên loại báo giá đã tồn tại"
                ]);
                http_response_code(400);
                exit;
            }

            $loaibaogiao->TenLoai = $data->TenLoai;

            try {
                if ($loaibaogiao->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại báo giá đã được thêm thành công",
                        'data' => [
                            "MaLoai" => $loaibaogiao->MaLoai,
                            "TenLoai" => $loaibaogiao->TenLoai
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm loại báo giá thất bại"
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
            
            if (!isset($data->MaLoai, $data->TenLoai) || empty(trim($data->TenLoai))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra tồn tại
            $loaibaogiao->MaLoai = $data->MaLoai;
            if (!$loaibaogiao->exists()) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Loại báo giá không tồn tại"
                ]);
                http_response_code(404);
                exit;
            }

            // Kiểm tra trùng tên (trừ chính nó)
            if ($loaibaogiao->isNameExists($data->TenLoai) && $data->TenLoai !== $loaibaogiao->TenLoai) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên loại báo giá đã tồn tại"
                ]);
                http_response_code(400);
                exit;
            }

            $loaibaogiao->TenLoai = $data->TenLoai;

            try {
                if ($loaibaogiao->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại báo giá đã được cập nhật",
                        'data' => [
                            "MaLoai" => $loaibaogiao->MaLoai,
                            "TenLoai" => $loaibaogiao->TenLoai
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật loại báo giá thất bại"
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
            if (!isset($data->MaLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loaibaogiao->MaLoai = $data->MaLoai;

            if ($loaibaogiao->delete()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Loại báo giá đã được xóa thành công"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Xóa loại báo giá thất bại"
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức DELETE"]);
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
?>