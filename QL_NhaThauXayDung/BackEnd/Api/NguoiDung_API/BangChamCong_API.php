<?php
// BangChamCong_API.php - API quản lý bảng chấm công và tính lương

// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and models
require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NhanVien.php';
require_once __DIR__ . '/../../Model/BangChamCong.php';

// Khởi tạo đối tượng database
$database = new Database();
$db = $database->getConn();

// Khởi tạo đối tượng BangChamCong
$bangChamCong = new BangChamCong($db);

// Lấy action từ request
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode(["status" => "error", "message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Trả về status 200 OK cho preflight request
    http_response_code(200);
    exit();
}

// Xử lý các action
switch ($action) {
    case 'GET':
        // Lấy tất cả bản ghi chấm công và thông tin lương
        getAllChamCong();
        break;

    case 'GET_ONE':
        // Lấy một bản ghi chấm công theo mã
        $maChamCong = isset($_GET['ma_cham_cong']) ? $_GET['ma_cham_cong'] : die();
        getChamCongById($bangChamCong, $maChamCong);
        break;

    case 'GET_BY_EMPLOYEE':
        // Lấy bản ghi chấm công theo mã nhân viên
        $maNhanVien = isset($_GET['ma_nhan_vien']) ? $_GET['ma_nhan_vien'] : die();
        getChamCongByEmployee($bangChamCong, $maNhanVien);
        break;

    case 'GET_BY_PERIOD':
        // Lấy bản ghi chấm công theo kỳ lương
        $kyLuong = isset($_GET['ky_luong']) ? $_GET['ky_luong'] : die();
        getChamCongByPeriod($bangChamCong, $kyLuong);
        break;

    case 'SEARCH':
        // Tìm kiếm bản ghi chấm công
        $keywords = isset($_GET['keywords']) ? $_GET['keywords'] : die();
        searchChamCong($bangChamCong, $keywords);
        break;

    case 'CREATE':
        // Tạo mới bản ghi chấm công
        createChamCong($bangChamCong);
        break;

    case 'UPDATE':
        // Cập nhật bản ghi chấm công
        updateChamCong($bangChamCong);
        break;

    case 'DELETE':
        // Xóa bản ghi chấm công
        $maChamCong = isset($_GET['ma_cham_cong']) ? $_GET['ma_cham_cong'] : die();
        deleteChamCong($bangChamCong, $maChamCong);
        break;

    default:
        // Hành động mặc định là lấy tất cả
        getAllChamCong();
        break;
}

// Hàm lấy tất cả bản ghi chấm công
function getAllChamCong()
{
    global $bangChamCong;

    // Phân trang nếu có
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

    // Tính toán vị trí bắt đầu
    $from = ($page - 1) * $limit;

    // Nếu có tham số phân trang
    if ($page > 0 && $limit > 0) {
        $result = $bangChamCong->readPaging($from, $limit);
        $total = $bangChamCong->count();

        if ($result["status"] === "success") {
            // Thêm thông tin phân trang vào kết quả
            $result["pagination"] = [
                "total_records" => (int)$total,
                "current_page" => $page,
                "records_per_page" => $limit,
                "total_pages" => ceil($total / $limit)
            ];
        }
    } else {
        // Lấy tất cả không phân trang
        $result = $bangChamCong->readAll();
    }

    // Trả về kết quả
    echo json_encode($result);
}

// Hàm lấy bản ghi chấm công theo mã
function getChamCongById($bangChamCong, $maChamCong)
{
    // Gán mã chấm công
    $bangChamCong->MaChamCong = $maChamCong;

    // Lấy thông tin
    $result = $bangChamCong->readOne();

    // Trả về kết quả
    echo json_encode($result);
}

// Hàm lấy bản ghi chấm công theo mã nhân viên
function getChamCongByEmployee($bangChamCong, $maNhanVien)
{
    // Lấy thông tin
    $stmt = $bangChamCong->getSalaryInfoByEmployee($maNhanVien);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $data = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $item = [
                "MaChamCong" => $row['MaChamCong'],
                "MaNhanVien" => $row['MaNhanVien'],
                "TenNhanVien" => $row['TenNhanVien'],
                "LuongCanBan" => (int)$row['LuongCanBan'],
                "SoNgayLam" => $row['SoNgayLam'],
                "KyLuong" => $row['KyLuong'],
                "LuongThang" => (int)$row['LuongThang']
            ];
            $data[] = $item;
        }

        $result = [
            "status" => "success",
            "data" => $data
        ];
    } else {
        $result = [
            "status" => "error",
            "message" => "Không tìm thấy thông tin chấm công cho nhân viên " . $maNhanVien
        ];
    }

    // Trả về kết quả
    echo json_encode($result);
}

// Hàm lấy bản ghi chấm công theo kỳ lương
function getChamCongByPeriod($bangChamCong, $kyLuong)
{
    // Lấy thông tin
    $stmt = $bangChamCong->getSalaryInfoByPeriod($kyLuong);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $data = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $item = [
                "MaChamCong" => $row['MaChamCong'],
                "MaNhanVien" => $row['MaNhanVien'],
                "TenNhanVien" => $row['TenNhanVien'],
                "LuongCanBan" => (int)$row['LuongCanBan'],
                "SoNgayLam" => $row['SoNgayLam'],
                "KyLuong" => $row['KyLuong'],
                "LuongThang" => (int)$row['LuongThang']
            ];
            $data[] = $item;
        }

        $result = [
            "status" => "success",
            "data" => $data
        ];
    } else {
        $result = [
            "status" => "error",
            "message" => "Không tìm thấy thông tin chấm công cho kỳ lương " . $kyLuong
        ];
    }

    // Trả về kết quả
    echo json_encode($result);
}

// Hàm tìm kiếm bản ghi chấm công
function searchChamCong($bangChamCong, $keywords)
{
    // Lấy kết quả tìm kiếm
    $result = $bangChamCong->search($keywords);

    // Trả về kết quả
    echo json_encode($result);
}

// Hàm tạo mới bản ghi chấm công
function createChamCong($bangChamCong)
{
    // Lấy dữ liệu gửi lên
    $data = json_decode(file_get_contents("php://input"));

    // Kiểm tra dữ liệu
    if (
        !empty($data->maNhanVien) &&
        !empty($data->soNgayLam) &&
        !empty($data->kyLuong)
    ) {
        // Tạo mã chấm công tự động theo định dạng CC + id tự tăng
        $query = "SELECT MAX(SUBSTRING(MaChamCong, 3)) AS max_id FROM BangChamCong";
        $stmt = $GLOBALS['db']->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextId = (int)($row['max_id'] ?? 0) + 1;

        // Gán giá trị cho đối tượng
        $bangChamCong->MaChamCong = 'CC' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        $bangChamCong->MaNhanVien = $data->maNhanVien;
        $bangChamCong->SoNgayLam = $data->soNgayLam;
        $bangChamCong->KyLuong = $data->kyLuong;

        // Tạo bản ghi
        $result = $bangChamCong->create();

        // Trả về kết quả
        echo json_encode($result);
    } else {
        // Dữ liệu không đầy đủ
        echo json_encode([
            "status" => "error",
            "message" => "Không thể tạo bản ghi chấm công. Dữ liệu không đầy đủ."
        ]);
    }
}

// Hàm cập nhật bản ghi chấm công
function updateChamCong($bangChamCong)
{
    // Lấy dữ liệu gửi lên
    $data = json_decode(file_get_contents("php://input"));

    // Kiểm tra dữ liệu
    if (
        !empty($data->maChamCong) &&
        !empty($data->maNhanVien) &&
        !empty($data->soNgayLam) &&
        !empty($data->kyLuong)
    ) {
        // Gán giá trị cho đối tượng
        $bangChamCong->MaChamCong = $data->maChamCong;
        $bangChamCong->MaNhanVien = $data->maNhanVien;
        $bangChamCong->SoNgayLam = $data->soNgayLam;
        $bangChamCong->KyLuong = $data->kyLuong;

        // Cập nhật bản ghi
        $result = $bangChamCong->update();

        // Trả về kết quả
        echo json_encode($result);
    } else {
        // Dữ liệu không đầy đủ
        echo json_encode([
            "status" => "error",
            "message" => "Không thể cập nhật bản ghi chấm công. Dữ liệu không đầy đủ."
        ]);
    }
}

// Hàm xóa bản ghi chấm công
function deleteChamCong($bangChamCong, $maChamCong)
{
    // Gán mã chấm công
    $bangChamCong->MaChamCong = $maChamCong;

    // Xóa bản ghi
    $result = $bangChamCong->delete();

    // Trả về kết quả
    echo json_encode($result);
}
