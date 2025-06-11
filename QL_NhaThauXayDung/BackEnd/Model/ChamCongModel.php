<?php
class ChamCongModel {
    private $conn;
    private $table_name = 'BangChamCong';

    // Các thuộc tính từ BangChamCong
    public $MaChamCong;
    public $SoNgayLam;
    public $KyLuong;
    public $TrangThai;
    public $MaNhanVien;
    public $LoaiChamCong;
    public $GioVao;
    public $GioRa;
    // Các thuộc tính từ BangPhanCong
    public $MaBangPhanCong;
    public $MaCongTrinh;
    public $NgayThamGia;
    public $NgayKetThuc;
    public $SoNgayThamGia;

    // Các thuộc tính từ NhanVien
    public $TenNhanVien;
    public $SoDT;
    public $CCCD;
    public $Email;
    public $NgayVao;
    public $LuongCanBan;
    public $MaLoaiNhanVien;

    // Các thuộc tính từ LoaiNhanVien
    public $TenLoai;

    // Các thuộc tính từ CongTrinh
    public $TenCongTrinh;
    public $Dientich;
    public $FileThietKe;
    public $MaKhachHang;
    public $MaHopDong;
    public $MaLoaiCongTrinh;
    public $NgayDuKienHoanThanh;

    // Các thuộc tính từ BangBaoCaoTienDo
    public $MaTienDo;
    public $ThoiGianHoanThanhThucTe;
    public $CongViec;
    public $NoiDungCongViec;
    public $NgayBaoCao;
    public $TiLeHoanThanh;
    public $HinhAnhTienDo;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy tất cả thông tin trong một lần truy vấn
    public function getAllInformation() {
        // Tăng giới hạn GROUP_CONCAT
        $this->conn->exec("SET SESSION group_concat_max_len = 1000000");
        // Đặt encoding
        $this->conn->exec("SET NAMES utf8mb4");
        
        $query = "SELECT 
                    -- Thông tin công trình
                    c.MaCongTrinh,
                    c.TenCongTrinh,
                    c.Dientich,
                    c.NgayDuKienHoanThanh,
                    lct.TenLoaiCongTrinh,
                    kh.TenKhachHang,
                    kh.SoDT as SoDTKhachHang,
                    kh.Email as EmailKhachHang,
                    
                    -- Thông tin tiến độ
                    COALESCE((SELECT SUM(TiLeHoanThanh) FROM BangBaoCaoTienDo WHERE MaCongTrinh = c.MaCongTrinh), 0) as TongTienDo,
                    COALESCE((SELECT COUNT(*) FROM BangBaoCaoTienDo WHERE MaCongTrinh = c.MaCongTrinh), 0) as SoBaoCaoTienDo,
                    
                    -- Thông tin phân công
                    COALESCE((SELECT COUNT(*) FROM BangPhanCong WHERE MaCongTrinh = c.MaCongTrinh), 0) as SoNhanVienPhanCong,
                    
                    -- Thông tin nhân viên được phân công
                    GROUP_CONCAT(
                        DISTINCT CONCAT_WS('|',
                            IFNULL(pc.MaBangPhanCong, ''),
                            IFNULL(nv.MaNhanVien, ''),
                            IFNULL(nv.TenNhanVien, ''),
                            IFNULL(lnv.TenLoai, ''),
                            IFNULL(DATE_FORMAT(pc.NgayThamGia, '%Y-%m-%d'), ''),
                            IFNULL(DATE_FORMAT(pc.NgayKetThuc, '%Y-%m-%d'), ''),
                            IFNULL(pc.SoNgayThamGia, '')
                        )
                        ORDER BY nv.TenNhanVien
                        SEPARATOR ','
                    ) as DanhSachNhanVien,
                    
                    -- Thông tin báo cáo tiến độ
                    GROUP_CONCAT(
                        DISTINCT CONCAT_WS('|',
                            IFNULL(bctd.MaTienDo, ''),
                            IFNULL(bctd.CongViec, ''),
                            IFNULL(bctd.NoiDungCongViec, ''),
                            IFNULL(DATE_FORMAT(bctd.NgayBaoCao, '%Y-%m-%d %H:%i:%s'), ''),
                            IFNULL(bctd.TiLeHoanThanh, '')
                        )
                        ORDER BY bctd.NgayBaoCao DESC
                        SEPARATOR ','
                    ) as DanhSachBaoCaoTienDo
                    
                 FROM CongTrinh c
                 LEFT JOIN LoaiCongTrinh lct ON c.MaLoaiCongTrinh = lct.MaLoaiCongTrinh
                 LEFT JOIN HopDong hd ON c.MaHopDong = hd.MaHopDong
                 LEFT JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
                 LEFT JOIN BangPhanCong pc ON c.MaCongTrinh = pc.MaCongTrinh
                 LEFT JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                 LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 LEFT JOIN BangBaoCaoTienDo bctd ON c.MaCongTrinh = bctd.MaCongTrinh
                 
                 GROUP BY c.MaCongTrinh, c.TenCongTrinh, c.Dientich, c.NgayDuKienHoanThanh,
                          lct.TenLoaiCongTrinh, kh.TenKhachHang, kh.SoDT, kh.Email
                 ORDER BY c.NgayDuKienHoanThanh DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy tất cả công trình
    public function getAllCongTrinh() {
        $query = "SELECT 
                    c.*,
                    lct.TenLoaiCongTrinh,
                    kh.TenKhachHang,
                    (SELECT COUNT(*) FROM BangPhanCong WHERE MaCongTrinh = c.MaCongTrinh) as SoNhanVienPhanCong,
                    (SELECT SUM(TiLeHoanThanh) FROM BangBaoCaoTienDo WHERE MaCongTrinh = c.MaCongTrinh) as TongTienDo
                 FROM CongTrinh c
                 LEFT JOIN LoaiCongTrinh lct ON c.MaLoaiCongTrinh = lct.MaLoaiCongTrinh
                 LEFT JOIN KhachHang kh ON c.MaKhachHang = kh.MaKhachHang
                 ORDER BY c.NgayDuKienHoanThanh DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách công trình theo điều kiện tiến độ
    public function getCongTrinhByTienDo() {
        $query = "SELECT DISTINCT c.MaCongTrinh, c.TenCongTrinh
                 FROM CongTrinh c
                 LEFT JOIN BangBaoCaoTienDo b ON c.MaCongTrinh = b.MaCongTrinh
                 WHERE NOT EXISTS (
                     SELECT 1 
                     FROM BangBaoCaoTienDo b2 
                     WHERE b2.MaCongTrinh = c.MaCongTrinh
                     GROUP BY b2.MaCongTrinh
                     HAVING SUM(b2.TiLeHoanThanh) >= 100
                 )
                 OR NOT EXISTS (
                     SELECT 1 
                     FROM BangBaoCaoTienDo b3 
                     WHERE b3.MaCongTrinh = c.MaCongTrinh
                 )";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy chi tiết tiến độ của một công trình
    public function getChiTietTienDo($maCongTrinh) {
        $query = "SELECT b.*, c.TenCongTrinh
                 FROM BangBaoCaoTienDo b
                 JOIN CongTrinh c ON b.MaCongTrinh = c.MaCongTrinh
                 WHERE b.MaCongTrinh = :maCongTrinh
                 ORDER BY b.NgayBaoCao DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maCongTrinh", $maCongTrinh);
        $stmt->execute();

        return $stmt;
    }

    // Lấy tổng tiến độ của một công trình
    public function getTongTienDo($maCongTrinh) {
        $query = "SELECT SUM(TiLeHoanThanh) as TongTienDo
                 FROM BangBaoCaoTienDo
                 WHERE MaCongTrinh = :maCongTrinh";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maCongTrinh", $maCongTrinh);
        $stmt->execute();

        return $stmt;
    }

    // Lấy thông tin chi tiết phân công nhân viên của công trình
    public function getChiTietPhanCong($maCongTrinh) {
        $query = "SELECT 
                    pc.MaBangPhanCong,
                    pc.NgayThamGia,
                    pc.NgayKetThuc,
                    pc.SoNgayThamGia,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    nv.SoDT,
                    nv.Email,
                    lnv.MaLoaiNhanVien,
                    lnv.TenLoai
                 FROM BangPhanCong pc
                 JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE pc.MaCongTrinh = :maCongTrinh
                 ORDER BY pc.NgayThamGia DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maCongTrinh", $maCongTrinh);
        $stmt->execute();

        return $stmt;
    }

    // Lấy thông tin tổng hợp công trình và phân công
    public function getCongTrinhChiTiet($maCongTrinh) {
        $query = "SELECT 
                    c.MaCongTrinh,
                    c.TenCongTrinh,
                    c.Dientich,
                    c.NgayDuKienHoanThanh,
                    (SELECT SUM(TiLeHoanThanh) FROM BangBaoCaoTienDo WHERE MaCongTrinh = c.MaCongTrinh) as TongTienDo,
                    (SELECT COUNT(*) FROM BangPhanCong WHERE MaCongTrinh = c.MaCongTrinh) as SoNhanVienPhanCong
                 FROM CongTrinh c
                 WHERE c.MaCongTrinh = :maCongTrinh";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maCongTrinh", $maCongTrinh);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách bảng chấm công của nhân viên
    public function getBangChamCongNhanVien($maNhanVien) {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE cc.MaNhanVien = :maNhanVien
                 ORDER BY cc.KyLuong DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maNhanVien", $maNhanVien);
        $stmt->execute();

        return $stmt;
    }

    // Lấy thông tin chi tiết một bảng chấm công
    public function getChiTietBangChamCong($maChamCong) {
        $query = "SELECT 
                    cc.*,
                    nv.TenNhanVien,
                    nv.LuongCanBan,
                    lnv.TenLoai as LoaiNhanVien,
                    (SELECT COUNT(*) FROM BangPhanCong WHERE MaNhanVien = cc.MaNhanVien) as SoCongTrinhDangLam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE cc.MaChamCong = :maChamCong";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maChamCong", $maChamCong);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách nhân viên theo loại
    public function getNhanVienTheoLoai() {
        $query = "SELECT 
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    nv.SoDT,
                    nv.Email,
                    lnv.TenLoai as LoaiNhanVien
                 FROM NhanVien nv
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE lnv.TenLoai IN ('Thợ chính', 'Thợ phụ')
                 ORDER BY lnv.TenLoai, nv.TenNhanVien";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách nhân viên không phải thợ
    public function getNhanVienKhongPhaiTho() {
        $query = "SELECT 
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    nv.SoDT,
                    nv.Email,
                    lnv.TenLoai as LoaiNhanVien
                 FROM NhanVien nv
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE lnv.TenLoai NOT IN ('Thợ chính', 'Thợ phụ')
                 ORDER BY lnv.TenLoai, nv.TenNhanVien";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Tạo bảng phân công mới
    public function createBangPhanCong($maCongTrinh, $maNhanVien, $ngayThamGia, $ngayKetThuc = null, $soNgayThamGia = null) {
        try {
            $query = "INSERT INTO BangPhanCong 
                     (MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) 
                     VALUES 
                     (:maCongTrinh, :maNhanVien, :ngayThamGia, :ngayKetThuc, :soNgayThamGia)";

            $stmt = $this->conn->prepare($query);

            // Bind các tham số
            $stmt->bindParam(":maCongTrinh", $maCongTrinh);
            $stmt->bindParam(":maNhanVien", $maNhanVien);
            $stmt->bindParam(":ngayThamGia", $ngayThamGia);
            $stmt->bindParam(":ngayKetThuc", $ngayKetThuc);
            $stmt->bindParam(":soNgayThamGia", $soNgayThamGia);

            // Thực thi câu lệnh
            if ($stmt->execute()) {
                return [
                    "status" => "success",
                    "message" => "Tạo phân công thành công",
                    "id" => $this->conn->lastInsertId()
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Không thể tạo phân công"
                ];
            }
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Lỗi khi tạo phân công: " . $e->getMessage()
            ];
        }
    }

    // Cập nhật bảng phân công
    public function updateBangPhanCong($maBangPhanCong, $ngayThamGia, $ngayKetThuc = null, $soNgayThamGia = null) {
        try {
            $query = "UPDATE BangPhanCong 
                     SET NgayThamGia = :ngayThamGia,
                         NgayKetThuc = :ngayKetThuc,
                         SoNgayThamGia = :soNgayThamGia
                     WHERE MaBangPhanCong = :maBangPhanCong";

            $stmt = $this->conn->prepare($query);

            // Bind các tham số
            $stmt->bindParam(":maBangPhanCong", $maBangPhanCong);
            $stmt->bindParam(":ngayThamGia", $ngayThamGia);
            $stmt->bindParam(":ngayKetThuc", $ngayKetThuc);
            $stmt->bindParam(":soNgayThamGia", $soNgayThamGia);

            // Thực thi câu lệnh
            if ($stmt->execute()) {
                return [
                    "status" => "success",
                    "message" => "Cập nhật phân công thành công"
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Không thể cập nhật phân công"
                ];
            }
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Lỗi khi cập nhật phân công: " . $e->getMessage()
            ];
        }
    }

    // Tạo bảng chấm công mới
    public function createBangChamCong($maNhanVien, $loaiChamCong, $soNgayLam = 1, $kyLuong = null, $trangThai = 'Chưa thanh toán', $gioVao = '08:00:00', $gioRa = '17:00:00') {
        try {
            // Nếu không có kỳ lương, lấy ngày hiện tại
            if ($kyLuong === null) {
                $kyLuong = date('Y-m-d H:i:s');
            }

            // Kiểm tra đã có chấm công hôm đó chưa
            $queryCheck = "SELECT COUNT(*) FROM BangChamCong WHERE MaNhanVien = :maNhanVien AND DATE(KyLuong) = :kyLuong";
            $stmtCheck = $this->conn->prepare($queryCheck);
            $stmtCheck->bindParam(":maNhanVien", $maNhanVien);
            $stmtCheck->bindParam(":kyLuong", date('Y-m-d', strtotime($kyLuong)));
            $stmtCheck->execute();
            if ($stmtCheck->fetchColumn() > 0) {
                return [
                    "status" => "error",
                    "message" => "Nhân viên đã chấm công ngày này!"
                ];
            }

            // Tạo mã chấm công mới với microtime để đảm bảo tính duy nhất
            $microtime = microtime(true);
            $timestamp = str_replace('.', '', $microtime); // Loại bỏ dấu chấm
            $random = rand(100, 999); // Thêm số ngẫu nhiên để tăng tính duy nhất
            $maChamCong = 'CC' . $timestamp . $random;

            // Đảm bảo định dạng giờ đúng
            $gioVao = date('H:i:s', strtotime($gioVao));
            $gioRa = date('H:i:s', strtotime($gioRa));

            $query = "INSERT INTO BangChamCong 
                     (MaChamCong, SoNgayLam, KyLuong, TrangThai, GioVao, GioRa, LoaiChamCong, MaNhanVien) 
                     VALUES 
                     (:maChamCong, :soNgayLam, :kyLuong, :trangThai, :gioVao, :gioRa, :loaiChamCong, :maNhanVien)";

            $stmt = $this->conn->prepare($query);

            // Bind các tham số
            $stmt->bindParam(":maChamCong", $maChamCong);
            $stmt->bindParam(":soNgayLam", $soNgayLam);
            $stmt->bindParam(":kyLuong", $kyLuong);
            $stmt->bindParam(":trangThai", $trangThai);
            $stmt->bindParam(":gioVao", $gioVao);
            $stmt->bindParam(":gioRa", $gioRa);
            $stmt->bindParam(":loaiChamCong", $loaiChamCong);
            $stmt->bindParam(":maNhanVien", $maNhanVien);

            // Thực thi câu lệnh
            if ($stmt->execute()) {
                return [
                    "status" => "success",
                    "message" => "Tạo chấm công thành công",
                    "id" => $maChamCong
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Không thể tạo chấm công"
                ];
            }
        } catch (PDOException $e) {
            return [
                "status" => "error",
                "message" => "Lỗi khi tạo chấm công: " . $e->getMessage()
            ];
        }
    }

    // Lấy danh sách bảng chấm công của nhân viên không phải thợ theo từng tháng
    public function getBangChamCongTheoThangKhongPhaiTho() {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    cc.GioVao,
                    cc.GioRa,
                    cc.LoaiChamCong,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien,
                    MONTH(cc.KyLuong) as Thang,
                    YEAR(cc.KyLuong) as Nam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE lnv.TenLoai NOT IN ('Thợ chính', 'Thợ phụ')
                 ORDER BY YEAR(cc.KyLuong) DESC, MONTH(cc.KyLuong) DESC, nv.TenNhanVien";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách bảng chấm công của nhân viên theo từng tháng
    public function getBangChamCongTheoThang($maNhanVien, $thang, $nam) {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    cc.GioVao,
                    cc.GioRa,
                    cc.LoaiChamCong,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien,
                    MONTH(cc.KyLuong) as Thang,
                    YEAR(cc.KyLuong) as Nam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE cc.MaNhanVien = :maNhanVien
                 AND MONTH(cc.KyLuong) = :thang
                 AND YEAR(cc.KyLuong) = :nam
                 ORDER BY cc.KyLuong ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maNhanVien", $maNhanVien);
        $stmt->bindParam(":thang", $thang);
        $stmt->bindParam(":nam", $nam);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách bảng chấm công của thợ (thợ chính và thợ phụ) theo từng tháng
    public function getBangChamCongThoTheoThang($thang, $nam) {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    cc.GioVao,
                    cc.GioRa,
                    cc.LoaiChamCong,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien,
                    MONTH(cc.KyLuong) as Thang,
                    YEAR(cc.KyLuong) as Nam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE lnv.TenLoai IN ('Thợ chính', 'Thợ phụ')
                 AND MONTH(cc.KyLuong) = :thang
                 AND YEAR(cc.KyLuong) = :nam
                 ORDER BY nv.TenNhanVien ASC, cc.KyLuong ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":thang", $thang);
        $stmt->bindParam(":nam", $nam);
        $stmt->execute();

        return $stmt;
    }

    // Lấy danh sách bảng chấm công của nhân viên không phải thợ theo từng tháng
    public function getBangChamCongNhanVienTheoThang($thang, $nam) {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    cc.GioVao,
                    cc.GioRa,
                    cc.LoaiChamCong,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien,
                    MONTH(cc.KyLuong) as Thang,
                    YEAR(cc.KyLuong) as Nam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE lnv.TenLoai NOT IN ('Thợ chính', 'Thợ phụ')
                 AND MONTH(cc.KyLuong) = :thang
                 AND YEAR(cc.KyLuong) = :nam
                 ORDER BY nv.TenNhanVien ASC, cc.KyLuong ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":thang", $thang);
        $stmt->bindParam(":nam", $nam);
        $stmt->execute();

        return $stmt;
    }

    // Lấy lịch sử chấm công theo tháng năm
    public function getLichSuChamCongTheoThang($thang, $nam) {
        $query = "SELECT 
                    cc.MaChamCong,
                    cc.SoNgayLam,
                    cc.KyLuong,
                    cc.TrangThai,
                    cc.GioVao,
                    cc.GioRa,
                    cc.LoaiChamCong,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    lnv.TenLoai as LoaiNhanVien,
                    MONTH(cc.KyLuong) as Thang,
                    YEAR(cc.KyLuong) as Nam
                 FROM BangChamCong cc
                 JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                 JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                 WHERE MONTH(cc.KyLuong) = :thang
                 AND YEAR(cc.KyLuong) = :nam
                 ORDER BY nv.TenNhanVien ASC, cc.KyLuong ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":thang", $thang);
        $stmt->bindParam(":nam", $nam);
        $stmt->execute();

        return $stmt;
    }
}
?> 