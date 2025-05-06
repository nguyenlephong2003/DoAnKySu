<?php
class BangChamCong {
    private $conn;
    private $table_name = 'BangChamCong';

    // Table columns
    public $MaChamCong;
    public $SoNgayLam;
    public $KyLuong;
    public $MaNhanVien;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new BangChamCong entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaChamCong, SoNgayLam, KyLuong, MaNhanVien) 
                  VALUES (:maChamCong, :soNgayLam, :kyLuong, :maNhanVien)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaChamCong = htmlspecialchars(strip_tags($this->MaChamCong));
        $this->SoNgayLam = filter_var($this->SoNgayLam, FILTER_VALIDATE_FLOAT);
        $this->KyLuong = filter_var($this->KyLuong, FILTER_VALIDATE_INT);
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));

        $stmt->bindParam(":maChamCong", $this->MaChamCong);
        $stmt->bindParam(":soNgayLam", $this->SoNgayLam);
        $stmt->bindParam(":kyLuong", $this->KyLuong);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single BangChamCong entry
    public function readSingle() {
        $query = "SELECT MaChamCong, SoNgayLam, KyLuong, MaNhanVien
                  FROM " . $this->table_name . " 
                  WHERE MaChamCong = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaChamCong);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaChamCong = $row['MaChamCong'];
        $this->SoNgayLam = $row['SoNgayLam'];
        $this->KyLuong = $row['KyLuong'];
        $this->MaNhanVien = $row['MaNhanVien'];
    }

    // Read All BangChamCong entries
    public function readAll() {
        $query = "SELECT MaChamCong, SoNgayLam, KyLuong, MaNhanVien
                  FROM " . $this->table_name . " 
                  ORDER BY MaChamCong";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update BangChamCong entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET SoNgayLam = :soNgayLam, 
                      KyLuong = :kyLuong, 
                      MaNhanVien = :maNhanVien 
                  WHERE MaChamCong = :maChamCong";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->SoNgayLam = filter_var($this->SoNgayLam, FILTER_VALIDATE_FLOAT);
        $this->KyLuong = filter_var($this->KyLuong, FILTER_VALIDATE_INT);
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));
        $this->MaChamCong = htmlspecialchars(strip_tags($this->MaChamCong));

        $stmt->bindParam(":soNgayLam", $this->SoNgayLam);
        $stmt->bindParam(":kyLuong", $this->KyLuong);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":maChamCong", $this->MaChamCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete BangChamCong entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaChamCong = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaChamCong = htmlspecialchars(strip_tags($this->MaChamCong));

        // Bind ID
        $stmt->bindParam(1, $this->MaChamCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search BangChamCong entries
    public function search($keywords) {
        $query = "SELECT MaChamCong, SoNgayLam, KyLuong, MaNhanVien
                  FROM " . $this->table_name . " 
                  WHERE MaChamCong LIKE ? 
                     OR MaNhanVien LIKE ? 
                     OR KyLuong LIKE ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean keywords
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Bind keywords
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total count of BangChamCong entries
    public function count() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'];
    }

    // Get BangChamCong entries with pagination
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT MaChamCong, SoNgayLam, KyLuong, MaNhanVien
                  FROM " . $this->table_name . " 
                  ORDER BY MaChamCong
                  LIMIT ?, ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        // Execute query
        $stmt->execute();

        // Return statement
        return $stmt;
    }
}
?>