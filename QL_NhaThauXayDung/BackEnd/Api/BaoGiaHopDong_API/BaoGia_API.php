<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/BangBaoGia.php';
require_once __DIR__ . '/../../Config/VerifyToken.php'; // Sử dụng VerifyToken thay vì JwtMiddleware

$database = new Database();
$db = $database->getConn();
$bangBaoGia = new BangBaoGia($db);
$verifyToken = new VerifyToken(); // Khởi tạo VerifyToken

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

// Xác thực token sử dụng lớp VerifyToken
$tokenValidation = $verifyToken->validate();
if (!$tokenValidation['valid']) {
    echo json_encode(["message" => $tokenValidation['message']]);
    http_response_code(401);
    exit;
}

// Thông tin người dùng từ token
$userData = $tokenValidation['data'];

// Tiếp tục xử lý nếu token hợp lệ
switch ($method) {
    case 'GET':
        if ($action === "GET") {
            $stmt = $bangBaoGia->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $bangBaoGia->MaBaoGia = isset($_GET['MaBaoGia']) ? $_GET['MaBaoGia'] : null;
            if ($bangBaoGia->MaBaoGia) {
                $additionalInfo = $bangBaoGia->readSingle();
                
                echo json_encode([
                    'status' => 'success',
                    'data' => [
                        'MaBaoGia' => $bangBaoGia->MaBaoGia,
                        'TenBaoGia' => $bangBaoGia->TenBaoGia,
                        'TrangThai' => $bangBaoGia->TrangThai,
                        'MaLoai' => $bangBaoGia->MaLoai,
                        'TenLoaiBaoGia' => $additionalInfo['TenLoaiBaoGia']
                    ]
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaBaoGia"]);
                http_response_code(400);
            }
        } elseif ($action === "getByStatus") {
            $trangThai = isset($_GET['TrangThai']) ? $_GET['TrangThai'] : null;
            if ($trangThai !== null) {
                $stmt = $bangBaoGia->getQuotationsByStatus($trangThai);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["message" => "Thiếu TrangThai"]);
                http_response_code(400);
            }
        } elseif ($action === "getQuotationDetails") {
            $bangBaoGia->MaBaoGia = isset($_GET['MaBaoGia']) ? $_GET['MaBaoGia'] : null;
            if ($bangBaoGia->MaBaoGia) {
                $stmt = $bangBaoGia->getQuotationDetails();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["message" => "Thiếu MaBaoGia"]);
                http_response_code(400);
            }
        } elseif ($action === "search") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            $stmt = $bangBaoGia->search($keywords);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "paging") {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $records_per_page = isset($_GET['records_per_page']) ? (int)$_GET['records_per_page'] : 10;
            
            // Calculate starting record for pagination
            $from_record_num = ($records_per_page * $page) - $records_per_page;
            
            $stmt = $bangBaoGia->readPaging($from_record_num, $records_per_page);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get total count for pagination
            $total_rows = $bangBaoGia->count();
            $total_pages = ceil($total_rows / $records_per_page);
            
            echo json_encode([
                'status' => 'success',
                'data' => $result,
                'pagination' => [
                    'total_rows' => $total_rows,
                    'total_pages' => $total_pages,
                    'current_page' => $page,
                    'records_per_page' => $records_per_page
                ]
            ]);
        } else {
            echo json_encode(["message" => "Action không hợp lệ"]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaBaoGia, $data->TenBaoGia, $data->TrangThai, $data->MaLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $bangBaoGia->MaBaoGia = $data->MaBaoGia;
            $bangBaoGia->TenBaoGia = $data->TenBaoGia;
            $bangBaoGia->TrangThai = $data->TrangThai;
            $bangBaoGia->MaLoai = $data->MaLoai;

            if ($bangBaoGia->create()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Bảng báo giá đã được thêm thành công"
                ]);
                http_response_code(201);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thêm bảng báo giá thất bại"
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
            if (!isset($data->MaBaoGia, $data->TenBaoGia, $data->TrangThai, $data->MaLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $bangBaoGia->MaBaoGia = $data->MaBaoGia;
            $bangBaoGia->TenBaoGia = $data->TenBaoGia;
            $bangBaoGia->TrangThai = $data->TrangThai;
            $bangBaoGia->MaLoai = $data->MaLoai;

            if ($bangBaoGia->update()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Bảng báo giá đã được cập nhật thành công"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Cập nhật bảng báo giá thất bại"
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
            if (!isset($data->MaBaoGia)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $bangBaoGia->MaBaoGia = $data->MaBaoGia;

            if ($bangBaoGia->delete()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Bảng báo giá đã được xóa thành công"
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Xóa bảng báo giá thất bại"
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