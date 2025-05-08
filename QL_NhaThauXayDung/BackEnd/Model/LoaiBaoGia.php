<?php
class LoaiBaoGia {
    private $conn;
    private $table_name = "loaibaogia";

    // Table columns
    public $MaLoai;
    public $TenLoai;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new LoaiBaoGia
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " (TenLoai) VALUES (:TenLoai)";
            $stmt = $this->conn->prepare($query);

            $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));
            $stmt->bindParam(":TenLoai", $this->TenLoai);

            if ($stmt->execute()) {
                $this->MaLoai = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            throw $e;
        }
    }

    // Read Single LoaiBaoGia
    public function readSingle() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE MaLoai = :MaLoai LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoai", $this->MaLoai);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->TenLoai = $row['TenLoai'];
            return true;
        }
        return false;
    }

    // Read All LoaiBaoGia
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Update LoaiBaoGia
    public function update() {
        try {
            if (!$this->exists()) {
                return false;
            }

            $query = "UPDATE " . $this->table_name . " SET TenLoai = :TenLoai WHERE MaLoai = :MaLoai";
            $stmt = $this->conn->prepare($query);

            $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));
            $this->MaLoai = htmlspecialchars(strip_tags($this->MaLoai));

            $stmt->bindParam(":TenLoai", $this->TenLoai);
            $stmt->bindParam(":MaLoai", $this->MaLoai);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            throw $e;
        }
    }

    // Delete LoaiBaoGia
    public function delete() {
        try {
            if (!$this->exists()) {
                return false;
            }

            $query = "DELETE FROM " . $this->table_name . " WHERE MaLoai = :MaLoai";
            $stmt = $this->conn->prepare($query);

            $this->MaLoai = htmlspecialchars(strip_tags($this->MaLoai));
            $stmt->bindParam(":MaLoai", $this->MaLoai);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in delete(): " . $e->getMessage());
            throw $e;
        }
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

    // Check if LoaiBaoGia exists
    public function exists() {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE MaLoai = :MaLoai";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":MaLoai", $this->MaLoai);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['count'] > 0;
    }

    // Check if TenLoai already exists
    public function isNameExists($tenLoai) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE TenLoai = :TenLoai";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":TenLoai", $tenLoai);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['count'] > 0;
    }
}
?>