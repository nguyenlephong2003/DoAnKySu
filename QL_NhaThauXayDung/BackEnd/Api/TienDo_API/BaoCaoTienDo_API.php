<?php
// Set headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database and object files
include_once '../../Config/Database.php';
include_once '../../Model/BangBaoCaoTienDo.php';
include_once '../../Config/VerifyToken.php';

// Get database connection
$database = new Database();
$db = $database->getConn();

// Initialize BangBaoCaoTienDo object
$baoCaoTienDo = new BangBaoCaoTienDo($db);
$verifyToken = new VerifyToken();

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Xác thực token
$tokenValidation = $verifyToken->validate();
if (!$tokenValidation['valid']) {
    echo json_encode([
        'status' => 'error',
        'message' => $tokenValidation['message']
    ]);
    http_response_code(401);
    exit;
}

// Handle different actions
switch ($action) {
    case 'GET':
        // Read all bao cao tien do
        $stmt = $baoCaoTienDo->readAll();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $baoCao_arr = array();
            $baoCao_arr["data"] = array();
            $projects = array(); // Lưu trữ thông tin các công trình

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                // Nếu chưa có thông tin công trình này trong mảng projects
                if (!isset($projects[$MaCongTrinh])) {
                    $projects[$MaCongTrinh] = array(
                        "MaCongTrinh" => $MaCongTrinh,
                        "TenCongTrinh" => $TenCongTrinh,
                        "Dientich" => $Dientich,
                        "FileThietKe" => $FileThietKe,
                        "MaKhachHang" => $MaKhachHang,
                        "MaHopDong" => $MaHopDong,
                        "MaLoaiCongTrinh" => $MaLoaiCongTrinh,
                        "NgayDuKienHoanThanh" => $NgayDuKienHoanThanh,
                        "TongTienDo" => 0,
                        "NgayHoanThanh" => null,
                        "SoBaoCao" => 0,
                        "TrangThai" => "Chưa có báo cáo",
                        "DanhSachBaoCao" => array()
                    );
                }

                // Thêm báo cáo vào danh sách của công trình
                if (!empty($MaTienDo)) {
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

                    // Thêm báo cáo vào công trình tương ứng
                    $projects[$MaCongTrinh]["DanhSachBaoCao"][] = $baoCao_item;
                    $projects[$MaCongTrinh]["SoBaoCao"]++;
                }
            }

            // Xử lý dữ liệu cho từng công trình
            foreach ($projects as &$project) {
                if (!empty($project["DanhSachBaoCao"])) {
                    // Sắp xếp danh sách báo cáo theo ngày báo cáo giảm dần
                    usort($project["DanhSachBaoCao"], function($a, $b) {
                        return strtotime($b["NgayBaoCao"]) - strtotime($a["NgayBaoCao"]);
                    });

                    // Tính tổng tiến độ từ tất cả các báo cáo
                    $tongTiLeHoanThanh = 0;
                    foreach ($project["DanhSachBaoCao"] as $report) {
                        $tongTiLeHoanThanh += floatval($report["TiLeHoanThanh"]);
                    }
                    $project["TongTienDo"] = $tongTiLeHoanThanh;
                    
                    // Lấy báo cáo mới nhất để cập nhật trạng thái tổng
                    $latestReport = $project["DanhSachBaoCao"][0];
                    
                    // Kiểm tra và cập nhật trạng thái tổng
                    if ($tongTiLeHoanThanh >= 100) {
                        $project["TrangThai"] = "Hoàn thành";
                        // Tìm ngày hoàn thành từ báo cáo có tỷ lệ hoàn thành 100%
                        foreach ($project["DanhSachBaoCao"] as $report) {
                            if ($report["TiLeHoanThanh"] >= 100) {
                                $project["NgayHoanThanh"] = $report["ThoiGianHoanThanhThucTe"];
                                break;
                            }
                        }
                    } else {
                        $project["TrangThai"] = "Đang thực hiện";
                        $project["NgayHoanThanh"] = null;
                    }
                }
            }

            // Chuyển đổi mảng projects thành mảng tuần tự
            $baoCao_arr["data"] = array_values($projects);

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
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            
            // Kiểm tra dữ liệu đầu vào
            if (!isset($data->MaCongTrinh, $data->CongViec, $data->NoiDungCongViec, 
                      $data->NgayBaoCao, $data->TrangThai, $data->TiLeHoanThanh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra ngày báo cáo không được trong tương lai
            if (strtotime($data->NgayBaoCao) > time()) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Ngày báo cáo không được trong tương lai"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra tỷ lệ hoàn thành hợp lệ
            if ($data->TiLeHoanThanh < 0 || $data->TiLeHoanThanh > 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tỷ lệ hoàn thành phải từ 0 đến 100"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra tiến độ của công trình
            $stmt = $baoCaoTienDo->getOverallProjectProgress($data->MaCongTrinh);
            if ($stmt && $stmt['TongTienDo'] >= 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Công trình đã hoàn thành 100%, không thể tạo thêm báo cáo tiến độ"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra MaTienDo đã được gửi
            if (empty($data->MaTienDo)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Mã tiến độ không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

            // Gán dữ liệu cho đối tượng
            $baoCaoTienDo->MaTienDo = $data->MaTienDo;
            $baoCaoTienDo->ThoiGianHoanThanhThucTe = $data->ThoiGianHoanThanhThucTe ?? null;
            $baoCaoTienDo->CongViec = $data->CongViec;
            $baoCaoTienDo->NoiDungCongViec = $data->NoiDungCongViec;
            $baoCaoTienDo->NgayBaoCao = $data->NgayBaoCao;
            $baoCaoTienDo->TrangThai = $data->TrangThai;
            $baoCaoTienDo->TiLeHoanThanh = $data->TiLeHoanThanh;
            $baoCaoTienDo->HinhAnhTienDo = $data->HinhAnhTienDo ?? null;
            $baoCaoTienDo->MaCongTrinh = $data->MaCongTrinh;

            try {
                if ($baoCaoTienDo->create()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Tạo báo cáo tiến độ thành công."
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Tạo báo cáo tiến độ thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi tạo báo cáo: ' . $e->getMessage()
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
            // Kiểm tra ngày báo cáo không được trong tương lai
            if (strtotime($data->NgayBaoCao) > time()) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Ngày báo cáo không được trong tương lai"
                ]);
                http_response_code(400);
                exit;
            }

            // Kiểm tra tỷ lệ hoàn thành hợp lệ
            if ($data->TiLeHoanThanh < 0 || $data->TiLeHoanThanh > 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tỷ lệ hoàn thành phải từ 0 đến 100"
                ]);
                http_response_code(400);
                exit;
            }

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