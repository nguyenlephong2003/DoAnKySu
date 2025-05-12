<?php
// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database and object files
include_once '../../Config/Database.php';
include_once '../../Model/KhachHang.php';

// Get database connection
$database = new Database();
$db = $database->getConn();

// Initialize KhachHang object
$khachHang = new KhachHang($db);

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all khach hang
        $stmt = $khachHang->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $khachHang_arr = array(
                "status" => "success",
                "data" => array()
            );

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $khachHang_item = array(
                    "MaKhachHang" => $MaKhachHang,
                    "TenKhachHang" => $TenKhachHang,
                    "SoDT" => $SoDT,
                    "CCCD" => $CCCD,
                    "Email" => $Email
                );
                array_push($khachHang_arr["data"], $khachHang_item);
            }

            http_response_code(200);
            echo json_encode($khachHang_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("status" => "success", "data" => array()));
        }
        break;

    case 'GET_SINGLE':
        // Get khach hang ID
        $khachHang->MaKhachHang = isset($_GET['id']) ? $_GET['id'] : die();

        // Read single khach hang
        $khachHang->readSingle();

        if ($khachHang->MaKhachHang != null) {
            $khachHang_arr = array(
                "MaKhachHang" => $khachHang->MaKhachHang,
                "TenKhachHang" => $khachHang->TenKhachHang,
                "SoDT" => $khachHang->SoDT,
                "CCCD" => $khachHang->CCCD,
                "Email" => $khachHang->Email
            );

            http_response_code(200);
            echo json_encode($khachHang_arr);
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
            $khachHang->MaKhachHang = $data->MaKhachHang;
            $khachHang->TenKhachHang = $data->TenKhachHang;
            $khachHang->SoDT = $data->SoDT;
            $khachHang->CCCD = $data->CCCD;
            $khachHang->Email = $data->Email ?? null;

            // Create khach hang
            if ($khachHang->create()) {
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
            $khachHang->MaKhachHang = $data->MaKhachHang;
            $khachHang->TenKhachHang = $data->TenKhachHang;
            $khachHang->SoDT = $data->SoDT;
            $khachHang->CCCD = $data->CCCD;
            $khachHang->Email = $data->Email ?? null;

            // Update khach hang
            if ($khachHang->update()) {
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
        $khachHang->MaKhachHang = isset($_GET['id']) ? $_GET['id'] : die();

        // Delete khach hang
        if ($khachHang->delete()) {
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