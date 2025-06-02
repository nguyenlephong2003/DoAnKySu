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
require_once __DIR__ . '/../../Model/ThietBiVatTu.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$thietbivattu = new ThietBiVatTu($db);
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
                $stmt = $thietbivattu->read();
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
            $thietbivattu->MaThietBiVatTu = isset($_GET['MaThietBiVatTu']) ? $_GET['MaThietBiVatTu'] : null;
            if ($thietbivattu->MaThietBiVatTu) {
                try {
                    $result = $thietbivattu->readSingle();
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaThietBiVatTu' => $thietbivattu->MaThietBiVatTu,
                            'TenThietBiVatTu' => $thietbivattu->TenThietBiVatTu,
                            'SoLuongTon' => $thietbivattu->SoLuongTon,
                            'TrangThai' => $thietbivattu->TrangThai,
                            'MaLoaiThietBiVatTu' => $thietbivattu->MaLoaiThietBiVatTu,
                            'MaNhaCungCap' => $thietbivattu->MaNhaCungCap,
                            'TenLoaiThietBiVatTu' => $result['TenLoaiThietBiVatTu'],
                            'DonViTinh' => $result['DonViTinh'],
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
                    'message' => "Thiếu MaThietBiVatTu"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "search") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : null;
            if ($keywords) {
                try {
                    $stmt = $thietbivattu->search($keywords);
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
                    'message' => "Thiếu từ khóa tìm kiếm"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getUsedInProjects") {
            $maThietBiVatTu = isset($_GET['MaThietBiVatTu']) ? $_GET['MaThietBiVatTu'] : null;
            if ($maThietBiVatTu) {
                try {
                    $stmt = $thietbivattu->getEquipmentUsedInProjects($maThietBiVatTu);
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
                    'message' => "Thiếu MaThietBiVatTu"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getLowStock") {
            $threshold = isset($_GET['threshold']) ? $_GET['threshold'] : 10;
            try {
                $stmt = $thietbivattu->getLowStockEquipment($threshold);
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
            if (!isset($data->MaThietBiVatTu, $data->TenThietBiVatTu, $data->SoLuongTon, $data->TrangThai, $data->MaLoaiThietBiVatTu, $data->MaNhaCungCap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $thietbivattu->MaThietBiVatTu = $data->MaThietBiVatTu;
            $thietbivattu->TenThietBiVatTu = $data->TenThietBiVatTu;
            $thietbivattu->SoLuongTon = $data->SoLuongTon;
            $thietbivattu->TrangThai = $data->TrangThai;
            $thietbivattu->MaLoaiThietBiVatTu = $data->MaLoaiThietBiVatTu;
            $thietbivattu->MaNhaCungCap = $data->MaNhaCungCap;
            try {
                if ($thietbivattu->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Thiết bị vật tư đã được thêm thành công",
                        'data' => [
                            'MaThietBiVatTu' => $thietbivattu->MaThietBiVatTu,
                            'TenThietBiVatTu' => $thietbivattu->TenThietBiVatTu,
                            'SoLuongTon' => $thietbivattu->SoLuongTon,
                            'TrangThai' => $thietbivattu->TrangThai,
                            'MaLoaiThietBiVatTu' => $thietbivattu->MaLoaiThietBiVatTu,
                            'MaNhaCungCap' => $thietbivattu->MaNhaCungCap
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm thiết bị vật tư thất bại"
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
            if (!isset($data->MaThietBiVatTu, $data->TenThietBiVatTu, $data->SoLuongTon, $data->TrangThai, $data->MaLoaiThietBiVatTu, $data->MaNhaCungCap)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }
            $thietbivattu->MaThietBiVatTu = $data->MaThietBiVatTu;
            $thietbivattu->TenThietBiVatTu = $data->TenThietBiVatTu;
            $thietbivattu->SoLuongTon = $data->SoLuongTon;
            $thietbivattu->TrangThai = $data->TrangThai;
            $thietbivattu->MaLoaiThietBiVatTu = $data->MaLoaiThietBiVatTu;
            $thietbivattu->MaNhaCungCap = $data->MaNhaCungCap;
            try {
                if ($thietbivattu->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Thiết bị vật tư đã được cập nhật",
                        'data' => [
                            'MaThietBiVatTu' => $thietbivattu->MaThietBiVatTu,
                            'TenThietBiVatTu' => $thietbivattu->TenThietBiVatTu,
                            'SoLuongTon' => $thietbivattu->SoLuongTon,
                            'TrangThai' => $thietbivattu->TrangThai,
                            'MaLoaiThietBiVatTu' => $thietbivattu->MaLoaiThietBiVatTu,
                            'MaNhaCungCap' => $thietbivattu->MaNhaCungCap
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật thiết bị vật tư thất bại"
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
        } elseif ($action === "updateQuantity") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaThietBiVatTu, $data->quantity, $data->type)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }
            $thietbivattu->MaThietBiVatTu = $data->MaThietBiVatTu;
            try {
                if ($thietbivattu->updateQuantity($data->quantity, $data->type)) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Cập nhật số lượng thiết bị vật tư thành công",
                        'data' => [
                            'MaThietBiVatTu' => $thietbivattu->MaThietBiVatTu,
                            'SoLuongTon' => $data->quantity
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật số lượng thiết bị vật tư thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi cập nhật số lượng: ' . $e->getMessage()
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
            if (!isset($data->MaThietBiVatTu)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaThietBiVatTu"
                ]);
                http_response_code(400);
                exit;
            }
            $thietbivattu->MaThietBiVatTu = $data->MaThietBiVatTu;
            try {
                if ($thietbivattu->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Thiết bị vật tư đã được xóa thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa thiết bị vật tư thất bại"
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