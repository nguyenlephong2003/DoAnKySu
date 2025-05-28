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
require_once __DIR__ . '/../../Model/HopDong.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$hopdong = new HopDong($db);
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

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all hop dong
        $stmt = $hopdong->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $hopdong_arr = array();
            $hopdong_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $hopdong_item = array(
                    "MaHopDong" => $MaHopDong,
                    "NgayKy" => $NgayKy,
                    "MoTa" => $MoTa,
                    "TongTien" => $TongTien,
                    "FileHopDong" => $FileHopDong,
                    "MaNhanVien" => $MaNhanVien,
                    "TrangThai" => $TrangThai,
                    "GhiChu" => $GhiChu,
                    "TenNhanVien" => $TenNhanVien,
                    "SoDT" => $SoDT
                );
                array_push($hopdong_arr["data"], $hopdong_item);
            }

            http_response_code(200);
            echo json_encode($hopdong_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("data" => array()));
        }
        break;

    case 'GET_UNUSED':
        // Get unused contracts
        $stmt = $hopdong->getUnusedContracts();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $hopdong_arr = array();
            $hopdong_arr["status"] = "success";
            $hopdong_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $hopdong_item = array(
                    "MaHopDong" => $MaHopDong,
                    "NgayKy" => $NgayKy,
                    "MoTa" => $MoTa,
                    "TongTien" => $TongTien,
                    "FileHopDong" => $FileHopDong,
                    "MaNhanVien" => $MaNhanVien,
                    "TrangThai" => $TrangThai,
                    "GhiChu" => $GhiChu
                );
                array_push($hopdong_arr["data"], $hopdong_item);
            }

            http_response_code(200);
            echo json_encode($hopdong_arr);
        } else {
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "data" => array()
            ));
        }
        break;

    case 'GET_SINGLE':
        // Get hop dong ID
        $hopdong->MaHopDong = isset($_GET['id']) ? $_GET['id'] : die();

        // Read single hop dong
        $hopdong->readSingle();

        if ($hopdong->MaHopDong != null) {
            $hopdong_arr = array(
                "MaHopDong" => $hopdong->MaHopDong,
                "NgayKy" => $hopdong->NgayKy,
                "MoTa" => $hopdong->MoTa,
                "TongTien" => $hopdong->TongTien,
                "FileHopDong" => $hopdong->FileHopDong,
                "MaNhanVien" => $hopdong->MaNhanVien,
                "TrangThai" => $hopdong->TrangThai,
                "GhiChu" => $hopdong->GhiChu
            );

            http_response_code(200);
            echo json_encode($hopdong_arr);
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
            !empty($data->MaNhanVien) &&
            !empty($data->TrangThai)
        ) {
            // Set hop dong property values
            $hopdong->MaHopDong = $data->MaHopDong;
            $hopdong->NgayKy = $data->NgayKy;
            $hopdong->MoTa = $data->MoTa;
            $hopdong->TongTien = $data->TongTien;
            $hopdong->FileHopDong = $data->FileHopDong ?? null;
            $hopdong->MaNhanVien = $data->MaNhanVien;
            $hopdong->TrangThai = $data->TrangThai;
            $hopdong->GhiChu = $data->GhiChu ?? null;

            // Create hop dong
            if ($hopdong->create()) {
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
            !empty($data->MaNhanVien) &&
            !empty($data->TrangThai)
        ) {
            // Set hop dong property values
            $hopdong->MaHopDong = $data->MaHopDong;
            $hopdong->NgayKy = $data->NgayKy;
            $hopdong->MoTa = $data->MoTa;
            $hopdong->TongTien = $data->TongTien;
            $hopdong->FileHopDong = $data->FileHopDong ?? null;
            $hopdong->MaNhanVien = $data->MaNhanVien;
            $hopdong->TrangThai = $data->TrangThai;
            $hopdong->GhiChu = $data->GhiChu ?? null;

            // Update hop dong
            if ($hopdong->update()) {
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
        $hopdong->MaHopDong = isset($_GET['id']) ? $_GET['id'] : die();

        // Delete hop dong
        if ($hopdong->delete()) {
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