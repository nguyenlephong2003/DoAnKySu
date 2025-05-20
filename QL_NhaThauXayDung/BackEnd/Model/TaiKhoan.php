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
        $query = "SELECT MaNhanVien FROM " . $this->table . " WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
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
    try {
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
        
        // Sinh mã tài khoản
        $this->MaTaiKhoan = $this->generateAccountCode();
        
        // Mã hóa mật khẩu bằng MD5
        $md5_password = md5($this->MatKhau);
        
        $query = "INSERT INTO " . $this->table . " (MaTaiKhoan, MatKhau, MaNhanVien) VALUES (:MaTaiKhoan, :MatKhau, :MaNhanVien)";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MatKhau", $md5_password);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        
        if ($stmt->execute()) {
            return $this->MaTaiKhoan; // Trả về MaTaiKhoan thay vì true
        }
        
        echo json_encode(["message" => "Lỗi khi thêm tài khoản"]);
        http_response_code(500);
        return false;
    } catch (Exception $e) {
        // Bắt ngoại lệ từ generateAccountCode
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return false;
    }
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
            $md5_password = md5($this->MatKhau);
            $query .= ", MatKhau = :MatKhau";
        }
        
        $query .= " WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        
        if (!empty($this->MatKhau)) {
            $stmt->bindParam(":MatKhau", $md5_password);
        }
        
        if ($stmt->execute()) {
            return $this->MaTaiKhoan;
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
        $query = "SELECT tk.*, nv.TenNhanVien, nv.MaLoaiNhanVien, lnv.TenLoai as LoaiNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy tài khoản theo ID
    public function getById() {
        $query = "SELECT tk.*, nv.TenNhanVien, nv.MaLoaiNhanVien, lnv.TenLoai as LoaiNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE tk.MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->execute();
        return $stmt;
    }
    
    // Lấy tài khoản theo mã nhân viên
    public function getByNhanVien() {
        $query = "SELECT tk.*, nv.TenNhanVien, nv.MaLoaiNhanVien, lnv.TenLoai as LoaiNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE tk.MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);
        $stmt->execute();
        return $stmt;
    }
    
    // Phương thức đăng nhập với MD5
    public function login() {
        $query = "SELECT tk.*, nv.TenNhanVien, nv.MaLoaiNhanVien, lnv.TenLoai as LoaiNhanVien
                  FROM " . $this->table . " tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
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
        
        // Mã hóa mật khẩu mới bằng MD5
        $md5_password = md5($this->MatKhau);
        
        $query = "UPDATE " . $this->table . " SET MatKhau = :MatKhau WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan", $this->MaTaiKhoan);
        $stmt->bindParam(":MatKhau", $md5_password);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    // Lấy danh sách nhân viên chưa có tài khoản
    public function getNhanVienWithoutAccount() {
        $query = "SELECT MaNhanVien, TenNhanVien, MaLoaiNhanVien 
                  FROM NhanVien 
                  WHERE MaNhanVien NOT IN (SELECT MaNhanVien FROM " . $this->table . ")";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function sinhMaNhanVien($prefix, $conn) {
    // Câu SQL: Lấy mã cuối cùng có prefix tương ứng
    $sql = "
        SELECT TOP 1 MaNhanVien AS MaCuoi
        FROM $this->table
        WHERE MaNhanVien LIKE ?
        ORDER BY CAST(SUBSTRING(MaNhanVien, LEN(?) + 1, LEN(MaNhanVien)) AS INT) DESC
    ";

    // Chuẩn bị giá trị để truyền vào câu lệnh (dạng 'AD%')
    $likePrefix = $prefix . '%';

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $likePrefix, $prefix);
    $stmt->execute();
    $result = $stmt->get_result();

    $nextNumber = 1; // Mặc định nếu chưa có mã nào

    if ($row = $result->fetch_assoc()) {
        // Tách phần số phía sau prefix
        $maCuoi = $row['MaCuoi'];
        $soCuoi = intval(substr($maCuoi, strlen($prefix)));
        $nextNumber = $soCuoi + 1;
    }

    // Format lại mã mới: ví dụ AD001, GD015,...
    $maMoi = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    return $maMoi;
}

 private function generateAccountCode() {
        // Đếm tổng số dòng trong bảng TaiKhoan
        $query = "SELECT COUNT(*) AS total FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $totalRows = (int)$row['total'];
        // Tính mã mới là tổng số dòng + 1
        $newNumber = $totalRows + 1;
        // Kiểm tra nếu mã mới vượt quá 999
        if ($newNumber > 999) {
            throw new Exception("Vượt quá giới hạn sinh mã (999)");
        }
        // Tạo mã với định dạng TKxxx
        return sprintf("TK%03d", $newNumber);
    }
}
?>