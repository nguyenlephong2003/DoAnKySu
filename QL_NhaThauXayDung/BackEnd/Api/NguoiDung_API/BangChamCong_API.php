<?php
// BangChamCong_API.php - API quản lý bảng chấm công và tính lương

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/NhanVien.php';
require_once __DIR__ . '/../../Model/BangChamCong.php';

$database = new Database();
$db = $database->getConn();

$bangChamCong = new BangChamCong($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

if (!$action) {
    echo json_encode(["status" => "error", "message" => "Yêu cầu không hợp lệ: thiếu tham số action"]);
    http_response_code(400);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($action) {
    case 'GET':
        getAllChamCong();
        break;
    case 'GET_ONE':
        $maChamCong = isset($_GET['ma_cham_cong']) ? $_GET['ma_cham_cong'] : die(json_encode(["status" => "error", "message" => "Thiếu tham số ma_cham_cong"]));
        getChamCongById($bangChamCong, $maChamCong);
        break;
    case 'GET_BY_EMPLOYEE':
        $maNhanVien = isset($_GET['ma_nhan_vien']) ? $_GET['ma_nhan_vien'] : die(json_encode(["status" => "error", "message" => "Thiếu tham số ma_nhan_vien"]));
        getChamCongByEmployee($bangChamCong, $maNhanVien);
        break;
    case 'POST':
        createChamCong($bangChamCong);
        break;
    case 'PUT':
        updateChamCong($bangChamCong);
        break;
    case 'DELETE':
        $maNhanVien = isset($_GET['ma_cham_cong']) ? $_GET['ma_cham_cong'] : die(json_encode(["status" => "error", "message" => "Thiếu tham số ma_cham_cong"]));
        deleteChamCong($bangChamCong, $maNhanVien);
        break;
    default:
        getAllChamCong();
        break;
}

function getAllChamCong() {
    global $bangChamCong;
    $result = $bangChamCong->readAll();
    echo json_encode($result);
}

function getChamCongById($bangChamCong, $maChamCong) {
    $bangChamCong->MaChamCong = $maChamCong;
    $result = $bangChamCong->readOne();
    echo json_encode($result);
}

function getChamCongByEmployee($bangChamCong, $maNhanVien) {
    $stmt = $bangChamCong->getSalaryInfoByEmployee($maNhanVien);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $luongThang = (int)$row['LuongCanBan'] * (int)$row['SoNgayLam'];
            $item = [
                "MaChamCong" => $row['MaChamCong'],
                "MaNhanVien" => $row['MaNhanVien'],
                "TenNhanVien" => $row['TenNhanVien'],
                "LuongCanBan" => (int)$row['LuongCanBan'],
                "SoNgayLam" => (float)$row['SoNgayLam'],
                "KyLuong" => (int)$row['KyLuong'],
                "LuongThang" => $luongThang
            ];
            $data[] = $item;
        }
        $result = ["status" => "success", "data" => $data];
    } else {
        $result = ["status" => "error", "message" => "Không tìm thấy thông tin chấm công cho nhân viên " . $maNhanVien];
    }
    echo json_encode($result);
}

function createChamCong($bangChamCong) {
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->MaNhanVien) && isset($data->SoNgayLam) && isset($data->KyLuong)) {
        $query = "SELECT MAX(SUBSTRING(MaChamCong, 3)) AS max_id FROM BangChamCong";
        $stmt = $GLOBALS['db']->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextId = (int)($row['max_id'] ?? 0) + 1;

        $bangChamCong->MaChamCong = 'CC' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        $bangChamCong->MaNhanVien = htmlspecialchars(strip_tags($data->MaNhanVien));
        $bangChamCong->SoNgayLam = (int)$data->SoNgayLam;
        $bangChamCong->KyLuong = (int)$data->KyLuong;

        $result = $bangChamCong->create();
        echo json_encode($result);
    } else {
        echo json_encode(["status" => "error", "message" => "Dữ liệu không đầy đủ để tạo bản ghi chấm công"]);
    }
}

function updateChamCong($bangChamCong) {
    $data = json_decode(file_get_contents("php://input"));
error_log(print_r($data, true));

    // Kiểm tra từng trường dữ liệu

    if (empty($data->MaNhanVien)) {
        echo json_encode(["status" => "error", "message" => "Thiếu mã nhân viên (MaNhanVien)"]);
        return;
    }
    if (!isset($data->SoNgayLam)) {
        echo json_encode(["status" => "error", "message" => "Thiếu số ngày làm (SoNgayLam)"]);
        return;
    }
    if (!isset($data->KyLuong)) {
        echo json_encode(["status" => "error", "message" => "Thiếu kỳ lương (KyLuong)"]);
        return;
    }

    // Gán giá trị cho đối tượng
    // $bangChamCong->MaChamCong = htmlspecialchars(strip_tags($data->MaChamCong));
    $bangChamCong->MaNhanVien = htmlspecialchars(strip_tags($data->MaNhanVien));
    $bangChamCong->SoNgayLam = (float)$data->SoNgayLam;
    $bangChamCong->KyLuong = (int)$data->KyLuong;

    // Thực hiện cập nhật
    $result = $bangChamCong->update();
    echo json_encode($result);
}



function deleteChamCong($bangChamCong, $maChamCong) {
    echo "Giá trị đầu vào maChamCong: ";
    var_dump($maChamCong);

    // Làm sạch đầu vào
    $bangChamCong->MaChamCong = htmlspecialchars(strip_tags($maChamCong));

    echo "Sau khi làm sạch: ";
    var_dump($bangChamCong->MaChamCong);

    // Thực hiện xóa
    $result = $bangChamCong->delete();

    echo "Kết quả hàm delete(): ";
    var_dump($result);

    // Trả kết quả dưới dạng JSON
    echo json_encode($result);
}

?>

