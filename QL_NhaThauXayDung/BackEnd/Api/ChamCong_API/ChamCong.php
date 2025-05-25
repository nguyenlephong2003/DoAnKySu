<?php
// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database and object files
include_once '../../Config/Database.php';
include_once '../../Model/ChamCongModel.php';

// Get database connection
$database = new Database();
$db = $database->getConn();

// Initialize ChamCongModel
$chamCongModel = new ChamCongModel($db);

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'GET':
        try {
            // Lấy thông tin cơ bản của công trình
            $stmt = $chamCongModel->getAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    // Lấy thông tin phân công cho công trình này
                    $stmtPhanCong = $chamCongModel->getPhanCongByCongTrinh($row['MaCongTrinh']);
                    $phanCongList = [];
                    while ($phanCong = $stmtPhanCong->fetch(PDO::FETCH_ASSOC)) {
                        $phanCongList[] = [
                            "MaBangPhanCong" => $phanCong['MaBangPhanCong'],
                            "MaNhanVien" => $phanCong['MaNhanVien'],
                            "TenNhanVien" => $phanCong['TenNhanVien'],
                            "LuongCanBan" => (int)$phanCong['LuongCanBan'],
                            "MaLoaiNhanVien" => $phanCong['MaLoaiNhanVien'],
                            "NgayThamGia" => $phanCong['NgayThamGia'],
                            "NgayKetThuc" => $phanCong['NgayKetThuc'],
                            "SoNgayThamGia" => $phanCong['SoNgayThamGia']
                        ];
                    }

                    $item = [
                        "CongTrinh" => [
                            [
                                "MaCongTrinh" => $row['MaCongTrinh'],
                                "TenCongTrinh" => $row['TenCongTrinh'],
                                "TrangThai" => $row['TrangThai'],
                                "PhanCong" => $phanCongList
                            ]
                        ]
                    ];
                    $result[] = $item;
                }
                
                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            } else {
                echo json_encode([
                    "status" => "success",
                    "data" => []
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi lấy danh sách công trình: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_SINGLE':
        try {
            // Get cham cong ID
            $chamCongModel->MaChamCong = isset($_GET['id']) ? $_GET['id'] : die();

            // Read single cham cong
            $stmt = $chamCongModel->getOne();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $result = [
                    "MaChamCong" => $row['MaChamCong'],
                    "MaNhanVien" => $row['MaNhanVien'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => (int)$row['LuongCanBan'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "LuongThang" => (int)($row['LuongCanBan'] * $row['SoNgayLam']),
                    "MaCongTrinh" => $row['MaCongTrinh'],
                    "TenCongTrinh" => $row['TenCongTrinh'],
                    "NgayThamGia" => $row['NgayThamGia'],
                    "NgayKetThuc" => $row['NgayKetThuc']
                ];
                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Không tìm thấy bản ghi chấm công"
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi lấy thông tin chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_BY_EMPLOYEE':
        try {
            // Get employee ID
            $maNhanVien = isset($_GET['maNhanVien']) ? $_GET['maNhanVien'] : die();

            // Get cham cong records for employee
            $stmt = $chamCongModel->getByEmployee($maNhanVien);
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaChamCong" => $row['MaChamCong'],
                        "MaNhanVien" => $row['MaNhanVien'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "LuongCanBan" => (int)$row['LuongCanBan'],
                        "SoNgayLam" => $row['SoNgayLam'],
                        "KyLuong" => $row['KyLuong'],
                        "LuongThang" => (int)($row['LuongCanBan'] * $row['SoNgayLam']),
                        "MaCongTrinh" => $row['MaCongTrinh'],
                        "TenCongTrinh" => $row['TenCongTrinh'],
                        "NgayThamGia" => $row['NgayThamGia'],
                        "NgayKetThuc" => $row['NgayKetThuc']
                    ];
                    $result[] = $item;
                }
                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            } else {
                echo json_encode([
                    "status" => "success",
                    "data" => []
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi lấy thông tin chấm công theo nhân viên: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_BY_PERIOD':
        try {
            // Get period
            $kyLuong = isset($_GET['kyLuong']) ? $_GET['kyLuong'] : die();

            // Validate date format
            if (!preg_match('/^\d{4}-\d{2}$/', $kyLuong)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Định dạng kỳ lương không hợp lệ. Sử dụng định dạng YYYY-MM"
                ]);
                break;
            }

            // Get cham cong records for period
            $stmt = $chamCongModel->getByPeriod($kyLuong);
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaChamCong" => $row['MaChamCong'],
                        "MaNhanVien" => $row['MaNhanVien'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "LuongCanBan" => (int)$row['LuongCanBan'],
                        "SoNgayLam" => $row['SoNgayLam'],
                        "KyLuong" => $row['KyLuong'],
                        "LuongThang" => (int)($row['LuongCanBan'] * $row['SoNgayLam']),
                        "MaCongTrinh" => $row['MaCongTrinh'],
                        "TenCongTrinh" => $row['TenCongTrinh'],
                        "NgayThamGia" => $row['NgayThamGia'],
                        "NgayKetThuc" => $row['NgayKetThuc']
                    ];
                    $result[] = $item;
                }
                echo json_encode([
                    "status" => "success",
                    "data" => $result
                ]);
            } else {
                echo json_encode([
                    "status" => "success",
                    "data" => []
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi lấy thông tin chấm công theo kỳ lương: " . $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        try {
            // Get posted data
            $data = json_decode(file_get_contents("php://input"));
            
            // Validate required fields
            if (!isset($data->MaNhanVien) || !isset($data->MaCongTrinh) || !isset($data->NgayThamGia)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thiếu thông tin bắt buộc: MaNhanVien, MaCongTrinh, NgayThamGia"
                ]);
                break;
            }

            // Validate date format
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data->NgayThamGia)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Định dạng ngày tham gia không hợp lệ. Sử dụng định dạng YYYY-MM-DD"
                ]);
                break;
            }

            // Set property values
            $chamCongModel->MaNhanVien = $data->MaNhanVien;
            $chamCongModel->MaCongTrinh = $data->MaCongTrinh;
            $chamCongModel->NgayThamGia = $data->NgayThamGia;
            $chamCongModel->NgayKetThuc = $data->NgayKetThuc ?? null;
            $chamCongModel->SoNgayThamGia = $data->SoNgayThamGia ?? 1;
            $chamCongModel->SoNgayLam = $data->SoNgayThamGia ?? 1;
            $chamCongModel->KyLuong = date('Y-m-01', strtotime($data->NgayThamGia));

            // Create cham cong
            $result = $chamCongModel->create();
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi tạo bản ghi chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'PUT':
        try {
            // Get posted data
            $data = json_decode(file_get_contents("php://input"));

            // Validate required fields
            if (!isset($data->MaChamCong) || !isset($data->MaNhanVien) || !isset($data->MaCongTrinh)) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thiếu thông tin bắt buộc: MaChamCong, MaNhanVien, MaCongTrinh"
                ]);
                break;
            }

            // Set property values
            $chamCongModel->MaChamCong = $data->MaChamCong;
            $chamCongModel->MaNhanVien = $data->MaNhanVien;
            $chamCongModel->MaCongTrinh = $data->MaCongTrinh;
            $chamCongModel->NgayThamGia = $data->NgayThamGia;
            $chamCongModel->NgayKetThuc = $data->NgayKetThuc ?? null;
            $chamCongModel->SoNgayThamGia = $data->SoNgayThamGia ?? 1;
            $chamCongModel->SoNgayLam = $data->SoNgayLam;
            $chamCongModel->KyLuong = $data->KyLuong;

            // Update cham cong
            $result = $chamCongModel->update();
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi cập nhật bản ghi chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'DELETE':
        try {
            // Get cham cong ID
            $chamCongModel->MaChamCong = isset($_GET['id']) ? $_GET['id'] : die();

            // Get ky luong for delete
            $stmt = $chamCongModel->getOne();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $chamCongModel->MaNhanVien = $row['MaNhanVien'];
                $chamCongModel->KyLuong = $row['KyLuong'];
            }

            // Delete cham cong
            $result = $chamCongModel->delete();
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi xóa bản ghi chấm công: " . $e->getMessage()
            ]);
        }
        break;

    default:
        echo json_encode([
            "status" => "error",
            "message" => "Hành động không hợp lệ"
        ]);
        break;
}
?> 