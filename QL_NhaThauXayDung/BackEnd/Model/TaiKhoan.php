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
    
    public function addAccount($maNhanVien, $matKhau, $loaiNhanVien) {
    try {
        // Kiểm tra MaNhanVien có tồn tại không
        $stmt = $this->conn->prepare("SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :maNhanVien");
        $stmt->bindParam(':maNhanVien', $maNhanVien);
        $stmt->execute();
        if (!$stmt->fetch()) {
            throw new Exception("Mã Nhân Viên '$maNhanVien' không tồn tại");
        }

        // Kiểm tra LoaiNhanVien có tồn tại không
        $stmt = $this->conn->prepare("SELECT MaLoaiNhanVien FROM LoaiNhanVien WHERE TenLoai = :loaiNhanVien");
        $stmt->bindParam(':loaiNhanVien', $loaiNhanVien);
        $stmt->execute();
        $role = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$role) {
            throw new Exception("Loại Nhân Viên '$loaiNhanVien' không tồn tại");
        }

        // Kiểm tra MaNhanVien đã có tài khoản chưa
        $stmt = $this->conn->prepare("SELECT MaNhanVien FROM TaiKhoan WHERE MaNhanVien = :maNhanVien");
        $stmt->bindParam(':maNhanVien', $maNhanVien);
        $stmt->execute();
        if ($stmt->fetch()) {
            throw new Exception("Mã Nhân Viên '$maNhanVien' đã có tài khoản");
        }

        // Cập nhật MaLoaiNhanVien trong bảng NhanVien
        $stmt = $this->conn->prepare("
            UPDATE NhanVien
            SET MaLoaiNhanVien = :maLoaiNhanVien
            WHERE MaNhanVien = :maNhanVien
        ");
        $stmt->bindParam(':maLoaiNhanVien', $role['MaLoaiNhanVien']);
        $stmt->bindParam(':maNhanVien', $maNhanVien);
        $stmt->execute();

        // Tạo MaTaiKhoan
        $stmt = $this->conn->query("SELECT MAX(MaTaiKhoan) AS maxId FROM TaiKhoan");
        $maxId = $stmt->fetch(PDO::FETCH_ASSOC)['maxId'];
        $newId = $maxId ? 'TK' . str_pad((intval(substr($maxId, 2)) + 1), 3, '0', STR_PAD_LEFT) : 'TK001';

        // Mã hóa mật khẩu
        $hashedPassword = md5($matKhau);

        // Thêm tài khoản mới
        $stmt = $this->conn->prepare("
            INSERT INTO TaiKhoan (MaTaiKhoan, MatKhau, MaNhanVien)
            VALUES (:maTaiKhoan, :matKhau, :maNhanVien)
        ");
        $stmt->bindParam(':maTaiKhoan', $newId);
        $stmt->bindParam(':matKhau', $hashedPassword);
        $stmt->bindParam(':maNhanVien', $maNhanVien);
        $stmt->execute();

        return ["status" => "success", "message" => "Thêm tài khoản thành công"];
    } catch (PDOException $e) {
        throw new Exception("Lỗi khi thêm tài khoản: " . $e->getMessage());
    }
}

    
   public function updateAccount($maTaiKhoan, $matKhau, $loaiNhanVien) {
        try {
            // Check if MaTaiKhoan exists
            $stmt = $this->conn->prepare("SELECT MaNhanVien FROM TaiKhoan WHERE MaTaiKhoan = :maTaiKhoan");
            $stmt->bindParam(':maTaiKhoan', $maTaiKhoan);
            $stmt->execute();
            $account = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$account) {
                throw new Exception("Account not found");
            }

            $maNhanVien = $account['MaNhanVien'];

            // Get MaLoaiNhanVien
            $stmt = $this->conn->prepare("SELECT MaLoaiNhanVien FROM LoaiNhanVien WHERE TenLoai = :loaiNhanVien");
            $stmt->bindParam(':loaiNhanVien', $loaiNhanVien);
            $stmt->execute();
            $role = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$role) {
                throw new Exception("Invalid LoaiNhanVien");
            }

            // Update NhanVien with new MaLoaiNhanVien
            $stmt = $this->conn->prepare("
                UPDATE NhanVien
                SET MaLoaiNhanVien = :maLoaiNhanVien
                WHERE MaNhanVien = :maNhanVien
            ");
            $stmt->bindParam(':maLoaiNhanVien', $role['MaLoaiNhanVien']);
            $stmt->bindParam(':maNhanVien', $maNhanVien);
            $stmt->execute();

            // Update password if provided
            if (!empty($matKhau)) {
                $hashedPassword = md5($matKhau);
                $stmt = $this->conn->prepare("
                    UPDATE TaiKhoan
                    SET MatKhau = :matKhau
                    WHERE MaTaiKhoan = :maTaiKhoan
                ");
                $stmt->bindParam(':matKhau', $hashedPassword);
                $stmt->bindParam(':maTaiKhoan', $maTaiKhoan);
                $stmt->execute();
            }

            return ["status" => "success", "message" => "Account updated successfully"];
        } catch (PDOException $e) {
            throw new Exception("Error updating account: " . $e->getMessage());
        }
    }

    
    // Xóa tài khoản
   public function deleteAccount($maTaiKhoan) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM TaiKhoan WHERE MaTaiKhoan = :maTaiKhoan");
            $stmt->bindParam(':maTaiKhoan', $maTaiKhoan);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ["status" => "success", "message" => "Account deleted successfully"];
            } else {
                throw new Exception("Account not found");
            }
        } catch (PDOException $e) {
            throw new Exception("Error deleting account: " . $e->getMessage());
        }
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