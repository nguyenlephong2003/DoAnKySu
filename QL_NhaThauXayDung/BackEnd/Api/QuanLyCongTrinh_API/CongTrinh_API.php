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
require_once __DIR__ . '/../../Model/CongTrinh.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$congtrinh = new CongTrinh($db);
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
        if ($action === "GET") {
            try {
                $stmt = $congtrinh->readAll();
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
            $congtrinh->MaCongTrinh = isset($_GET['MaCongTrinh']) ? $_GET['MaCongTrinh'] : null;
            if ($congtrinh->MaCongTrinh) {
                try {
                    $congtrinh->readSingle();
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaCongTrinh' => $congtrinh->MaCongTrinh,
                            'TenCongTrinh' => $congtrinh->TenCongTrinh,
                            'Dientich' => $congtrinh->Dientich,
                            'FileThietKe' => $congtrinh->FileThietKe,
                            'MaKhachHang' => $congtrinh->MaKhachHang,
                            'MaHopDong' => $congtrinh->MaHopDong,
                            'MaLoaiCongTrinh' => $congtrinh->MaLoaiCongTrinh,
                            'NgayDuKienHoanThanh' => $congtrinh->NgayDuKienHoanThanh
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
                    'message' => "Thiếu MaCongTrinh"
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
            if (!isset($data->MaCongTrinh, $data->TenCongTrinh, $data->Dientich, $data->FileThietKe, $data->MaKhachHang, $data->MaHopDong, $data->MaLoaiCongTrinh, $data->NgayDuKienHoanThanh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $congtrinh->MaCongTrinh = $data->MaCongTrinh;
            $congtrinh->TenCongTrinh = $data->TenCongTrinh;
            $congtrinh->Dientich = $data->Dientich;
            $congtrinh->FileThietKe = $data->FileThietKe;
            $congtrinh->MaKhachHang = $data->MaKhachHang;
            $congtrinh->MaHopDong = $data->MaHopDong;
            $congtrinh->MaLoaiCongTrinh = $data->MaLoaiCongTrinh;
            $congtrinh->NgayDuKienHoanThanh = $data->NgayDuKienHoanThanh;
            try {
                if ($congtrinh->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Công trình đã được thêm thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm công trình thất bại"
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
            if (!isset($data->MaCongTrinh, $data->TenCongTrinh, $data->Dientich, $data->FileThietKe, $data->MaKhachHang, $data->MaHopDong, $data->MaLoaiCongTrinh, $data->NgayDuKienHoanThanh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }
            $congtrinh->MaCongTrinh = $data->MaCongTrinh;
            $congtrinh->TenCongTrinh = $data->TenCongTrinh;
            $congtrinh->Dientich = $data->Dientich;
            $congtrinh->FileThietKe = $data->FileThietKe;
            $congtrinh->MaKhachHang = $data->MaKhachHang;
            $congtrinh->MaHopDong = $data->MaHopDong;
            $congtrinh->MaLoaiCongTrinh = $data->MaLoaiCongTrinh;
            $congtrinh->NgayDuKienHoanThanh = $data->NgayDuKienHoanThanh;
            try {
                if ($congtrinh->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Công trình đã được cập nhật"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật công trình thất bại"
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
            if (!isset($data->MaCongTrinh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaCongTrinh"
                ]);
                http_response_code(400);
                exit;
            }
            $congtrinh->MaCongTrinh = $data->MaCongTrinh;
            try {
                if ($congtrinh->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Công trình đã được xóa"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa công trình thất bại"
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