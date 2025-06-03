<?php
// Set headers
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

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
            // Lấy tất cả thông tin công trình và phân công
            $stmt = $chamCongModel->getAllInformation();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    // Debug: In ra dữ liệu thô từ database
                    error_log("Raw DanhSachNhanVien: " . $row['DanhSachNhanVien']);
                    
                    // Xử lý danh sách nhân viên
                    $danhSachNhanVien = [];
                    if (!empty($row['DanhSachNhanVien']) && $row['DanhSachNhanVien'] !== '|||||') {
                        $nhanVienArray = explode(',', trim($row['DanhSachNhanVien']));
                        foreach ($nhanVienArray as $nhanVien) {
                            if (!empty($nhanVien) && $nhanVien !== '|||||') {
                                $info = explode('|', trim($nhanVien));
                                if (count($info) >= 7 && !empty($info[0])) {
                                    $danhSachNhanVien[] = [
                                        "MaBangPhanCong" => trim($info[0]),
                                        "MaNhanVien" => trim($info[1]),
                                        "TenNhanVien" => trim($info[2]),
                                        "LoaiNhanVien" => trim($info[3]),
                                        "NgayThamGia" => trim($info[4]),
                                        "NgayKetThuc" => trim($info[5]),
                                        "SoNgayThamGia" => trim($info[6])
                                    ];
                                }
                            }
                        }
                    }

                    // Debug: In ra danh sách nhân viên sau khi xử lý
                    error_log("Processed DanhSachNhanVien: " . json_encode($danhSachNhanVien));

                    // Xử lý danh sách báo cáo tiến độ
                    $danhSachBaoCao = [];
                    if (!empty($row['DanhSachBaoCaoTienDo']) && $row['DanhSachBaoCaoTienDo'] !== '||||') {
                        $baoCaoArray = explode(',', trim($row['DanhSachBaoCaoTienDo']));
                        foreach ($baoCaoArray as $baoCao) {
                            if (!empty($baoCao) && $baoCao !== '||||') {
                                $info = explode('|', trim($baoCao));
                                if (count($info) >= 5 && !empty($info[0])) {
                                    $danhSachBaoCao[] = [
                                        "MaTienDo" => trim($info[0]),
                                        "CongViec" => trim($info[1]),
                                        "NoiDungCongViec" => trim($info[2]),
                                        "NgayBaoCao" => trim($info[3]),
                                        "TiLeHoanThanh" => trim($info[4])
                                    ];
                                }
                            }
                        }
                    }

                    $item = [
                        "CongTrinh" => [
                            "MaCongTrinh" => $row['MaCongTrinh'],
                            "TenCongTrinh" => $row['TenCongTrinh'],
                            "Dientich" => $row['Dientich'],
                            "NgayDuKienHoanThanh" => $row['NgayDuKienHoanThanh'],
                            "TenLoaiCongTrinh" => $row['TenLoaiCongTrinh'],
                            "KhachHang" => [
                                "TenKhachHang" => $row['TenKhachHang'],
                                "SoDT" => $row['SoDTKhachHang'],
                                "Email" => $row['EmailKhachHang']
                            ],
                            "TongTienDo" => $row['TongTienDo'],
                            "SoBaoCaoTienDo" => $row['SoBaoCaoTienDo'],
                            "SoNhanVienPhanCong" => $row['SoNhanVienPhanCong'],
                            "DanhSachNhanVien" => $danhSachNhanVien,
                            "DanhSachBaoCaoTienDo" => $danhSachBaoCao
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

    case 'GET_CONG_TRINH':
        try {
            $stmt = $chamCongModel->getAllCongTrinh();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaCongTrinh" => $row['MaCongTrinh'],
                        "TenCongTrinh" => $row['TenCongTrinh'],
                        "Dientich" => $row['Dientich'],
                        "NgayDuKienHoanThanh" => $row['NgayDuKienHoanThanh'],
                        "TenLoaiCongTrinh" => $row['TenLoaiCongTrinh'],
                        "TenKhachHang" => $row['TenKhachHang'],
                        "SoNhanVienPhanCong" => $row['SoNhanVienPhanCong'],
                        "TongTienDo" => $row['TongTienDo']
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

    case 'GET_CONG_TRINH_CHUA_HOAN_THANH':
        try {
            $stmt = $chamCongModel->getCongTrinhByTienDo();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaCongTrinh" => $row['MaCongTrinh'],
                        "TenCongTrinh" => $row['TenCongTrinh']
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
                "message" => "Lỗi khi lấy danh sách công trình chưa hoàn thành: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_BY_EMPLOYEE':
        try {
            // Get employee ID
            $maNhanVien = isset($_GET['maNhanVien']) ? $_GET['maNhanVien'] : die();

            // Get cham cong records for employee
            $stmt = $chamCongModel->getBangChamCongNhanVien($maNhanVien);
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaChamCong" => $row['MaChamCong'],
                        "SoNgayLam" => $row['SoNgayLam'],
                        "KyLuong" => $row['KyLuong'],
                        "TrangThai" => $row['TrangThai'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "LoaiNhanVien" => $row['LoaiNhanVien']
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

    case 'GET_CHI_TIET_CHAM_CONG':
        try {
            // Get cham cong ID
            $maChamCong = isset($_GET['maChamCong']) ? $_GET['maChamCong'] : die();

            // Get chi tiet cham cong
            $stmt = $chamCongModel->getChiTietBangChamCong($maChamCong);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $result = [
                    "MaChamCong" => $row['MaChamCong'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "TrangThai" => $row['TrangThai'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => $row['LuongCanBan'],
                    "LoaiNhanVien" => $row['LoaiNhanVien'],
                    "SoCongTrinhDangLam" => $row['SoCongTrinhDangLam']
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
                "message" => "Lỗi khi lấy thông tin chi tiết chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_NHAN_VIEN_THEO_LOAI':
        try {
            $stmt = $chamCongModel->getNhanVienTheoLoai();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaNhanVien" => $row['MaNhanVien'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "SoDT" => $row['SoDT'],
                        "Email" => $row['Email'],
                        "LoaiNhanVien" => $row['LoaiNhanVien']
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
                "message" => "Lỗi khi lấy danh sách nhân viên: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_NHAN_VIEN_KHONG_PHAI_THO':
        try {
            $stmt = $chamCongModel->getNhanVienKhongPhaiTho();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaNhanVien" => $row['MaNhanVien'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "SoDT" => $row['SoDT'],
                        "Email" => $row['Email'],
                        "LoaiNhanVien" => $row['LoaiNhanVien'],
                        "LuongCanBan" => $row['LuongCanBan'],
                        "NgayVao" => $row['NgayVao']
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
                "message" => "Lỗi khi lấy danh sách nhân viên: " . $e->getMessage()
            ]);
        }
        break;

    case 'GET_BY_MONTH_KHONG_PHAI_THO':
        try {
            // Get cham cong records for non-worker employees
            $stmt = $chamCongModel->getBangChamCongTheoThangKhongPhaiTho();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $result = [];
                $groupedData = [];

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $item = [
                        "MaChamCong" => $row['MaChamCong'],
                        "MaNhanVien" => $row['MaNhanVien'],
                        "TenNhanVien" => $row['TenNhanVien'],
                        "LoaiNhanVien" => $row['LoaiNhanVien'],
                        "SoNgayLam" => $row['SoNgayLam'],
                        "KyLuong" => $row['KyLuong'],
                        "TrangThai" => $row['TrangThai'],
                        "GioVao" => $row['GioVao'],
                        "GioRa" => $row['GioRa'],
                        "LoaiChamCong" => $row['LoaiChamCong']
                    ];

                    // Tạo key cho tháng/năm
                    $key = $row['Nam'] . '-' . $row['Thang'];
                    
                    if (!isset($groupedData[$key])) {
                        $groupedData[$key] = [
                            "Thang" => $row['Thang'],
                            "Nam" => $row['Nam'],
                            "DanhSachChamCong" => []
                        ];
                    }

                    // Tìm nhân viên trong danh sách với cùng TrangThai và LoaiChamCong
                    $found = false;

                    foreach ($groupedData[$key]["DanhSachChamCong"] as &$chamCong) {
                        if ($chamCong["MaNhanVien"] === $row['MaNhanVien'] && 
                            $chamCong["TrangThai"] === $row['TrangThai'] &&
                            $chamCong["LoaiChamCong"] === $row['LoaiChamCong']) {
                            // Cập nhật số ngày làm
                            $chamCong["SoNgayLam"] += $row['SoNgayLam'];
                            // Cập nhật kỳ lương thành mảng
                            if (!isset($chamCong["KyLuongArray"])) {
                                $chamCong["KyLuongArray"] = [$chamCong["KyLuong"]];
                            }
                            $chamCong["KyLuongArray"][] = $row['KyLuong'];
                            // Cập nhật giờ vào/ra nếu khác
                            if ($chamCong["GioVao"] !== $row['GioVao'] || $chamCong["GioRa"] !== $row['GioRa']) {
                                $chamCong["GioVao"] = $row['GioVao'];
                                $chamCong["GioRa"] = $row['GioRa'];
                            }
                            $found = true;
                            break;
                        }
                    }

                    if (!$found) {
                        // Thêm mới nếu chưa có
                        $item["KyLuongArray"] = [$row['KyLuong']];
                        $groupedData[$key]["DanhSachChamCong"][] = $item;
                    }
                }

                // Chuyển đổi từ object sang array và sắp xếp theo tháng/năm giảm dần
                $result = array_values($groupedData);
                usort($result, function($a, $b) {
                    if ($a['Nam'] != $b['Nam']) {
                        return $b['Nam'] - $a['Nam'];
                    }
                    return $b['Thang'] - $a['Thang'];
                });

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
                "message" => "Lỗi khi lấy thông tin chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        try {
            // Lấy dữ liệu từ request body
            $data = json_decode(file_get_contents("php://input"), true);

            // Kiểm tra các trường bắt buộc
            if (!isset($data['MaNhanVien']) || !isset($data['LoaiChamCong'])) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thiếu thông tin bắt buộc (MaNhanVien, LoaiChamCong)"
                ]);
                exit();
            }

            // Tạo chấm công mới
            $result = $chamCongModel->createBangChamCong(
                $data['MaNhanVien'],
                $data['LoaiChamCong'],
                $data['GioVao'] ?? '08:00:00',
                $data['GioRa'] ?? '17:00:00'
            );

            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi tạo chấm công: " . $e->getMessage()
            ]);
        }
        break;

    case 'PUT':
        try {
            // Lấy dữ liệu từ request body
            $data = json_decode(file_get_contents("php://input"), true);

            // Kiểm tra các trường bắt buộc
            if (!isset($data['MaBangPhanCong']) || !isset($data['NgayThamGia'])) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thiếu thông tin bắt buộc"
                ]);
                exit();
            }

            // Cập nhật phân công
            $result = $chamCongModel->updateBangPhanCong(
                $data['MaBangPhanCong'],
                $data['NgayThamGia'],
                $data['NgayKetThuc'] ?? null,
                $data['SoNgayThamGia'] ?? null
            );

            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi cập nhật phân công: " . $e->getMessage()
            ]);
        }
        break;

    case 'POST_BANG_CHAM_CONG':
        try {
            // Lấy dữ liệu từ request body
            $data = json_decode(file_get_contents("php://input"), true);

            // Kiểm tra các trường bắt buộc
            if (!isset($data['MaNhanVien']) || !isset($data['LoaiChamCong'])) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Thiếu thông tin bắt buộc (MaNhanVien, LoaiChamCong)"
                ]);
                exit();
            }

            // Tạo chấm công mới
            $result = $chamCongModel->createBangChamCong(
                $data['MaNhanVien'],
                $data['LoaiChamCong'],
                $data['SoNgayLam'] ?? 1,
                $data['KyLuong'] ?? null,
                $data['TrangThai'] ?? 'Chưa thanh toán',
                $data['GioVao'] ?? '08:00:00',
                $data['GioRa'] ?? '17:00:00'
            );

            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi khi tạo chấm công: " . $e->getMessage()
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