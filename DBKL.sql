use master
create database QL_NhaThauXayDung
use QL_NhaThauXayDung
drop QL_NhaThauXayDung
go

create table LoaiNhanVien
(
	MaLoaiNhanVien varchar(6) primary key not null,
	TenLoai nvarchar (255)
)

create table NhanVien
(	
	MaNhanVien varchar (6) primary key not null,
	TenNhanVien nvarchar(255),
	SoDT varchar(10),
	CCCD varchar (12),
	Email varchar(255),
	NgayVao datetime,
	MaLoaiNhanVien varchar(6)
	constraint fk_LoaiNhanVien foreign key (MaLoaiNhanVien) references LoaiNhanVien(MaLoaiNhanVien)
)


create table BangChamCong
(
	MaChamCong int primary key,
	SoNgayLam float,
	KyLuong int,
	MaNhanVien varchar(6)
	constraint fk_NhanVien_BangChamCong foreign key (MaNhanVien) references NhanVien(MaNhanVien)

)

create table TaiKhoan
(	
	MaTaiKhoan varchar(6) primary key not null,
	MatKhau varchar(255),
	MaNhanVien varchar(6) unique
	constraint fk_NhanVien_TaiKhoan foreign key (MaNhanVien) references NhanVien(MaNhanVien)
 )

 create table HopDong
 (
	MaHopDong varchar(6) primary key,
	NgayKy Date,
	MoTa nvarchar(255),
	TongTien float,
	FileHopDong varchar(6),
	MaNhanVien varchar(6)
constraint fk_NhanVien_HopDong foreign key (MaNhanVien) references NhanVien(MaNhanVien)
 )

 create table KhachHang
(
	MaKhachHang varchar(6) primary key,
	TenKhachHang varchar(255),
	SoDT varchar(10),
	CCCD varchar(12),
	Email varchar(255),
)

create table LoaiCongTrinh
(
	MaLoaiCongTrinh varchar(6) primary key,
	TenLoaiCongTrinh nvarchar(255)
)

create table LoaiBaoGia
(
	MaLoai int primary key,
	TenLoai nvarchar(255),
)

create table BangBaoGia
(
	MaBaoGia int primary key,
	TenBaoGia nvarchar(255),
	TrangThai nvarchar(255),
	MaLoai int
	constraint fk_BangBaoGia_LoaiBaoGia foreign key (MaLoai) references LoaiBaoGia(MaLoai)
)

create table CongTrinh
(
	MaCongTrinh varchar(6) primary key,
	TenCongTrinh nvarchar(255),
	Dientich float, 
	FileThietKe varchar(255),
	MaKhachHang varchar(6),
	MaHopDong varchar(6),
	MaLoaiCongTrinh varchar(6),
	NgayDuKienHoanThanh datetime
	constraint fk_CongTrinh_KhachHang foreign key (MaKhachHang) references KhachHang(MaKhachHang),
	constraint fk_CongTrinh_HopDong foreign key (MaKhachHang) references HopDong(MaHopDong),
	constraint fk_CongTrinh_LoaiCongTrinh foreign key (MaLoaiCongTrinh) references LoaiCongTrinh(MaLoaiCongTrinh)
)

create table ChiTietBaoGia
(
	MaChiTietBaoGia int primary key, 
	MaBaoGia int,
	MaCongTrinh varchar(6),
	GiaThapNhat float,
	GiaCaoNhat float
	constraint fk_ChiTietBaoGia_CongTrinh foreign key (MaCongTrinh) references CongTrinh(MaCongTrinh),
	constraint fk_ChiTietBaoGia_BaoGia foreign key (MaBaoGia) references BangBaoGia(MaBaoGia)
)

create table BangBaoCaoTienDo
(
	MaTienDo int primary key,
	ThoiGianHoanThanhThucTe DateTime,
	NoiDungCongViec nvarchar(255),
	NgayBaoCao DateTime,
	TrangThai int,
	TiLeHoanThanh float,
	HinhAnhTienDo varchar(255),
	MaCongTrinh varchar(6),
	constraint fk_CongTrinh_TienDo foreign key(MaCongTrinh) references CongTrinh(MaCongTrinh)
)

 create table BangPhanCong
 (
	MaBangPhanCong int primary key,
	MaCongTrinh varchar(6),
	MaNhanVien varchar(6),
	NgayThamGia Date,
	NgayKetThuc Date,
	SoNgayThamGia int
	constraint fk_BangPhanCong_CongTrinh foreign key (MaCongTrinh) references CongTrinh(MaCongTrinh),
	constraint fk_BangPhanCong_NhanVien foreign key (MaNhanVien) references NhanVien(MaNhanVien)
 )

create table NhaCungCap
(
	MaNhaCungCap varchar(6) primary key,
	TenNhaCungCap nvarchar(255),
	SoDT varchar(11),
	DiaChi nvarchar(255),
	LoaiHinhCungCap nvarchar(255)
)

create table LoaiThietBiVatTu 
(
	MaLoaiThietBiVatTu int primary key,
	TenLoai nvarchar(255),
	DonViTinh nvarchar(20)
)

create table ThietBiVatTu 
(
	MaThietBiVatTu int primary key,
	TenThietBiVatTu nvarchar(255),
	SoLuongTon float,
	TrangThai nvarchar(255),
	MaLoaiThietBiVatTu int,
	MaNhaCungCap varchar(6)
	constraint fk_ThietBiVatTu_NhaCungCap foreign key (MaNhaCungCap) references NhaCungCap(MaNhaCungCap),
	constraint fk_ThietBiVatTu_LoaiThietBiVatTu foreign key (MaLoaiThietBiVatTu) references LoaiThietBiVatTu(MaLoaiThietBiVatTu)
)

create table PhieuNhap
(
	MaPhieuNhap int primary key,
	NgayNhap DateTime,
	TongTien float,
	TrangThai nvarchar(50),
	MaNhaCungCap varchar(6),
	MaNhanVien varchar(6)
	constraint fk_PhieuNhap_NhaCungCap foreign key (MaNhaCungCap) references NhaCungCap(MaNhaCungCap),
	constraint fk_PhieuNhap_NhanVien foreign key (MaNhanVien) references NhanVien(MaNhanVien)
)

create table ChiTietPhieuNhap
(
	MaChiTietPhieuNhap int primary key,
	MaPhieuNhap int,
	MaThietBiVatTu int,
	SoLuong float,
	DonGia float
	constraint fk_ChiTietPhieuNhap_PhieuNhap foreign key (MaPhieuNhap) references PhieuNhap(MaPhieuNhap),
	constraint fk_ChiTietPhieuNhap_ThietBiVatTu foreign key (MaThietBiVatTu) references ThietBiVatTu(MaThietBiVatTu)
)

create table ChiTietThiCong
(
	MaChiTietThiCong int primary key,
	MaCongTrinh varchar(6),
	MaThietBiVatTu int,
	TrangThai nvarchar(50),
	NgayRoiKho Datetime,
	NgayHoanKho Datetime
	constraint fk_ChiTietThiCong_ThietBiVatTu foreign key (MaThietBiVatTu) references ThietBiVatTu(MaThietBiVatTu),
	constraint fk_ChiTietThiCong_CongTrinh foreign key (MaCongTrinh) references CongTrinh(MaCongTrinh),
)