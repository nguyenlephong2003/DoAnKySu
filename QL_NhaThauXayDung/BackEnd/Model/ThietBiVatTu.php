<?php
class ThietBiVatTu {
    private $conn;
    private $table_name = 'ThietBiVatTu';

    // Table columns
    public $MaThietBiVatTu;
    public $TenThietBiVatTu;
    public $TrangThai;
    public $MaLoaiThietBiVatTu;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ThietBiVatTu entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaThietBiVatTu, TenThietBiVatTu, TrangThai, MaLoaiThietBiVatTu) 
                  VALUES (:maThietBiVatTu, :tenThietBiVatTu, :trangThai, :maLoaiThietBiVatTu)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->TenThietBiVatTu = htmlspecialchars(strip_tags($this->TenThietBiVatTu));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoaiThietBiVatTu = filter_var($this->MaLoaiThietBiVatTu, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":tenThietBiVatTu", $this->TenThietBiVatTu);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read all ThietBiVatTu entries
    public function read() {
        $query = "SELECT tbvt.*, 
                         lvt.TenLoai as TenLoaiThietBiVatTu, 
                         lvt.DonViTinh
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  ORDER BY tbvt.MaThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Read Single ThietBiVatTu entry
    public function readSingle() {
        $query = "SELECT tbvt.*, 
                         lvt.TenLoai as TenLoaiThietBiVatTu, 
                         lvt.DonViTinh
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE tbvt.MaThietBiVatTu = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaThietBiVatTu);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaThietBiVatTu = $row['MaThietBiVatTu'];
        $this->TenThietBiVatTu = $row['TenThietBiVatTu'];
        $this->TrangThai = $row['TrangThai'];
        $this->MaLoaiThietBiVatTu = $row['MaLoaiThietBiVatTu'];

        // Return additional information
        return [
            'TenLoaiThietBiVatTu' => $row['TenLoaiThietBiVatTu'],
            'DonViTinh' => $row['DonViTinh']
        ];
    }

    // Update ThietBiVatTu entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenThietBiVatTu = :tenThietBiVatTu, 
                      TrangThai = :trangThai, 
                      MaLoaiThietBiVatTu = :maLoaiThietBiVatTu
                  WHERE MaThietBiVatTu = :maThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenThietBiVatTu = htmlspecialchars(strip_tags($this->TenThietBiVatTu));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoaiThietBiVatTu = filter_var($this->MaLoaiThietBiVatTu, FILTER_VALIDATE_INT);
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));

        $stmt->bindParam(":tenThietBiVatTu", $this->TenThietBiVatTu);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete ThietBiVatTu entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaThietBiVatTu = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));

        // Bind ID
        $stmt->bindParam(1, $this->MaThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search ThietBiVatTu entries
    public function search($keywords) {
        $query = "SELECT tbvt.*, 
                         lvt.TenLoai as TenLoaiThietBiVatTu, 
                         lvt.DonViTinh
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE tbvt.TenThietBiVatTu LIKE ? 
                     OR lvt.TenLoai LIKE ?";

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

    // Get equipment used in construction projects
    public function getEquipmentUsedInProjects($maThietBiVatTu) {
        $query = "SELECT ct.MaCongTrinh, ct.TenCongTrinh, 
                         ctc.NgayRoiKho, ctc.NgayHoanKho, 
                         ctc.TrangThai
                  FROM ChiTietThiCong ctc
                  JOIN CongTrinh ct ON ctc.MaCongTrinh = ct.MaCongTrinh
                  WHERE ctc.MaThietBiVatTu = ?
                  ORDER BY ctc.NgayRoiKho";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind equipment ID
        $stmt->bindParam(1, $maThietBiVatTu);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get suppliers for this equipment
    public function getSuppliers() {
        $query = "SELECT cu.*, 
                         ncc.TenNhaCungCap,
                         ncc.SoDT,
                         ncc.Email
                  FROM CungUng cu
                  JOIN NhaCungCap ncc ON cu.MaNhaCungCap = ncc.MaNhaCungCap
                  WHERE cu.MaThietBiVatTu = ?
                  ORDER BY cu.DonGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind equipment ID
        $stmt->bindParam(1, $this->MaThietBiVatTu);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>