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
require_once __DIR__ . '/../../Model/ChiTietPhieuNhap.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$chitietphieunhap = new ChiTietPhieuNhap($db);
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
        if ($action === "getById") {
            $chitietphieunhap->MaChiTietPhieuNhap = isset($_GET['MaChiTietPhieuNhap']) ? $_GET['MaChiTietPhieuNhap'] : null;
            if ($chitietphieunhap->MaChiTietPhieuNhap) {
                try {
                    $result = $chitietphieunhap->readSingle();
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaChiTietPhieuNhap' => $chitietphieunhap->MaChiTietPhieuNhap,
                            'MaPhieuNhap' => $chitietphieunhap->MaPhieuNhap,
                            'MaThietBiVatTu' => $chitietphieunhap->MaThietBiVatTu,
                            'SoLuong' => $chitietphieunhap->SoLuong,
                            'DonGia' => $chitietphieunhap->DonGia,
                            'TenThietBiVatTu' => $result['TenThietBiVatTu'],
                            'LoaiThietBi' => $result['LoaiThietBi'],
                            'DonViTinh' => $result['DonViTinh'],
                            'NgayNhap' => $result['NgayNhap'],
                            'TenNhaCungCap' => $result['TenNhaCungCap']
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
                    'message' => "Thiếu MaChiTietPhieuNhap"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getByPhieuNhap") {
            $maPhieuNhap = isset($_GET['MaPhieuNhap']) ? $_GET['MaPhieuNhap'] : null;
            if ($maPhieuNhap) {
                try {
                    $stmt = $chitietphieunhap->getImportReceiptDetails($maPhieuNhap);
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
                    'message' => "Thiếu MaPhieuNhap"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getTotalValue") {
            $maPhieuNhap = isset($_GET['MaPhieuNhap']) ? $_GET['MaPhieuNhap'] : null;
            if ($maPhieuNhap) {
                try {
                    $result = $chitietphieunhap->calculateTotalValue($maPhieuNhap);
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
                    'message' => "Thiếu MaPhieuNhap"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getMostImported") {
            $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;
            try {
                $stmt = $chitietphieunhap->getMostImportedEquipment($limit);
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
                'message' => "Action không hợp lệ"
            ]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaPhieuNhap, $data->MaThietBiVatTu, $data->SoLuong, $data->MaNhaCungCap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $chitietphieunhap->MaPhieuNhap = $data->MaPhieuNhap;
            $chitietphieunhap->MaThietBiVatTu = $data->MaThietBiVatTu;
            $chitietphieunhap->SoLuong = $data->SoLuong;
            $chitietphieunhap->MaNhaCungCap = $data->MaNhaCungCap;
            try {
                if ($chitietphieunhap->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Chi tiết phiếu nhập đã được thêm thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm chi tiết phiếu nhập thất bại"
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
            if (!isset($data->MaChiTietPhieuNhap, $data->MaPhieuNhap, $data->MaThietBiVatTu, $data->SoLuong, $data->MaNhaCungCap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }
            $chitietphieunhap->MaChiTietPhieuNhap = $data->MaChiTietPhieuNhap;
            $chitietphieunhap->MaPhieuNhap = $data->MaPhieuNhap;
            $chitietphieunhap->MaThietBiVatTu = $data->MaThietBiVatTu;
            $chitietphieunhap->SoLuong = $data->SoLuong;
            $chitietphieunhap->MaNhaCungCap = $data->MaNhaCungCap;
            try {
                if ($chitietphieunhap->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Chi tiết phiếu nhập đã được cập nhật"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật chi tiết phiếu nhập thất bại"
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
            if (!isset($data->MaChiTietPhieuNhap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaChiTietPhieuNhap"
                ]);
                http_response_code(400);
                exit;
            }
            $chitietphieunhap->MaChiTietPhieuNhap = $data->MaChiTietPhieuNhap;
            try {
                if ($chitietphieunhap->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Chi tiết phiếu nhập đã được xóa"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa chi tiết phiếu nhập thất bại"
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