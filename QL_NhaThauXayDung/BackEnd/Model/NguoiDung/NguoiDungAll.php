<?php
class NguoiDungAll {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // -------------- Phần LoaiNhanVien --------------
    public function getAllLoaiNhanVien() {
        $query = "SELECT * FROM LoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getLoaiNhanVienById($maLoai) {
        $query = "SELECT * FROM LoaiNhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $stmt->execute();
        return $stmt;
    }

    public function addLoaiNhanVien($maLoai, $tenLoai) {
        // Kiểm tra nếu loại nhân viên đã tồn tại
        $checkQuery = "SELECT MaLoaiNhanVien FROM LoaiNhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["message" => "Mã loại nhân viên đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "INSERT INTO LoaiNhanVien (MaLoaiNhanVien, TenLoai) VALUES (:MaLoaiNhanVien, :TenLoai)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $stmt->bindParam(":TenLoai", $tenLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateLoaiNhanVien($maLoai, $tenLoai) {
        // Kiểm tra nếu loại nhân viên không tồn tại
        $checkQuery = "SELECT MaLoaiNhanVien FROM LoaiNhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Loại nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "UPDATE LoaiNhanVien SET TenLoai = :TenLoai WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $stmt->bindParam(":TenLoai", $tenLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteLoaiNhanVien($maLoai) {
        // Kiểm tra nếu loại nhân viên không tồn tại
        $checkQuery = "SELECT MaLoaiNhanVien FROM LoaiNhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Loại nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra xem có nhân viên nào thuộc loại này không
        $relatedQuery = "SELECT COUNT(*) as count FROM NhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $relatedStmt = $this->conn->prepare($relatedQuery);
        $relatedStmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $relatedStmt->execute();
        $row = $relatedStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row['count'] > 0) {
            echo json_encode(["message" => "Không thể xóa loại nhân viên này vì đã có nhân viên thuộc loại này"]);
            http_response_code(400);
            return false;
        }
        
        $query = "DELETE FROM LoaiNhanVien WHERE MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // -------------- Phần NhanVien --------------
    public function getAllNhanVien() {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM NhanVien nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getNhanVienById($maNV) {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM NhanVien nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE nv.MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $maNV);
        $stmt->execute();
        return $stmt;
    }

    public function getNhanVienByLoai($maLoai) {
        $query = "SELECT nv.*, lnv.TenLoai as TenLoaiNhanVien 
                  FROM NhanVien nv
                  LEFT JOIN LoaiNhanVien lnv ON nv.MaLoaiNhanVien = lnv.MaLoaiNhanVien
                  WHERE nv.MaLoaiNhanVien = :MaLoaiNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        $stmt->execute();
        return $stmt;
    }

    public function addNhanVien($maNV, $tenNV, $soDT, $cccd, $email, $ngayVao, $maLoai) {
        // Kiểm tra nếu nhân viên đã tồn tại
        $checkQuery = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaNhanVien", $maNV);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["message" => "Mã nhân viên đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu email đã tồn tại
        $checkEmailQuery = "SELECT Email FROM NhanVien WHERE Email = :Email";
        $checkEmailStmt = $this->conn->prepare($checkEmailQuery);
        $checkEmailStmt->bindParam(":Email", $email);
        $checkEmailStmt->execute();
        
        if ($checkEmailStmt->rowCount() > 0) {
            echo json_encode(["message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại
        if (!empty($cccd)) {
            $checkCCCDQuery = "SELECT CCCD FROM NhanVien WHERE CCCD = :CCCD";
            $checkCCCDStmt = $this->conn->prepare($checkCCCDQuery);
            $checkCCCDStmt->bindParam(":CCCD", $cccd);
            $checkCCCDStmt->execute();
            
            if ($checkCCCDStmt->rowCount() > 0) {
                echo json_encode(["message" => "CCCD đã tồn tại"]);
                http_response_code(400);
                return false;
            }
        }
        
        $query = "INSERT INTO NhanVien (MaNhanVien, TenNhanVien, SoDT, CCCD, Email, NgayVao, MaLoaiNhanVien) 
                  VALUES (:MaNhanVien, :TenNhanVien, :SoDT, :CCCD, :Email, :NgayVao, :MaLoaiNhanVien)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $maNV);
        $stmt->bindParam(":TenNhanVien", $tenNV);
        $stmt->bindParam(":SoDT", $soDT);
        $stmt->bindParam(":CCCD", $cccd);
        $stmt->bindParam(":Email", $email);
        $stmt->bindParam(":NgayVao", $ngayVao);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateNhanVien($maNV, $tenNV, $soDT, $cccd, $email, $ngayVao, $maLoai) {
        // Kiểm tra nếu nhân viên không tồn tại
        $checkQuery = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaNhanVien", $maNV);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu email đã tồn tại (của người khác)
        $checkEmailQuery = "SELECT Email FROM NhanVien WHERE Email = :Email AND MaNhanVien != :MaNhanVien";
        $checkEmailStmt = $this->conn->prepare($checkEmailQuery);
        $checkEmailStmt->bindParam(":Email", $email);
        $checkEmailStmt->bindParam(":MaNhanVien", $maNV);
        $checkEmailStmt->execute();
        
        if ($checkEmailStmt->rowCount() > 0) {
            echo json_encode(["message" => "Email đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu CCCD đã tồn tại (của người khác)
        if (!empty($cccd)) {
            $checkCCCDQuery = "SELECT CCCD FROM NhanVien WHERE CCCD = :CCCD AND MaNhanVien != :MaNhanVien";
            $checkCCCDStmt = $this->conn->prepare($checkCCCDQuery);
            $checkCCCDStmt->bindParam(":CCCD", $cccd);
            $checkCCCDStmt->bindParam(":MaNhanVien", $maNV);
            $checkCCCDStmt->execute();
            
            if ($checkCCCDStmt->rowCount() > 0) {
                echo json_encode(["message" => "CCCD đã tồn tại"]);
                http_response_code(400);
                return false;
            }
        }
        
        $query = "UPDATE NhanVien SET TenNhanVien = :TenNhanVien, SoDT = :SoDT, CCCD = :CCCD, 
                  Email = :Email, NgayVao = :NgayVao, MaLoaiNhanVien = :MaLoaiNhanVien 
                  WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $maNV);
        $stmt->bindParam(":TenNhanVien", $tenNV);
        $stmt->bindParam(":SoDT", $soDT);
        $stmt->bindParam(":CCCD", $cccd);
        $stmt->bindParam(":Email", $email);
        $stmt->bindParam(":NgayVao", $ngayVao);
        $stmt->bindParam(":MaLoaiNhanVien", $maLoai);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteNhanVien($maNV) {
        // Kiểm tra nếu nhân viên không tồn tại
        $checkQuery = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaNhanVien", $maNV);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
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
            $relatedQuery = "SELECT COUNT(*) as count FROM " . $table . " WHERE " . $field . " = :MaNhanVien";
            $relatedStmt = $this->conn->prepare($relatedQuery);
            $relatedStmt->bindParam(":MaNhanVien", $maNV);
            $relatedStmt->execute();
            $row = $relatedStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($row['count'] > 0) {
                echo json_encode(["message" => "Không thể xóa nhân viên này vì đã có dữ liệu liên quan trong bảng " . $table]);
                http_response_code(400);
                return false;
            }
        }
        
        $query = "DELETE FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $maNV);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // -------------- Phần TaiKhoan --------------
    public function getAllTaiKhoan() {
        $query = "SELECT tk.MaTaiKhoan, tk.MaNhanVien, nv.TenNhanVien
                  FROM TaiKhoan tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getTaiKhoanById($maTK) {
        $query = "SELECT tk.MaTaiKhoan, tk.MaNhanVien, nv.TenNhanVien
                  FROM TaiKhoan tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  WHERE tk.MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $maTK);
        $stmt->execute();
        return $stmt;
    }

    public function getTaiKhoanByNhanVien($maNV) {
        $query = "SELECT tk.MaTaiKhoan, tk.MaNhanVien, nv.TenNhanVien
                  FROM TaiKhoan tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  WHERE tk.MaNhanVien = :MaNhanVien";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaNhanVien", $maNV);
        $stmt->execute();
        return $stmt;
    }

    public function addTaiKhoan($maTK, $matKhau, $maNV) {
        // Kiểm tra nếu tài khoản đã tồn tại
        $checkQuery = "SELECT MaTaiKhoan FROM TaiKhoan WHERE MaTaiKhoan = :MaTaiKhoan";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaTaiKhoan", $maTK);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(["message" => "Mã tài khoản đã tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên không tồn tại
        $checkNVQuery = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $checkNVStmt = $this->conn->prepare($checkNVQuery);
        $checkNVStmt->bindParam(":MaNhanVien", $maNV);
        $checkNVStmt->execute();
        
        if ($checkNVStmt->rowCount() == 0) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên đã có tài khoản
        $checkTKQuery = "SELECT MaNhanVien FROM TaiKhoan WHERE MaNhanVien = :MaNhanVien";
        $checkTKStmt = $this->conn->prepare($checkTKQuery);
        $checkTKStmt->bindParam(":MaNhanVien", $maNV);
        $checkTKStmt->execute();
        
        if ($checkTKStmt->rowCount() > 0) {
            echo json_encode(["message" => "Nhân viên đã có tài khoản"]);
            http_response_code(400);
            return false;
        }
        
        // Mã hóa mật khẩu
        $hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO TaiKhoan (MaTaiKhoan, MatKhau, MaNhanVien) VALUES (:MaTaiKhoan, :MatKhau, :MaNhanVien)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $maTK);
        $stmt->bindParam(":MatKhau", $hashedPassword);
        $stmt->bindParam(":MaNhanVien", $maNV);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateTaiKhoan($maTK, $maNV, $matKhau = null) {
        // Kiểm tra nếu tài khoản không tồn tại
        $checkQuery = "SELECT MaTaiKhoan FROM TaiKhoan WHERE MaTaiKhoan = :MaTaiKhoan";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaTaiKhoan", $maTK);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên không tồn tại
        $checkNVQuery = "SELECT MaNhanVien FROM NhanVien WHERE MaNhanVien = :MaNhanVien";
        $checkNVStmt = $this->conn->prepare($checkNVQuery);
        $checkNVStmt->bindParam(":MaNhanVien", $maNV);
        $checkNVStmt->execute();
        
        if ($checkNVStmt->rowCount() == 0) {
            echo json_encode(["message" => "Nhân viên không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Kiểm tra nếu nhân viên đã có tài khoản khác
        $checkTKQuery = "SELECT MaNhanVien FROM TaiKhoan WHERE MaNhanVien = :MaNhanVien AND MaTaiKhoan != :MaTaiKhoan";
        $checkTKStmt = $this->conn->prepare($checkTKQuery);
        $checkTKStmt->bindParam(":MaNhanVien", $maNV);
        $checkTKStmt->bindParam(":MaTaiKhoan", $maTK);
        $checkTKStmt->execute();
        
        if ($checkTKStmt->rowCount() > 0) {
            echo json_encode(["message" => "Nhân viên đã có tài khoản khác"]);
            http_response_code(400);
            return false;
        }
        
        if (!empty($matKhau)) {
            // Mã hóa mật khẩu mới
            $hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);
            
            $query = "UPDATE TaiKhoan SET MaNhanVien = :MaNhanVien, MatKhau = :MatKhau WHERE MaTaiKhoan = :MaTaiKhoan";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":MaTaiKhoan", $maTK);
            $stmt->bindParam(":MaNhanVien", $maNV);
            $stmt->bindParam(":MatKhau", $hashedPassword);
        } else {
            $query = "UPDATE TaiKhoan SET MaNhanVien = :MaNhanVien WHERE MaTaiKhoan = :MaTaiKhoan";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":MaTaiKhoan", $maTK);
            $stmt->bindParam(":MaNhanVien", $maNV);
        }
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteTaiKhoan($maTK) {
        // Kiểm tra nếu tài khoản không tồn tại
        $checkQuery = "SELECT MaTaiKhoan FROM TaiKhoan WHERE MaTaiKhoan = :MaTaiKhoan";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaTaiKhoan", $maTK);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        $query = "DELETE FROM TaiKhoan WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $maTK);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function login($maTK, $matKhau) {
        $query = "SELECT tk.*, nv.TenNhanVien 
                  FROM TaiKhoan tk
                  LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
                  WHERE tk.MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $maTK);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($matKhau, $row['MatKhau'])) {
                return $row;
            }
        }
        
        return false;
    }

    public function changePassword($maTK, $matKhau) {
        // Kiểm tra tài khoản tồn tại
        $checkQuery = "SELECT MaTaiKhoan FROM TaiKhoan WHERE MaTaiKhoan = :MaTaiKhoan";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":MaTaiKhoan", $maTK);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            echo json_encode(["message" => "Tài khoản không tồn tại"]);
            http_response_code(400);
            return false;
        }
        
        // Mã hóa mật khẩu mới
        $hashedPassword = password_hash($matKhau, PASSWORD_DEFAULT);
        
        $query = "UPDATE TaiKhoan SET MatKhau = :MatKhau WHERE MaTaiKhoan = :MaTaiKhoan";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaTaiKhoan", $maTK);
        $stmt->bindParam(":MatKhau", $hashedPassword);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>