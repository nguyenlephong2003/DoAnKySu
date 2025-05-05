CREATE TABLE `LoaiNhanVien` (
  `MaLoaiNhanVien` varchar(6) PRIMARY KEY,
  `TenLoai` nvarchar(255)
);

CREATE TABLE `NhanVien` (
  `MaNhanVien` varchar(6) PRIMARY KEY,
  `TenNhanVien` nvarchar(255),
  `SoDT` varchar(10),
  `CCCD` varchar(12),
  `Email` varchar(255),
  `NgayVao` datetime,
  `MaLoaiNhanVien` varchar(6)
);

CREATE TABLE `BangChamCong` (
  `MaChamCong` varchar(6) PRIMARY KEY,
  `SoNgayLam` float,
  `KyLuong` int,
  `MaNhanVien` varchar(6)
);

CREATE TABLE `TaiKhoan` (
  `MaTaiKhoan` varchar(6) PRIMARY KEY,
  `MatKhau` varchar(255),
  `MaNhanVien` varchar(6) UNIQUE
);

CREATE TABLE `HopDong` (
  `MaHopDong` varchar(6) PRIMARY KEY,
  `NgayKy` Date,
  `MoTa` nvarchar(255),
  `TongTien` float,
  `FileHopDong` varchar(6),
  `MaNhanVien` varchar(6)
);

CREATE TABLE `KhachHang` (
  `MaKhachHang` varchar(6) PRIMARY KEY,
  `TenKhachHang` varchar(255),
  `SoDT` varchar(10),
  `CCCD` varchar(12),
  `Email` varchar(255)
);

CREATE TABLE `LoaiCongTrinh` (
  `MaLoaiCongTrinh` varchar(6) PRIMARY KEY,
  `TenLoaiCongTrinh` nvarchar(255)
);

CREATE TABLE `LoaiBaoGia` (
  `MaLoai` varchar(6) PRIMARY KEY,
  `TenLoai` nvarchar(255)
);

CREATE TABLE `BangBaoGia` (
  `MaBaoGia` varchar(6) PRIMARY KEY,
  `TenBaoGia` nvarchar(255),
  `TrangThai` nvarchar(255),
  `MaLoai` varchar(6)
);

CREATE TABLE `CongTrinh` (
  `MaCongTrinh` varchar(6) PRIMARY KEY,
  `TenCongTrinh` nvarchar(255),
  `Dientich` float,
  `FileThietKe` varchar(255),
  `MaKhachHang` varchar(6),
  `MaHopDong` varchar(6),
  `MaLoaiCongTrinh` varchar(6),
  `NgayDuKienHoanThanh` datetime
);

CREATE TABLE `ChiTietBaoGia` (
  `MaChiTietBaoGia` int PRIMARY KEY,
  `MaBaoGia` varchar(6),
  `MaCongTrinh` varchar(6),
  `GiaThapNhat` float,
  `GiaCaoNhat` float
);

CREATE TABLE `BangBaoCaoTienDo` (
  `MaTienDo` varchar(6) PRIMARY KEY,
  `ThoiGianHoanThanhThucTe` DateTime,
  `NoiDungCongViec` nvarchar(255),
  `NgayBaoCao` DateTime,
  `TrangThai` int,
  `TiLeHoanThanh` float,
  `HinhAnhTienDo` varchar(255),
  `MaCongTrinh` varchar(6)
);

CREATE TABLE `BangPhanCong` (
  `MaBangPhanCong` varchar(6) PRIMARY KEY,
  `MaCongTrinh` varchar(6),
  `MaNhanVien` varchar(6),
  `NgayThamGia` Date,
  `NgayKetThuc` Date,
  `SoNgayThamGia` int
);

CREATE TABLE `NhaCungCap` (
  `MaNhaCungCap` varchar(6) PRIMARY KEY,
  `TenNhaCungCap` nvarchar(255),
  `SoDT` varchar(11),
  `DiaChi` nvarchar(255),
  `LoaiHinhCungCap` nvarchar(255)
);

CREATE TABLE `LoaiThietBiVatTu` (
  `MaLoaiThietBiVatTu` varchar(6) PRIMARY KEY,
  `TenLoai` nvarchar(255),
  `DonViTinh` nvarchar(20)
);

CREATE TABLE `ThietBiVatTu` (
  `MaThietBiVatTu` varchar(6) PRIMARY KEY,
  `TenThietBiVatTu` nvarchar(255),
  `SoLuongTon` float,
  `TrangThai` nvarchar(255),
  `MaLoaiThietBiVatTu` varchar(6),
  `MaNhaCungCap` varchar(6)
);

CREATE TABLE `PhieuNhap` (
  `MaPhieuNhap` varchar(6) PRIMARY KEY,
  `NgayNhap` DateTime,
  `TongTien` float,
  `TrangThai` nvarchar(50),
  `MaNhaCungCap` varchar(6),
  `MaNhanVien` varchar(6)
);

CREATE TABLE `ChiTietPhieuNhap` (
  `MaChiTietPhieuNhap` int PRIMARY KEY,
  `MaPhieuNhap` varchar(6),
  `MaThietBiVatTu` varchar(6),
  `SoLuong` float,
  `DonGia` float
);

CREATE TABLE `ChiTietThiCong` (
  `MaChiTietThiCong` int PRIMARY KEY,
  `MaCongTrinh` varchar(6),
  `MaThietBiVatTu` varchar(6),
  `TrangThai` nvarchar(50),
  `NgayRoiKho` Datetime,
  `NgayHoanKho` Datetime
);

ALTER TABLE `NhanVien` ADD CONSTRAINT `fk_LoaiNhanVien` FOREIGN KEY (`MaLoaiNhanVien`) REFERENCES `LoaiNhanVien` (`MaLoaiNhanVien`);

ALTER TABLE `BangChamCong` ADD CONSTRAINT `fk_NhanVien_BangChamCong` FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `TaiKhoan` ADD CONSTRAINT `fk_NhanVien_TaiKhoan` FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `HopDong` ADD CONSTRAINT `fk_NhanVien_HopDong` FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `BangBaoGia` ADD CONSTRAINT `fk_BangBaoGia_LoaiBaoGia` FOREIGN KEY (`MaLoai`) REFERENCES `LoaiBaoGia` (`MaLoai`);

ALTER TABLE `CongTrinh` ADD CONSTRAINT `fk_CongTrinh_KhachHang` FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang` (`MaKhachHang`);

ALTER TABLE `CongTrinh` ADD CONSTRAINT `fk_CongTrinh_HopDong` FOREIGN KEY (`MaHopDong`) REFERENCES `HopDong` (`MaHopDong`);

ALTER TABLE `CongTrinh` ADD CONSTRAINT `fk_CongTrinh_LoaiCongTrinh` FOREIGN KEY (`MaLoaiCongTrinh`) REFERENCES `LoaiCongTrinh` (`MaLoaiCongTrinh`);

ALTER TABLE `ChiTietBaoGia` ADD CONSTRAINT `fk_ChiTietBaoGia_CongTrinh` FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `ChiTietBaoGia` ADD CONSTRAINT `fk_ChiTietBaoGia_BaoGia` FOREIGN KEY (`MaBaoGia`) REFERENCES `BangBaoGia` (`MaBaoGia`);

ALTER TABLE `BangBaoCaoTienDo` ADD CONSTRAINT `fk_CongTrinh_TienDo` FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `BangPhanCong` ADD CONSTRAINT `fk_BangPhanCong_CongTrinh` FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `BangPhanCong` ADD CONSTRAINT `fk_BangPhanCong_NhanVien` FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `ThietBiVatTu` ADD CONSTRAINT `fk_ThietBiVatTu_NhaCungCap` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNhaCungCap`);

ALTER TABLE `ThietBiVatTu` ADD CONSTRAINT `fk_ThietBiVatTu_LoaiThietBiVatTu` FOREIGN KEY (`MaLoaiThietBiVatTu`) REFERENCES `LoaiThietBiVatTu` (`MaLoaiThietBiVatTu`);

ALTER TABLE `PhieuNhap` ADD CONSTRAINT `fk_PhieuNhap_NhaCungCap` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNhaCungCap`);

ALTER TABLE `PhieuNhap` ADD CONSTRAINT `fk_PhieuNhap_NhanVien` FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `ChiTietPhieuNhap` ADD CONSTRAINT `fk_ChiTietPhieuNhap_PhieuNhap` FOREIGN KEY (`MaPhieuNhap`) REFERENCES `PhieuNhap` (`MaPhieuNhap`);

ALTER TABLE `ChiTietPhieuNhap` ADD CONSTRAINT `fk_ChiTietPhieuNhap_ThietBiVatTu` FOREIGN KEY (`MaThietBiVatTu`) REFERENCES `ThietBiVatTu` (`MaThietBiVatTu`);

ALTER TABLE `ChiTietThiCong` ADD CONSTRAINT `fk_ChiTietThiCong_ThietBiVatTu` FOREIGN KEY (`MaThietBiVatTu`) REFERENCES `ThietBiVatTu` (`MaThietBiVatTu`);

ALTER TABLE `ChiTietThiCong` ADD CONSTRAINT `fk_ChiTietThiCong_CongTrinh` FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);
