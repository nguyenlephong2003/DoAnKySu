<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NguoiDung/TaiKhoan.php';

$database = new Database();
$db = $database->getConn();
$taikhoan = new TaiKhoan($db);

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
            $stmt = $taikhoan->getAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result as &$item) {
                if (isset($item['MatKhau'])) {
                    unset($item['MatKhau']);
                }
            }
            echo json_encode($result);
        } elseif ($action === "getById") {
            $taikhoan->MaTaiKhoan = isset($_GET['MaTaiKhoan']) ? $_GET['MaTaiKhoan'] : null;
            if ($taikhoan->MaTaiKhoan) {
                $stmt = $taikhoan->getById();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (isset($result['MatKhau'])) {
                    unset($result['MatKhau']);
                }
                
                echo json_encode($result);
            } else {
                echo json_encode(["message" => "Thiếu MaTaiKhoan"]);
                http_response_code(400);
            }
        } elseif ($action === "getByNhanVien") {
            $taikhoan->MaNhanVien = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($taikhoan->MaNhanVien) {
                $stmt = $taikhoan->getByNhanVien();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Loại bỏ mật khẩu trong kết quả trả về
                if (isset($result['MatKhau'])) {
                    unset($result['MatKhau']);
                }
                
                echo json_encode($result);
            } else {
                echo json_encode(["message" => "Thiếu MaNhanVien"]);
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
            if (!isset($data->MaTaiKhoan, $data->MatKhau, $data->MaNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $taikhoan->MaTaiKhoan = $data->MaTaiKhoan;
            $taikhoan->MatKhau = $data->MatKhau;
            $taikhoan->MaNhanVien = $data->MaNhanVien;

            if ($taikhoan->add()) {
                echo json_encode(["message" => "Tài khoản đã được thêm thành công"]);
            } else {
                echo json_encode(["message" => "Thêm tài khoản thất bại"]);
                http_response_code(500);
            }
        } elseif ($action === "login") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaTaiKhoan, $data->MatKhau)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $taikhoan->MaTaiKhoan = $data->MaTaiKhoan;
            $taikhoan->MatKhau = $data->MatKhau;

            $result = $taikhoan->login();
            if ($result) {
                // Loại bỏ mật khẩu trong kết quả trả về
                unset($result['MatKhau']);
                echo json_encode([
                    "message" => "Đăng nhập thành công",
                    "data" => $result
                ]);
            } else {
                echo json_encode(["message" => "Tên đăng nhập hoặc mật khẩu không đúng"]);
                http_response_code(401);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức POST"]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaTaiKhoan, $data->MaNhanVien)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $taikhoan->MaTaiKhoan = $data->MaTaiKhoan;
            $taikhoan->MaNhanVien = $data->MaNhanVien;
            $taikhoan->MatKhau = isset($data->MatKhau) ? $data->MatKhau : null;

            if ($taikhoan->update()) {
                echo json_encode(["message" => "Tài khoản đã được cập nhật"]);
            } else {
                echo json_encode(["message" => "Cập nhật tài khoản thất bại"]);
                http_response_code(500);
            }
        } elseif ($action === "changePassword") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaTaiKhoan, $data->MatKhau)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $taikhoan->MaTaiKhoan = $data->MaTaiKhoan;
            $taikhoan->MatKhau = $data->MatKhau;

            if ($taikhoan->changePassword()) {
                echo json_encode(["message" => "Mật khẩu đã được cập nhật"]);
            } else {
                echo json_encode(["message" => "Cập nhật mật khẩu thất bại"]);
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
            if (!isset($data->MaTaiKhoan)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $taikhoan->MaTaiKhoan = $data->MaTaiKhoan;

            if ($taikhoan->delete()) {
                echo json_encode(["message" => "Tài khoản đã được xóa thành công"]);
            } else {
                echo json_encode(["message" => "Xóa tài khoản thất bại"]);
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