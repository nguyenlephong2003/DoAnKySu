<?php
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400"); // 24 hours
    http_response_code(200);
    exit();
}

// Regular request headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/LoaiThietBiVatTu.php';

$database = new Database();
$db = $database->getConn();
$loaithietbivattu = new LoaiThietBiVatTu($db);

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

switch ($method) {
    case 'GET':
        if ($action === "GET") {
            try {
                $stmt = $loaithietbivattu->readAll();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } elseif ($action === "getById") {
            $loaithietbivattu->MaLoaiThietBiVatTu = isset($_GET['MaLoaiThietBiVatTu']) ? $_GET['MaLoaiThietBiVatTu'] : null;
            
            if ($loaithietbivattu->MaLoaiThietBiVatTu) {
                try {
                    $loaithietbivattu->readSingle();
                    
                    echo json_encode([
                        'status' => 'success',
                        'data' => [
                            'MaLoaiThietBiVatTu' => $loaithietbivattu->MaLoaiThietBiVatTu,
                            'TenLoai' => $loaithietbivattu->TenLoai,
                            'DonViTinh' => $loaithietbivattu->DonViTinh
                        ]
                    ]);
                } catch (Exception $e) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
                    ]);
                    http_response_code(500);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiThietBiVatTu"
                ]);
                http_response_code(400);
            }
        } elseif ($action === "search") {
            $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : '';
            
            try {
                $stmt = $loaithietbivattu->search($keywords);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi tìm kiếm: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } elseif ($action === "paging") {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $records_per_page = isset($_GET['records_per_page']) ? (int)$_GET['records_per_page'] : 10;
            
            try {
                $from_record_num = ($records_per_page * $page) - $records_per_page;
                $stmt = $loaithietbivattu->readPaging($from_record_num, $records_per_page);
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                $total_rows = $loaithietbivattu->count();
                $total_pages = ceil($total_rows / $records_per_page);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result,
                    'paging' => [
                        'total_rows' => $total_rows,
                        'total_pages' => $total_pages,
                        'current_page' => $page,
                        'records_per_page' => $records_per_page
                    ]
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi lấy dữ liệu phân trang: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ"
            ]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->TenLoai, $data->DonViTinh) || empty(trim($data->TenLoai)) || empty(trim($data->DonViTinh))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tên loại và đơn vị tính không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            $loaithietbivattu->TenLoai = $data->TenLoai;
            $loaithietbivattu->DonViTinh = $data->DonViTinh;

            try {
                if ($loaithietbivattu->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại thiết bị vật tư đã được thêm thành công",
                        'data' => [
                            "MaLoaiThietBiVatTu" => $loaithietbivattu->MaLoaiThietBiVatTu,
                            "TenLoai" => $loaithietbivattu->TenLoai,
                            "DonViTinh" => $loaithietbivattu->DonViTinh
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Thêm loại thiết bị vật tư thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi thêm dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức POST"
            ]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaLoaiThietBiVatTu, $data->TenLoai, $data->DonViTinh) || 
                empty(trim($data->TenLoai)) || empty(trim($data->DonViTinh))) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            $loaithietbivattu->MaLoaiThietBiVatTu = $data->MaLoaiThietBiVatTu;
            $loaithietbivattu->TenLoai = $data->TenLoai;
            $loaithietbivattu->DonViTinh = $data->DonViTinh;

            try {
                if ($loaithietbivattu->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại thiết bị vật tư đã được cập nhật",
                        'data' => [
                            "MaLoaiThietBiVatTu" => $loaithietbivattu->MaLoaiThietBiVatTu,
                            "TenLoai" => $loaithietbivattu->TenLoai,
                            "DonViTinh" => $loaithietbivattu->DonViTinh
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật loại thiết bị vật tư thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi cập nhật dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức PUT"
            ]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        if ($action === "DELETE") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaLoaiThietBiVatTu)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaLoaiThietBiVatTu"
                ]);
                http_response_code(400);
                exit;
            }

            $loaithietbivattu->MaLoaiThietBiVatTu = $data->MaLoaiThietBiVatTu;

            try {
                if ($loaithietbivattu->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Loại thiết bị vật tư đã được xóa"
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa loại thiết bị vật tư thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi xóa dữ liệu: ' . $e->getMessage()
                ]);
                http_response_code(500);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => "Action không hợp lệ cho phương thức DELETE"
            ]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode([
            'status' => 'error',
            'message' => "Phương thức không được hỗ trợ"
        ]);
        http_response_code(405);
        break;
}
?> 