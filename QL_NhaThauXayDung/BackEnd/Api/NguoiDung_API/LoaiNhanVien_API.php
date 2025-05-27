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
require_once __DIR__ . '/../../Model/LoaiNhanVien.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

// Kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConn();
$loainhanvien = new LoaiNhanVien($db);
$verifyToken = new VerifyToken();

// Lấy phương thức HTTP và tham số `action`
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
                $stmt = $loainhanvien->getAll();
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
            $loainhanvien->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? $_GET['MaLoaiNhanVien'] : null;
            if ($loainhanvien->MaLoaiNhanVien) {
                try {
                    $stmt = $loainhanvien->getById();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
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
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiNhanVien"
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
                    'message' => "Tên loại nhân viên không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->TenLoai = $data->TenLoai;

            try {
                if ($loainhanvien->add()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại nhân viên đã được thêm thành công",
                        'data' => [
                            "MaLoaiNhanVien" => $loainhanvien->MaLoaiNhanVien,
                            "TenLoai" => $loainhanvien->TenLoai
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm loại nhân viên thất bại"
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
            if (!isset($data->MaLoaiNhanVien, $data->TenLoai) || empty(trim($data->TenLoai))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;
            $loainhanvien->TenLoai = $data->TenLoai;

            try {
                if ($loainhanvien->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại nhân viên đã được cập nhật",
                        'data' => [
                            "MaLoaiNhanVien" => $loainhanvien->MaLoaiNhanVien,
                            "TenLoai" => $loainhanvien->TenLoai
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật loại nhân viên thất bại"
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
            if (!isset($data->MaLoaiNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiNhanVien"
                ]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;

            try {
                if ($loainhanvien->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại nhân viên đã được xóa thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa loại nhân viên thất bại"
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