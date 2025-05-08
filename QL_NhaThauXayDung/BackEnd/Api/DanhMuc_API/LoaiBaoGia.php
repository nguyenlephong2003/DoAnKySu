<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/LoaiBaoGia.php';

$database = new Database();
$db = $database->getConn();
$loaibaogiao = new LoaiBaoGia($db);

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
            $stmt = $loaibaogiao->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $loaibaogiao->MaLoai = isset($_GET['MaLoai']) ? $_GET['MaLoai'] : null;
            
            if ($loaibaogiao->MaLoai) {
                $loaibaogiao->readSingle();
                
                echo json_encode([
                    'status' => 'success',
                    'data' => [
                        'MaLoai' => $loaibaogiao->MaLoai,
                        'TenLoai' => $loaibaogiao->TenLoai
                    ]
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaLoai"]);
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
            
            if (!isset($data->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $loaibaogiao->TenLoai = $data->TenLoai;

            if ($loaibaogiao->create()) {
                echo json_encode([
                    "message" => "Loại báo giá đã được thêm thành công",
                    "data" => [
                        "MaLoai" => $loaibaogiao->MaLoai,
                        "TenLoai" => $loaibaogiao->TenLoai
                    ]
                ]);
            } else {
                echo json_encode(["message" => "Thêm loại báo giá thất bại"]);
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

            $loaibaogiao->MaLoai = $data->MaLoai;
            $loaibaogiao->TenLoai = $data->TenLoai;

            if ($loaibaogiao->update()) {
                echo json_encode([
                    "message" => "Loại báo giá đã được cập nhật",
                    "data" => [
                        "MaLoai" => $loaibaogiao->MaLoai,
                        "TenLoai" => $loaibaogiao->TenLoai
                    ]
                ]);
            } else {
                echo json_encode(["message" => "Cập nhật loại báo giá thất bại"]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức PUT"]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode(["message" => "Phương thức không được hỗ trợ"]);
        http_response_code(405);
        break;
}
?>