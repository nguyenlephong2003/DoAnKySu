<?php
class BangBaoGia {
    private $conn;
    private $table_name = 'BangBaoGia';

    // Table columns
    public $MaBaoGia;
    public $TenBaoGia;
    public $TrangThai;
    public $MaLoai;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new BangBaoGia entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaBaoGia, TenBaoGia, TrangThai, MaLoai) 
                  VALUES (:maBaoGia, :tenBaoGia, :trangThai, :maLoai)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
        $this->TenBaoGia = htmlspecialchars(strip_tags($this->TenBaoGia));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoai = filter_var($this->MaLoai, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
        $stmt->bindParam(":tenBaoGia", $this->TenBaoGia);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoai", $this->MaLoai);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single BangBaoGia entry
    public function readSingle() {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, lbg.TenLoai as TenLoaiBaoGia
                  FROM " . $this->table_name . " bg
                  LEFT JOIN LoaiBaoGia lbg ON bg.MaLoai = lbg.MaLoai
                  WHERE bg.MaBaoGia = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaBaoGia);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaBaoGia = $row['MaBaoGia'];
        $this->TenBaoGia = $row['TenBaoGia'];
        $this->TrangThai = $row['TrangThai'];
        $this->MaLoai = $row['MaLoai'];
        
        // Optional: return additional information
        return [
            'TenLoaiBaoGia' => $row['TenLoaiBaoGia']
        ];
    }

    // Read All BangBaoGia entries
    public function readAll() {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, lbg.TenLoai as TenLoaiBaoGia
                  FROM " . $this->table_name . " bg
                  LEFT JOIN LoaiBaoGia lbg ON bg.MaLoai = lbg.MaLoai
                  ORDER BY bg.MaBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update BangBaoGia entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenBaoGia = :tenBaoGia, 
                      TrangThai = :trangThai, 
                      MaLoai = :maLoai 
                  WHERE MaBaoGia = :maBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenBaoGia = htmlspecialchars(strip_tags($this->TenBaoGia));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoai = filter_var($this->MaLoai, FILTER_VALIDATE_INT);
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));

        $stmt->bindParam(":tenBaoGia", $this->TenBaoGia);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoai", $this->MaLoai);
        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete BangBaoGia entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaBaoGia = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));

        // Bind ID
        $stmt->bindParam(1, $this->MaBaoGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search BangBaoGia entries
    public function search($keywords) {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, lbg.TenLoai as TenLoaiBaoGia
                  FROM " . $this->table_name . " bg
                  LEFT JOIN LoaiBaoGia lbg ON bg.MaLoai = lbg.MaLoai
                  WHERE bg.MaBaoGia LIKE ? 
                     OR bg.TenBaoGia LIKE ? 
                     OR bg.TrangThai LIKE ? 
                     OR lbg.TenLoai LIKE ?";

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

    // Get total count of BangBaoGia entries
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

    // Get BangBaoGia entries with pagination
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, lbg.TenLoai as TenLoaiBaoGia
                  FROM " . $this->table_name . " bg
                  LEFT JOIN LoaiBaoGia lbg ON bg.MaLoai = lbg.MaLoai
                  ORDER BY bg.MaBaoGia
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

    // Get quotation details including associated projects
    public function getQuotationDetails() {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         ctbg.MaCongTrinh, ct.TenCongTrinh,
                         ctbg.GiaThapNhat, ctbg.GiaCaoNhat
                  FROM " . $this->table_name . " bg
                  LEFT JOIN ChiTietBaoGia ctbg ON bg.MaBaoGia = ctbg.MaBaoGia
                  LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
                  WHERE bg.MaBaoGia = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind quotation ID
        $stmt->bindParam(1, $this->MaBaoGia);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get quotations by status
    public function getQuotationsByStatus($trangThai) {
        $query = "SELECT MaBaoGia, TenBaoGia, TrangThai, MaLoai
                  FROM " . $this->table_name . "
                  WHERE TrangThai = ?
                  ORDER BY MaBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean status
        $trangThai = htmlspecialchars(strip_tags($trangThai));

        // Bind status
        $stmt->bindParam(1, $trangThai);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>