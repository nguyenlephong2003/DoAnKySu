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
require_once __DIR__ . '/../../Model/CungUng.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$cungUng = new CungUng($db);
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
                $stmt = $cungUng->read();
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
            $cungUng->MaCungUng = isset($_GET['MaCungUng']) ? $_GET['MaCungUng'] : null;
            if ($cungUng->MaCungUng) {
                try {
                    $result = $cungUng->readSingle();
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
                    'message' => "Thiếu MaCungUng"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getByEquipment") {
            $maThietBiVatTu = isset($_GET['MaThietBiVatTu']) ? $_GET['MaThietBiVatTu'] : null;
            if ($maThietBiVatTu) {
                try {
                    $stmt = $cungUng->getByEquipment($maThietBiVatTu);
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
        } elseif ($action === "getBySupplier") {
            $maNhaCungCap = isset($_GET['MaNhaCungCap']) ? $_GET['MaNhaCungCap'] : null;
            if ($maNhaCungCap) {
                try {
                    $stmt = $cungUng->getBySupplier($maNhaCungCap);
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
                    'message' => "Thiếu MaNhaCungCap"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "getLowStock") {
            $threshold = isset($_GET['threshold']) ? $_GET['threshold'] : 10;
            try {
                $stmt = $cungUng->getLowStockSupplies($threshold);
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
        } elseif ($action === "getUnlinkedSuppliers") {
            $maThietBiVatTu = isset($_GET['MaThietBiVatTu']) ? $_GET['MaThietBiVatTu'] : null;
            if ($maThietBiVatTu) {
                try {
                    $stmt = $cungUng->getUnlinkedSuppliers($maThietBiVatTu);
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
            if (!isset($data->MaThietBiVatTu, $data->MaNhaCungCap, $data->SoLuongTon)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $cungUng->MaThietBiVatTu = $data->MaThietBiVatTu;
            $cungUng->MaNhaCungCap = $data->MaNhaCungCap;
            $cungUng->SoLuongTon = $data->SoLuongTon;
            $cungUng->DonGia = isset($data->DonGia) ? $data->DonGia : 0;

            try {
                if ($cungUng->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Thông tin cung ứng đã được thêm thành công"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm thông tin cung ứng thất bại"
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
            if (!isset($data->MaCungUng, $data->SoLuongTon)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $cungUng->MaCungUng = $data->MaCungUng;
            $cungUng->SoLuongTon = $data->SoLuongTon;
            $cungUng->DonGia = isset($data->DonGia) ? $data->DonGia : null;

            try {
                if ($cungUng->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Thông tin cung ứng đã được cập nhật"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật thông tin cung ứng thất bại"
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
            if (!isset($data->MaCungUng, $data->quantity, $data->type)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }
            $cungUng->MaCungUng = $data->MaCungUng;
            try {
                if ($cungUng->updateQuantity($data->quantity, $data->type)) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Số lượng đã được cập nhật"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật số lượng thất bại"
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
            $cungUng->MaCungUng = isset($_GET['MaCungUng']) ? $_GET['MaCungUng'] : null;
            if ($cungUng->MaCungUng) {
                try {
                    if ($cungUng->delete()) {
                        echo json_encode([
                            'status' => 'success',
                            'message' => "Thông tin cung ứng đã được xóa"
                        ]);
                    } else {
                        echo json_encode([
                            'status' => 'error',
                            'message' => "Xóa thông tin cung ứng thất bại"
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
                    'message' => "Thiếu MaCungUng"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "deleteByEquipmentAndSupplier") {
            $maThietBiVatTu = isset($_GET['MaThietBiVatTu']) ? $_GET['MaThietBiVatTu'] : null;
            $maNhaCungCap = isset($_GET['MaNhaCungCap']) ? $_GET['MaNhaCungCap'] : null;
            
            if ($maThietBiVatTu && $maNhaCungCap) {
                try {
                    if ($cungUng->deleteByEquipmentAndSupplier($maThietBiVatTu, $maNhaCungCap)) {
                        echo json_encode([
                            'status' => 'success',
                            'message' => "Thông tin cung ứng đã được xóa"
                        ]);
                    } else {
                        echo json_encode([
                            'status' => 'error',
                            'message' => "Xóa thông tin cung ứng thất bại"
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
                    'message' => "Thiếu MaThietBiVatTu hoặc MaNhaCungCap"
                ]);
                http_response_code(400);
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