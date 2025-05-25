<?php
class ChamCongModel {
    private $conn;
    private $table_name = 'BangChamCong';

    // Các thuộc tính từ BangChamCong
    public $MaChamCong;
    public $SoNgayLam;
    public $KyLuong;
    public $MaNhanVien;

    // Các thuộc tính từ BangPhanCong
    public $MaBangPhanCong;
    public $MaCongTrinh;
    public $NgayThamGia;
    public $NgayKetThuc;
    public $SoNgayThamGia;

    // Các thuộc tính từ NhanVien
    public $TenNhanVien;
    public $LuongCanBan;
    public $MaLoaiNhanVien;

    // Các thuộc tính từ CongTrinh
    public $TenCongTrinh;

    // Các thuộc tính từ ChamCong
    public $TrangThai;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy tất cả bản ghi chấm công với thông tin chi tiết
    public function getAll() {
        $query = "SELECT 
                    ct.MaCongTrinh,
                    ct.TenCongTrinh,
                    ct.TrangThai
                FROM CongTrinh ct
                WHERE EXISTS (
                    SELECT 1 
                    FROM BangPhanCong pc
                    JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                    JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                    WHERE pc.MaCongTrinh = ct.MaCongTrinh
                    AND lnv.TenLoai IN ('Thợ chính', 'Thợ phụ')
                )
                ORDER BY ct.TenCongTrinh";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lấy thông tin chi tiết của một bản ghi chấm công
    public function getOne() {
        $query = "SELECT cc.*, nv.TenNhanVien, nv.LuongCanBan, nv.MaLoaiNhanVien,
                         pc.MaBangPhanCong, pc.MaCongTrinh, pc.NgayThamGia, pc.NgayKetThuc, pc.SoNgayThamGia,
                         ct.TenCongTrinh, cc.TrangThai
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN BangPhanCong pc ON cc.MaNhanVien = pc.MaNhanVien 
                      AND DATE_FORMAT(cc.KyLuong, '%Y-%m') = DATE_FORMAT(pc.NgayThamGia, '%Y-%m')
                  LEFT JOIN CongTrinh ct ON pc.MaCongTrinh = ct.MaCongTrinh
                  WHERE cc.MaChamCong = :maChamCong
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maChamCong", $this->MaChamCong);
        $stmt->execute();

        return $stmt;
    }

    // Tạo mới bản ghi chấm công và phân công
    public function create() {
        try {
            $this->conn->beginTransaction();

            // 1. Tạo bản ghi phân công
            $queryPhanCong = "INSERT INTO BangPhanCong 
                             (MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) 
                             VALUES (:maCongTrinh, :maNhanVien, :ngayThamGia, :ngayKetThuc, :soNgayThamGia)";

            $stmtPhanCong = $this->conn->prepare($queryPhanCong);

            $stmtPhanCong->bindParam(":maCongTrinh", $this->MaCongTrinh);
            $stmtPhanCong->bindParam(":maNhanVien", $this->MaNhanVien);
            $stmtPhanCong->bindParam(":ngayThamGia", $this->NgayThamGia);
            $stmtPhanCong->bindParam(":ngayKetThuc", $this->NgayKetThuc);
            $stmtPhanCong->bindParam(":soNgayThamGia", $this->SoNgayThamGia);

            if (!$stmtPhanCong->execute()) {
                throw new Exception("Không thể tạo bản ghi phân công");
            }

            $this->MaBangPhanCong = $this->conn->lastInsertId();

            // 2. Tạo bản ghi chấm công
            $queryChamCong = "INSERT INTO " . $this->table_name . " 
                             (MaNhanVien, SoNgayLam, KyLuong, TrangThai) 
                             VALUES (:maNhanVien, :soNgayLam, :kyLuong, :trangThai)";

            $stmtChamCong = $this->conn->prepare($queryChamCong);

            $stmtChamCong->bindParam(":maNhanVien", $this->MaNhanVien);
            $stmtChamCong->bindParam(":soNgayLam", $this->SoNgayLam);
            $stmtChamCong->bindParam(":kyLuong", $this->KyLuong);
            $stmtChamCong->bindParam(":trangThai", $this->TrangThai);

            if (!$stmtChamCong->execute()) {
                throw new Exception("Không thể tạo bản ghi chấm công");
            }

            $this->MaChamCong = $this->conn->lastInsertId();
            $this->conn->commit();

            return [
                "status" => "success",
                "message" => "Tạo phân công và chấm công thành công",
                "data" => [
                    "MaChamCong" => $this->MaChamCong,
                    "MaBangPhanCong" => $this->MaBangPhanCong,
                    "MaNhanVien" => $this->MaNhanVien,
                    "MaCongTrinh" => $this->MaCongTrinh,
                    "SoNgayLam" => $this->SoNgayLam,
                    "KyLuong" => $this->KyLuong,
                    "NgayThamGia" => $this->NgayThamGia,
                    "NgayKetThuc" => $this->NgayKetThuc,
                    "SoNgayThamGia" => $this->SoNgayThamGia,
                    "TrangThai" => $this->TrangThai
                ]
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    // Cập nhật bản ghi chấm công và phân công
    public function update() {
        try {
            $this->conn->beginTransaction();

            // 1. Cập nhật bản ghi phân công
            $queryPhanCong = "UPDATE BangPhanCong 
                             SET MaCongTrinh = :maCongTrinh,
                                 NgayThamGia = :ngayThamGia,
                                 NgayKetThuc = :ngayKetThuc,
                                 SoNgayThamGia = :soNgayThamGia
                             WHERE MaBangPhanCong = :maBangPhanCong";

            $stmtPhanCong = $this->conn->prepare($queryPhanCong);

            $stmtPhanCong->bindParam(":maCongTrinh", $this->MaCongTrinh);
            $stmtPhanCong->bindParam(":ngayThamGia", $this->NgayThamGia);
            $stmtPhanCong->bindParam(":ngayKetThuc", $this->NgayKetThuc);
            $stmtPhanCong->bindParam(":soNgayThamGia", $this->SoNgayThamGia);
            $stmtPhanCong->bindParam(":maBangPhanCong", $this->MaBangPhanCong);

            if (!$stmtPhanCong->execute()) {
                throw new Exception("Không thể cập nhật bản ghi phân công");
            }

            // 2. Cập nhật bản ghi chấm công
            $queryChamCong = "UPDATE " . $this->table_name . " 
                             SET SoNgayLam = :soNgayLam,
                                 KyLuong = :kyLuong,
                                 TrangThai = :trangThai
                             WHERE MaChamCong = :maChamCong";

            $stmtChamCong = $this->conn->prepare($queryChamCong);

            $stmtChamCong->bindParam(":soNgayLam", $this->SoNgayLam);
            $stmtChamCong->bindParam(":kyLuong", $this->KyLuong);
            $stmtChamCong->bindParam(":trangThai", $this->TrangThai);
            $stmtChamCong->bindParam(":maChamCong", $this->MaChamCong);

            if (!$stmtChamCong->execute()) {
                throw new Exception("Không thể cập nhật bản ghi chấm công");
            }

            $this->conn->commit();

            return [
                "status" => "success",
                "message" => "Cập nhật phân công và chấm công thành công",
                "data" => [
                    "MaChamCong" => $this->MaChamCong,
                    "MaBangPhanCong" => $this->MaBangPhanCong,
                    "MaNhanVien" => $this->MaNhanVien,
                    "MaCongTrinh" => $this->MaCongTrinh,
                    "SoNgayLam" => $this->SoNgayLam,
                    "KyLuong" => $this->KyLuong,
                    "NgayThamGia" => $this->NgayThamGia,
                    "NgayKetThuc" => $this->NgayKetThuc,
                    "SoNgayThamGia" => $this->SoNgayThamGia,
                    "TrangThai" => $this->TrangThai
                ]
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    // Xóa bản ghi chấm công và phân công
    public function delete() {
        
        try {
            $this->conn->beginTransaction();

            // 1. Lấy thông tin phân công trước khi xóa
            $queryGetPhanCong = "SELECT MaBangPhanCong FROM BangPhanCong 
                                WHERE MaNhanVien = :maNhanVien 
                                AND DATE_FORMAT(NgayThamGia, '%Y-%m') = DATE_FORMAT(:kyLuong, '%Y-%m')";
            
            $stmtGetPhanCong = $this->conn->prepare($queryGetPhanCong);
            $stmtGetPhanCong->bindParam(":maNhanVien", $this->MaNhanVien);
            $stmtGetPhanCong->bindParam(":kyLuong", $this->KyLuong);
            $stmtGetPhanCong->execute();
            
            $phanCong = $stmtGetPhanCong->fetch(PDO::FETCH_ASSOC);
            if ($phanCong) {
                $this->MaBangPhanCong = $phanCong['MaBangPhanCong'];
            }

            // 2. Xóa bản ghi phân công
            $queryPhanCong = "DELETE FROM BangPhanCong 
                             WHERE MaBangPhanCong = :maBangPhanCong";

            $stmtPhanCong = $this->conn->prepare($queryPhanCong);
            $stmtPhanCong->bindParam(":maBangPhanCong", $this->MaBangPhanCong);

            if (!$stmtPhanCong->execute()) {
                throw new Exception("Không thể xóa bản ghi phân công");
            }

            // 3. Xóa bản ghi chấm công
            $queryChamCong = "DELETE FROM " . $this->table_name . " 
                             WHERE MaChamCong = :maChamCong";

            $stmtChamCong = $this->conn->prepare($queryChamCong);
            $stmtChamCong->bindParam(":maChamCong", $this->MaChamCong);

            if (!$stmtChamCong->execute()) {
                throw new Exception("Không thể xóa bản ghi chấm công");
            }

            $this->conn->commit();

            return [
                "status" => "success",
                "message" => "Xóa phân công và chấm công thành công",
                "data" => [
                    "MaChamCong" => $this->MaChamCong,
                    "MaBangPhanCong" => $this->MaBangPhanCong
                ]
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    // Lấy thông tin chấm công theo nhân viên
    public function getByEmployee($maNhanVien) {
        $query = "SELECT cc.*, nv.TenNhanVien, nv.LuongCanBan, nv.MaLoaiNhanVien,
                         pc.MaBangPhanCong, pc.MaCongTrinh, pc.NgayThamGia, pc.NgayKetThuc, pc.SoNgayThamGia,
                         ct.TenCongTrinh, cc.TrangThai
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN BangPhanCong pc ON cc.MaNhanVien = pc.MaNhanVien 
                      AND DATE_FORMAT(cc.KyLuong, '%Y-%m') = DATE_FORMAT(pc.NgayThamGia, '%Y-%m')
                  LEFT JOIN CongTrinh ct ON pc.MaCongTrinh = ct.MaCongTrinh
                  WHERE cc.MaNhanVien = :maNhanVien
                  ORDER BY cc.KyLuong DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maNhanVien", $maNhanVien);
        $stmt->execute();

        return $stmt;
    }

    // Lấy thông tin chấm công theo kỳ lương
    public function getByPeriod($kyLuong) {
        $query = "SELECT cc.*, nv.TenNhanVien, nv.LuongCanBan, nv.MaLoaiNhanVien,
                         pc.MaBangPhanCong, pc.MaCongTrinh, pc.NgayThamGia, pc.NgayKetThuc, pc.SoNgayThamGia,
                         ct.TenCongTrinh, cc.TrangThai
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN BangPhanCong pc ON cc.MaNhanVien = pc.MaNhanVien 
                      AND DATE_FORMAT(cc.KyLuong, '%Y-%m') = DATE_FORMAT(pc.NgayThamGia, '%Y-%m')
                  LEFT JOIN CongTrinh ct ON pc.MaCongTrinh = ct.MaCongTrinh
                  WHERE DATE_FORMAT(cc.KyLuong, '%Y-%m') = DATE_FORMAT(:kyLuong, '%Y-%m')
                  ORDER BY nv.TenNhanVien";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":kyLuong", $kyLuong);
        $stmt->execute();

        return $stmt;
    }

    public function getPhanCongByCongTrinh($maCongTrinh) {
        $query = "SELECT 
                    pc.MaBangPhanCong,
                    pc.MaNhanVien,
                    nv.TenNhanVien,
                    nv.LuongCanBan,
                    nv.MaLoaiNhanVien,
                    pc.NgayThamGia,
                    pc.NgayKetThuc,
                    pc.SoNgayThamGia
                FROM BangPhanCong pc
                JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                WHERE pc.MaCongTrinh = :maCongTrinh
                AND nv.MaLoaiNhanVien IN (6, 7) -- 6: Thợ chính, 7: Thợ phụ
                ORDER BY nv.TenNhanVien";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maCongTrinh", $maCongTrinh);
        $stmt->execute();

        return $stmt;
    }
}
?> 