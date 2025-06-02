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
require_once __DIR__ . '/../../Model/NhanVien.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$nhanvien = new NhanVien($db);
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
                $stmt = $nhanvien->getAll();
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
            $nhanvien->MaNhanVien = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($nhanvien->MaNhanVien) {
                try {
                    $stmt = $nhanvien->getById();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($result) {
                        echo json_encode([
                            'status' => 'success',
                            'data' => $result
                        ]);
                    } else {
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Không tìm thấy nhân viên với mã ' . $nhanvien->MaNhanVien
                        ]);
                        http_response_code(404);
                    }
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
                    'message' => "Thiếu MaNhanVien"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getByLoaiNhanVien") {
            $nhanvien->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? intval($_GET['MaLoaiNhanVien']) : null;
            if ($nhanvien->MaLoaiNhanVien) {
                try {
                    $stmt = $nhanvien->getByLoaiNhanVien();
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
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiNhanVien"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "generateCode") {
            $data = new NhanVien($db);
            $data->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? (int)$_GET['MaLoaiNhanVien'] : null;
            $prefix = $data->getPrefixFromMaLoai();
            if ($prefix === null) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Không tìm thấy mã loại nhân viên"
                ]);
                http_response_code(404);
                exit;
            }
            if (!$prefix) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu prefix"
                ]);
                http_response_code(400);
                exit;
            }
            try {
                $newCode = $nhanvien->generateEmployeeCode($prefix);
                if ($newCode) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => ["MaNhanVien" => $newCode]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Không thể tạo mã nhân viên"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi tạo mã: ' . $e->getMessage()
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
            if (!isset($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $data->Email, $data->LuongCanBan, $data->MaLoaiNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            
            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : date('Y-m-d H:i:s');
            $nhanvien->LuongCanBan = $data->LuongCanBan;
            $nhanvien->MaLoaiNhanVien = intval($data->MaLoaiNhanVien);

            try {
                $result = $nhanvien->add();
                if ($result !== false) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhân viên đã được thêm thành công",
                        'data' => $result
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm nhân viên thất bại"
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
            if (!isset($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $data->Email, $data->LuongCanBan, $data->MaLoaiNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : null;
            $nhanvien->LuongCanBan = $data->LuongCanBan;
            $nhanvien->MaLoaiNhanVien = intval($data->MaLoaiNhanVien);

            try {
                $result = $nhanvien->update();
                if ($result !== false) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhân viên đã được cập nhật",
                        'data' => $result
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật nhân viên thất bại"
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
            if (!isset($data->MaNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaNhanVien"
                ]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;

            try {
                $result = $nhanvien->delete();
                if ($result !== false) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Nhân viên đã được xóa thành công",
                        'data' => $result
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa nhân viên thất bại"
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