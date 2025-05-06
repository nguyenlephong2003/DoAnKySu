<?php
class LoaiThietBiVatTu {
    private $conn;
    private $table_name = 'LoaiThietBiVatTu';

    // Table columns
    public $MaLoaiThietBiVatTu;
    public $TenLoai;
    public $DonViTinh;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new LoaiThietBiVatTu
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (TenLoai, DonViTinh) 
                  VALUES (:tenLoai, :donViTinh)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));
        $this->DonViTinh = htmlspecialchars(strip_tags($this->DonViTinh));

        $stmt->bindParam(":tenLoai", $this->TenLoai);
        $stmt->bindParam(":donViTinh", $this->DonViTinh);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaLoaiThietBiVatTu = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single LoaiThietBiVatTu
    public function readSingle() {
        $query = "SELECT MaLoaiThietBiVatTu, TenLoai, DonViTinh 
                  FROM " . $this->table_name . " 
                  WHERE MaLoaiThietBiVatTu = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaLoaiThietBiVatTu);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaLoaiThietBiVatTu = $row['MaLoaiThietBiVatTu'];
        $this->TenLoai = $row['TenLoai'];
        $this->DonViTinh = $row['DonViTinh'];
    }

    // Read All LoaiThietBiVatTu
    public function readAll() {
        $query = "SELECT MaLoaiThietBiVatTu, TenLoai, DonViTinh 
                  FROM " . $this->table_name . " 
                  ORDER BY MaLoaiThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update LoaiThietBiVatTu
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenLoai = :tenLoai, 
                      DonViTinh = :donViTinh 
                  WHERE MaLoaiThietBiVatTu = :maLoaiThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenLoai = htmlspecialchars(strip_tags($this->TenLoai));
        $this->DonViTinh = htmlspecialchars(strip_tags($this->DonViTinh));
        $this->MaLoaiThietBiVatTu = htmlspecialchars(strip_tags($this->MaLoaiThietBiVatTu));

        $stmt->bindParam(":tenLoai", $this->TenLoai);
        $stmt->bindParam(":donViTinh", $this->DonViTinh);
        $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete LoaiThietBiVatTu
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaLoaiThietBiVatTu = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaLoaiThietBiVatTu = htmlspecialchars(strip_tags($this->MaLoaiThietBiVatTu));

        // Bind ID
        $stmt->bindParam(1, $this->MaLoaiThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search LoaiThietBiVatTu
    public function search($keywords) {
        $query = "SELECT MaLoaiThietBiVatTu, TenLoai, DonViTinh 
                  FROM " . $this->table_name . " 
                  WHERE TenLoai LIKE ? OR DonViTinh LIKE ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean keywords
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Bind keywords
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total count of LoaiThietBiVatTu
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

    // Get LoaiThietBiVatTu with pagination
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT MaLoaiThietBiVatTu, TenLoai, DonViTinh 
                  FROM " . $this->table_name . " 
                  ORDER BY MaLoaiThietBiVatTu 
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