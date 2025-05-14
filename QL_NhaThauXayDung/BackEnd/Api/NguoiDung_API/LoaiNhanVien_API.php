<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/LoaiNhanVien.php';

// Kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConn();
$loainhanvien = new LoaiNhanVien($db);

// Lấy phương thức HTTP và tham số `action`
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode(["message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

switch ($method) {
    case 'GET':
        if ($action === "GET") {
            $stmt = $loainhanvien->getAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $loainhanvien->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? $_GET['MaLoaiNhanVien'] : null;
            if ($loainhanvien->MaLoaiNhanVien) {
                $stmt = $loainhanvien->getById();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaLoaiNhanVien"]);
                http_response_code(400);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ"]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaLoaiNhanVien, $data->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;
            $loainhanvien->TenLoai = $data->TenLoai;

            if ($loainhanvien->add()) {
                echo json_encode(["message" => "Loại nhân viên đã được thêm thành công"]);
            } else {
                echo json_encode(["message" => "Thêm loại nhân viên thất bại"]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức POST"]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaLoaiNhanVien, $data->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;
            $loainhanvien->TenLoai = $data->TenLoai;

            if ($loainhanvien->update()) {
                echo json_encode(["message" => "Loại nhân viên đã được cập nhật"]);
            } else {
                echo json_encode(["message" => "Cập nhật loại nhân viên thất bại"]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức PUT"]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        if ($action === "DELETE") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaLoaiNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loainhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;

            if ($loainhanvien->delete()) {
                echo json_encode(["message" => "Loại nhân viên đã được xóa thành công"]);
            } else {
                echo json_encode(["message" => "Xóa loại nhân viên thất bại"]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức DELETE"]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode(["message" => "Phương thức không được hỗ trợ"]);
        http_response_code(405);
        break;
}
?>