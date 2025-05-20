<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/TaiKhoan.php';



$database = new Database();
$db = $database->getConn();
$taikhoan = new TaiKhoan($db);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
            $stmt = $taikhoan->getAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $taikhoan->MaTaiKhoan = isset($_GET['MaTaiKhoan']) ? $_GET['MaTaiKhoan'] : null;
            if ($taikhoan->MaTaiKhoan) {
                $stmt = $taikhoan->getById();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaTaiKhoan"]);
                http_response_code(400);
            }
        } elseif ($action === "getByNhanVien") {
            $taikhoan->MaNhanVien = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($taikhoan->MaNhanVien) {
                $stmt = $taikhoan->getByNhanVien();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaNhanVien"]);
                http_response_code(400);
            }
        } elseif ($action === "getNhanVienWithoutAccount") {
            $stmt = $taikhoan->getNhanVienWithoutAccount();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } else {
            echo json_encode(["message" => "Action không hợp lệ"]);
            http_response_code(400);
        }
        break;

   case 'POST':
    if ($action === "POST") {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->MatKhau, $data->MaNhanVien)) {
            echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
            http_response_code(400);
            exit;
        }

        $taikhoan->MatKhau = $data->MatKhau;
        $taikhoan->MaNhanVien = $data->MaNhanVien;

        $result = $taikhoan->add();
        if ($result !== false) {
            echo json_encode([
                "status" => "success",
                "message" => "Tài khoản đã được thêm thành công",
                "MaTaiKhoan" => $result // Sử dụng giá trị trả về từ add
            ]);
            http_response_code(201);
        } else {
            // Lỗi đã được xử lý trong hàm add, không cần lặp lại
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

            $user = $taikhoan->login();
            if ($user) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Đăng nhập thành công',
                    'data' => $user
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Tên đăng nhập hoặc mật khẩu không đúng'
                ]);
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
                // Message được trả về trong phương thức update() nếu có lỗi
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
                echo json_encode(["message" => "Mật khẩu đã được thay đổi"]);
            } else {
                // Message được trả về trong phương thức changePassword() nếu có lỗi
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
                // Message được trả về trong phương thức delete() nếu có lỗi
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