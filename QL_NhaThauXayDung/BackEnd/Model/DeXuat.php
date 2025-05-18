<?php
class DeXuat {
    private $conn;
    private $table_name = 'DeXuat';

    public $MaDeXuat;
    public $NgayLap;
    public $NgayGiaoDuKien;
    public $MaNhanVien;
    public $LoaiDeXuat;
    public $TrangThai;
    public $GhiChu;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create
    public function create() {
        $query = "INSERT INTO $this->table_name (MaDeXuat, NgayLap, NgayGiaoDuKien, MaNhanVien, LoaiDeXuat, TrangThai, GhiChu) VALUES (:MaDeXuat, :NgayLap, :NgayGiaoDuKien, :MaNhanVien, :LoaiDeXuat, :TrangThai, :GhiChu)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':MaDeXuat', $this->MaDeXuat);
        $stmt->bindParam(':NgayLap', $this->NgayLap);
        $stmt->bindParam(':NgayGiaoDuKien', $this->NgayGiaoDuKien);
        $stmt->bindParam(':MaNhanVien', $this->MaNhanVien);
        $stmt->bindParam(':LoaiDeXuat', $this->LoaiDeXuat);
        $stmt->bindParam(':TrangThai', $this->TrangThai);
        $stmt->bindParam(':GhiChu', $this->GhiChu);
        return $stmt->execute();
    }

    // Read all
    public function readAll() {
        $query = "SELECT * FROM $this->table_name ORDER BY NgayLap DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single
    public function readSingle() {
        $query = "SELECT * FROM $this->table_name WHERE MaDeXuat = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->MaDeXuat);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Update
    public function update() {
        $query = "UPDATE $this->table_name SET NgayLap = :NgayLap, NgayGiaoDuKien = :NgayGiaoDuKien, MaNhanVien = :MaNhanVien, LoaiDeXuat = :LoaiDeXuat, TrangThai = :TrangThai, GhiChu = :GhiChu WHERE MaDeXuat = :MaDeXuat";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':MaDeXuat', $this->MaDeXuat);
        $stmt->bindParam(':NgayLap', $this->NgayLap);
        $stmt->bindParam(':NgayGiaoDuKien', $this->NgayGiaoDuKien);
        $stmt->bindParam(':MaNhanVien', $this->MaNhanVien);
        $stmt->bindParam(':LoaiDeXuat', $this->LoaiDeXuat);
        $stmt->bindParam(':TrangThai', $this->TrangThai);
        $stmt->bindParam(':GhiChu', $this->GhiChu);
        return $stmt->execute();
    }

    // Delete
    public function delete() {
        $query = "DELETE FROM $this->table_name WHERE MaDeXuat = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->MaDeXuat);
        return $stmt->execute();
    }
} 