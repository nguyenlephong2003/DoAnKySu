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
require_once __DIR__ . '/../../Model/LoaiCongTrinh.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$loaicongtrinh = new LoaiCongTrinh($db);
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
        if ($action === "GET" || $action === "GET_ALL") {
            try {
                $stmt = $loaicongtrinh->readAll();
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
            $loaicongtrinh->MaLoaiCongTrinh = isset($_GET['MaLoaiCongTrinh']) ? $_GET['MaLoaiCongTrinh'] : null;
            
            if ($loaicongtrinh->MaLoaiCongTrinh) {
                try {
                    $loaicongtrinh->readSingle();
                    
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaLoaiCongTrinh' => $loaicongtrinh->MaLoaiCongTrinh,
                            'TenLoaiCongTrinh' => $loaicongtrinh->TenLoaiCongTrinh
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
                    'message' => "Thiếu MaLoaiCongTrinh"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "search") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            
            try {
                $stmt = $loaicongtrinh->search($keywords);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi tìm kiếm: ' . $e->getMessage()
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
            
            if (!isset($data->TenLoaiCongTrinh) || empty(trim($data->TenLoaiCongTrinh))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên loại công trình không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            $loaicongtrinh->TenLoaiCongTrinh = $data->TenLoaiCongTrinh;

            try {
                if ($loaicongtrinh->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại công trình đã được thêm thành công",
                        'data' => [
                            "MaLoaiCongTrinh" => $loaicongtrinh->MaLoaiCongTrinh,
                            "TenLoaiCongTrinh" => $loaicongtrinh->TenLoaiCongTrinh
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm loại công trình thất bại"
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
            
            if (!isset($data->MaLoaiCongTrinh, $data->TenLoaiCongTrinh) || empty(trim($data->TenLoaiCongTrinh))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            $loaicongtrinh->MaLoaiCongTrinh = $data->MaLoaiCongTrinh;
            $loaicongtrinh->TenLoaiCongTrinh = $data->TenLoaiCongTrinh;

            try {
                if ($loaicongtrinh->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại công trình đã được cập nhật",
                        'data' => [
                            "MaLoaiCongTrinh" => $loaicongtrinh->MaLoaiCongTrinh,
                            "TenLoaiCongTrinh" => $loaicongtrinh->TenLoaiCongTrinh
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật loại công trình thất bại"
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
            
            if (!isset($data->MaLoaiCongTrinh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiCongTrinh"
                ]);
                http_response_code(400);
                exit;
            }

            $loaicongtrinh->MaLoaiCongTrinh = $data->MaLoaiCongTrinh;

            try {
                if ($loaicongtrinh->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại công trình đã được xóa"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa loại công trình thất bại"
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
?> 