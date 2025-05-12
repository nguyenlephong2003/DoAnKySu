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
include_once '../../Model/HopDong.php';

// Get database connection
$database = new Database();
$db = $database->getConn();

// Initialize HopDong object
$hopDong = new HopDong($db);

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all hop dong
        $stmt = $hopDong->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $hopDong_arr = array();
            $hopDong_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $hopDong_item = array(
                    "MaHopDong" => $MaHopDong,
                    "NgayKy" => $NgayKy,
                    "MoTa" => $MoTa,
                    "TongTien" => $TongTien,
                    "FileHopDong" => $FileHopDong,
                    "MaNhanVien" => $MaNhanVien
                );
                array_push($hopDong_arr["data"], $hopDong_item);
            }

            http_response_code(200);
            echo json_encode($hopDong_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("data" => array()));
        }
        break;

    case 'GET_UNUSED':
        // Get unused contracts
        $stmt = $hopDong->getUnusedContracts();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $hopDong_arr = array();
            $hopDong_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $hopDong_item = array(
                    "MaHopDong" => $MaHopDong,
                    "NgayKy" => $NgayKy,
                    "MoTa" => $MoTa,
                    "TongTien" => $TongTien,
                    "FileHopDong" => $FileHopDong,
                    "MaNhanVien" => $MaNhanVien
                );
                array_push($hopDong_arr["data"], $hopDong_item);
            }

            http_response_code(200);
            echo json_encode($hopDong_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("data" => array()));
        }
        break;

    case 'GET_SINGLE':
        // Get hop dong ID
        $hopDong->MaHopDong = isset($_GET['id']) ? $_GET['id'] : die();

        // Read single hop dong
        $hopDong->readSingle();

        if ($hopDong->MaHopDong != null) {
            $hopDong_arr = array(
                "MaHopDong" => $hopDong->MaHopDong,
                "NgayKy" => $hopDong->NgayKy,
                "MoTa" => $hopDong->MoTa,
                "TongTien" => $hopDong->TongTien,
                "FileHopDong" => $hopDong->FileHopDong,
                "MaNhanVien" => $hopDong->MaNhanVien
            );

            http_response_code(200);
            echo json_encode($hopDong_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy hợp đồng."));
        }
        break;

    case 'POST':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaHopDong) &&
            !empty($data->NgayKy) &&
            !empty($data->MoTa) &&
            !empty($data->TongTien) &&
            !empty($data->MaNhanVien)
        ) {
            // Set hop dong property values
            $hopDong->MaHopDong = $data->MaHopDong;
            $hopDong->NgayKy = $data->NgayKy;
            $hopDong->MoTa = $data->MoTa;
            $hopDong->TongTien = $data->TongTien;
            $hopDong->FileHopDong = $data->FileHopDong ?? null;
            $hopDong->MaNhanVien = $data->MaNhanVien;

            // Create hop dong
            if ($hopDong->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Tạo hợp đồng thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể tạo hợp đồng."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể tạo hợp đồng. Dữ liệu không đầy đủ."));
        }
        break;

    case 'PUT':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaHopDong) &&
            !empty($data->NgayKy) &&
            !empty($data->MoTa) &&
            !empty($data->TongTien) &&
            !empty($data->MaNhanVien)
        ) {
            // Set hop dong property values
            $hopDong->MaHopDong = $data->MaHopDong;
            $hopDong->NgayKy = $data->NgayKy;
            $hopDong->MoTa = $data->MoTa;
            $hopDong->TongTien = $data->TongTien;
            $hopDong->FileHopDong = $data->FileHopDong ?? null;
            $hopDong->MaNhanVien = $data->MaNhanVien;

            // Update hop dong
            if ($hopDong->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cập nhật hợp đồng thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể cập nhật hợp đồng."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể cập nhật hợp đồng. Dữ liệu không đầy đủ."));
        }
        break;

    case 'DELETE':
        // Get hop dong ID
        $hopDong->MaHopDong = isset($_GET['id']) ? $_GET['id'] : die();

        // Delete hop dong
        if ($hopDong->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Xóa hợp đồng thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể xóa hợp đồng."));
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(array("message" => "Hành động không hợp lệ."));
        break;
}
?> 