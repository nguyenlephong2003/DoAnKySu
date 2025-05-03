<?php
class TaiKhoan {
    private $conn;
    private $table = "TaiKhoan";
    
    public $MaTaiKhoan;
    public $MatKhau;
    public $MaNhanVien;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Kiểm tra xem tài khoản đã tồn tại chưa
    private function isTaiKhoanExist() {
        $query = "SELECT MaTaiKhoan FROM " . $this->table . " WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }
    
    // Kiểm tra xem nhân viên đã có tài khoản chưa
    private function isNhanVienHasAccount() {
        $query = "SELECT MaNhanVien FROM " . $this->table . " WHERE MaNhanVien = :MaNhanVien AND MaTaiKhoan != :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }
    
    // Kiểm tra xem nhân viên có tồn tại không
    private function isNhanVienExist() {
        $query = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return ($stmt->rowCount() > 0);
    }
    
    // Thêm tài khoản mới
    public function add() {
        // Kiểm tra nếu tài khoản đã tồn tại
        if ($this->isTaiKhoanExist()) {
            echo json_encode(["message" => "Mã tài khoản đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên đã có tài khoản
        if ($this->isNhanVienHasAccount()) {
            echo json_encode(["message" => "Nhân viên đã có tài khoản"]);
            http_response_code(400);
            return false;
        }
        
        // Mã hóa mật khẩu
        $hashed_password = password_hash($this->MatKhau, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO " . $this->table . " (MaTaiKhoan, MatKhau, MaNhanVien) VALUES (:MaTaiKhoan, :MatKhau, :MaNhanVien)";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MatKhau", $hashed_password);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Cập nhật thông tin tài khoản
    public function update() {
        // Kiểm tra nếu tài khoản không tồn tại
        if (!$this->isTaiKhoanExist()) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên không tồn tại
        if (!$this->isNhanVienExist()) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên đã có tài khoản khác
        if ($this->isNhanVienHasAccount()) {
            echo json_encode(["message" => "Nhân viên đã có tài khoản khác"]);
            http_response_code(400);
            return false;
        }
        
        $query = "UPDATE " . $this->table . " SET MaNhanVien = :MaNhanVien";
        
        // Nếu mật khẩu được cập nhật
        if (!empty($this->MatKhau)) {
            $hashed_password = password_hash($this->MatKhau, PASSWORD_DEFAULT);
            $query .= ", MatKhau = :MatKhau";
        }
        
        $query .= " WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        
        if (!empty($this->MatKhau)) {
            $stmt->bindParam(":MatKhau", $hashed_password);
        }
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Xóa tài khoản
    public function delete() {
        // Kiểm tra nếu tài khoản không tồn tại
        if (!$this->isTaiKhoanExist()) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "DELETE FROM " . $this->table . " WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Lấy tất cả tài khoản
    public function getAll() {
        $query = "SELECT tk.*, nv.TenNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy tài khoản theo ID
    public function getById() {
        $query = "SELECT tk.*, nv.TenNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  WHERE tk.MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy tài khoản theo mã nhân viên
    public function getByNhanVien() {
        $query = "SELECT tk.*, nv.TenNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  WHERE tk.MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return $stmt;
    }
    
// Phương thức đăng nhập điều chỉnh cho mật khẩu dạng MD5
public function login() {
    $query = "SELECT tk.*, nv.TenNhanVien 
              FROM " . $this->table . " tk
              LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
              WHERE tk.MaTaiKhoan = :MaTaiKhoan";
    $stmt = $this->conn->prepare($query);
    
    // Ràng buộc tham số
    $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Băm mật khẩu người dùng nhập bằng MD5 và so sánh
        if (md5($this->MatKhau) === $row['MatKhau']) {
            return $row;
        }
    }
    
    return false;
}
    
    // Đổi mật khẩu
    public function changePassword() {
        // Kiểm tra tài khoản tồn tại
        if (!$this->isTaiKhoanExist()) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Mã hóa mật khẩu mới
        $hashed_password = password_hash($this->MatKhau, PASSWORD_DEFAULT);
        
        $query = "UPDATE " . $this->table . " SET MatKhau = :MatKhau WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MatKhau", $hashed_password);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>