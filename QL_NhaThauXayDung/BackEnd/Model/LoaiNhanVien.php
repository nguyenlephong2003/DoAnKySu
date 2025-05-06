<?php
class LoaiNhanVien {
    private $conn;
    private $table = "LoaiNhanVien";
    
    public $MaLoaiNhanVien;
    public $TenLoai;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Kiểm tra xem loại nhân viên đã tồn tại chưa
    private function isLoaiNhanVienExist() {
        $query = "SELECT MaLoaiNhanVien FROM " . $this->table . " WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }
    
    // Thêm loại nhân viên mới
    public function add() {
        // Kiểm tra nếu loại nhân viên đã tồn tại
        if ($this->isLoaiNhanVienExist()) {
            echo json_encode(["message" => "Mã loại nhân viên đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "INSERT INTO " . $this->table . " (MaLoaiNhanVien, TenLoai) VALUES (:MaLoaiNhanVien, :TenLoai)";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->bindParam(":TenLoai", $this->TenLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Cập nhật thông tin loại nhân viên
    public function update() {
        // Kiểm tra nếu loại nhân viên không tồn tại
        if (!$this->isLoaiNhanVienExist()) {
            echo json_encode(["message" => "Loại nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "UPDATE " . $this->table . " SET TenLoai = :TenLoai WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->bindParam(":TenLoai", $this->TenLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Xóa loại nhân viên
    public function delete() {
        // Kiểm tra nếu loại nhân viên không tồn tại
        if (!$this->isLoaiNhanVienExist()) {
            echo json_encode(["message" => "Loại nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra xem có nhân viên nào thuộc loại này không
        $query = "SELECT COUNT(*) as count FROM NhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row['count'] > 0) {
            echo json_encode(["message" => "Không thể xóa loại nhân viên này vì đã có nhân viên thuộc loại này"]);
            http_response_code(400);
            return false;
        }
        
        $query = "DELETE FROM " . $this->table . " WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Lấy tất cả loại nhân viên
    public function getAll() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy loại nhân viên theo ID
    public function getById() {
        $query = "SELECT * FROM " . $this->table . " WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaLoaiNhanVien", $this->MaLoaiNhanVien);
        $stmt->execute();
        return $stmt;
    }
}
?>