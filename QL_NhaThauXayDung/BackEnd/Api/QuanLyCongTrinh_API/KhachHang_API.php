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
require_once __DIR__ . '/../../Model/KhachHang.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$khachhang = new KhachHang($db);
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

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all khach hang
        $stmt = $khachhang->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $khachhang_arr = array(
                "status" => "success",
                "data" => array()
            );

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $khachhang_item = array(
                    "MaKhachHang" => $MaKhachHang,
                    "TenKhachHang" => $TenKhachHang,
                    "SoDT" => $SoDT,
                    "CCCD" => $CCCD,
                    "Email" => $Email
                );
                array_push($khachhang_arr["data"], $khachhang_item);
            }

            http_response_code(200);
            echo json_encode($khachhang_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("status" => "success", "data" => array()));
        }
        break;

    case 'GET_SINGLE':
        // Get khach hang ID
        $khachhang->MaKhachHang = isset($_GET['id']) ? $_GET['id'] : die();

        // Read single khach hang
        $khachhang->readSingle();

        if ($khachhang->MaKhachHang != null) {
            $khachhang_arr = array(
                "MaKhachHang" => $khachhang->MaKhachHang,
                "TenKhachHang" => $khachhang->TenKhachHang,
                "SoDT" => $khachhang->SoDT,
                "CCCD" => $khachhang->CCCD,
                "Email" => $khachhang->Email
            );

            http_response_code(200);
            echo json_encode($khachhang_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy khách hàng."));
        }
        break;

    case 'POST':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaKhachHang) &&
            !empty($data->TenKhachHang) &&
            !empty($data->SoDT) &&
            !empty($data->CCCD)
        ) {
            // Set khach hang property values
            $khachhang->MaKhachHang = $data->MaKhachHang;
            $khachhang->TenKhachHang = $data->TenKhachHang;
            $khachhang->SoDT = $data->SoDT;
            $khachhang->CCCD = $data->CCCD;
            $khachhang->Email = $data->Email ?? null;

            // Create khach hang
            if ($khachhang->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Tạo khách hàng thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể tạo khách hàng."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể tạo khách hàng. Dữ liệu không đầy đủ."));
        }
        break;

    case 'PUT':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaKhachHang) &&
            !empty($data->TenKhachHang) &&
            !empty($data->SoDT) &&
            !empty($data->CCCD)
        ) {
            // Set khach hang property values
            $khachhang->MaKhachHang = $data->MaKhachHang;
            $khachhang->TenKhachHang = $data->TenKhachHang;
            $khachhang->SoDT = $data->SoDT;
            $khachhang->CCCD = $data->CCCD;
            $khachhang->Email = $data->Email ?? null;

            // Update khach hang
            if ($khachhang->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cập nhật khách hàng thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể cập nhật khách hàng."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể cập nhật khách hàng. Dữ liệu không đầy đủ."));
        }
        break;

    case 'DELETE':
        // Get khach hang ID
        $khachhang->MaKhachHang = isset($_GET['id']) ? $_GET['id'] : die();

        // Delete khach hang
        if ($khachhang->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Xóa khách hàng thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể xóa khách hàng."));
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(array("message" => "Hành động không hợp lệ."));
        break;
}
?> 