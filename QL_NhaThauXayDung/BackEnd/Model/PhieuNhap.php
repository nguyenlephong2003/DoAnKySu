<?php
class PhieuNhap {
    private $conn;
    private $table_name = 'PhieuNhap';

    // Table columns
    public $MaPhieuNhap;
    public $NgayNhap;
    public $TongTien;
    public $TrangThai;
    public $MaNhaCungCap;
    public $MaNhanVien;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new PhieuNhap entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaPhieuNhap, NgayNhap, TongTien, TrangThai, 
                   MaNhaCungCap, MaNhanVien) 
                  VALUES (:maPhieuNhap, :ngayNhap, :tongTien, :trangThai, 
                          :maNhaCungCap, :maNhanVien)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaPhieuNhap = htmlspecialchars(strip_tags($this->MaPhieuNhap));
        $this->NgayNhap = htmlspecialchars(strip_tags($this->NgayNhap));
        $this->TongTien = filter_var($this->TongTien, FILTER_VALIDATE_FLOAT);
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));

        $stmt->bindParam(":maPhieuNhap", $this->MaPhieuNhap);
        $stmt->bindParam(":ngayNhap", $this->NgayNhap);
        $stmt->bindParam(":tongTien", $this->TongTien);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single PhieuNhap entry
    public function readSingle() {
        $query = "SELECT pn.*, 
                         ncc.TenNhaCungCap, 
                         nv.TenNhanVien
                  FROM " . $this->table_name . " pn
                  LEFT JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN NhanVien nv ON pn.MaNhanVien = nv.MaNhanVien
                  WHERE pn.MaPhieuNhap = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaPhieuNhap);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaPhieuNhap = $row['MaPhieuNhap'];
        $this->NgayNhap = $row['NgayNhap'];
        $this->TongTien = $row['TongTien'];
        $this->TrangThai = $row['TrangThai'];
        $this->MaNhaCungCap = $row['MaNhaCungCap'];
        $this->MaNhanVien = $row['MaNhanVien'];

        // Return additional information
        return [
            'TenNhaCungCap' => $row['TenNhaCungCap'],
            'TenNhanVien' => $row['TenNhanVien']
        ];
    }

    // Get import receipt details
    public function getImportReceiptDetails() {
        $query = "SELECT ctpn.*, 
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as LoaiThietBi,
                         lvt.DonViTinh
                  FROM ChiTietPhieuNhap ctpn
                  LEFT JOIN ThietBiVatTu tbvt ON ctpn.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE ctpn.MaPhieuNhap = ?
                  ORDER BY ctpn.MaChiTietPhieuNhap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind import receipt ID
        $stmt->bindParam(1, $this->MaPhieuNhap);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update PhieuNhap entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET NgayNhap = :ngayNhap, 
                      TongTien = :tongTien, 
                      TrangThai = :trangThai, 
                      MaNhaCungCap = :maNhaCungCap, 
                      MaNhanVien = :maNhanVien 
                  WHERE MaPhieuNhap = :maPhieuNhap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->NgayNhap = htmlspecialchars(strip_tags($this->NgayNhap));
        $this->TongTien = filter_var($this->TongTien, FILTER_VALIDATE_FLOAT);
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));
        $this->MaPhieuNhap = htmlspecialchars(strip_tags($this->MaPhieuNhap));

        $stmt->bindParam(":ngayNhap", $this->NgayNhap);
        $stmt->bindParam(":tongTien", $this->TongTien);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);
        $stmt->bindParam(":maNhanVien", $this->MaNhanVien);
        $stmt->bindParam(":maPhieuNhap", $this->MaPhieuNhap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete PhieuNhap entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaPhieuNhap = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaPhieuNhap = htmlspecialchars(strip_tags($this->MaPhieuNhap));

        // Bind ID
        $stmt->bindParam(1, $this->MaPhieuNhap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get import receipts by date range
    public function getImportReceiptsByDateRange($startDate, $endDate) {
        $query = "SELECT pn.*, 
                         ncc.TenNhaCungCap, 
                         nv.TenNhanVien
                  FROM " . $this->table_name . " pn
                  LEFT JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN NhanVien nv ON pn.MaNhanVien = nv.MaNhanVien
                  WHERE pn.NgayNhap BETWEEN :startDate AND :endDate
                  ORDER BY pn.NgayNhap DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind date parameters
        $stmt->bindParam(":startDate", $startDate);
        $stmt->bindParam(":endDate", $endDate);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get total import value
    public function getTotalImportValue($year = null) {
        $query = "SELECT SUM(TongTien) as TotalImportValue 
                  FROM " . $this->table_name;
        
        // Add year filter if provided
        if ($year !== null) {
            $query .= " WHERE YEAR(NgayNhap) = :year";
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

        return $row['TotalImportValue'];
    }

    // Get import receipts by status
    public function getImportReceiptsByStatus($trangThai) {
        $query = "SELECT pn.*, 
                         ncc.TenNhaCungCap, 
                         nv.TenNhanVien
                  FROM " . $this->table_name . " pn
                  LEFT JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN NhanVien nv ON pn.MaNhanVien = nv.MaNhanVien
                  WHERE pn.TrangThai = ?
                  ORDER BY pn.NgayNhap DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind status
        $stmt->bindParam(1, $trangThai);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>