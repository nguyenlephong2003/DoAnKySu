<?php
class ChiTietBaoGia {
    private $conn;
    private $table_name = 'ChiTietBaoGia';

    // Table columns
    public $MaChiTietBaoGia;
    public $MaBaoGia;
    public $MaCongTrinh;
    public $GiaBaoGia;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ChiTietBaoGia entry
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " 
                      (MaBaoGia, MaCongTrinh, GiaBaoGia) 
                      VALUES (:maBaoGia, :maCongTrinh, :giaBaoGia)";

            $stmt = $this->conn->prepare($query);

            // Clean and bind data
            $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
            $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
            $this->GiaBaoGia = filter_var($this->GiaBaoGia, FILTER_VALIDATE_FLOAT);

            $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
            $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
            $stmt->bindParam(":giaBaoGia", $this->GiaBaoGia);

            if($stmt->execute()) {
                $this->MaChiTietBaoGia = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            throw $e;
        }
    }

    // Read Single ChiTietBaoGia entry
    public function readSingle() {
        try {
            $query = "SELECT ctbg.*, 
                             bg.TenBaoGia, 
                             ct.TenCongTrinh
                      FROM " . $this->table_name . " ctbg
                      LEFT JOIN BangBaoGia bg ON ctbg.MaBaoGia = bg.MaBaoGia
                      LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
                      WHERE ctbg.MaChiTietBaoGia = :maChiTietBaoGia 
                      LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":maChiTietBaoGia", $this->MaChiTietBaoGia);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $this->MaChiTietBaoGia = $row['MaChiTietBaoGia'];
                $this->MaBaoGia = $row['MaBaoGia'];
                $this->MaCongTrinh = $row['MaCongTrinh'];
                $this->GiaBaoGia = $row['GiaBaoGia'];

                return [
                    'TenBaoGia' => $row['TenBaoGia'],
                    'TenCongTrinh' => $row['TenCongTrinh']
                ];
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in readSingle(): " . $e->getMessage());
            throw $e;
        }
    }

    // Get Quotation Details by Quotation ID
    public function getQuotationDetails($maBaoGia) {
        try {
            $query = "SELECT ctbg.*, 
                             ct.TenCongTrinh, 
                             ct.Dientich
                      FROM " . $this->table_name . " ctbg
                      LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
                      WHERE ctbg.MaBaoGia = :maBaoGia
                      ORDER BY ctbg.MaChiTietBaoGia";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":maBaoGia", $maBaoGia);
            $stmt->execute();

            return $stmt;
        } catch (PDOException $e) {
            error_log("Error in getQuotationDetails(): " . $e->getMessage());
            throw $e;
        }
    }

    // Update ChiTietBaoGia entry
    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . " 
                      SET MaBaoGia = :maBaoGia, 
                          MaCongTrinh = :maCongTrinh, 
                          GiaBaoGia = :giaBaoGia 
                      WHERE MaChiTietBaoGia = :maChiTietBaoGia";

            $stmt = $this->conn->prepare($query);

            // Clean and bind data
            $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
            $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
            $this->GiaBaoGia = filter_var($this->GiaBaoGia, FILTER_VALIDATE_FLOAT);
            $this->MaChiTietBaoGia = filter_var($this->MaChiTietBaoGia, FILTER_VALIDATE_INT);

            $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
            $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
            $stmt->bindParam(":giaBaoGia", $this->GiaBaoGia);
            $stmt->bindParam(":maChiTietBaoGia", $this->MaChiTietBaoGia);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            throw $e;
        }
    }

    // Delete ChiTietBaoGia entry
    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " 
                      WHERE MaChiTietBaoGia = :maChiTietBaoGia";

            $stmt = $this->conn->prepare($query);

            $this->MaChiTietBaoGia = filter_var($this->MaChiTietBaoGia, FILTER_VALIDATE_INT);
            $stmt->bindParam(":maChiTietBaoGia", $this->MaChiTietBaoGia);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in delete(): " . $e->getMessage());
            throw $e;
        }
    }

    // Get total price for a specific quotation
    public function getTotalPrice($maBaoGia) {
        try {
            $query = "SELECT SUM(GiaBaoGia) as TongGia
                      FROM " . $this->table_name . "
                      WHERE MaBaoGia = :maBaoGia";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":maBaoGia", $maBaoGia);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getTotalPrice(): " . $e->getMessage());
            throw $e;
        }
    }
}
?>