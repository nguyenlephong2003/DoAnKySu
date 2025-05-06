<?php
class ChiTietPhieuNhap {
    private $conn;
    private $table_name = 'ChiTietPhieuNhap';

    // Table columns
    public $MaChiTietPhieuNhap;
    public $MaPhieuNhap;
    public $MaThietBiVatTu;
    public $SoLuong;
    public $DonGia;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new ChiTietPhieuNhap entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaPhieuNhap, MaThietBiVatTu, SoLuong, DonGia) 
                  VALUES (:maPhieuNhap, :maThietBiVatTu, :soLuong, :donGia)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaPhieuNhap = htmlspecialchars(strip_tags($this->MaPhieuNhap));
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->SoLuong = filter_var($this->SoLuong, FILTER_VALIDATE_FLOAT);
        $this->DonGia = filter_var($this->DonGia, FILTER_VALIDATE_FLOAT);

        $stmt->bindParam(":maPhieuNhap", $this->MaPhieuNhap);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":soLuong", $this->SoLuong);
        $stmt->bindParam(":donGia", $this->DonGia);

        // Execute query
        if($stmt->execute()) {
            // Get the last inserted ID
            $this->MaChiTietPhieuNhap = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Read Single ChiTietPhieuNhap entry
    public function readSingle() {
        $query = "SELECT ctpn.*, 
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as LoaiThietBi,
                         lvt.DonViTinh,
                         pn.NgayNhap,
                         ncc.TenNhaCungCap
                  FROM " . $this->table_name . " ctpn
                  LEFT JOIN ThietBiVatTu tbvt ON ctpn.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  LEFT JOIN PhieuNhap pn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
                  LEFT JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
                  WHERE ctpn.MaChiTietPhieuNhap = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietPhieuNhap);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaChiTietPhieuNhap = $row['MaChiTietPhieuNhap'];
        $this->MaPhieuNhap = $row['MaPhieuNhap'];
        $this->MaThietBiVatTu = $row['MaThietBiVatTu'];
        $this->SoLuong = $row['SoLuong'];
        $this->DonGia = $row['DonGia'];

        // Return additional information
        return [
            'TenThietBiVatTu' => $row['TenThietBiVatTu'],
            'LoaiThietBi' => $row['LoaiThietBi'],
            'DonViTinh' => $row['DonViTinh'],
            'NgayNhap' => $row['NgayNhap'],
            'TenNhaCungCap' => $row['TenNhaCungCap']
        ];
    }

    // Get details for a specific import receipt
    public function getImportReceiptDetails($maPhieuNhap) {
        $query = "SELECT ctpn.*, 
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as LoaiThietBi,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " ctpn
                  LEFT JOIN ThietBiVatTu tbvt ON ctpn.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE ctpn.MaPhieuNhap = ?
                  ORDER BY ctpn.MaChiTietPhieuNhap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind import receipt ID
        $stmt->bindParam(1, $maPhieuNhap);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update ChiTietPhieuNhap entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET MaPhieuNhap = :maPhieuNhap, 
                      MaThietBiVatTu = :maThietBiVatTu, 
                      SoLuong = :soLuong, 
                      DonGia = :donGia 
                  WHERE MaChiTietPhieuNhap = :maChiTietPhieuNhap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaPhieuNhap = htmlspecialchars(strip_tags($this->MaPhieuNhap));
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->SoLuong = filter_var($this->SoLuong, FILTER_VALIDATE_FLOAT);
        $this->DonGia = filter_var($this->DonGia, FILTER_VALIDATE_FLOAT);
        $this->MaChiTietPhieuNhap = filter_var($this->MaChiTietPhieuNhap, FILTER_VALIDATE_INT);

        $stmt->bindParam(":maPhieuNhap", $this->MaPhieuNhap);
        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":soLuong", $this->SoLuong);
        $stmt->bindParam(":donGia", $this->DonGia);
        $stmt->bindParam(":maChiTietPhieuNhap", $this->MaChiTietPhieuNhap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete ChiTietPhieuNhap entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaChiTietPhieuNhap = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaChiTietPhieuNhap = filter_var($this->MaChiTietPhieuNhap, FILTER_VALIDATE_INT);

        // Bind ID
        $stmt->bindParam(1, $this->MaChiTietPhieuNhap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Calculate total value for a specific import receipt
    public function calculateTotalValue($maPhieuNhap) {
        $query = "SELECT 
                    SUM(SoLuong * DonGia) as TongGiaTri,
                    COUNT(DISTINCT MaThietBiVatTu) as SoLoaiThietBi,
                    SUM(SoLuong) as TongSoLuong
                  FROM " . $this->table_name . "
                  WHERE MaPhieuNhap = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind import receipt ID
        $stmt->bindParam(1, $maPhieuNhap);

        // Execute query
        $stmt->execute();

        // Return calculation results
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get most imported equipment
    public function getMostImportedEquipment($limit = 10) {
        $query = "SELECT 
                    tbvt.MaThietBiVatTu,
                    tbvt.TenThietBiVatTu,
                    lvt.TenLoai as LoaiThietBi,
                    SUM(ctpn.SoLuong) as TongSoLuong,
                    SUM(ctpn.SoLuong * ctpn.DonGia) as TongGiaTri
                  FROM " . $this->table_name . " ctpn
                  JOIN ThietBiVatTu tbvt ON ctpn.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  GROUP BY tbvt.MaThietBiVatTu, tbvt.TenThietBiVatTu, lvt.TenLoai
                  ORDER BY TongSoLuong DESC
                  LIMIT ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind limit
        $stmt->bindParam(1, $limit, PDO::PARAM_INT);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>