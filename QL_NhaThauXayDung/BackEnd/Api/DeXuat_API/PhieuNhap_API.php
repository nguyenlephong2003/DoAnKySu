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
require_once __DIR__ . '/../../Model/PhieuNhap.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$phieunhap = new PhieuNhap($db);
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
                $stmt = $phieunhap->getAll();
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
            $phieunhap->MaPhieuNhap = isset($_GET['MaPhieuNhap']) ? $_GET['MaPhieuNhap'] : null;
            if ($phieunhap->MaPhieuNhap) {
                try {
                    $result = $phieunhap->readSingle();
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaPhieuNhap' => $phieunhap->MaPhieuNhap,
                            'NgayNhap' => $phieunhap->NgayNhap,
                            'TongTien' => $phieunhap->TongTien,
                            'TrangThai' => $phieunhap->TrangThai,
                            'MaNhaCungCap' => $phieunhap->MaNhaCungCap,
                            'MaNhanVien' => $phieunhap->MaNhanVien,
                            'TenNhaCungCap' => $result['TenNhaCungCap'],
                            'TenNhanVien' => $result['TenNhanVien']
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
                    'message' => "Thiếu MaPhieuNhap"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getByDateRange") {
            $startDate = isset($_GET['startDate']) ? $_GET['startDate'] : null;
            $endDate = isset($_GET['endDate']) ? $_GET['endDate'] : null;
            if ($startDate && $endDate) {
                try {
                    $stmt = $phieunhap->getImportReceiptsByDateRange($startDate, $endDate);
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
                    'message' => "Thiếu thông tin ngày"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getByStatus") {
            $trangThai = isset($_GET['trangThai']) ? $_GET['trangThai'] : null;
            if ($trangThai) {
                try {
                    $stmt = $phieunhap->getImportReceiptsByStatus($trangThai);
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
                    'message' => "Thiếu trạng thái"
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
            if (!isset($data->MaPhieuNhap, $data->NgayNhap, $data->TongTien, $data->TrangThai, $data->MaNhaCungCap, $data->MaNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $phieunhap->MaPhieuNhap = $data->MaPhieuNhap;
            $phieunhap->NgayNhap = $data->NgayNhap;
            $phieunhap->TongTien = $data->TongTien;
            $phieunhap->TrangThai = $data->TrangThai;
            $phieunhap->MaNhaCungCap = $data->MaNhaCungCap;
            $phieunhap->MaNhanVien = $data->MaNhanVien;
            try {
                if ($phieunhap->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Phiếu nhập đã được thêm thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm phiếu nhập thất bại"
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
            if (!isset($data->MaPhieuNhap, $data->NgayNhap, $data->TongTien, $data->TrangThai, $data->MaNhaCungCap, $data->MaNhanVien)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }
            $phieunhap->MaPhieuNhap = $data->MaPhieuNhap;
            $phieunhap->NgayNhap = $data->NgayNhap;
            $phieunhap->TongTien = $data->TongTien;
            $phieunhap->TrangThai = $data->TrangThai;
            $phieunhap->MaNhaCungCap = $data->MaNhaCungCap;
            $phieunhap->MaNhanVien = $data->MaNhanVien;
            try {
                if ($phieunhap->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Phiếu nhập đã được cập nhật"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật phiếu nhập thất bại"
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
            if (!isset($data->MaPhieuNhap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaPhieuNhap"
                ]);
                http_response_code(400);
                exit;
            }
            $phieunhap->MaPhieuNhap = $data->MaPhieuNhap;
            try {
                if ($phieunhap->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Phiếu nhập đã được xóa"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa phiếu nhập thất bại"
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