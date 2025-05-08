<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/BangBaoGia.php';
require_once __DIR__ . '/../../Model/LoaiBaoGia.php';
require_once __DIR__ . '/../../Config/VerifyToken.php';

$database = new Database();
$db = $database->getConn();
$bangBaoGia = new BangBaoGia($db);
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
        // Các action cho BangBaoGia
        if ($action === "GET") {
            $stmt = $bangBaoGia->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } 
        elseif ($action === "getBangBaoGiaById") {
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
        } 
        elseif ($action === "getByStatus") {
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
        } 
        elseif ($action === "getQuotationDetails") {
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
        } 
        elseif ($action === "searchBangBaoGia") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            $stmt = $bangBaoGia->search($keywords);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } 
        elseif ($action === "pagingBangBaoGia") {
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
        }
        // Các action cho LoaiBaoGia
        elseif ($action === "getAllLoaiBaoGia") {
            $stmt = $loaiBaoGia->readAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } 
        elseif ($action === "getLoaiBaoGiaById") {
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
        } 
        elseif ($action === "searchLoaiBaoGia") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            $stmt = $loaiBaoGia->search($keywords);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        }
        // Action gộp dữ liệu
        elseif ($action === "getDashboardData") {
            // Lấy thống kê báo giá theo trạng thái
            $query = "SELECT TrangThai, COUNT(*) as SoLuong FROM BangBaoGia GROUP BY TrangThai";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $thongKeTrangThai = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Lấy thống kê báo giá theo loại
            $query = "SELECT l.TenLoai, COUNT(b.MaBaoGia) as SoLuong 
                      FROM LoaiBaoGia l
                      LEFT JOIN BangBaoGia b ON l.MaLoai = b.MaLoai
                      GROUP BY l.MaLoai";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $thongKeLoai = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Lấy báo giá mới nhất
            $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                             l.TenLoai as TenLoaiBaoGia
                      FROM BangBaoGia bg
                      LEFT JOIN LoaiBaoGia l ON bg.MaLoai = l.MaLoai
                      ORDER BY bg.MaBaoGia DESC
                      LIMIT 5";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $baoGiaMoiNhat = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'thongKeTrangThai' => $thongKeTrangThai,
                    'thongKeLoai' => $thongKeLoai,
                    'baoGiaMoiNhat' => $baoGiaMoiNhat
                ]
            ]);
        }
        else {
            echo json_encode(["message" => "Action không hợp lệ"]);
            http_response_code(400);
        }
        break;

    case 'POST':
        // Thêm BangBaoGia
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
        } 
        // Thêm LoaiBaoGia
        elseif ($action === "createLoaiBaoGia") {
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
        }
        // Thêm cả BangBaoGia và LoaiBaoGia trong một request
        elseif ($action === "createFullBaoGia") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->baoGia, $data->loaiBaoGia, $data->baoGia->TenBaoGia, $data->baoGia->TrangThai, $data->loaiBaoGia->TenLoai)) {
                echo json_encode(["message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            // Bắt đầu transaction
            $db->beginTransaction();

            try {
                // Thêm loại báo giá trước
                $loaiBaoGia->TenLoai = $data->loaiBaoGia->TenLoai;
                
                if (!$loaiBaoGia->create()) {
                    throw new Exception("Thêm loại báo giá thất bại");
                }

                // Thêm bảng báo giá với mã loại vừa tạo
                $bangBaoGia->MaBaoGia = $data->baoGia->MaBaoGia ?? null;
                $bangBaoGia->TenBaoGia = $data->baoGia->TenBaoGia;
                $bangBaoGia->TrangThai = $data->baoGia->TrangThai;
                $bangBaoGia->MaLoai = $loaiBaoGia->MaLoai;

                if (!$bangBaoGia->create()) {
                    throw new Exception("Thêm bảng báo giá thất bại");
                }

                // Commit transaction
                $db->commit();

                echo json_encode([
                    "status" => "success",
                    "message" => "Đã thêm mới báo giá và loại báo giá thành công",
                    "data" => [
                        "baoGia" => [
                            "MaBaoGia" => $bangBaoGia->MaBaoGia,
                            "TenBaoGia" => $bangBaoGia->TenBaoGia,
                            "TrangThai" => $bangBaoGia->TrangThai,
                            "MaLoai" => $bangBaoGia->MaLoai
                        ],
                        "loaiBaoGia" => [
                            "MaLoai" => $loaiBaoGia->MaLoai,
                            "TenLoai" => $loaiBaoGia->TenLoai
                        ]
                    ]
                ]);
                http_response_code(201);
            } catch (Exception $e) {
                // Rollback transaction
                $db->rollBack();
                
                echo json_encode([
                    "status" => "error",
                    "message" => $e->getMessage()
                ]);
                http_response_code(500);
            }
        }
        else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức POST"]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        // Cập nhật BangBaoGia
        if ($action === "updateBangBaoGia") {
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
        } 
        // Cập nhật LoaiBaoGia
        elseif ($action === "updateLoaiBaoGia") {
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
        }
        else {
            echo json_encode(["message" => "Action không hợp lệ cho phương thức PUT"]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        // Xóa BangBaoGia
        if ($action === "deleteBangBaoGia") {
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
        } 
        // Xóa LoaiBaoGia
        elseif ($action === "deleteLoaiBaoGia") {
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
        }
        else {
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