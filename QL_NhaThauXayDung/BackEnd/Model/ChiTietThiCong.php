<?php
class ChiTietThiCong {
    private $conn;
    private $table_name = 'ChiTietThiCong';

    // Table columns
    public $MaChiTietThiCong;
    public $MaCongTrinh;
    public $MaThietBiVatTu;
    public $TrangThai;
    public $NgayRoiKho;
    public $NgayHoanKho;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ChiTietThiCong entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaCongTrinh, MaThietBiVatTu, TrangThai, NgayRoiKho, NgayHoanKho) 
                  VALUES (:maCongTrinh, :maThietBiVatTu, :trangThai, :ngayRoiKho, :ngayHoanKho)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->NgayRoiKho = htmlspecialchars(strip_tags($this->NgayRoiKho));
        $this->NgayHoanKho = htmlspecialchars(strip_tags($this->NgayHoanKho));

        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":ngayRoiKho", $this->NgayRoiKho);
        $stmt->bindParam(":ngayHoanKho", $this->NgayHoanKho);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaChiTietThiCong = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single ChiTietThiCong entry
    public function readSingle() {
        $query = "SELECT ctc.*, 
                         ct.TenCongTrinh,
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as LoaiThietBi,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " ctc
                  LEFT JOIN CongTrinh ct ON ctc.MaCongTrinh = ct.MaCongTrinh
                  LEFT JOIN ThietBiVatTu tbvt ON ctc.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE ctc.MaChiTietThiCong = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietThiCong);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaChiTietThiCong = $row['MaChiTietThiCong'];
        $this->MaCongTrinh = $row['MaCongTrinh'];
        $this->MaThietBiVatTu = $row['MaThietBiVatTu'];
        $this->TrangThai = $row['TrangThai'];
        $this->NgayRoiKho = $row['NgayRoiKho'];
        $this->NgayHoanKho = $row['NgayHoanKho'];

        // Return additional information
        return [
            'TenCongTrinh' => $row['TenCongTrinh'],
            'TenThietBiVatTu' => $row['TenThietBiVatTu'],
            'LoaiThietBi' => $row['LoaiThietBi'],
            'DonViTinh' => $row['DonViTinh']
        ];
    }

    // Get construction details for a specific project
    public function getProjectConstructionDetails($maCongTrinh) {
        $query = "SELECT ctc.*, 
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as LoaiThietBi,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " ctc
                  LEFT JOIN ThietBiVatTu tbvt ON ctc.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE ctc.MaCongTrinh = ?
                  ORDER BY ctc.NgayRoiKho";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update ChiTietThiCong entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET MaCongTrinh = :maCongTrinh, 
                      MaThietBiVatTu = :maThietBiVatTu, 
                      TrangThai = :trangThai, 
                      NgayRoiKho = :ngayRoiKho, 
                      NgayHoanKho = :ngayHoanKho 
                  WHERE MaChiTietThiCong = :maChiTietThiCong";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->TrangThai = htmlspecialchars(strip_tags($this->TrangThai));
        $this->NgayRoiKho = htmlspecialchars(strip_tags($this->NgayRoiKho));
        $this->NgayHoanKho = htmlspecialchars(strip_tags($this->NgayHoanKho));
        $this->MaChiTietThiCong = filter_var($this->MaChiTietThiCong, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":ngayRoiKho", $this->NgayRoiKho);
        $stmt->bindParam(":ngayHoanKho", $this->NgayHoanKho);
        $stmt->bindParam(":maChiTietThiCong", $this->MaChiTietThiCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete ChiTietThiCong entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaChiTietThiCong = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaChiTietThiCong = filter_var($this->MaChiTietThiCong, FILTER_VALIDATE_INT);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietThiCong);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get equipment usage statistics for a project
    public function getEquipmentUsageStatistics($maCongTrinh) {
        $query = "SELECT 
                    MaThietBiVatTu,
                    TenThietBiVatTu,
                    COUNT(*) as SoLanSuDung,
                    MIN(NgayRoiKho) as NgayDauTien,
                    MAX(NgayHoanKho) as NgayCuoiCung,
                    SUM(DATEDIFF(NgayHoanKho, NgayRoiKho)) as TongThoiGianSuDung
                  FROM (
                    SELECT 
                      ctc.MaThietBiVatTu, 
                      tbvt.TenThietBiVatTu,
                      ctc.NgayRoiKho, 
                      ctc.NgayHoanKho
                    FROM " . $this->table_name . " ctc
                    JOIN ThietBiVatTu tbvt ON ctc.MaThietBiVatTu = tbvt.MaThietBiVatTu
                    WHERE ctc.MaCongTrinh = ? AND ctc.NgayHoanKho IS NOT NULL
                  ) as EquipmentUsage
                  GROUP BY MaThietBiVatTu, TenThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get current equipment status in a project
    public function getCurrentEquipmentStatus($maCongTrinh) {
        $query = "SELECT 
                    ctc.MaThietBiVatTu,
                    tbvt.TenThietBiVatTu,
                    ctc.TrangThai,
                    COUNT(*) as SoLuong,
                    MAX(ctc.NgayRoiKho) as NgayMoiNhat
                  FROM " . $this->table_name . " ctc
                  JOIN ThietBiVatTu tbvt ON ctc.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  WHERE ctc.MaCongTrinh = ?
                  GROUP BY ctc.MaThietBiVatTu, tbvt.TenThietBiVatTu, ctc.TrangThai";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>