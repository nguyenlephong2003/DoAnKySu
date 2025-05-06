<?php
class NhaCungCap {
    private $conn;
    private $table_name = 'NhaCungCap';

    // Table columns
    public $MaNhaCungCap;
    public $TenNhaCungCap;
    public $SoDT;
    public $DiaChi;
    public $LoaiHinhCungCap;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new NhaCungCap entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaNhaCungCap, TenNhaCungCap, SoDT, DiaChi, LoaiHinhCungCap) 
                  VALUES (:maNhaCungCap, :tenNhaCungCap, :soDT, :diaChi, :loaiHinhCungCap)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));
        $this->TenNhaCungCap = htmlspecialchars(strip_tags($this->TenNhaCungCap));
        $this->SoDT = htmlspecialchars(strip_tags($this->SoDT));
        $this->DiaChi = htmlspecialchars(strip_tags($this->DiaChi));
        $this->LoaiHinhCungCap = htmlspecialchars(strip_tags($this->LoaiHinhCungCap));

        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);
        $stmt->bindParam(":tenNhaCungCap", $this->TenNhaCungCap);
        $stmt->bindParam(":soDT", $this->SoDT);
        $stmt->bindParam(":diaChi", $this->DiaChi);
        $stmt->bindParam(":loaiHinhCungCap", $this->LoaiHinhCungCap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single NhaCungCap entry
    public function readSingle() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE MaNhaCungCap = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaNhaCungCap);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaNhaCungCap = $row['MaNhaCungCap'];
        $this->TenNhaCungCap = $row['TenNhaCungCap'];
        $this->SoDT = $row['SoDT'];
        $this->DiaChi = $row['DiaChi'];
        $this->LoaiHinhCungCap = $row['LoaiHinhCungCap'];
    }

    // Update NhaCungCap entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenNhaCungCap = :tenNhaCungCap, 
                      SoDT = :soDT, 
                      DiaChi = :diaChi, 
                      LoaiHinhCungCap = :loaiHinhCungCap 
                  WHERE MaNhaCungCap = :maNhaCungCap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenNhaCungCap = htmlspecialchars(strip_tags($this->TenNhaCungCap));
        $this->SoDT = htmlspecialchars(strip_tags($this->SoDT));
        $this->DiaChi = htmlspecialchars(strip_tags($this->DiaChi));
        $this->LoaiHinhCungCap = htmlspecialchars(strip_tags($this->LoaiHinhCungCap));
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));

        $stmt->bindParam(":tenNhaCungCap", $this->TenNhaCungCap);
        $stmt->bindParam(":soDT", $this->SoDT);
        $stmt->bindParam(":diaChi", $this->DiaChi);
        $stmt->bindParam(":loaiHinhCungCap", $this->LoaiHinhCungCap);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete NhaCungCap entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaNhaCungCap = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));

        // Bind ID
        $stmt->bindParam(1, $this->MaNhaCungCap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search NhaCungCap entries
    public function search($keywords) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE TenNhaCungCap LIKE ? 
                     OR SoDT LIKE ? 
                     OR DiaChi LIKE ? 
                     OR LoaiHinhCungCap LIKE ?";

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

    // Get supplier's supplied equipment
    public function getSuppliedEquipment() {
        $query = "SELECT tbvt.MaThietBiVatTu, tbvt.TenThietBiVatTu, 
                         tbvt.SoLuongTon, tbvt.TrangThai, 
                         lvt.TenLoai as LoaiThietBi
                  FROM ThietBiVatTu tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE tbvt.MaNhaCungCap = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind supplier ID
        $stmt->bindParam(1, $this->MaNhaCungCap);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get supplier's import receipts
    public function getImportReceipts() {
        $query = "SELECT pn.MaPhieuNhap, pn.NgayNhap, pn.TongTien, pn.TrangThai,
                         nv.TenNhanVien
                  FROM PhieuNhap pn
                  LEFT JOIN NhanVien nv ON pn.MaNhanVien = nv.MaNhanVien
                  WHERE pn.MaNhaCungCap = ?
                  ORDER BY pn.NgayNhap DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind supplier ID
        $stmt->bindParam(1, $this->MaNhaCungCap);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>