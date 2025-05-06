<?php
class NhanVien {
    private $conn;
    private $table = "NhanVien";

    public $MaNhanVien;
    public $TenNhanVien;
    public $SoDT;
    public $CCCD;
    public $Email;
    public $NgayVao;
    public $MaLoaiNhanVien;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Kiểm tra xem nhân viên đã tồn tại chưa
    private function isNhanVienExist() {
        $query = "SELECT MaNhanVien FROM " . $this->table . " WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }

    // Kiểm tra sự tồn tại của email nhân viên
    private function isEmailExist() {
        $query = "SELECT Email FROM " . $this->table . " WHERE Email = :Email AND MaNhanVien != :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Email", $this->Email);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }
    
    // Kiểm tra sự tồn tại của CCCD
    private function isCCCDExist() {
        $query = "SELECT CCCD FROM " . $this->table . " WHERE CCCD = :CCCD AND MaNhanVien != :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":CCCD", $this->CCCD);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }

    // Thêm nhân viên mới
    public function add() {
        // Kiểm tra nếu nhân viên đã tồn tại
        if ($this->isNhanVienExist()) {
            echo json_encode(["message" => "Mã nhân viên đã tồn tại"]);
            http_response_code(400);
            return false;
        }

        // Kiểm tra nếu email đã tồn tại
        if ($this->isEmailExist()) {
            echo json_encode(["message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại
        if ($this->isCCCDExist()) {
            echo json_encode(["message" => "CCCD đã tồn tại"]);
            http_response_code(400);
            return false;
        }

        $query = "INSERT INTO " . $this->table . " (MaNhanVien, TenNhanVien, SoDT, CCCD, Email, NgayVao, MaLoaiNhanVien) 
                  VALUES (:MaNhanVien, :TenNhanVien, :SoDT, :CCCD, :Email, :NgayVao, :MaLoaiNhanVien)";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":TenNhanVien", $this->TenNhanVien);
        $stmt->bindParam(":SoDT", $this->SoDT);
        $stmt->bindParam(":CCCD", $this->CCCD);
        $stmt->bindParam(":Email", $this->Email);
        $stmt->bindParam(":NgayVao", $this->NgayVao);
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Cập nhật thông tin nhân viên
    public function update() {
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }

        // Kiểm tra nếu email đã tồn tại (trong trường hợp email thay đổi)
        if ($this->isEmailExist()) {
            echo json_encode(["message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại (trong trường hợp CCCD thay đổi)
        if ($this->isCCCDExist()) {
            echo json_encode(["message" => "CCCD đã tồn tại"]);
            http_response_code(400);
            return false;
        }

        $query = "UPDATE " . $this->table . " 
                  SET TenNhanVien = :TenNhanVien, SoDT = :SoDT, CCCD = :CCCD, Email = :Email, NgayVao = :NgayVao, MaLoaiNhanVien = :MaLoaiNhanVien
                  WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":TenNhanVien", $this->TenNhanVien);
        $stmt->bindParam(":SoDT", $this->SoDT);
        $stmt->bindParam(":CCCD", $this->CCCD);
        $stmt->bindParam(":Email", $this->Email);
        $stmt->bindParam(":NgayVao", $this->NgayVao);
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Xóa nhân viên
    public function delete() {
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra liên kết với các bảng khác
        $tables = [
            "BangChamCong" => "MaNhanVien",
            "TaiKhoan" => "MaNhanVien",
            "HopDong" => "MaNhanVien",
            "BangPhanCong" => "MaNhanVien",
            "PhieuNhap" => "MaNhanVien"
        ];
        
        foreach ($tables as $table => $field) {
            $query = "SELECT COUNT(*) as count FROM " . $table . " WHERE " . $field . " = :MaNhanVien";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($row['count'] > 0) {
                echo json_encode(["message" => "Không thể xóa nhân viên này vì đã có dữ liệu liên quan trong bảng " . $table]);
                http_response_code(400);
                return false;
            }
        }

        $query = "DELETE FROM " . $this->table . " WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Lấy tất cả nhân viên
    public function getAll() {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM " . $this->table . " nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Lấy nhân viên theo ID
    public function getById() {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM " . $this->table . " nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE nv.MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy nhân viên theo loại nhân viên
    public function getByLoaiNhanVien() {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM " . $this->table . " nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE nv.MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->execute();
        return $stmt;
    }
}
?>