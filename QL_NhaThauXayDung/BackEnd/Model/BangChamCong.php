<?php
class BangChamCong {
    private $conn;
    private $table_name = 'BangChamCong';

    // Các thuộc tính của BangChamCong
    public $MaChamCong;
    public $SoNgayLam;
    public $KyLuong;
    public $MaNhanVien;

    // Constructor
    public function __construct($db) {
        $this->conn = $db;
    }

    // Tạo bản ghi mới trong BangChamCong
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (MaChamCong, SoNgayLam, KyLuong, MaNhanVien) 
                  VALUES (:MaChamCong, :SoNgayLam, :KyLuong, :MaNhanVien)";

        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);

        // Làm sạch và ràng buộc dữ liệu
        $this->MaChamCong = htmlspecialchars(strip_tags($this->MaChamCong));
        $this->SoNgayLam = filter_var($this->SoNgayLam, FILTER_VALIDATE_FLOAT);
        $this->KyLuong = date('Y-m-d H:i:s', strtotime($this->KyLuong));
        $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));

        $stmt->bindParam(":MaChamCong", $this->MaChamCong);
        $stmt->bindParam(":SoNgayLam", $this->SoNgayLam);
        $stmt->bindParam(":KyLuong", $this->KyLuong);
        $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);

        // Thực thi câu lệnh
        if($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Đã tạo bản ghi chấm công thành công",
                "data" => [
                    "MaChamCong" => $this->MaChamCong,
                    "SoNgayLam" => $this->SoNgayLam,
                    "KyLuong" => $this->KyLuong,
                    "MaNhanVien" => $this->MaNhanVien
                ]
            ];
        }
        return [
            "status" => "error",
            "message" => "Không thể tạo bản ghi chấm công"
        ];
    }

    // Đọc một bản ghi BangChamCong
    public function readOne() {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  WHERE cc.MaChamCong = :maChamCong
                  LIMIT 0,1";

        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);

        // Ràng buộc ID
        $stmt->bindParam(":maChamCong", $this->MaChamCong);

        // Thực thi câu lệnh
        $stmt->execute();

        // Lấy dữ liệu
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            return [
                "status" => "success",
                "data" => [
                    "MaChamCong" => $row['MaChamCong'],
                    "MaNhanVien" => $row['MaNhanVien'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => (int)$row['LuongCanBan'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "LuongThang" => (int)$row['LuongThang']
                ]
            ];
        }

        return [
            "status" => "error",
            "message" => "Không tìm thấy bản ghi chấm công"
        ];
    }

    // Đọc tất cả bản ghi BangChamCong
    public function readAll() {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  ORDER BY cc.KyLuong DESC, cc.MaNhanVien";

        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);

        // Thực thi câu lệnh
        $stmt->execute();
        
        $num = $stmt->rowCount();

        if($num > 0) {
            $data = [];

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $item = [
                    "MaChamCong" => $row['MaChamCong'],
                    "MaNhanVien" => $row['MaNhanVien'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => (int)$row['LuongCanBan'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "LuongThang" => (int)$row['LuongThang']
                ];
                $data[] = $item;
            }

            return [
                "status" => "success",
                "data" => $data
            ];
        }

        return [
            "status" => "error",
            "message" => "Không tìm thấy bản ghi chấm công"
        ];
    }

    // Cập nhật bản ghi BangChamCong
   public function update() {
    $query = "UPDATE " . $this->table_name . " 
              SET SoNgayLam = :SoNgayLam, 
                  KyLuong = :KyLuong, 
                  MaNhanVien = :MaNhanVien 
              WHERE  MaNhanVien = :MaNhanVien";

    // Chuẩn bị câu lệnh
    $stmt = $this->conn->prepare($query);

    // Làm sạch và ràng buộc dữ liệu
    $this->SoNgayLam = filter_var($this->SoNgayLam, FILTER_VALIDATE_FLOAT);
    $this->KyLuong = date('Y-m-d H:i:s', strtotime($this->KyLuong));
    $this->MaNhanVien = htmlspecialchars(strip_tags($this->MaNhanVien));

    $stmt->bindParam(":SoNgayLam", $this->SoNgayLam);
    $stmt->bindParam(":KyLuong", $this->KyLuong);
    $stmt->bindParam(":MaNhanVien", $this->MaNhanVien);

    // Thực thi câu lệnh
    if($stmt->execute()) {
        // Lấy thông tin sau khi cập nhật
        $result = $this->readOne();
        
        if($result["status"] === "success") {
            return [
                "status" => "success",
                "message" => "Cập nhật bản ghi chấm công thành công",
                "data" => $result["data"]
            ];
        }
        
        return [
            "status" => "success",
            "message" => "Cập nhật bản ghi chấm công thành công, nhưng không lấy được thông tin chi tiết"
        ];
    }

    return [
        "status" => "error",
        "message" => "Không thể cập nhật bản ghi chấm công"
    ];
}


    // Xóa bản ghi BangChamCong
    public function delete() {
    // Lấy thông tin trước khi xóa
    $this->MaChamCong = htmlspecialchars(strip_tags($this->MaChamCong));
    error_log("MaChamCong: " . $this->MaChamCong); // Kiểm tra giá trị
    $resultInfo = $this->readOne();
    
    if($resultInfo["status"] === "error") {
        return [
            "status" => "error",
            "message" => "Không tìm thấy bản ghi chấm công1"
        ];
    }
    
    $query = "DELETE FROM " . $this->table_name . " WHERE MaChamCong = :maChamCong";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":maChamCong", $this->MaChamCong);

  if ($stmt->execute()) {
    return [
        "status" => "success",
        "message" => "Đã xóa bản ghi chấm công thành công",
        "data" => $resultInfo["data"]
    ];
} else {
    $errorInfo = $stmt->errorInfo(); // Lấy thông tin lỗi
    return [
        "status" => "error",
        "message" => "Không thể xóa bản ghi chấm công: " . $errorInfo[2] // Thông báo lỗi chi tiết
    ];
}

}


    // Tìm kiếm bản ghi BangChamCong
    public function search($keywords) {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  WHERE cc.MaChamCong LIKE :keywords 
                     OR cc.MaNhanVien LIKE :keywords 
                     OR nv.TenNhanVien LIKE :keywords 
                     OR DATE_FORMAT(cc.KyLuong, '%Y-%m-%d') LIKE :keywords";

        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);

        // Làm sạch từ khóa
        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // Ràng buộc từ khóa
        $stmt->bindParam(":keywords", $keywords);

        // Thực thi câu lệnh
        $stmt->execute();
        
        $num = $stmt->rowCount();

        if($num > 0) {
            $data = [];

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $item = [
                    "MaChamCong" => $row['MaChamCong'],
                    "MaNhanVien" => $row['MaNhanVien'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => (int)$row['LuongCanBan'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "LuongThang" => (int)$row['LuongThang']
                ];
                $data[] = $item;
            }

            return [
                "status" => "success",
                "data" => $data
            ];
        }

        return [
            "status" => "error",
            "message" => "Không tìm thấy bản ghi chấm công phù hợp"
        ];
    }

    // Lấy tổng số bản ghi BangChamCong
    public function count() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    // Phân trang BangChamCong
    public function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  ORDER BY cc.KyLuong DESC, cc.MaNhanVien
                  LIMIT :from_record_num, :records_per_page";

        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);

        // Ràng buộc giá trị biến
        $stmt->bindParam(":from_record_num", $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(":records_per_page", $records_per_page, PDO::PARAM_INT);

        // Thực thi câu lệnh
        $stmt->execute();
        
        $num = $stmt->rowCount();

        if($num > 0) {
            $data = [];

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $item = [
                    "MaChamCong" => $row['MaChamCong'],
                    "MaNhanVien" => $row['MaNhanVien'],
                    "TenNhanVien" => $row['TenNhanVien'],
                    "LuongCanBan" => (int)$row['LuongCanBan'],
                    "SoNgayLam" => $row['SoNgayLam'],
                    "KyLuong" => $row['KyLuong'],
                    "LuongThang" => (int)$row['LuongThang']
                ];
                $data[] = $item;
            }

            return [
                "status" => "success",
                "data" => $data
            ];
        }

        return [
            "status" => "error",
            "message" => "Không tìm thấy bản ghi chấm công"
        ];
    }

    // Lấy thông tin lương của tất cả nhân viên có chấm công
    public function getAllSalaryInfo() {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  ORDER BY cc.KyLuong DESC, cc.MaNhanVien";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // Lấy thông tin lương theo mã nhân viên
    public function getSalaryInfoByEmployee($maNhanVien) {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  WHERE cc.MaNhanVien = :maNhanVien
                  ORDER BY cc.KyLuong DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":maNhanVien", $maNhanVien);
        $stmt->execute();
        
        return $stmt;
    }

    // Lấy thông tin lương theo kỳ lương
    public function getSalaryInfoByPeriod($kyLuong) {
        $query = "SELECT cc.MaChamCong, cc.SoNgayLam, cc.KyLuong, cc.MaNhanVien,
                  nv.TenNhanVien, nv.LuongCanBan, (nv.LuongCanBan * cc.SoNgayLam) AS LuongThang
                  FROM " . $this->table_name . " cc
                  JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
                  WHERE DATE(cc.KyLuong) = DATE(:kyLuong)
                  ORDER BY cc.MaNhanVien";
        
        $stmt = $this->conn->prepare($query);
        $kyLuong = date('Y-m-d H:i:s', strtotime($kyLuong));
        $stmt->bindParam(":kyLuong", $kyLuong);
        $stmt->execute();
        
        return $stmt;
    }
}
?>