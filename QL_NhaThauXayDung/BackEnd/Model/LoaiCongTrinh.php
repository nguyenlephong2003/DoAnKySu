<?php
class LoaiCongTrinh {
    private $conn;
    private $table_name = 'LoaiCongTrinh';

    // Table columns
    public $MaLoaiCongTrinh;
    public $TenLoaiCongTrinh;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new LoaiCongTrinh
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (TenLoaiCongTrinh) 
                  VALUES (:tenLoaiCongTrinh)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoaiCongTrinh = htmlspecialchars(strip_tags($this->TenLoaiCongTrinh));

        $stmt->bindParam(":tenLoaiCongTrinh", $this->TenLoaiCongTrinh);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaLoaiCongTrinh = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single LoaiCongTrinh
    public function readSingle() {
        $query = "SELECT MaLoaiCongTrinh, TenLoaiCongTrinh 
                  FROM " . $this->table_name . " 
                  WHERE MaLoaiCongTrinh = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaLoaiCongTrinh);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaLoaiCongTrinh = $row['MaLoaiCongTrinh'];
        $this->TenLoaiCongTrinh = $row['TenLoaiCongTrinh'];
    }

    // Read All LoaiCongTrinh
    public function readAll() {
        $query = "SELECT MaLoaiCongTrinh, TenLoaiCongTrinh 
                  FROM " . $this->table_name . " 
                  ORDER BY MaLoaiCongTrinh";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update LoaiCongTrinh
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenLoaiCongTrinh = :tenLoaiCongTrinh 
                  WHERE MaLoaiCongTrinh = :maLoaiCongTrinh";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoaiCongTrinh = htmlspecialchars(strip_tags($this->TenLoaiCongTrinh));
        $this->MaLoaiCongTrinh = htmlspecialchars(strip_tags($this->MaLoaiCongTrinh));

        $stmt->bindParam(":tenLoaiCongTrinh", $this->TenLoaiCongTrinh);
        $stmt->bindParam(":maLoaiCongTrinh", $this->MaLoaiCongTrinh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete LoaiCongTrinh
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaLoaiCongTrinh = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaLoaiCongTrinh = htmlspecialchars(strip_tags($this->MaLoaiCongTrinh));

        // Bind ID
        $stmt->bindParam(1, $this->MaLoaiCongTrinh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search LoaiCongTrinh
    public function search($keywords) {
        $query = "SELECT MaLoaiCongTrinh, TenLoaiCongTrinh 
                  FROM " . $this->table_name . " 
                  WHERE TenLoaiCongTrinh LIKE ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean keywords
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Bind keywords
        $stmt->bindParam(1, $keywords);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>