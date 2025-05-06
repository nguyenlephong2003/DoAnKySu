<?php
class ThietBiVatTu {
    private $conn;
    private $table_name = 'ThietBiVatTu';

    // Table columns
    public $MaThietBiVatTu;
    public $TenThietBiVatTu;
    public $SoLuongTon;
    public $TrangThai;
    public $MaLoaiThietBiVatTu;
    public $MaNhaCungCap;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ThietBiVatTu entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaThietBiVatTu, TenThietBiVatTu, SoLuongTon, TrangThai, 
                   MaLoaiThietBiVatTu, MaNhaCungCap) 
                  VALUES (:maThietBiVatTu, :tenThietBiVatTu, :soLuongTon, :trangThai, 
                          :maLoaiThietBiVatTu, :maNhaCungCap)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->TenThietBiVatTu = htmlspecialchars(strip_tags($this->TenThietBiVatTu));
        $this->SoLuongTon = filter_var($this->SoLuongTon, FILTER_VALIDATE_FLOAT);
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoaiThietBiVatTu = filter_var($this->MaLoaiThietBiVatTu, FILTER_VALIDATE_INT);
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));

        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":tenThietBiVatTu", $this->TenThietBiVatTu);
        $stmt->bindParam(":soLuongTon", $this->SoLuongTon);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single ThietBiVatTu entry
    public function readSingle() {
        $query = "SELECT tbvt.*, 
                         lvt.TenLoai as TenLoaiThietBiVatTu, 
                         lvt.DonViTinh,
                         ncc.TenNhaCungCap
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON tbvt.MaNhaCungCap = ncc.MaNhaCungCap
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
        $this->SoLuongTon = $row['SoLuongTon'];
        $this->TrangThai = $row['TrangThai'];
        $this->MaLoaiThietBiVatTu = $row['MaLoaiThietBiVatTu'];
        $this->MaNhaCungCap = $row['MaNhaCungCap'];

        // Return additional information
        return [
            'TenLoaiThietBiVatTu' => $row['TenLoaiThietBiVatTu'],
            'DonViTinh' => $row['DonViTinh'],
            'TenNhaCungCap' => $row['TenNhaCungCap']
        ];
    }

    // Update ThietBiVatTu entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET TenThietBiVatTu = :tenThietBiVatTu, 
                      SoLuongTon = :soLuongTon, 
                      TrangThai = :trangThai, 
                      MaLoaiThietBiVatTu = :maLoaiThietBiVatTu, 
                      MaNhaCungCap = :maNhaCungCap 
                  WHERE MaThietBiVatTu = :maThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->TenThietBiVatTu = htmlspecialchars(strip_tags($this->TenThietBiVatTu));
        $this->SoLuongTon = filter_var($this->SoLuongTon, FILTER_VALIDATE_FLOAT);
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->MaLoaiThietBiVatTu = filter_var($this->MaLoaiThietBiVatTu, FILTER_VALIDATE_INT);
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));

        $stmt->bindParam(":tenThietBiVatTu", $this->TenThietBiVatTu);
        $stmt->bindParam(":soLuongTon", $this->SoLuongTon);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);
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
                         lvt.DonViTinh,
                         ncc.TenNhaCungCap
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON tbvt.MaNhaCungCap = ncc.MaNhaCungCap
                  WHERE tbvt.TenThietBiVatTu LIKE ? 
                     OR lvt.TenLoai LIKE ? 
                     OR ncc.TenNhaCungCap LIKE ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean keywords
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Bind keywords
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);

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

    // Get low stock equipment
    public function getLowStockEquipment($threshold = 10) {
        $query = "SELECT tbvt.*, 
                         lvt.TenLoai as TenLoaiThietBiVatTu, 
                         lvt.DonViTinh
                  FROM " . $this->table_name . " tbvt
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE tbvt.SoLuongTon <= ?
                  ORDER BY tbvt.SoLuongTon";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind threshold
        $stmt->bindParam(1, $threshold, PDO::PARAM_INT);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update equipment quantity
    public function updateQuantity($quantity, $type = 'add') {
        $query = $type === 'add' 
            ? "UPDATE " . $this->table_name . " 
               SET SoLuongTon = SoLuongTon + :quantity 
               WHERE MaThietBiVatTu = :maThietBiVatTu"
            : "UPDATE " . $this->table_name . " 
               SET SoLuongTon = SoLuongTon - :quantity 
               WHERE MaThietBiVatTu = :maThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $quantity = filter_var($quantity, FILTER_VALIDATE_FLOAT);
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));

        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>