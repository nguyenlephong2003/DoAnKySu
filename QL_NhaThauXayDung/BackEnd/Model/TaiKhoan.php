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
        
        // Mã hóa mật khẩu bằng MD5
        $md5_password = md5($this->MatKhau);
        
        $query = "INSERT INTO " . $this->table . " (MaTaiKhoan, MatKhau, MaNhanVien) VALUES (:MaTaiKhoan, :MatKhau, :MaNhanVien)";
        $stmt = $this->conn->prepare($query);
        
        // Ràng buộc tham số
        $stmt->bindParam(":MaTaiKhoan",$this->generateAccountCode($this->conn, $this->table, "MaTaiKhoan"));
        $stmt->bindParam(":MatKhau", $md5_password);
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

//     function sinhMaNhanVien($prefix, $conn) {
//     // Câu SQL: Lấy mã cuối cùng có prefix tương ứng
//     $sql = "
//         SELECT TOP 1 MaNhanVien AS MaCuoi
//         FROM $this->table
//         WHERE MaNhanVien LIKE ?
//         ORDER BY CAST(SUBSTRING(MaNhanVien, LEN(?) + 1, LEN(MaNhanVien)) AS INT) DESC
//     ";

//     // Chuẩn bị giá trị để truyền vào câu lệnh (dạng 'AD%')
//     $likePrefix = $prefix . '%';

//     $stmt = $conn->prepare($sql);
//     $stmt->bind_param("ss", $likePrefix, $prefix);
//     $stmt->execute();
//     $result = $stmt->get_result();

//     $nextNumber = 1; // Mặc định nếu chưa có mã nào

//     if ($row = $result->fetch_assoc()) {
//         // Tách phần số phía sau prefix
//         $maCuoi = $row['MaCuoi'];
//         $soCuoi = intval(substr($maCuoi, strlen($prefix)));
//         $nextNumber = $soCuoi + 1;
//     }

//     // Format lại mã mới: ví dụ AD001, GD015,...
//     $maMoi = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
//     return $maMoi;
// }
function generateAccountCode($conn, $tableName, $columnName) {
    try {
        // Tìm mã tài khoản lớn nhất hiện tại trong cơ sở dữ liệu
        $sql = "SELECT $columnName FROM $tableName WHERE $columnName LIKE 'TK%' ORDER BY $columnName DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        // Lấy mã tài khoản lớn nhất
        $lastCode = $stmt->fetchColumn();
        
        if ($lastCode) {
            // Nếu đã có mã tài khoản trong cơ sở dữ liệu
            // Trích xuất phần số từ mã (loại bỏ phần "TK")
            $lastNumber = (int)substr($lastCode, 2);
            
            // Tăng số lên 1
            $newNumber = $lastNumber + 1;
            
            // Đảm bảo số mới có 3 chữ số (thêm số 0 phía trước nếu cần)
            $newCode = 'TK' . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
        } else {
            // Nếu chưa có mã tài khoản nào trong cơ sở dữ liệu, bắt đầu với TK001
            $newCode = 'TK001';
        }
        
        return $newCode;
    } catch (PDOException $e) {
        // Xử lý lỗi nếu có
        error_log("Lỗi khi sinh mã tài khoản: " . $e->getMessage());
        return false;
    }
}
}
?>