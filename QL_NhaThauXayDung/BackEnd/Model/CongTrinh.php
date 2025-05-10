<?php
class CongTrinh {
    private $conn;
    private $table_name = 'CongTrinh';

    // Table columns
    public $MaCongTrinh;
    public $TenCongTrinh;
    public $Dientich;
    public $FileThietKe;
    public $MaKhachHang;
    public $MaHopDong;
    public $MaLoaiCongTrinh;
    public $NgayDuKienHoanThanh;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new CongTrinh entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaCongTrinh, TenCongTrinh, Dientich, FileThietKe, 
                   MaKhachHang, MaHopDong, MaLoaiCongTrinh, NgayDuKienHoanThanh) 
                  VALUES (:maCongTrinh, :tenCongTrinh, :dienTich, :fileThietKe, 
                          :maKhachHang, :maHopDong, :maLoaiCongTrinh, :ngayDuKienHoanThanh)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->TenCongTrinh = htmlspecialchars(strip_tags($this->TenCongTrinh));
        $this->Dientich = filter_var($this->Dientich, FILTER_VALIDATE_FLOAT);
        $this->FileThietKe = htmlspecialchars(strip_tags($this->FileThietKe));
        $this->MaKhachHang = htmlspecialchars(strip_tags($this->MaKhachHang));
        $this->MaHopDong = htmlspecialchars(strip_tags($this->MaHopDong));
        $this->MaLoaiCongTrinh = filter_var($this->MaLoaiCongTrinh, FILTER_VALIDATE_INT);
        $this->NgayDuKienHoanThanh = htmlspecialchars(strip_tags($this->NgayDuKienHoanThanh));

        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":tenCongTrinh", $this->TenCongTrinh);
        $stmt->bindParam(":dienTich", $this->Dientich);
        $stmt->bindParam(":fileThietKe", $this->FileThietKe);
        $stmt->bindParam(":maKhachHang", $this->MaKhachHang);
        $stmt->bindParam(":maHopDong", $this->MaHopDong);
        $stmt->bindParam(":maLoaiCongTrinh", $this->MaLoaiCongTrinh);
        $stmt->bindParam(":ngayDuKienHoanThanh", $this->NgayDuKienHoanThanh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single CongTrinh entry
    public function readSingle() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE MaCongTrinh = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaCongTrinh);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaCongTrinh = $row['MaCongTrinh'];
        $this->TenCongTrinh = $row['TenCongTrinh'];
        $this->Dientich = $row['Dientich'];
        $this->FileThietKe = $row['FileThietKe'];
        $this->MaKhachHang = $row['MaKhachHang'];
        $this->MaHopDong = $row['MaHopDong'];
        $this->MaLoaiCongTrinh = $row['MaLoaiCongTrinh'];
        $this->NgayDuKienHoanThanh = $row['NgayDuKienHoanThanh'];
    }

    // Update CongTrinh entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenCongTrinh = :tenCongTrinh, 
                      Dientich = :dienTich, 
                      FileThietKe = :fileThietKe, 
                      MaKhachHang = :maKhachHang, 
                      MaHopDong = :maHopDong, 
                      MaLoaiCongTrinh = :maLoaiCongTrinh, 
                      NgayDuKienHoanThanh = :ngayDuKienHoanThanh 
                  WHERE MaCongTrinh = :maCongTrinh";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenCongTrinh = htmlspecialchars(strip_tags($this->TenCongTrinh));
        $this->Dientich = filter_var($this->Dientich, FILTER_VALIDATE_FLOAT);
        $this->FileThietKe = htmlspecialchars(strip_tags($this->FileThietKe));
        $this->MaKhachHang = htmlspecialchars(strip_tags($this->MaKhachHang));
        $this->MaHopDong = htmlspecialchars(strip_tags($this->MaHopDong));
        $this->MaLoaiCongTrinh = filter_var($this->MaLoaiCongTrinh, FILTER_VALIDATE_INT);
        $this->NgayDuKienHoanThanh = htmlspecialchars(strip_tags($this->NgayDuKienHoanThanh));
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));

        $stmt->bindParam(":tenCongTrinh", $this->TenCongTrinh);
        $stmt->bindParam(":dienTich", $this->Dientich);
        $stmt->bindParam(":fileThietKe", $this->FileThietKe);
        $stmt->bindParam(":maKhachHang", $this->MaKhachHang);
        $stmt->bindParam(":maHopDong", $this->MaHopDong);
        $stmt->bindParam(":maLoaiCongTrinh", $this->MaLoaiCongTrinh);
        $stmt->bindParam(":ngayDuKienHoanThanh", $this->NgayDuKienHoanThanh);
        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete CongTrinh entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaCongTrinh = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));

        // Bind ID
        $stmt->bindParam(1, $this->MaCongTrinh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get list of projects by customer
    public function getProjectsByCustomer($maKhachHang) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE MaKhachHang = ?
                  ORDER BY NgayDuKienHoanThanh DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind customer ID
        $stmt->bindParam(1, $maKhachHang);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get list of projects by project type
    public function getProjectsByType($maLoaiCongTrinh) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE MaLoaiCongTrinh = ?
                  ORDER BY NgayDuKienHoanThanh DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project type ID
        $stmt->bindParam(1, $maLoaiCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get project progress
    public function getProjectProgress() {
        $query = "SELECT CongViec, NoiDungCongViec, 
                         ThoiGianHoanThanhThucTe, TrangThai, 
                         TiLeHoanThanh
                  FROM BangBaoCaoTienDo
                  WHERE MaCongTrinh = ?
                  ORDER BY ThoiGianHoanThanhThucTe";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $this->MaCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Lấy tất cả công trình
    public function readAll() {
        $query = "SELECT ct.MaCongTrinh, ct.TenCongTrinh, ct.Dientich, ct.FileThietKe, ct.MaKhachHang, ct.MaHopDong, ct.MaLoaiCongTrinh, ct.NgayDuKienHoanThanh, lct.TenLoaiCongTrinh, kh.TenKhachHang
                  FROM " . $this->table_name . " ct
                  LEFT JOIN LoaiCongTrinh lct ON ct.MaLoaiCongTrinh = lct.MaLoaiCongTrinh
                  LEFT JOIN KhachHang kh ON ct.MaKhachHang = kh.MaKhachHang
                  ORDER BY ct.MaCongTrinh DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>