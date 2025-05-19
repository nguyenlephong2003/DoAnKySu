<?php
class BangBaoCaoTienDo {
    private $conn;
    private $table_name = 'BangBaoCaoTienDo';

    // Table columns
    public $MaTienDo;
    public $ThoiGianHoanThanhThucTe;
    public $CongViec;
    public $NoiDungCongViec;
    public $NgayBaoCao;
    public $TrangThai;
    public $TiLeHoanThanh;
    public $HinhAnhTienDo;
    public $MaCongTrinh;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new BangBaoCaoTienDo entry
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaTienDo, ThoiGianHoanThanhThucTe, CongViec, 
                   NoiDungCongViec, NgayBaoCao, TrangThai, 
                   TiLeHoanThanh, HinhAnhTienDo, MaCongTrinh) 
                  VALUES (:maTienDo, :thoiGianHoanThanhThucTe, :congViec, 
                          :noiDungCongViec, :ngayBaoCao, :trangThai, 
                          :tiLeHoanThanh, :hinhAnhTienDo, :maCongTrinh)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->MaTienDo = is_string($this->MaTienDo) ? htmlspecialchars(strip_tags($this->MaTienDo)) : '';
        $this->ThoiGianHoanThanhThucTe = is_string($this->ThoiGianHoanThanhThucTe) ? htmlspecialchars(strip_tags($this->ThoiGianHoanThanhThucTe)) : null;
        $this->CongViec = is_string($this->CongViec) ? htmlspecialchars(strip_tags($this->CongViec)) : '';
        $this->NoiDungCongViec = is_string($this->NoiDungCongViec) ? htmlspecialchars(strip_tags($this->NoiDungCongViec)) : '';
        $this->NgayBaoCao = is_string($this->NgayBaoCao) ? htmlspecialchars(strip_tags($this->NgayBaoCao)) : '';
        $this->TrangThai = filter_var($this->TrangThai, FILTER_VALIDATE_INT) !== false ? (int)$this->TrangThai : 0;
        $this->TiLeHoanThanh = is_numeric($this->TiLeHoanThanh) ? floatval($this->TiLeHoanThanh) : 0;
        $this->HinhAnhTienDo = is_string($this->HinhAnhTienDo) ? $this->HinhAnhTienDo : null;
        $this->MaCongTrinh = is_string($this->MaCongTrinh) ? htmlspecialchars(strip_tags($this->MaCongTrinh)) : '';

        $stmt->bindParam(":maTienDo", $this->MaTienDo);
        $stmt->bindParam(":thoiGianHoanThanhThucTe", $this->ThoiGianHoanThanhThucTe);
        $stmt->bindParam(":congViec", $this->CongViec);
        $stmt->bindParam(":noiDungCongViec", $this->NoiDungCongViec);
        $stmt->bindParam(":ngayBaoCao", $this->NgayBaoCao);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":tiLeHoanThanh", $this->TiLeHoanThanh);
        $stmt->bindParam(":hinhAnhTienDo", $this->HinhAnhTienDo);
        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Read Single BangBaoCaoTienDo entry
    public function readSingle() {
        $query = "SELECT btd.*, ct.TenCongTrinh, ct.Dientich, ct.FileThietKe, 
                         ct.MaKhachHang, ct.MaHopDong, ct.MaLoaiCongTrinh, 
                         ct.NgayDuKienHoanThanh
                  FROM " . $this->table_name . " btd
                  LEFT JOIN CongTrinh ct ON btd.MaCongTrinh = ct.MaCongTrinh
                  WHERE btd.MaTienDo = ? 
                  LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->MaTienDo);

        // Execute query
        $stmt->execute();

        // Get row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Set properties
        $this->MaTienDo = $row['MaTienDo'];
        $this->ThoiGianHoanThanhThucTe = $row['ThoiGianHoanThanhThucTe'];
        $this->CongViec = $row['CongViec'];
        $this->NoiDungCongViec = $row['NoiDungCongViec'];
        $this->NgayBaoCao = $row['NgayBaoCao'];
        $this->TrangThai = $row['TrangThai'];
        $this->TiLeHoanThanh = $row['TiLeHoanThanh'];
        $this->HinhAnhTienDo = $row['HinhAnhTienDo'];
        $this->MaCongTrinh = $row['MaCongTrinh'];

        // Return additional information
        return [
            'TenCongTrinh' => $row['TenCongTrinh'],
            'Dientich' => $row['Dientich'],
            'FileThietKe' => $row['FileThietKe'],
            'MaKhachHang' => $row['MaKhachHang'],
            'MaHopDong' => $row['MaHopDong'],
            'MaLoaiCongTrinh' => $row['MaLoaiCongTrinh'],
            'NgayDuKienHoanThanh' => $row['NgayDuKienHoanThanh']
        ];
    }

    // Get progress reports for a specific project
    public function getProjectProgressReports($maCongTrinh) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE MaCongTrinh = ?
                  ORDER BY NgayBaoCao DESC";

        // Prepare statementp
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Update BangBaoCaoTienDo entry
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET ThoiGianHoanThanhThucTe = :thoiGianHoanThanhThucTe, 
                      CongViec = :congViec, 
                      NoiDungCongViec = :noiDungCongViec, 
                      NgayBaoCao = :ngayBaoCao, 
                      TrangThai = :trangThai, 
                      TiLeHoanThanh = :tiLeHoanThanh, 
                      HinhAnhTienDo = :hinhAnhTienDo, 
                      MaCongTrinh = :maCongTrinh 
                  WHERE MaTienDo = :maTienDo";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean and bind data
        $this->ThoiGianHoanThanhThucTe = htmlspecialchars(strip_tags($this->ThoiGianHoanThanhThucTe));
        $this->CongViec = htmlspecialchars(strip_tags($this->CongViec));
        $this->NoiDungCongViec = htmlspecialchars(strip_tags($this->NoiDungCongViec));
        $this->NgayBaoCao = htmlspecialchars(strip_tags($this->NgayBaoCao));
        $this->TrangThai = filter_var($this->TrangThai, FILTER_VALIDATE_INT) !== false ? (int)$this->TrangThai : 0;
        $this->TiLeHoanThanh = filter_var($this->TiLeHoanThanh, FILTER_VALIDATE_FLOAT);
        $this->HinhAnhTienDo = is_string($this->HinhAnhTienDo) ? $this->HinhAnhTienDo : null;
        $this->MaCongTrinh = htmlspecialchars(strip_tags($this->MaCongTrinh));
        $this->MaTienDo = htmlspecialchars(strip_tags($this->MaTienDo));

        $stmt->bindParam(":thoiGianHoanThanhThucTe", $this->ThoiGianHoanThanhThucTe);
        $stmt->bindParam(":congViec", $this->CongViec);
        $stmt->bindParam(":noiDungCongViec", $this->NoiDungCongViec);
        $stmt->bindParam(":ngayBaoCao", $this->NgayBaoCao);
        $stmt->bindParam(":trangThai", $this->TrangThai);
        $stmt->bindParam(":tiLeHoanThanh", $this->TiLeHoanThanh);
        $stmt->bindParam(":hinhAnhTienDo", $this->HinhAnhTienDo);
        $stmt->bindParam(":maCongTrinh", $this->MaCongTrinh);
        $stmt->bindParam(":maTienDo", $this->MaTienDo);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete BangBaoCaoTienDo entry
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE MaTienDo = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->MaTienDo = htmlspecialchars(strip_tags($this->MaTienDo));

        // Bind ID
        $stmt->bindParam(1, $this->MaTienDo);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get overall project progress
    public function getOverallProjectProgress($maCongTrinh) {
        $query = "SELECT 
                    MAX(TiLeHoanThanh) as TongTienDo,
                    MAX(ThoiGianHoanThanhThucTe) as NgayHoanThanh,
                    COUNT(*) as SoBaoCao
                  FROM " . $this->table_name . "
                  WHERE MaCongTrinh = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind project ID
        $stmt->bindParam(1, $maCongTrinh);

        // Execute query
        $stmt->execute();

        // Return progress details
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get progress reports by status
    public function getProgressReportsByStatus($maCongTrinh, $trangThai) {
        $query = "SELECT * FROM " . $this->table_name . "
                  WHERE MaCongTrinh = ? AND TrangThai = ?
                  ORDER BY NgayBaoCao DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(1, $maCongTrinh);
        $stmt->bindParam(2, $trangThai);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get all progress reports with construction details
    public function readAll() {
        $query = "SELECT btd.*, ct.TenCongTrinh, ct.Dientich, ct.FileThietKe, 
                         ct.MaKhachHang, ct.MaHopDong, ct.MaLoaiCongTrinh, 
                         ct.NgayDuKienHoanThanh
                  FROM " . $this->table_name . " btd
                  LEFT JOIN CongTrinh ct ON btd.MaCongTrinh = ct.MaCongTrinh
                  ORDER BY btd.NgayBaoCao DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
?>