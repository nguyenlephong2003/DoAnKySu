<?php
// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
    header("Vary: Origin");
    http_response_code(200);
    exit();
}

// Security headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Expose-Headers: *");
header("Vary: Origin");

// Content type
header("Content-Type: application/json; charset=UTF-8");

// Add ngrok-skip-browser-warning headers
header("ngrok-skip-browser-warning: true");
header("X-Ngrok-Skip-Browser-Warning: true");

require_once __DIR__ . '/../../Config/Database.php';
require_once __DIR__ . '/../../Model/BangBaoCaoTienDo_Model.php';

$database = new Database();
$db = $database->getConn();
$baoCaoTienDo = new BangBaoCaoTienDo($db);

$input = json_decode(file_get_contents("php://input"), true);

if (
    $_SERVER['REQUEST_METHOD'] === 'POST' &&
    isset($input['MaCongTrinh']) &&
    (!isset($input['action']) || $input['action'] === '')
) {
    $maCongTrinh = trim($input['MaCongTrinh']);
    if ($maCongTrinh === "") {
        // Nếu MaCongTrinh rỗng, trả về tất cả báo cáo
        try {
            $stmt = $baoCaoTienDo->readAll();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $baoCao_arr = array();
                $baoCao_arr["data"] = array();
                $projects = array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    if (!isset($projects[$MaCongTrinh])) {
                        $projects[$MaCongTrinh] = array(
                            "MaCongTrinh" => $MaCongTrinh,
                            "TenCongTrinh" => $TenCongTrinh,
                            "Dientich" => $Dientich,
                            "FileThietKe" => $FileThietKe,
                            "MaKhachHang" => $MaKhachHang,
                            "MaHopDong" => $MaHopDong,
                            "MaLoaiCongTrinh" => $MaLoaiCongTrinh,
                            "NgayDuKienHoanThanh" => !empty($NgayDuKienHoanThanh) ? date('d/m/Y', strtotime($NgayDuKienHoanThanh)) : null,
                            "TongTienDo" => 0,
                            "NgayHoanThanh" => null,
                            "SoBaoCao" => 0,
                            "TrangThai" => "Chưa có báo cáo",
                            "DanhSachBaoCao" => array()
                        );
                    }
                    if (!empty($MaTienDo)) {
                        $baoCao_item = array(
                            "MaTienDo" => $MaTienDo,
                            "ThoiGianHoanThanhThucTe" => !empty($ThoiGianHoanThanhThucTe) ? date('d/m/Y', strtotime($ThoiGianHoanThanhThucTe)) : null,
                            "CongViec" => $CongViec,
                            "NoiDungCongViec" => $NoiDungCongViec,
                            "NgayBaoCao" => !empty($NgayBaoCao) ? date('d/m/Y', strtotime($NgayBaoCao)) : null,
                            "TrangThai" => $TrangThai,
                            "TiLeHoanThanh" => $TiLeHoanThanh,
                            "HinhAnhTienDo" => $HinhAnhTienDo,
                            "MaCongTrinh" => $MaCongTrinh
                        );
                        $projects[$MaCongTrinh]["DanhSachBaoCao"][] = $baoCao_item;
                        $projects[$MaCongTrinh]["SoBaoCao"]++;
                    }
                }
                foreach ($projects as &$project) {
                    if (!empty($project["DanhSachBaoCao"])) {
                        usort($project["DanhSachBaoCao"], function($a, $b) {
                            return strtotime(str_replace('/', '-', $b["NgayBaoCao"])) - strtotime(str_replace('/', '-', $a["NgayBaoCao"]));
                        });
                        $tongTiLeHoanThanh = 0;
                        foreach ($project["DanhSachBaoCao"] as $report) {
                            $tongTiLeHoanThanh += floatval($report["TiLeHoanThanh"]);
                        }
                        $project["TongTienDo"] = $tongTiLeHoanThanh;
                        $latestReport = $project["DanhSachBaoCao"][0];
                        if ($tongTiLeHoanThanh >= 100) {
                            $project["TrangThai"] = "Hoàn thành";
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
                $baoCao_arr["data"] = array_values($projects);
                echo json_encode([
                    'status' => 'success',
                    'data' => $baoCao_arr["data"]
                ]);
            } else {
                echo json_encode([
                    'status' => 'success',
                    'data' => []
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
            ]);
            http_response_code(500);
        }
        exit;
    } else {
        // Nếu MaCongTrinh có giá trị, trả về báo cáo của công trình đó
        try {
            $stmt = $baoCaoTienDo->getProjectProgressReports($maCongTrinh);
            $num = is_array($stmt) ? count($stmt) : $stmt->rowCount();
            if ($num > 0) {
                $danhSachBaoCao = is_array($stmt) ? $stmt : [];
                if (!is_array($stmt)) {
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $danhSachBaoCao[] = $row;
                    }
                }
                echo json_encode([
                    'status' => 'success',
                    'data' => $danhSachBaoCao
                ]);
            } else {
                echo json_encode([
                    'status' => 'success',
                    'data' => []
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Lỗi khi lấy dữ liệu: ' . $e->getMessage()
            ]);
            http_response_code(500);
        }
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// Get action from request (support both GET and POST)
$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : null);

// If no action is specified but maCongTrinh is present in body, treat it as GET_BY_PROJECT
if (empty($action)) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input['maCongTrinh'])) {
        $action = 'GET_BY_PROJECT';
    }
}

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
    case 'POST': // Handle both GET and POST
        if ($action === "GET") {
            try {
                $stmt = $baoCaoTienDo->readAll();
                $num = $stmt->rowCount();

                if ($num > 0) {
                    $baoCao_arr = array();
                    $baoCao_arr["data"] = array();
                    $projects = array();

                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        
                        if (!isset($projects[$MaCongTrinh])) {
                            $projects[$MaCongTrinh] = array(
                                "MaCongTrinh" => $MaCongTrinh,
                                "TenCongTrinh" => $TenCongTrinh,
                                "Dientich" => $Dientich,
                                "FileThietKe" => $FileThietKe,
                                "MaKhachHang" => $MaKhachHang,
                                "MaHopDong" => $MaHopDong,
                                "MaLoaiCongTrinh" => $MaLoaiCongTrinh,
                                "NgayDuKienHoanThanh" => !empty($NgayDuKienHoanThanh) ? date('d/m/Y', strtotime($NgayDuKienHoanThanh)) : null,
                                "TongTienDo" => 0,
                                "NgayHoanThanh" => null,
                                "SoBaoCao" => 0,
                                "TrangThai" => "Chưa có báo cáo",
                                "DanhSachBaoCao" => array()
                            );
                        }

                        if (!empty($MaTienDo)) {
                            $baoCao_item = array(
                                "MaTienDo" => $MaTienDo,
                                "ThoiGianHoanThanhThucTe" => !empty($ThoiGianHoanThanhThucTe) ? date('d/m/Y', strtotime($ThoiGianHoanThanhThucTe)) : null,
                                "CongViec" => $CongViec,
                                "NoiDungCongViec" => $NoiDungCongViec,
                                "NgayBaoCao" => !empty($NgayBaoCao) ? date('d/m/Y', strtotime($NgayBaoCao)) : null,
                                "TrangThai" => $TrangThai,
                                "TiLeHoanThanh" => $TiLeHoanThanh,
                                "HinhAnhTienDo" => $HinhAnhTienDo,
                                "MaCongTrinh" => $MaCongTrinh
                            );

                            $projects[$MaCongTrinh]["DanhSachBaoCao"][] = $baoCao_item;
                            $projects[$MaCongTrinh]["SoBaoCao"]++;
                        }
                    }

                    foreach ($projects as &$project) {
                        if (!empty($project["DanhSachBaoCao"])) {
                            usort($project["DanhSachBaoCao"], function($a, $b) {
                                return strtotime(str_replace('/', '-', $b["NgayBaoCao"])) - strtotime(str_replace('/', '-', $a["NgayBaoCao"]));
                            });

                            $tongTiLeHoanThanh = 0;
                            foreach ($project["DanhSachBaoCao"] as $report) {
                                $tongTiLeHoanThanh += floatval($report["TiLeHoanThanh"]);
                            }
                            $project["TongTienDo"] = $tongTiLeHoanThanh;
                            
                            $latestReport = $project["DanhSachBaoCao"][0];
                            
                            if ($tongTiLeHoanThanh >= 100) {
                                $project["TrangThai"] = "Hoàn thành";
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

                    $baoCao_arr["data"] = array_values($projects);
                    echo json_encode([
                        'status' => 'success',
                        'data' => $baoCao_arr["data"]
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'success',
                        'data' => []
                    ]);
                }
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
                'message' => "Action không hợp lệ"
            ]);
            http_response_code(400);
        }
        break;

    case 'POST':
        if ($action === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaCongTrinh, $data->CongViec, $data->NoiDungCongViec, 
                      $data->NgayBaoCao, $data->TrangThai, $data->TiLeHoanThanh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ"
                ]);
                http_response_code(400);
                exit;
            }

            if (strtotime($data->NgayBaoCao) > time()) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Ngày báo cáo không được trong tương lai"
                ]);
                http_response_code(400);
                exit;
            }

            if ($data->TiLeHoanThanh < 0 || $data->TiLeHoanThanh > 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tỷ lệ hoàn thành phải từ 0 đến 100"
                ]);
                http_response_code(400);
                exit;
            }

            $stmt = $baoCaoTienDo->getOverallProjectProgress($data->MaCongTrinh);
            if ($stmt && $stmt['TongTienDo'] >= 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Công trình đã hoàn thành 100%, không thể tạo thêm báo cáo tiến độ"
                ]);
                http_response_code(400);
                exit;
            }

            if (empty($data->MaTienDo)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Mã tiến độ không được để trống"
                ]);
                http_response_code(400);
                exit;
            }

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
        if ($action === "PUT") {
            $data = json_decode(file_get_contents("php://input"));
            
            if (!isset($data->MaTienDo, $data->CongViec, $data->NoiDungCongViec, 
                      $data->NgayBaoCao, $data->TrangThai, $data->TiLeHoanThanh, 
                      $data->MaCongTrinh)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Dữ liệu không đầy đủ hoặc không hợp lệ"
                ]);
                http_response_code(400);
                exit;
            }

            if (strtotime($data->NgayBaoCao) > time()) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Ngày báo cáo không được trong tương lai"
                ]);
                http_response_code(400);
                exit;
            }

            if ($data->TiLeHoanThanh < 0 || $data->TiLeHoanThanh > 100) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Tỷ lệ hoàn thành phải từ 0 đến 100"
                ]);
                http_response_code(400);
                exit;
            }

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
                if ($baoCaoTienDo->update()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Cập nhật báo cáo tiến độ thành công."
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Cập nhật báo cáo tiến độ thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi cập nhật báo cáo: ' . $e->getMessage()
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
            
            if (!isset($data->MaTienDo)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => "Thiếu MaTienDo"
                ]);
                http_response_code(400);
                exit;
            }

            $baoCaoTienDo->MaTienDo = $data->MaTienDo;

            try {
                if ($baoCaoTienDo->delete()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => "Xóa báo cáo tiến độ thành công."
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => "Xóa báo cáo tiến độ thất bại"
                    ]);
                    http_response_code(500);
                }
            } catch (Exception $e) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Lỗi khi xóa báo cáo: ' . $e->getMessage()
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