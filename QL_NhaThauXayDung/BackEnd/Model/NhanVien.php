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
    public $TenLoaiNhanVien; // Thêm trường này để lưu tên loại nhân viên

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
            echo json_encode(["status" => "error", "message" => "Mã nhân viên đã tồn tại"]);
            http_response_code(400);
            return false;
        }

        // Kiểm tra nếu email đã tồn tại
        if ($this->isEmailExist()) {
            echo json_encode(["status" => "error", "message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại
        if ($this->isCCCDExist()) {
            echo json_encode(["status" => "error", "message" => "CCCD đã tồn tại"]);
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
            // Lấy thông tin nhân viên vừa thêm
            $this->MaNhanVien = $this->MaNhanVien;
            $stmt = $this->getById();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                "status" => "success",
                "message" => "Nhân viên đã được thêm thành công",
                "data" => $result
            ];
        }
        
        echo json_encode(["status" => "error", "message" => "Thêm nhân viên thất bại"]);
        http_response_code(500);
        return false;
    }

    // Cập nhật thông tin nhân viên
    public function update() {
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["status" => "error", "message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }

        // Kiểm tra nếu email đã tồn tại (trong trường hợp email thay đổi)
        if ($this->isEmailExist()) {
            echo json_encode(["status" => "error", "message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại (trong trường hợp CCCD thay đổi)
        if ($this->isCCCDExist()) {
            echo json_encode(["status" => "error", "message" => "CCCD đã tồn tại"]);
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
            // Lấy thông tin nhân viên sau khi cập nhật
            $stmt = $this->getById();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                "status" => "success",
                "message" => "Nhân viên đã được cập nhật thành công",
                "data" => $result
            ];
        }
        
        echo json_encode(["status" => "error", "message" => "Cập nhật nhân viên thất bại"]);
        http_response_code(500);
        return false;
    }

    // Xóa nhân viên
    public function delete() {
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["status" => "error", "message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Lấy thông tin nhân viên trước khi xóa
        $stmt = $this->getById();
        $nhanVienInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
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
                echo json_encode(["status" => "error", "message" => "Không thể xóa nhân viên này vì đã có dữ liệu liên quan trong bảng " . $table]);
                http_response_code(400);
                return false;
            }
        }

        $query = "DELETE FROM " . $this->table . " WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);

        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Nhân viên đã được xóa thành công",
                "data" => $nhanVienInfo
            ];
        }
        
        echo json_encode(["status" => "error", "message" => "Xóa nhân viên thất bại"]);
        http_response_code(500);
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
    
    // Hàm sinh mã nhân viên tự động
    public function generateEmployeeCode($prefix = "NV") {
        try {
            // Tìm mã nhân viên lớn nhất hiện tại có cùng prefix
            $sql = "SELECT MaNhanVien FROM " . $this->table . " WHERE MaNhanVien LIKE :prefix ORDER BY MaNhanVien DESC LIMIT 1";
            $stmt = $this->conn->prepare($sql);
            $prefixParam = $prefix . "%";
            $stmt->bindParam(":prefix", $prefixParam);
            $stmt->execute();
            
            // Lấy mã nhân viên lớn nhất
            $lastCode = $stmt->fetchColumn();
            
            if ($lastCode) {
                // Nếu đã có mã nhân viên trong cơ sở dữ liệu
                // Trích xuất phần số từ mã (loại bỏ phần prefix)
                $lastNumber = (int)substr($lastCode, strlen($prefix));
                
                // Tăng số lên 1
                $newNumber = $lastNumber + 1;
                
                // Đảm bảo số mới có 3 chữ số (thêm số 0 phía trước nếu cần)
                $newCode = $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
            } else {
                // Nếu chưa có mã nhân viên nào trong cơ sở dữ liệu với prefix này, bắt đầu với 001
                $newCode = $prefix . "001";
            }
            
            return $newCode;
        } catch (PDOException $e) {
            // Xử lý lỗi nếu có
            error_log("Lỗi khi sinh mã nhân viên: " . $e->getMessage());
            return false;
        }
    }
}
?>