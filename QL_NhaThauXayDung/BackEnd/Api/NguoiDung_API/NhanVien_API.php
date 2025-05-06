<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NhanVien.php';

// Kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConn();
$nhanvien = new NhanVien($db);

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
            $stmt = $nhanvien->getAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } elseif ($action === "getById") {
            $nhanvien->MaNhanVien = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($nhanvien->MaNhanVien) {
                $stmt = $nhanvien->getById();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($result);
            } else {
                echo json_encode(["message" => "Thiếu MaNhanVien"]);
                http_response_code(400);
            }
        } elseif ($action === "getByLoaiNhanVien") {
            $nhanvien->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? $_GET['MaLoaiNhanVien'] : null;
            if ($nhanvien->MaLoaiNhanVien) {
                $stmt = $nhanvien->getByLoaiNhanVien();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
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
            if (!isset($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $data->Email, $data->MaLoaiNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : date('Y-m-d H:i:s');
            $nhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;

            if ($nhanvien->add()) {
                echo json_encode(["message" => "Nhân viên đã được thêm thành công"]);
            } else {
                echo json_encode(["message" => "Thêm nhân viên thất bại"]);
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
            if (!isset($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $data->Email, $data->MaLoaiNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : null;
            $nhanvien->MaLoaiNhanVien = $data->MaLoaiNhanVien;

            if ($nhanvien->update()) {
                echo json_encode(["message" => "Nhân viên đã được cập nhật"]);
            } else {
                echo json_encode(["message" => "Cập nhật nhân viên thất bại"]);
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
            if (!isset($data->MaNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;

            if ($nhanvien->delete()) {
                echo json_encode(["message" => "Nhân viên đã được xóa thành công"]);
            } else {
                echo json_encode(["message" => "Xóa nhân viên thất bại"]);
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