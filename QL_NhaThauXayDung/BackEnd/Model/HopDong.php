<?php
class HopDong {
    private $conn;
    private $table_name = 'HopDong';

    // Table columns
    public $MaHopDong;
    public $NgayKy;
    public $MoTa;
    public $TongTien;
    public $FileHopDong;
    public $MaNhanVien;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new HopDong entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien) 
                  VALUES (:maHopDong, :ngayKy, :moTa, :tongTien, :fileHopDong, :maNhanVien)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaHopDong = htmlspecialchars(strip_tags($this->MaHopDong));
        $this->NgayKy = htmlspecialchars(strip_tags($this->NgayKy));
        $this->MoTa = htmlspecialchars(strip_tags($this->MoTa));
        $this->TongTien = filter_var($this->TongTien, FILTER_VALIDATE_FLOAT);
        $this->FileHopDong = htmlspecialchars(strip_tags($this->FileHopDong));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));

        $stmt->bindParam(":maHopDong", $this->MaHopDong);
        $stmt->bindParam(":ngayKy", $this->NgayKy);
        $stmt->bindParam(":moTa", $this->MoTa);
        $stmt->bindParam(":tongTien", $this->TongTien);
        $stmt->bindParam(":fileHopDong", $this->FileHopDong);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single HopDong entry
    public function readSingle() {
        $query = "SELECT MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien
                  FROM " . $this->table_name . " 
                  WHERE MaHopDong = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaHopDong);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaHopDong = $row['MaHopDong'];
        $this->NgayKy = $row['NgayKy'];
        $this->MoTa = $row['MoTa'];
        $this->TongTien = $row['TongTien'];
        $this->FileHopDong = $row['FileHopDong'];
        $this->MaNhanVien = $row['MaNhanVien'];
    }

    // Read All HopDong entries
    public function readAll() {
        $query = "SELECT MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien
                  FROM " . $this->table_name . " 
                  ORDER BY NgayKy DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update HopDong entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET NgayKy = :ngayKy, 
                      MoTa = :moTa, 
                      TongTien = :tongTien, 
                      FileHopDong = :fileHopDong, 
                      MaNhanVien = :maNhanVien 
                  WHERE MaHopDong = :maHopDong";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->NgayKy = htmlspecialchars(strip_tags($this->NgayKy));
        $this->MoTa = htmlspecialchars(strip_tags($this->MoTa));
        $this->TongTien = filter_var($this->TongTien, FILTER_VALIDATE_FLOAT);
        $this->FileHopDong = htmlspecialchars(strip_tags($this->FileHopDong));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));
        $this->MaHopDong = htmlspecialchars(strip_tags($this->MaHopDong));

        $stmt->bindParam(":ngayKy", $this->NgayKy);
        $stmt->bindParam(":moTa", $this->MoTa);
        $stmt->bindParam(":tongTien", $this->TongTien);
        $stmt->bindParam(":fileHopDong", $this->FileHopDong);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":maHopDong", $this->MaHopDong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete HopDong entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaHopDong = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaHopDong = htmlspecialchars(strip_tags($this->MaHopDong));

        // Bind ID
        $stmt->bindParam(1, $this->MaHopDong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search HopDong entries
    public function search($keywords) {
        $query = "SELECT MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien
                  FROM " . $this->table_name . " 
                  WHERE MaHopDong LIKE ? 
                     OR MoTa LIKE ? 
                     OR MaNhanVien LIKE ?
                     OR NgayKy LIKE ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean keywords
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Bind keywords
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $keywords);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total count of HopDong entries
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

    // Get HopDong entries with pagination
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien
                  FROM " . $this->table_name . " 
                  ORDER BY NgayKy DESC
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

    // Get contracts by date range
    public function getContractsByDateRange($startDate, $endDate) {
        $query = "SELECT MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien
                  FROM " . $this->table_name . " 
                  WHERE NgayKy BETWEEN :startDate AND :endDate
                  ORDER BY NgayKy DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind date parameters
        $stmt->bindParam(":startDate", $startDate);
        $stmt->bindParam(":endDate", $endDate);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total contract value
    public function getTotalContractValue($year = null) {
        $query = "SELECT SUM(TongTien) as TotalValue 
                  FROM " . $this->table_name;
        
        // Add year filter if provided
        if ($year !== null) {
            $query .= " WHERE YEAR(NgayKy) = :year";
        }

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind year if provided
        if ($year !== null) {
            $stmt->bindParam(":year", $year);
        }

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['TotalValue'];
    }
}
?>