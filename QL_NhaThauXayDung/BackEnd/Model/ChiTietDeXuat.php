<?php
class ChiTietDeXuat {
    private $conn;
    private $table_name = 'ChiTietDeXuat';

    public $MaChiTietDeXuat;
    public $MaDeXuat;
    public $MaThietBiVatTu;
    public $SoLuong;
    public $DonGia;
    public $MaNhaCungCap;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create
    public function create() {
        $query = "INSERT INTO $this->table_name (MaDeXuat, MaThietBiVatTu, SoLuong, DonGia, MaNhaCungCap) VALUES (:MaDeXuat, :MaThietBiVatTu, :SoLuong, :DonGia, :MaNhaCungCap)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':MaDeXuat', $this->MaDeXuat);
        $stmt->bindParam(':MaThietBiVatTu', $this->MaThietBiVatTu);
        $stmt->bindParam(':SoLuong', $this->SoLuong);
        $stmt->bindParam(':DonGia', $this->DonGia);
        $stmt->bindParam(':MaNhaCungCap', $this->MaNhaCungCap);
        return $stmt->execute();
    }

    // Read all by MaDeXuat
    public function readByDeXuat() {
        $query = "SELECT ctdx.*, tbvt.TenThietBiVatTu, ncc.TenNhaCungCap
                  FROM ChiTietDeXuat ctdx
                  LEFT JOIN ThietBiVatTu tbvt ON ctdx.MaThietBiVatTu = tbvt.MaThietBiVatTu
                  LEFT JOIN NhaCungCap ncc ON ctdx.MaNhaCungCap = ncc.MaNhaCungCap
                  WHERE ctdx.MaDeXuat = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->MaDeXuat);
        $stmt->execute();
        return $stmt;
    }

    // Read single
    public function readSingle() {
        $query = "SELECT * FROM $this->table_name WHERE MaChiTietDeXuat = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->MaChiTietDeXuat);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Update
    public function update() {
        $query = "UPDATE $this->table_name SET MaDeXuat = :MaDeXuat, MaThietBiVatTu = :MaThietBiVatTu, SoLuong = :SoLuong, DonGia = :DonGia, MaNhaCungCap = :MaNhaCungCap WHERE MaChiTietDeXuat = :MaChiTietDeXuat";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':MaChiTietDeXuat', $this->MaChiTietDeXuat);
        $stmt->bindParam(':MaDeXuat', $this->MaDeXuat);
        $stmt->bindParam(':MaThietBiVatTu', $this->MaThietBiVatTu);
        $stmt->bindParam(':SoLuong', $this->SoLuong);
        $stmt->bindParam(':DonGia', $this->DonGia);
        $stmt->bindParam(':MaNhaCungCap', $this->MaNhaCungCap);
        return $stmt->execute();
    }

    // Delete
    public function delete() {
        $query = "DELETE FROM $this->table_name WHERE MaChiTietDeXuat = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->MaChiTietDeXuat);
        return $stmt->execute();
    }
} 