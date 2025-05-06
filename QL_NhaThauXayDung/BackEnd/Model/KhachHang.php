<?php
class KhachHang {
    private $conn;
    private $table_name = 'KhachHang';

    // Table columns
    public $MaKhachHang;
    public $TenKhachHang;
    public $SoDT;
    public $CCCD;
    public $Email;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new KhachHang entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaKhachHang, TenKhachHang, SoDT, CCCD, Email) 
                  VALUES (:maKhachHang, :tenKhachHang, :soDT, :cccd, :email)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaKhachHang = htmlspecialchars(strip_tags($this->MaKhachHang));
        $this->TenKhachHang = htmlspecialchars(strip_tags($this->TenKhachHang));
        $this->SoDT = htmlspecialchars(strip_tags($this->SoDT));
        $this->CCCD = htmlspecialchars(strip_tags($this->CCCD));
        $this->Email = filter_var($this->Email, FILTER_SANITIZE_EMAIL);

        $stmt->bindParam(":maKhachHang", $this->MaKhachHang);
        $stmt->bindParam(":tenKhachHang", $this->TenKhachHang);
        $stmt->bindParam(":soDT", $this->SoDT);
        $stmt->bindParam(":cccd", $this->CCCD);
        $stmt->bindParam(":email", $this->Email);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single KhachHang entry
    public function readSingle() {
        $query = "SELECT MaKhachHang, TenKhachHang, SoDT, CCCD, Email
                  FROM " . $this->table_name . " 
                  WHERE MaKhachHang = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaKhachHang);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaKhachHang = $row['MaKhachHang'];
        $this->TenKhachHang = $row['TenKhachHang'];
        $this->SoDT = $row['SoDT'];
        $this->CCCD = $row['CCCD'];
        $this->Email = $row['Email'];
    }

    // Read All KhachHang entries
    public function readAll() {
        $query = "SELECT MaKhachHang, TenKhachHang, SoDT, CCCD, Email
                  FROM " . $this->table_name . " 
                  ORDER BY TenKhachHang";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update KhachHang entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenKhachHang = :tenKhachHang, 
                      SoDT = :soDT, 
                      CCCD = :cccd, 
                      Email = :email 
                  WHERE MaKhachHang = :maKhachHang";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenKhachHang = htmlspecialchars(strip_tags($this->TenKhachHang));
        $this->SoDT = htmlspecialchars(strip_tags($this->SoDT));
        $this->CCCD = htmlspecialchars(strip_tags($this->CCCD));
        $this->Email = filter_var($this->Email, FILTER_SANITIZE_EMAIL);
        $this->MaKhachHang = htmlspecialchars(strip_tags($this->MaKhachHang));

        $stmt->bindParam(":tenKhachHang", $this->TenKhachHang);
        $stmt->bindParam(":soDT", $this->SoDT);
        $stmt->bindParam(":cccd", $this->CCCD);
        $stmt->bindParam(":email", $this->Email);
        $stmt->bindParam(":maKhachHang", $this->MaKhachHang);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete KhachHang entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaKhachHang = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaKhachHang = htmlspecialchars(strip_tags($this->MaKhachHang));

        // Bind ID
        $stmt->bindParam(1, $this->MaKhachHang);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search KhachHang entries
    public function search($keywords) {
        $query = "SELECT MaKhachHang, TenKhachHang, SoDT, CCCD, Email
                  FROM " . $this->table_name . " 
                  WHERE MaKhachHang LIKE ? 
                     OR TenKhachHang LIKE ? 
                     OR SoDT LIKE ? 
                     OR CCCD LIKE ? 
                     OR Email LIKE ?";

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
        $stmt->bindParam(5, $keywords);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total count of KhachHang entries
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

    // Get KhachHang entries with pagination
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT MaKhachHang, TenKhachHang, SoDT, CCCD, Email
                  FROM " . $this->table_name . " 
                  ORDER BY TenKhachHang
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

    // Check if customer exists by unique identifiers
    public function checkCustomerExists($identifier, $type = 'email') {
        // Determine the query based on the type of identifier
        switch($type) {
            case 'email':
                $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE Email = ?";
                break;
            case 'phone':
                $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE SoDT = ?";
                break;
            case 'cccd':
                $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE CCCD = ?";
                break;
            default:
                return false;
        }

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind identifier
        $cleanIdentifier = htmlspecialchars(strip_tags($identifier));

        // Bind parameter
        $stmt->bindParam(1, $cleanIdentifier);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Return true if count > 0, false otherwise
        return $row['count'] > 0;
    }

    // Get customer projects
    public function getCustomerProjects() {
        $query = "SELECT ct.MaCongTrinh, ct.TenCongTrinh, ct.NgayDuKienHoanThanh
                  FROM CongTrinh ct
                  WHERE ct.MaKhachHang = ?
                  ORDER BY ct.NgayDuKienHoanThanh";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind customer ID
        $stmt->bindParam(1, $this->MaKhachHang);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>