<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NhanVien.php';

// Xử lý OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


// Kết nối cơ sở dữ liệu
$database = new Database();
$db = $database->getConn();
$nhanvien = new NhanVien($db);

// Lấy phương thức HTTP và tham số `action`
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode(["status" => "error", "message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

switch ($method) {
    case 'GET':
        if ($action === "GET") {
            $stmt = $nhanvien->getAll();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } elseif ($action === "getById") {
            $nhanvien->MaNhanVien = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($nhanvien->MaNhanVien) {
                $stmt = $nhanvien->getById();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($result) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $result
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Không tìm thấy nhân viên với mã ' . $nhanvien->MaNhanVien
                    ]);
                    http_response_code(404);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Thiếu MaNhanVien"]);
                http_response_code(400);
            }
        } elseif ($action === "getByLoaiNhanVien") {
            $nhanvien->MaLoaiNhanVien = isset($_GET['MaLoaiNhanVien']) ? intval($_GET['MaLoaiNhanVien']) : null;
            if ($nhanvien->MaLoaiNhanVien) {
                $stmt = $nhanvien->getByLoaiNhanVien();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Thiếu MaLoaiNhanVien"]);
                http_response_code(400);
            }
        } elseif ($action === "generateCode") {
            $prefix = isset($_GET['prefix']) ? $_GET['prefix'] : "NV";
            $newCode = $nhanvien->generateEmployeeCode($prefix);
            
            if ($newCode) {
                echo json_encode([
                    'status' => 'success',
                    'data' => ["MaNhanVien" => $newCode]
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Không thể tạo mã nhân viên"]);
                http_response_code(500);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Action không hợp lệ"]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            // Nhận dữ liệu từ client
            $data = json_decode(file_get_contents("php://input"));
            
            // Nếu không có MaNhanVien, tự động tạo
            if (empty($data->MaNhanVien)) {
                $prefix = isset($data->prefix) ? $data->prefix : "NV";
                $data->MaNhanVien = $nhanvien->generateEmployeeCode($prefix);
            }
            
            // Kiểm tra dữ liệu đầu vào
            if (!isset($data->TenNhanVien, $data->SoDT, $data->Email, $data->MaLoaiNhanVien)) {
                echo json_encode(["status" => "error", "message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }
            
            // Gán dữ liệu cho đối tượng
            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : date('Y-m-d H:i:s');
            $nhanvien->MaLoaiNhanVien = intval($data->MaLoaiNhanVien);

            // Thêm nhân viên
            $result = $nhanvien->add();
            if ($result !== false) {
                echo json_encode($result);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Action không hợp lệ cho phương thức POST"]);
            http_response_code(400);
        }
        break;

    case 'PUT':
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $data->Email, $data->MaLoaiNhanVien)) {
                echo json_encode(["status" => "error", "message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;
            $nhanvien->TenNhanVien = $data->TenNhanVien;
            $nhanvien->SoDT = $data->SoDT;
            $nhanvien->CCCD = isset($data->CCCD) ? $data->CCCD : null;
            $nhanvien->Email = $data->Email;
            $nhanvien->NgayVao = isset($data->NgayVao) ? $data->NgayVao : null;
            $nhanvien->MaLoaiNhanVien = intval($data->MaLoaiNhanVien);

            $result = $nhanvien->update();
            if ($result !== false) {
                echo json_encode($result);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Action không hợp lệ cho phương thức PUT"]);
            http_response_code(400);
        }
        break;

    case 'DELETE':
        if ($action === "DELETE") {
            $data = json_decode(file_get_contents("php://input"));
            if (!isset($data->MaNhanVien)) {
                echo json_encode(["status" => "error", "message" => "Dữ liệu không đầy đủ"]);
                http_response_code(400);
                exit;
            }

            $nhanvien->MaNhanVien = $data->MaNhanVien;

            $result = $nhanvien->delete();
            if ($result !== false) {
                echo json_encode($result);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Action không hợp lệ cho phương thức DELETE"]);
            http_response_code(400);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ"]);
        http_response_code(405);
        break;
}
?>