CREATE TABLE `LoaiNhanVien` (
  `MaLoaiNhanVien` int AUTO_INCREMENT PRIMARY KEY,
  `TenLoai` varchar(255)
);

CREATE TABLE `LoaiCongTrinh` (
  `MaLoaiCongTrinh` int AUTO_INCREMENT PRIMARY KEY,
  `TenLoaiCongTrinh` varchar(255)
);

CREATE TABLE `LoaiBaoGia` (
  `MaLoai` int AUTO_INCREMENT PRIMARY KEY,
  `TenLoai` varchar(255)
);

CREATE TABLE `LoaiThietBiVatTu` (
  `MaLoaiThietBiVatTu` int AUTO_INCREMENT PRIMARY KEY,
  `TenLoai` varchar(255),
  `DonViTinh` varchar(20),
  `LaThietBi` TINYINT(1) DEFAULT 1
);

CREATE TABLE `NhanVien` (
  `MaNhanVien` varchar(20) PRIMARY KEY,
  `TenNhanVien` varchar(255),
  `SoDT` varchar(10),
  `CCCD` varchar(12),
  `Email` varchar(255),
  `NgayVao` datetime,
  `LuongCanBan` float,
  `MaLoaiNhanVien` int
);

CREATE TABLE `BangChamCong` (
  `MaChamCong` varchar(20) PRIMARY KEY,
  `SoNgayLam` float,
  `KyLuong` datetime,
  `MaNhanVien` varchar(20)
);

CREATE TABLE `TaiKhoan` (
  `MaTaiKhoan` varchar(20) PRIMARY KEY,
  `MatKhau` varchar(255),
  `MaNhanVien` varchar(20) UNIQUE
);

CREATE TABLE `HopDong` (
  `MaHopDong` varchar(20) PRIMARY KEY,
  `NgayKy` Date,
  `MoTa` varchar(255),
  `TongTien` float,
  `FileHopDong` text,
  `TrangThai` varchar(255),
  `GhiChu` varchar(255),
  `MaNhanVien` varchar(20)
);

CREATE TABLE `KhachHang` (
  `MaKhachHang` varchar(20) PRIMARY KEY,
  `TenKhachHang` varchar(255) not null,
  `SoDT` varchar(10) not null,
  `CCCD` varchar(12) not null,
  `Email` varchar(255)
);

CREATE TABLE `BangBaoGia` (
  `MaBaoGia` varchar(20) PRIMARY KEY,
  `TenBaoGia` varchar(255),
  `TrangThai` varchar(255),
  `GhiChu` varchar(255),
  `MaLoai` int
);

CREATE TABLE `CongTrinh` (
  `MaCongTrinh` varchar(20) PRIMARY KEY,
  `TenCongTrinh` varchar(255),
  `Dientich` float,
  `FileThietKe` text,
  `MaKhachHang` varchar(20),
  `MaHopDong` varchar(20),
  `MaLoaiCongTrinh` int,
  `NgayDuKienHoanThanh` datetime
);

CREATE TABLE `ChiTietBaoGia` (
  `MaChiTietBaoGia` int AUTO_INCREMENT PRIMARY KEY,
  `MaBaoGia` varchar(20),
  `MaCongTrinh` varchar(20),
  `GiaBaoGia` float,
  `NoiDung` varchar(250)
);

CREATE TABLE `BangBaoCaoTienDo` (
  `MaTienDo` varchar(20) PRIMARY KEY,
  `ThoiGianHoanThanhThucTe` DateTime,
  `CongViec` varchar(255),
  `NoiDungCongViec` varchar(255),
  `NgayBaoCao` DateTime,
  `TrangThai` boolean,
  `TiLeHoanThanh` float,
  `HinhAnhTienDo` text,
  `MaCongTrinh` varchar(20)
);

CREATE TABLE `BangPhanCong` (
  `MaBangPhanCong` int AUTO_INCREMENT PRIMARY KEY,
  `MaCongTrinh` varchar(20),
  `MaNhanVien` varchar(20),
  `NgayThamGia` Date,
  `NgayKetThuc` Date,
  `SoNgayThamGia` int
);

CREATE TABLE `NhaCungCap` (
  `MaNhaCungCap` varchar(20) PRIMARY KEY,
  `TenNhaCungCap` varchar(255),
  `SoDT` varchar(11),
  `Email` varchar(255),
  `DiaChi` varchar(255),
  `LoaiHinhCungCap` varchar(255)
);

CREATE TABLE `ThietBiVatTu` (
  `MaThietBiVatTu` varchar(20) PRIMARY KEY,
  `TenThietBiVatTu` varchar(255),
  `SoLuongTon` float,
  `TrangThai` varchar(255),
  `MaLoaiThietBiVatTu` int,
  `MaNhaCungCap` varchar(20)
);

CREATE TABLE `PhieuNhap` (
  `MaPhieuNhap` varchar(20) PRIMARY KEY,
  `NgayNhap` DateTime,
  `DiaDiemGiao` varchar(255),
  `TongTien` float,
  `TrangThai` varchar(50),
  `MaNhaCungCap` varchar(20),
  `MaNhanVien` varchar(20)
);

CREATE TABLE `ChiTietPhieuNhap` (
  `MaChiTietPhieuNhap` int AUTO_INCREMENT PRIMARY KEY,
  `MaPhieuNhap` varchar(20),
  `MaThietBiVatTu` varchar(20),
  `SoLuong` float,
  `DonGia` float
);

CREATE TABLE `ChiTietThiCong` (
  `MaChiTietThiCong` int AUTO_INCREMENT PRIMARY KEY,
  `MaCongTrinh` varchar(20),
  `MaThietBiVatTu` varchar(20),
  `TrangThai` varchar(50),
  `NgayRoiKho` Datetime,
  `NgayHoanKho` Datetime
);

CREATE TABLE `DeXuat` (
  `MaDeXuat` varchar(20) PRIMARY KEY,
  `NgayLap` DateTime,  
  `NgayGiaoDuKien` DateTime,
  `NgayDuyet` DateTime,
  `MaNhanVien` varchar(20),
  `LoaiDeXuat` varchar(50),
  `TrangThai` nvarchar(50) DEFAULT 'Chờ duyệt',
  `GhiChu` nvarchar(255),
  FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`)
);

CREATE TABLE `ChiTietDeXuat` (
  `MaChiTietDeXuat` int AUTO_INCREMENT PRIMARY KEY,
  `MaDeXuat` varchar(20),
  `MaThietBiVatTu` varchar(20),
  `SoLuong` float,
  `DonGia` float,
  `MaNhaCungCap` varchar(20),
  FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNhaCungCap`),
  FOREIGN KEY (`MaDeXuat`) REFERENCES `DeXuat` (`MaDeXuat`),
  FOREIGN KEY (`MaThietBiVatTu`) REFERENCES `ThietBiVatTu` (`MaThietBiVatTu`)
);

ALTER TABLE `NhanVien` 
ADD CONSTRAINT `fk_LoaiNhanVien` 
FOREIGN KEY (`MaLoaiNhanVien`) REFERENCES `LoaiNhanVien` (`MaLoaiNhanVien`);

ALTER TABLE `BangChamCong` 
ADD CONSTRAINT `fk_NhanVien_BangChamCong` 
FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `TaiKhoan` 
ADD CONSTRAINT `fk_NhanVien_TaiKhoan` 
FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `HopDong` 
ADD CONSTRAINT `fk_NhanVien_HopDong` 
FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `BangBaoGia` 
ADD CONSTRAINT `fk_BangBaoGia_LoaiBaoGia` 
FOREIGN KEY (`MaLoai`) REFERENCES `LoaiBaoGia` (`MaLoai`);

ALTER TABLE `CongTrinh` 
ADD CONSTRAINT `fk_CongTrinh_KhachHang` 
FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang` (`MaKhachHang`);

ALTER TABLE `CongTrinh` 
ADD CONSTRAINT `fk_CongTrinh_HopDong` 
FOREIGN KEY (`MaHopDong`) REFERENCES `HopDong` (`MaHopDong`);

ALTER TABLE `CongTrinh` 
ADD CONSTRAINT `fk_CongTrinh_LoaiCongTrinh` 
FOREIGN KEY (`MaLoaiCongTrinh`) REFERENCES `LoaiCongTrinh` (`MaLoaiCongTrinh`);

ALTER TABLE `ChiTietBaoGia` 
ADD CONSTRAINT `fk_ChiTietBaoGia_CongTrinh` 
FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `ChiTietBaoGia` 
ADD CONSTRAINT `fk_ChiTietBaoGia_BaoGia` 
FOREIGN KEY (`MaBaoGia`) REFERENCES `BangBaoGia` (`MaBaoGia`);

ALTER TABLE `BangBaoCaoTienDo` 
ADD CONSTRAINT `fk_CongTrinh_TienDo` 
FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `BangPhanCong` 
ADD CONSTRAINT `fk_BangPhanCong_CongTrinh` 
FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);

ALTER TABLE `BangPhanCong` 
ADD CONSTRAINT `fk_BangPhanCong_NhanVien` 
FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `ThietBiVatTu` 
ADD CONSTRAINT `fk_ThietBiVatTu_NhaCungCap` 
FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNhaCungCap`);

ALTER TABLE `ThietBiVatTu` 
ADD CONSTRAINT `fk_ThietBiVatTu_LoaiThietBiVatTu` 
FOREIGN KEY (`MaLoaiThietBiVatTu`) REFERENCES `LoaiThietBiVatTu` (`MaLoaiThietBiVatTu`);

ALTER TABLE `PhieuNhap` 
ADD CONSTRAINT `fk_PhieuNhap_NhaCungCap` 
FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNhaCungCap`);

ALTER TABLE `PhieuNhap` 
ADD CONSTRAINT `fk_PhieuNhap_NhanVien` 
FOREIGN KEY (`MaNhanVien`) REFERENCES `NhanVien` (`MaNhanVien`);

ALTER TABLE `ChiTietPhieuNhap` 
ADD CONSTRAINT `fk_ChiTietPhieuNhap_PhieuNhap` 
FOREIGN KEY (`MaPhieuNhap`) REFERENCES `PhieuNhap` (`MaPhieuNhap`);

ALTER TABLE `ChiTietPhieuNhap` 
ADD CONSTRAINT `fk_ChiTietPhieuNhap_ThietBiVatTu` 
FOREIGN KEY (`MaThietBiVatTu`) REFERENCES `ThietBiVatTu` (`MaThietBiVatTu`);

ALTER TABLE `ChiTietThiCong` 
ADD CONSTRAINT `fk_ChiTietThiCong_ThietBiVatTu` 
FOREIGN KEY (`MaThietBiVatTu`) REFERENCES `ThietBiVatTu` (`MaThietBiVatTu`);

ALTER TABLE `ChiTietThiCong` 
ADD CONSTRAINT `fk_ChiTietThiCong_CongTrinh` 
FOREIGN KEY (`MaCongTrinh`) REFERENCES `CongTrinh` (`MaCongTrinh`);