<?php
class CungUng {
    private $conn;
    private $table_name = 'CungUng';

    // Table columns
    public $MaCungUng;
    public $MaThietBiVatTu;
    public $MaNhaCungCap;
    public $SoLuongTon;
    public $DonGia;
    public $NgayCapNhat;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new CungUng entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaThietBiVatTu, MaNhaCungCap, SoLuongTon, DonGia) 
                  VALUES (:maThietBiVatTu, :maNhaCungCap, :soLuongTon, :donGia)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaThietBiVatTu = htmlspecialchars(strip_tags($this->MaThietBiVatTu));
        $this->MaNhaCungCap = htmlspecialchars(strip_tags($this->MaNhaCungCap));
        $this->SoLuongTon = filter_var($this->SoLuongTon, FILTER_VALIDATE_FLOAT);
        $this->DonGia = filter_var($this->DonGia, FILTER_VALIDATE_FLOAT);

        $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);
        $stmt->bindParam(":maNhaCungCap", $this->MaNhaCungCap);
        $stmt->bindParam(":soLuongTon", $this->SoLuongTon);
        $stmt->bindParam(":donGia", $this->DonGia);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read all CungUng entries
    public function read() {
        $query = "SELECT cu.*, 
                         tbvt.TenThietBiVatTu,
                         ncc.TenNhaCungCap,
                         lvt.TenLoai as TenLoaiThietBiVatTu,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " cu
                  LEFT JOIN ThietBiVatTu tbvt ON cu.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON cu.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  ORDER BY cu.MaCungUng";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Read Single CungUng entry
    public function readSingle() {
        $query = "SELECT cu.*, 
                         tbvt.TenThietBiVatTu,
                         ncc.TenNhaCungCap,
                         lvt.TenLoai as TenLoaiThietBiVatTu,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " cu
                  LEFT JOIN ThietBiVatTu tbvt ON cu.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON cu.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE cu.MaCungUng = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaCungUng);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaCungUng = $row['MaCungUng'];
        $this->MaThietBiVatTu = $row['MaThietBiVatTu'];
        $this->MaNhaCungCap = $row['MaNhaCungCap'];
        $this->SoLuongTon = $row['SoLuongTon'];
        $this->DonGia = $row['DonGia'];
        $this->NgayCapNhat = $row['NgayCapNhat'];

        return $row;
    }

    // Update CungUng entry
    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . " 
                      SET SoLuongTon = :soLuongTon, 
                          DonGia = :donGia,
                          NgayCapNhat = CURRENT_TIMESTAMP
                      WHERE MaCungUng = :maCungUng";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean and bind data
            $this->SoLuongTon = filter_var($this->SoLuongTon, FILTER_VALIDATE_FLOAT);
            $this->DonGia = filter_var($this->DonGia, FILTER_VALIDATE_FLOAT);
            $this->MaCungUng = filter_var($this->MaCungUng, FILTER_VALIDATE_INT);

            // Validate data
            if ($this->SoLuongTon === false || $this->SoLuongTon < 0) {
                error_log("Invalid SoLuongTon value: " . $this->SoLuongTon);
                return false;
            }

            if ($this->MaCungUng === false) {
                error_log("Invalid MaCungUng value: " . $this->MaCungUng);
                return false;
            }

            $stmt->bindParam(":soLuongTon", $this->SoLuongTon);
            $stmt->bindParam(":donGia", $this->DonGia);
            $stmt->bindParam(":maCungUng", $this->MaCungUng);

            // Execute query
            if($stmt->execute()) {
                return true;
            }

            error_log("Failed to execute update query for MaCungUng: " . $this->MaCungUng);
            return false;
        } catch (PDOException $e) {
            error_log("PDO Error in CungUng::update: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log("Error in CungUng::update: " . $e->getMessage());
            return false;
        }
    }

    // Delete CungUng entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaCungUng = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaCungUng = filter_var($this->MaCungUng, FILTER_VALIDATE_INT);

        // Bind ID
        $stmt->bindParam(1, $this->MaCungUng);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get supplies by equipment
    public function getByEquipment($maThietBiVatTu) {
        $query = "SELECT cu.*, 
                         ncc.TenNhaCungCap,
                         ncc.SoDT,
                         ncc.Email
                  FROM " . $this->table_name . " cu
                  LEFT JOIN NhaCungCap ncc ON cu.MaNhaCungCap = ncc.MaNhaCungCap
                  WHERE cu.MaThietBiVatTu = ?
                  ORDER BY cu.DonGia";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind equipment ID
        $stmt->bindParam(1, $maThietBiVatTu);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get supplies by supplier
    public function getBySupplier($maNhaCungCap) {
        $query = "SELECT cu.*, 
                         tbvt.TenThietBiVatTu,
                         lvt.TenLoai as TenLoaiThietBiVatTu,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " cu
                  LEFT JOIN ThietBiVatTu tbvt ON cu.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE cu.MaNhaCungCap = ?
                  ORDER BY tbvt.TenThietBiVatTu";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind supplier ID
        $stmt->bindParam(1, $maNhaCungCap);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update quantity
    public function updateQuantity($quantity, $type = 'add') {
        $query = $type === 'add' 
            ? "UPDATE " . $this->table_name . " 
               SET SoLuongTon = SoLuongTon + :quantity,
                   NgayCapNhat = CURRENT_TIMESTAMP
               WHERE MaCungUng = :maCungUng"
            : "UPDATE " . $this->table_name . " 
               SET SoLuongTon = SoLuongTon - :quantity,
                   NgayCapNhat = CURRENT_TIMESTAMP
               WHERE MaCungUng = :maCungUng";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $quantity = filter_var($quantity, FILTER_VALIDATE_FLOAT);
        $this->MaCungUng = filter_var($this->MaCungUng, FILTER_VALIDATE_INT);

        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":maCungUng", $this->MaCungUng);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get low stock supplies
    public function getLowStockSupplies($threshold = 10) {
        $query = "SELECT cu.*, 
                         tbvt.TenThietBiVatTu,
                         ncc.TenNhaCungCap,
                         lvt.TenLoai as TenLoaiThietBiVatTu,
                         lvt.DonViTinh
                  FROM " . $this->table_name . " cu
                  LEFT JOIN ThietBiVatTu tbvt ON cu.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON cu.MaNhaCungCap = ncc.MaNhaCungCap
                  LEFT JOIN LoaiThietBiVatTu lvt ON tbvt.MaLoaiThietBiVatTu = lvt.MaLoaiThietBiVatTu
                  WHERE cu.SoLuongTon <= ?
                  ORDER BY cu.SoLuongTon";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind threshold
        $stmt->bindParam(1, $threshold);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get suppliers that are not linked to a specific equipment
    public function getUnlinkedSuppliers($maThietBiVatTu) {
        $query = "SELECT ncc.* 
                  FROM NhaCungCap ncc
                  WHERE ncc.MaNhaCungCap NOT IN (
                      SELECT cu.MaNhaCungCap 
                      FROM " . $this->table_name . " cu 
                      WHERE cu.MaThietBiVatTu = ?
                  )
                  ORDER BY ncc.TenNhaCungCap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind equipment ID
        $stmt->bindParam(1, $maThietBiVatTu);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Delete CungUng entry by equipment and supplier IDs
    public function deleteByEquipmentAndSupplier($maThietBiVatTu, $maNhaCungCap) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaThietBiVatTu = :maThietBiVatTu 
                  AND MaNhaCungCap = :maNhaCungCap";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $maThietBiVatTu = htmlspecialchars(strip_tags($maThietBiVatTu));
        $maNhaCungCap = htmlspecialchars(strip_tags($maNhaCungCap));

        // Bind parameters
        $stmt->bindParam(":maThietBiVatTu", $maThietBiVatTu);
        $stmt->bindParam(":maNhaCungCap", $maNhaCungCap);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?> 