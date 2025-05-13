<?php
class BangBaoGia {
    private $conn;
    private $table_name = 'BangBaoGia';

    // Table columns
    public $MaBaoGia;
    public $TenBaoGia;
    public $TrangThai;
    public $MaLoai;
    public $GhiChu;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new BangBaoGia entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaBaoGia, TenBaoGia, TrangThai, MaLoai, GhiChu) 
                  VALUES (:maBaoGia, :tenBaoGia, :trangThai, :maLoai, :ghiChu)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));
        $this->TenBaoGia = htmlspecialchars(strip_tags($this->TenBaoGia));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoai = filter_var($this->MaLoai, FILTER_VALIDATE_INT);
        $this->GhiChu = htmlspecialchars(strip_tags($this->GhiChu));

        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);
        $stmt->bindParam(":tenBaoGia", $this->TenBaoGia);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoai", $this->MaLoai);
        $stmt->bindParam(":ghiChu", $this->GhiChu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single BangBaoGia entry
    public function readSingle() {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, bg.GhiChu, lbg.TenLoai as TenLoaiBaoGia
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
        $this->GhiChu = $row['GhiChu'];
        
        // Optional: return additional information
        return [
            'TenLoaiBaoGia' => $row['TenLoaiBaoGia']
        ];
    }

    // Read All BangBaoGia entries
    public function readAll() {
        $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, 
                         bg.MaLoai, bg.GhiChu, lbg.TenLoai as TenLoaiBaoGia
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
                      MaLoai = :maLoai,
                      GhiChu = :ghiChu
                  WHERE MaBaoGia = :maBaoGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenBaoGia = htmlspecialchars(strip_tags($this->TenBaoGia));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoai = filter_var($this->MaLoai, FILTER_VALIDATE_INT);
        $this->GhiChu = htmlspecialchars(strip_tags($this->GhiChu));
        $this->MaBaoGia = htmlspecialchars(strip_tags($this->MaBaoGia));

        $stmt->bindParam(":tenBaoGia", $this->TenBaoGia);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoai", $this->MaLoai);
        $stmt->bindParam(":ghiChu", $this->GhiChu);
        $stmt->bindParam(":maBaoGia", $this->MaBaoGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete BangBaoGia entry and related data
    public function delete() {
        try {
            // Start transaction
            $this->conn->beginTransaction();

            // 1. Delete from ChiTietBaoGia first (child table)
            $query1 = "DELETE FROM ChiTietBaoGia WHERE MaBaoGia = ?";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindParam(1, $this->MaBaoGia);
            $stmt1->execute();

            // 2. Delete from BangBaoGia (main table)
            $query2 = "DELETE FROM " . $this->table_name . " WHERE MaBaoGia = ?";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(1, $this->MaBaoGia);
            $stmt2->execute();

            // Commit transaction
            $this->conn->commit();
            return true;

        } catch(PDOException $e) {
            // Rollback transaction on error
            $this->conn->rollBack();
            throw $e;
        }
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
    $query = "SELECT bg.MaBaoGia, bg.TenBaoGia, bg.TrangThai, bg.GhiChu,
                     ctbg.MaCongTrinh, ct.TenCongTrinh, ct.Dientich, ct.FileThietKe, 
                     ct.MaKhachHang, kh.TenKhachHang, kh.SoDT,
                     ct.MaLoaiCongTrinh, lct.TenLoaiCongTrinh, 
                     ct.MaHopDong, ct.NgayDuKienHoanThanh,
                     ctbg.GiaBaoGia, ctbg.NoiDung
              FROM " . $this->table_name . " bg
              LEFT JOIN ChiTietBaoGia ctbg ON bg.MaBaoGia = ctbg.MaBaoGia
              LEFT JOIN CongTrinh ct ON ctbg.MaCongTrinh = ct.MaCongTrinh
              LEFT JOIN LoaiCongTrinh lct ON ct.MaLoaiCongTrinh = lct.MaLoaiCongTrinh
              LEFT JOIN KhachHang kh ON ct.MaKhachHang = kh.MaKhachHang
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