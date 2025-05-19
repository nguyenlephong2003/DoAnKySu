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
include_once '../../Model/BangBaoCaoTienDo.php';

// Get database connection
$database = new Database();
$db = $database->getConn();

// Initialize BangBaoCaoTienDo object
$baoCaoTienDo = new BangBaoCaoTienDo($db);

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all bao cao tien do
        $stmt = $baoCaoTienDo->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $baoCao_arr = array();
            $baoCao_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $baoCao_item = array(
                    "MaTienDo" => $MaTienDo,
                    "ThoiGianHoanThanhThucTe" => $ThoiGianHoanThanhThucTe,
                    "CongViec" => $CongViec,
                    "NoiDungCongViec" => $NoiDungCongViec,
                    "NgayBaoCao" => $NgayBaoCao,
                    "TrangThai" => $TrangThai,
                    "TiLeHoanThanh" => $TiLeHoanThanh,
                    "HinhAnhTienDo" => $HinhAnhTienDo,
                    "MaCongTrinh" => $MaCongTrinh,
                    "TenCongTrinh" => $TenCongTrinh,
                    "Dientich" => $Dientich,
                    "FileThietKe" => $FileThietKe,
                    "MaKhachHang" => $MaKhachHang,
                    "MaHopDong" => $MaHopDong,
                    "MaLoaiCongTrinh" => $MaLoaiCongTrinh,
                    "NgayDuKienHoanThanh" => $NgayDuKienHoanThanh
                );
                array_push($baoCao_arr["data"], $baoCao_item);
            }

            http_response_code(200);
            echo json_encode($baoCao_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("data" => array()));
        }
        break;

    case 'GET_SINGLE':
        // Get bao cao ID
        $baoCaoTienDo->MaTienDo = isset($_GET['id']) ? $_GET['id'] : die();

        // Read single bao cao
        $result = $baoCaoTienDo->readSingle();

        if ($baoCaoTienDo->MaTienDo != null) {
            $baoCao_arr = array(
                "MaTienDo" => $baoCaoTienDo->MaTienDo,
                "ThoiGianHoanThanhThucTe" => $baoCaoTienDo->ThoiGianHoanThanhThucTe,
                "CongViec" => $baoCaoTienDo->CongViec,
                "NoiDungCongViec" => $baoCaoTienDo->NoiDungCongViec,
                "NgayBaoCao" => $baoCaoTienDo->NgayBaoCao,
                "TrangThai" => $baoCaoTienDo->TrangThai,
                "TiLeHoanThanh" => $baoCaoTienDo->TiLeHoanThanh,
                "HinhAnhTienDo" => $baoCaoTienDo->HinhAnhTienDo,
                "MaCongTrinh" => $baoCaoTienDo->MaCongTrinh,
                "TenCongTrinh" => $result['TenCongTrinh'],
                "Dientich" => $result['Dientich'],
                "FileThietKe" => $result['FileThietKe'],
                "MaKhachHang" => $result['MaKhachHang'],
                "MaHopDong" => $result['MaHopDong'],
                "MaLoaiCongTrinh" => $result['MaLoaiCongTrinh'],
                "NgayDuKienHoanThanh" => $result['NgayDuKienHoanThanh']
            );

            http_response_code(200);
            echo json_encode($baoCao_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy báo cáo tiến độ."));
        }
        break;

    case 'GET_BY_PROJECT':
        // Get project ID
        $maCongTrinh = isset($_GET['maCongTrinh']) ? $_GET['maCongTrinh'] : die();

        // Get progress reports for project
        $stmt = $baoCaoTienDo->getProjectProgressReports($maCongTrinh);
        $num = $stmt->rowCount();

        if ($num > 0) {
            $baoCao_arr = array();
            $baoCao_arr["data"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $baoCao_item = array(
                    "MaTienDo" => $MaTienDo,
                    "ThoiGianHoanThanhThucTe" => $ThoiGianHoanThanhThucTe,
                    "CongViec" => $CongViec,
                    "NoiDungCongViec" => $NoiDungCongViec,
                    "NgayBaoCao" => $NgayBaoCao,
                    "TrangThai" => $TrangThai,
                    "TiLeHoanThanh" => $TiLeHoanThanh,
                    "HinhAnhTienDo" => $HinhAnhTienDo,
                    "MaCongTrinh" => $MaCongTrinh
                );
                array_push($baoCao_arr["data"], $baoCao_item);
            }

            http_response_code(200);
            echo json_encode($baoCao_arr);
        } else {
            http_response_code(200);
            echo json_encode(array("data" => array()));
        }
        break;

    case 'POST':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaTienDo) &&
            !empty($data->CongViec) &&
            !empty($data->NoiDungCongViec) &&
            !empty($data->NgayBaoCao) &&
            isset($data->TrangThai) &&
            isset($data->TiLeHoanThanh) &&
            !empty($data->MaCongTrinh)
        ) {
            // Set bao cao property values
            $baoCaoTienDo->MaTienDo = $data->MaTienDo;
            $baoCaoTienDo->ThoiGianHoanThanhThucTe = $data->ThoiGianHoanThanhThucTe ?? null;
            $baoCaoTienDo->CongViec = $data->CongViec;
            $baoCaoTienDo->NoiDungCongViec = $data->NoiDungCongViec;
            $baoCaoTienDo->NgayBaoCao = $data->NgayBaoCao;
            $baoCaoTienDo->TrangThai = filter_var($data->TrangThai, FILTER_VALIDATE_INT) !== false ? (int)$data->TrangThai : 0;
            $baoCaoTienDo->TiLeHoanThanh = $data->TiLeHoanThanh;
            $baoCaoTienDo->HinhAnhTienDo = $data->HinhAnhTienDo ?? null;
            $baoCaoTienDo->MaCongTrinh = $data->MaCongTrinh;

            // Create bao cao
            if ($baoCaoTienDo->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Tạo báo cáo tiến độ thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể tạo báo cáo tiến độ."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể tạo báo cáo tiến độ. Dữ liệu không đầy đủ."));
        }
        break;

    case 'PUT':
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate required fields
        if (
            !empty($data->MaTienDo) &&
            !empty($data->CongViec) &&
            !empty($data->NoiDungCongViec) &&
            !empty($data->NgayBaoCao) &&
            !empty($data->TrangThai) &&
            !empty($data->TiLeHoanThanh) &&
            !empty($data->MaCongTrinh)
        ) {
            // Set bao cao property values
            $baoCaoTienDo->MaTienDo = $data->MaTienDo;
            $baoCaoTienDo->ThoiGianHoanThanhThucTe = $data->ThoiGianHoanThanhThucTe ?? null;
            $baoCaoTienDo->CongViec = $data->CongViec;
            $baoCaoTienDo->NoiDungCongViec = $data->NoiDungCongViec;
            $baoCaoTienDo->NgayBaoCao = $data->NgayBaoCao;
            $baoCaoTienDo->TrangThai = $data->TrangThai;
            $baoCaoTienDo->TiLeHoanThanh = $data->TiLeHoanThanh;
            $baoCaoTienDo->HinhAnhTienDo = $data->HinhAnhTienDo ?? null;
            $baoCaoTienDo->MaCongTrinh = $data->MaCongTrinh;

            // Update bao cao
            if ($baoCaoTienDo->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cập nhật báo cáo tiến độ thành công."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Không thể cập nhật báo cáo tiến độ."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Không thể cập nhật báo cáo tiến độ. Dữ liệu không đầy đủ."));
        }
        break;

    case 'DELETE':
        // Get bao cao ID
        $baoCaoTienDo->MaTienDo = isset($_GET['id']) ? $_GET['id'] : die();

        // Delete bao cao
        if ($baoCaoTienDo->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Xóa báo cáo tiến độ thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể xóa báo cáo tiến độ."));
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(array("message" => "Hành động không hợp lệ."));
        break;
}
?> 