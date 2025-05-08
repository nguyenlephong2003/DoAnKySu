<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/LoaiBaoGia.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$loaiBaoGia = new LoaiBaoGia($db);
$verifyToken = new VerifyToken();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

// Handle preflight OPTIONS request
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!$action) {
    echo json_encode(["message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

// Xác thực token
$tokenValidation = $verifyToken->validate();
if (!$tokenValidation['valid']) {
    echo json_encode(["message" => $tokenValidation['message']]);
    http_response_code(401);
    exit;
}

// Tiếp tục xử lý nếu token hợp lệ
switch ($method) {
    case 'GET':
        if ($action === "GET") {
            $stmt = $loaiBaoGia->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $loaiBaoGia->MaLoai = isset($_GET['MaLoai']) ? $_GET['MaLoai'] : null;
            if ($loaiBaoGia->MaLoai) {
                $loaiBaoGia->readSingle();
                
                echo json_encode([
                    'status' => 'success',
                    'data' => [
                        'MaLoai' => $loaiBaoGia->MaLoai,
                        'TenLoai' => $loaiBaoGia->TenLoai
                    ]
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaLoai"]);
                http_response_code(400);
            }
        } elseif ($action === "search") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            $stmt = $loaiBaoGia->search($keywords);
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
            if (!isset($data->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loaiBaoGia->TenLoai = $data->TenLoai;

            if ($loaiBaoGia->create()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Loại báo giá đã được thêm thành công",
                    "data" => [
                        "MaLoai" => $loaiBaoGia->MaLoai,
                        "TenLoai" => $loaiBaoGia->TenLoai
                    ]
                ]);
                http_response_code(201);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thêm loại báo giá thất bại"
                ]);
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
            if (!isset($data->MaLoai, $data->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loaiBaoGia->MaLoai = $data->MaLoai;
            $loaiBaoGia->TenLoai = $data->TenLoai;

            if ($loaiBaoGia->update()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Loại báo giá đã được cập nhật thành công"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Cập nhật loại báo giá thất bại"
                ]);
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
            if (!isset($data->MaLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loaiBaoGia->MaLoai = $data->MaLoai;

            if ($loaiBaoGia->delete()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Loại báo giá đã được xóa thành công"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Xóa loại báo giá thất bại"
                ]);
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