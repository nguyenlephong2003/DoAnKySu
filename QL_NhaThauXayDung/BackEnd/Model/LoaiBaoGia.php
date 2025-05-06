<?php
class LoaiBaoGia {
    private $conn;
    private $table_name = 'LoaiBaoGia';

    // Table columns
    public $MaLoai;
    public $TenLoai;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new LoaiBaoGia
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (TenLoai) 
                  VALUES (:tenLoai)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));

        $stmt->bindParam(":tenLoai", $this->TenLoai);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaLoai = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single LoaiBaoGia
    public function readSingle() {
        $query = "SELECT MaLoai, TenLoai 
                  FROM " . $this->table_name . " 
                  WHERE MaLoai = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaLoai);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaLoai = $row['MaLoai'];
        $this->TenLoai = $row['TenLoai'];
    }

    // Read All LoaiBaoGia
    public function readAll() {
        $query = "SELECT MaLoai, TenLoai 
                  FROM " . $this->table_name . " 
                  ORDER BY MaLoai";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update LoaiBaoGia
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenLoai = :tenLoai 
                  WHERE MaLoai = :maLoai";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));
        $this->MaLoai = htmlspecialchars(strip_tags($this->MaLoai));

        $stmt->bindParam(":tenLoai", $this->TenLoai);
        $stmt->bindParam(":maLoai", $this->MaLoai);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete LoaiBaoGia
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaLoai = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaLoai = htmlspecialchars(strip_tags($this->MaLoai));

        // Bind ID
        $stmt->bindParam(1, $this->MaLoai);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search LoaiBaoGia
    public function search($keywords) {
        $query = "SELECT MaLoai, TenLoai 
                  FROM " . $this->table_name . " 
                  WHERE TenLoai LIKE ?";

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