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
        $query = "SELECT t.*, l.TenLoai as TenLoaiThietBiVatTu, l.DonViTinh,
                 COALESCE(SUM(c.SoLuongTon), 0) as TongSoLuongTon
                 FROM " . $this->table_name . " t
                 LEFT JOIN LoaiThietBiVatTu l ON t.MaLoaiThietBiVatTu = l.MaLoaiThietBiVatTu
                 LEFT JOIN CungUng c ON t.MaThietBiVatTu = c.MaThietBiVatTu
                 GROUP BY t.MaThietBiVatTu";

        $stmt = $this->conn->prepare($query);
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
        try {
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

            // Validate data
            if (empty($this->TenThietBiVatTu)) {
                error_log("Invalid TenThietBiVatTu value: empty");
                return false;
            }

            if (empty($this->TrangThai)) {
                error_log("Invalid TrangThai value: empty");
                return false;
            }

            if ($this->MaLoaiThietBiVatTu === false) {
                error_log("Invalid MaLoaiThietBiVatTu value: " . $this->MaLoaiThietBiVatTu);
                return false;
            }

            if (empty($this->MaThietBiVatTu)) {
                error_log("Invalid MaThietBiVatTu value: empty");
                return false;
            }

            $stmt->bindParam(":tenThietBiVatTu", $this->TenThietBiVatTu);
            $stmt->bindParam(":trangThai", $this->TrangThai);
            $stmt->bindParam(":maLoaiThietBiVatTu", $this->MaLoaiThietBiVatTu);
            $stmt->bindParam(":maThietBiVatTu", $this->MaThietBiVatTu);

            // Execute query
            if($stmt->execute()) {
                return true;
            }

            error_log("Failed to execute update query for MaThietBiVatTu: " . $this->MaThietBiVatTu);
            return false;
        } catch (PDOException $e) {
            error_log("PDO Error in ThietBiVatTu::update: " . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log("Error in ThietBiVatTu::update: " . $e->getMessage());
            return false;
        }
    }

    // Delete ThietBiVatTu entry
    public function delete() {
        try {
            // Begin transaction
            $this->conn->beginTransaction();

            // First delete related records from CungUng table
            $query1 = "DELETE FROM CungUng WHERE MaThietBiVatTu = ?";
            $stmt1 = $this->conn->prepare($query1);
            $stmt1->bindParam(1, $this->MaThietBiVatTu);
            $stmt1->execute();

            // Then delete from ThietBiVatTu table
            $query2 = "DELETE FROM " . $this->table_name . " WHERE MaThietBiVatTu = ?";
            $stmt2 = $this->conn->prepare($query2);
            $stmt2->bindParam(1, $this->MaThietBiVatTu);
            $stmt2->execute();

            // Commit transaction
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollBack();
            throw $e;
        }
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