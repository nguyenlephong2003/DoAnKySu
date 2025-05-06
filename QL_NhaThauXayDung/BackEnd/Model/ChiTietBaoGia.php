<?php
class ChiTietBaoGia {
    private $conn;
    private $table_name = 'ChiTietBaoGia';

    // Table columns
    public $MaChiTietBaoGia;
    public $MaBaoGia;
    public $MaCongTrinh;
    public $GiaThapNhat;
    public $GiaCaoNhat;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ChiTietBaoGia entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaBaoGia, MaCongTrinh, GiaThapNhat, GiaCaoNhat) 
                  VALUES (:maBaoGia, :maCongTrinh, :giaThapNhat, :giaCaoNhat)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->GiaThapNhat = filter_var($this->GiaThapNhat, FILTER_VALIDATE_FLOAT);
        $this->GiaCaoNhat = filter_var($this->GiaCaoNhat, FILTER_VALIDATE_FLOAT);

        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":giaThapNhat", $this->GiaThapNhat);
        $stmt->bindParam(":giaCaoNhat", $this->GiaCaoNhat);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaChiTietBaoGia = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single ChiTietBaoGia entry
    public function readSingle() {
        $query = "SELECT ctbg.*, 
                         bg.TenBaoGia, 
                         ct.TenCongTrinh
                  FROM " . $this->table_name . " ctbg
                  LEFT JOIN BangBaoGia bg ON ctbg.MaBaoGia = bg.MaBaoGia
                  LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
                  WHERE ctbg.MaChiTietBaoGia = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietBaoGia);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaChiTietBaoGia = $row['MaChiTietBaoGia'];
        $this->MaBaoGia = $row['MaBaoGia'];
        $this->MaCongTrinh = $row['MaCongTrinh'];
        $this->GiaThapNhat = $row['GiaThapNhat'];
        $this->GiaCaoNhat = $row['GiaCaoNhat'];

        // Return additional information
        return [
            'TenBaoGia' => $row['TenBaoGia'],
            'TenCongTrinh' => $row['TenCongTrinh']
        ];
    }

    // Get Quotation Details by Quotation ID
    public function getQuotationDetails($maBaoGia) {
        $query = "SELECT ctbg.*, 
                         ct.TenCongTrinh, 
                         ct.Dientich
                  FROM " . $this->table_name . " ctbg
                  LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
                  WHERE ctbg.MaBaoGia = ?
                  ORDER BY ctbg.MaChiTietBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind Quotation ID
        $stmt->bindParam(1, $maBaoGia);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update ChiTietBaoGia entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET MaBaoGia = :maBaoGia, 
                      MaCongTrinh = :maCongTrinh, 
                      GiaThapNhat = :giaThapNhat, 
                      GiaCaoNhat = :giaCaoNhat 
                  WHERE MaChiTietBaoGia = :maChiTietBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->GiaThapNhat = filter_var($this->GiaThapNhat, FILTER_VALIDATE_FLOAT);
        $this->GiaCaoNhat = filter_var($this->GiaCaoNhat, FILTER_VALIDATE_FLOAT);
        $this->MaChiTietBaoGia = filter_var($this->MaChiTietBaoGia, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":giaThapNhat", $this->GiaThapNhat);
        $stmt->bindParam(":giaCaoNhat", $this->GiaCaoNhat);
        $stmt->bindParam(":maChiTietBaoGia", $this->MaChiTietBaoGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete ChiTietBaoGia entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaChiTietBaoGia = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaChiTietBaoGia = filter_var($this->MaChiTietBaoGia, FILTER_VALIDATE_INT);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietBaoGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get total price range for a specific quotation
    public function getTotalPriceRange($maBaoGia) {
        $query = "SELECT 
                    SUM(GiaThapNhat) as TongGiaThapNhat, 
                    SUM(GiaCaoNhat) as TongGiaCaoNhat
                  FROM " . $this->table_name . "
                  WHERE MaBaoGia = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind Quotation ID
        $stmt->bindParam(1, $maBaoGia);

        // Execute query
        $stmt->execute();

        // Get row
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>