<?php
class BangPhanCong {
    private $conn;
    private $table_name = 'BangPhanCong';

    // Table columns
    public $MaBangPhanCong;
    public $MaCongTrinh;
    public $MaNhanVien;
    public $NgayThamGia;
    public $NgayKetThuc;
    public $SoNgayThamGia;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new BangPhanCong entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) 
                  VALUES (:maCongTrinh, :maNhanVien, :ngayThamGia, :ngayKetThuc, :soNgayThamGia)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));
        $this->NgayThamGia = htmlspecialchars(strip_tags($this->NgayThamGia));
        $this->NgayKetThuc = htmlspecialchars(strip_tags($this->NgayKetThuc));
        $this->SoNgayThamGia = filter_var($this->SoNgayThamGia, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":ngayThamGia", $this->NgayThamGia);
        $stmt->bindParam(":ngayKetThuc", $this->NgayKetThuc);
        $stmt->bindParam(":soNgayThamGia", $this->SoNgayThamGia);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaBangPhanCong = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single BangPhanCong entry
    public function readSingle() {
        $query = "SELECT pc.*, 
                         ct.TenCongTrinh, 
                         nv.TenNhanVien
                  FROM " . $this->table_name . " pc
                  LEFT JOIN CongTrinh ct ON pc.MaCongTrinh = ct.MaCongTrinh
                  LEFT JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                  WHERE pc.MaBangPhanCong = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaBangPhanCong);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaBangPhanCong = $row['MaBangPhanCong'];
        $this->MaCongTrinh = $row['MaCongTrinh'];
        $this->MaNhanVien = $row['MaNhanVien'];
        $this->NgayThamGia = $row['NgayThamGia'];
        $this->NgayKetThuc = $row['NgayKetThuc'];
        $this->SoNgayThamGia = $row['SoNgayThamGia'];

        // Return additional information
        return [
            'TenCongTrinh' => $row['TenCongTrinh'],
            'TenNhanVien' => $row['TenNhanVien']
        ];
    }

    // Get assignments for a specific project
    public function getProjectAssignments($maCongTrinh) {
        $query = "SELECT pc.*, nv.TenNhanVien, nv.SoDT
                  FROM " . $this->table_name . " pc
                  LEFT JOIN NhanVien nv ON pc.MaNhanVien = nv.MaNhanVien
                  WHERE pc.MaCongTrinh = ?
                  ORDER BY pc.NgayThamGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get assignments for a specific employee
    public function getEmployeeAssignments($maNhanVien) {
        $query = "SELECT pc.*, ct.TenCongTrinh
                  FROM " . $this->table_name . " pc
                  LEFT JOIN CongTrinh ct ON pc.MaCongTrinh = ct.MaCongTrinh
                  WHERE pc.MaNhanVien = ?
                  ORDER BY pc.NgayThamGia DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind employee ID
        $stmt->bindParam(1, $maNhanVien);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update BangPhanCong entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET MaCongTrinh = :maCongTrinh, 
                      MaNhanVien = :maNhanVien, 
                      NgayThamGia = :ngayThamGia, 
                      NgayKetThuc = :ngayKetThuc, 
                      SoNgayThamGia = :soNgayThamGia 
                  WHERE MaBangPhanCong = :maBangPhanCong";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));
        $this->NgayThamGia = htmlspecialchars(strip_tags($this->NgayThamGia));
        $this->NgayKetThuc = htmlspecialchars(strip_tags($this->NgayKetThuc));
        $this->SoNgayThamGia = filter_var($this->SoNgayThamGia, FILTER_VALIDATE_INT);
        $this->MaBangPhanCong = filter_var($this->MaBangPhanCong, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":ngayThamGia", $this->NgayThamGia);
        $stmt->bindParam(":ngayKetThuc", $this->NgayKetThuc);
        $stmt->bindParam(":soNgayThamGia", $this->SoNgayThamGia);
        $stmt->bindParam(":maBangPhanCong", $this->MaBangPhanCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete BangPhanCong entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaBangPhanCong = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaBangPhanCong = filter_var($this->MaBangPhanCong, FILTER_VALIDATE_INT);

        // Bind ID
        $stmt->bindParam(1, $this->MaBangPhanCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get employee workload
    public function getEmployeeWorkload($maNhanVien, $startDate = null, $endDate = null) {
        $query = "SELECT 
                    COUNT(DISTINCT MaCongTrinh) as SoCongTrinh,
                    SUM(SoNgayThamGia) as TongNgayThamGia
                  FROM " . $this->table_name . "
                  WHERE MaNhanVien = ?";

        // Add date range filter if provided
        if ($startDate && $endDate) {
            $query .= " AND NgayThamGia BETWEEN :startDate AND :endDate";
        }

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind employee ID
        $stmt->bindParam(1, $maNhanVien);

        // Bind date parameters if provided
        if ($startDate && $endDate) {
            $stmt->bindParam(":startDate", $startDate);
            $stmt->bindParam(":endDate", $endDate);
        }

        // Execute query
        $stmt->execute();

        // Return workload details
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>