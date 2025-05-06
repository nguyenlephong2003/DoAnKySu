<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NguoiDungAll.php';

$database = new Database();
$db = $database->getConn();
$manager = new NguoiDungAll($db);

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
            $nhanVienStmt = $manager->getAllNhanVien();
            $nhanViens = $nhanVienStmt->fetchAll(PDO::FETCH_ASSOC);
            
            $result = [];
            
            foreach ($nhanViens as $nhanVien) {
                $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
                $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                $taiKhoanStmt = $manager->getTaiKhoanByNhanVien($nhanVien['MaNhanVien']);
                $taiKhoan = $taiKhoanStmt->fetch(PDO::FETCH_ASSOC);
                
                $nhanVien['loainhanvien'] = [
                    $loaiNhanVien
                ];
                
                if ($taiKhoan) {
                    $nhanVien['taikhoan'] = [
                        $taiKhoan
                    ];
                } else {
                    $nhanVien['taikhoan'] = [];
                }
                
                $result[] = $nhanVien;
            }
            
            // Trả về kết quả dạng JSON
            echo json_encode(['nhanvien' => $result]);
            
        } elseif ($action === "getById") {
            $maNV = isset($_GET['MaNhanVien']) ? $_GET['MaNhanVien'] : null;
            if ($maNV) {
                // Lấy thông tin nhân viên
                $nhanVienStmt = $manager->getNhanVienById($maNV);
                $nhanVien = $nhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                if ($nhanVien) {
                    // Lấy thông tin loại nhân viên
                    $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
                    $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
                    
                    // Lấy thông tin tài khoản
                    $taiKhoanStmt = $manager->getTaiKhoanByNhanVien($nhanVien['MaNhanVien']);
                    $taiKhoan = $taiKhoanStmt->fetch(PDO::FETCH_ASSOC);
                    
                    // Thêm thông tin vào nhân viên
                    $nhanVien['loainhanvien'] = [
                        $loaiNhanVien
                    ];
                    
                    if ($taiKhoan) {
                        $nhanVien['taikhoan'] = [
                            $taiKhoan
                        ];
                    } else {
                        $nhanVien['taikhoan'] = [];
                    }
                    
                    // Trả về kết quả dạng JSON
                    echo json_encode(['nhanvien' => [$nhanVien]]);
                } else {
                    echo json_encode(["message" => "Không tìm thấy nhân viên với mã $maNV"]);
                    http_response_code(404);
                }
            } else {
                echo json_encode(["message" => "Thiếu MaNhanVien"]);
                http_response_code(400);
            }
        } elseif ($action === "getByLoaiNhanVien") {
            $maLoai = isset($_GET['MaLoaiNhanVien']) ? $_GET['MaLoaiNhanVien'] : null;
            if ($maLoai) {
                // Lấy tất cả nhân viên theo loại
                $nhanVienStmt = $manager->getNhanVienByLoai($maLoai);
                $nhanViens = $nhanVienStmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Lấy thông tin loại nhân viên
                $loaiNhanVienStmt = $manager->getLoaiNhanVienById($maLoai);
                $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                // Kết quả cuối cùng
                $result = [];
                
                // Duyệt qua từng nhân viên để lấy thông tin liên quan
                foreach ($nhanViens as $nhanVien) {
                    // Lấy thông tin tài khoản
                    $taiKhoanStmt = $manager->getTaiKhoanByNhanVien($nhanVien['MaNhanVien']);
                    $taiKhoan = $taiKhoanStmt->fetch(PDO::FETCH_ASSOC);
                    
                    // Thêm thông tin vào nhân viên
                    $nhanVien['loainhanvien'] = [
                        $loaiNhanVien
                    ];
                    
                    if ($taiKhoan) {
                        $nhanVien['taikhoan'] = [
                            $taiKhoan
                        ];
                    } else {
                        $nhanVien['taikhoan'] = [];
                    }
                    
                    $result[] = $nhanVien;
                }
                
                // Trả về kết quả dạng JSON
                echo json_encode(['nhanvien' => $result]);
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

            $cccd = isset($data->CCCD) ? $data->CCCD : null;
            $ngayVao = isset($data->NgayVao) ? $data->NgayVao : date('Y-m-d H:i:s');

            if ($manager->addNhanVien($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $cccd, $data->Email, $ngayVao, $data->MaLoaiNhanVien)) {
                // Lấy thông tin nhân viên vừa thêm
                $nhanVienStmt = $manager->getNhanVienById($data->MaNhanVien);
                $nhanVien = $nhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                // Lấy thông tin loại nhân viên
                $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
                $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                // Thêm thông tin vào nhân viên
                $nhanVien['loainhanvien'] = [
                    $loaiNhanVien
                ];
                $nhanVien['taikhoan'] = [];
                
                echo json_encode([
                    "message" => "Nhân viên đã được thêm thành công",
                    "nhanvien" => [$nhanVien]
                ]);
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

            $cccd = isset($data->CCCD) ? $data->CCCD : null;
            $ngayVao = isset($data->NgayVao) ? $data->NgayVao : null;

            if ($manager->updateNhanVien($data->MaNhanVien, $data->TenNhanVien, $data->SoDT, $cccd, $data->Email, $ngayVao, $data->MaLoaiNhanVien)) {
                // Lấy thông tin nhân viên sau khi cập nhật
                $nhanVienStmt = $manager->getNhanVienById($data->MaNhanVien);
                $nhanVien = $nhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                // Lấy thông tin loại nhân viên
                $loaiNhanVienStmt = $manager->getLoaiNhanVienById($nhanVien['MaLoaiNhanVien']);
                $loaiNhanVien = $loaiNhanVienStmt->fetch(PDO::FETCH_ASSOC);
                
                // Lấy thông tin tài khoản
                $taiKhoanStmt = $manager->getTaiKhoanByNhanVien($nhanVien['MaNhanVien']);
                $taiKhoan = $taiKhoanStmt->fetch(PDO::FETCH_ASSOC);
                
                // Thêm thông tin vào nhân viên
                $nhanVien['loainhanvien'] = [
                    $loaiNhanVien
                ];
                
                if ($taiKhoan) {
                    $nhanVien['taikhoan'] = [
                        $taiKhoan
                    ];
                } else {
                    $nhanVien['taikhoan'] = [];
                }
                
                echo json_encode([
                    "message" => "Nhân viên đã được cập nhật",
                    "nhanvien" => [$nhanVien]
                ]);
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

            if ($manager->deleteNhanVien($data->MaNhanVien)) {
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