INSERT INTO LoaiNhanVien (MaLoaiNhanVien, TenLoai) VALUES
('AD', 'Admin'),
('GD', 'Giám đốc'),
('KT', 'Kế toán'),
('NS', 'Nhân sự'),
('QL', 'Quản lý công trình'),
('TC', 'Thợ chính'),
('TP', 'Thợ phụ');
INSERT INTO NhanVien (MaNhanVien, TenNhanVien, SoDT, CCCD, Email, NgayVao, MaLoaiNhanVien) VALUES
('AD001', 'Nguyễn Văn Admin', '0901234567', '079123456789', 'admin@congty.com', '2020-01-01', 'AD'),
('GD001', 'Trần Thị Giám Đốc', '0912345678', '079234567890', 'giamdoc@congty.com', '2019-01-01', 'GD'),
('KT001', 'Lê Văn Kế Toán', '0923456789', '079345678901', 'ketoan@congty.com', '2020-03-15', 'KT'),
('NS001', 'Phạm Thị Nhân Sự', '0934567890', '079456789012', 'nhansu@congty.com', '2020-05-10', 'NS'),
('QL001', 'Hoàng Quản Lý', '0945678901', '079567890123', 'quanly1@congty.com', '2020-02-20', 'QL'),
('QL002', 'Lý Thị Quản Lý', '0956789012', '079678901234', 'quanly2@congty.com', '2020-06-15', 'QL'),
('TC001', 'Trịnh Văn Thợ', '0967890123', '079789012345', 'thochinh1@congty.com', '2020-07-10', 'TC'),
('TC002', 'Đặng Thợ Chính', '0978901234', '079890123456', 'thochinh2@congty.com', '2020-08-05', 'TC'),
('TP001', 'Ngô Văn Phụ', '0989012345', '079901234567', 'thophu1@congty.com', '2020-09-01', 'TP'),
('TP002', 'Mai Thị Phụ', '0990123456', '079012345678', 'thophu2@congty.com', '2020-10-10', 'TP');
INSERT INTO TaiKhoan (MaTaiKhoan, MatKhau, MaNhanVien) VALUES
('TK001', MD5('admin123'), 'AD001'),
('TK002', MD5('giamdoc123'), 'GD001'),
('TK003', MD5('ketoan123'), 'KT001'),
('TK004', MD5('nhansu123'), 'NS001'),
('TK005', MD5('quanly123'), 'QL001'),
('TK006', MD5('quanly456'), 'QL002'),
('TK007', MD5('thochinh123'), 'TC001'),
('TK008', MD5('thochinh456'), 'TC002'),
('TK009', MD5('thophu123'), 'TP001'),
('TK010', MD5('thophu456'), 'TP002');
INSERT INTO BangChamCong (MaChamCong, SoNgayLam, KyLuong, MaNhanVien) VALUES
('CC001', 26.5, 202401, 'AD001'),
('CC002', 25.0, 202401, 'GD001'),
('CC003', 24.5, 202401, 'KT001'),
('CC004', 26.0, 202401, 'NS001'),
('CC005', 22.0, 202401, 'QL001'),
('CC006', 23.5, 202401, 'QL002'),
('CC007', 28.0, 202401, 'TC001'),
('CC008', 27.5, 202401, 'TC002'),
('CC009', 20.0, 202401, 'TP001'),
('CC010', 19.5, 202401, 'TP002');
INSERT INTO HopDong (MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien) VALUES
('HD001', '2023-01-15', N'Hợp đồng quản lý công trình số 1', 50000000, 'F001', 'QL001'),
('HD002', '2023-02-20', N'Hợp đồng nhân sự hỗ trợ dự án A', 30000000, 'F002', 'NS001'),
('HD003', '2023-03-10', N'Hợp đồng cung cấp dịch vụ kế toán', 20000000, 'F003', 'KT001'),
('HD004', '2023-04-05', N'Hợp đồng quản trị hệ thống', 45000000, 'F004', 'AD001'),
('HD005', '2023-05-18', N'Hợp đồng giám sát thi công công trình B', 60000000, 'F005', 'QL002'),
('HD006', '2023-06-22', N'Hợp đồng hỗ trợ kỹ thuật cơ khí', 25000000, 'F006', 'TC001'),
('HD007', '2023-07-14', N'Hợp đồng đào tạo nhân viên mới', 15000000, 'F007', 'GD001'),
('HD008', '2023-08-01', N'Hợp đồng phụ việc công trình C', 18000000, 'F008', 'TP001'),
('HD009', '2023-09-09', N'Hợp đồng bảo trì hệ thống phần mềm', 22000000, 'F009', 'AD001'),
('HD010', '2023-10-30', N'Hợp đồng thuê ngoài dịch vụ hỗ trợ', 17000000, 'F010', 'TP002');
INSERT INTO KhachHang (MaKhachHang, TenKhachHang, SoDT, CCCD, Email) VALUES
('KH001', 'Nguyễn Văn A', '0911111111', '012345678901', 'nguyenvana@gmail.com'),
('KH002', 'Trần Thị B', '0922222222', '012345678902', 'tranthib@yahoo.com'),
('KH003', 'Lê Văn C', '0933333333', '012345678903', 'levanc@hotmail.com'),
('KH004', 'Phạm Thị D', '0944444444', '012345678904', 'phamthid@gmail.com'),
('KH005', 'Đỗ Mạnh E', '0955555555', '012345678905', 'domane@example.com'),
('KH006', 'Vũ Thị F', '0966666666', '012345678906', 'vuthif@outlook.com'),
('KH007', 'Hoàng Văn G', '0977777777', '012345678907', 'hoangvang@gmail.com'),
('KH008', 'Ngô Thị H', '0988888888', '012345678908', 'ngothih@yahoo.com'),
('KH009', 'Mai Văn I', '0999999999', '012345678909', 'maivani@mail.com'),
('KH010', 'Bùi Thị J', '0900000000', '012345678910', 'buithij@gmail.com');
INSERT INTO LoaiCongTrinh (MaLoaiCongTrinh, TenLoaiCongTrinh) VALUES
('CT001', N'Nhà ở dân dụng'),
('CT002', N'Công trình công nghiệp'),
('CT003', N'Văn phòng'),
('CT004', N'Cầu đường'),
('CT005', N'Khu nghỉ dưỡng');
INSERT INTO LoaiBaoGia (MaLoai, TenLoai) VALUES
('LBG001', N'Báo giá thi công'),
('LBG002', N'Báo giá vật liệu'),
('LBG003', N'Báo giá nhân công'),
('LBG004', N'Báo giá dịch vụ bảo trì');
INSERT INTO BangBaoGia (MaBaoGia, TenBaoGia, TrangThai, MaLoai) VALUES
('BG001', N'Báo giá thi công nhà phố', N'Đã duyệt', 'BG01'),
('BG002', N'Báo giá vật liệu xây dựng A', N'Chờ duyệt', 'BG02'),
('BG003', N'Báo giá nhân công công trình B', N'Từ chối', 'BG03'),
('BG004', N'Báo giá dịch vụ bảo trì năm 2025', N'Đã duyệt', 'BG04'),
('BG005', N'Báo giá thi công biệt thự', N'Chờ duyệt', 'BG01');
INSERT INTO CongTrinh (MaCongTrinh, TenCongTrinh, DienTich, FileThietKe, MaKhachHang, MaHopDong, MaLoaiCongTrinh, NgayDuKienHoanThanh) VALUES
('CT001', N'Nhà phố anh A', 120.5, 'file1.pdf', 'KH001', 'HD001', 'CT001', '2024-12-31'),
('CT002', N'Văn phòng công ty B', 300.0, 'file2.pdf', 'KH002', 'HD002', 'CT003', '2025-03-15'),
('CT003', N'Nhà xưởng C', 800.0, 'file3.pdf', 'KH003', 'HD003', 'CT002', '2025-06-30');
INSERT INTO ChiTietBaoGia (MaChiTietBaoGia, MaBaoGia, MaCongTrinh, GiaThapNhat, GiaCaoNhat) VALUES
(1, 'BG001', 'CT001', 45000000, 55000000),
(2, 'BG002', 'CT002', 28000000, 35000000),
(3, 'BG003', 'CT003', 70000000, 90000000);
INSERT INTO BangBaoCaoTienDo (MaTienDo, ThoiGianHoanThanhThucTe, NoiDungCongViec, NgayBaoCao, TrangThai, TiLeHoanThanh, HinhAnhTienDo, MaCongTrinh) VALUES
('TD001', '2024-05-01 10:00:00', N'Đào móng', '2024-05-01', 1, 10, 'hinh1.jpg', 'CT001'),
('TD002', '2024-05-15 15:30:00', N'Đổ bê tông tầng 1', '2024-05-15', 1, 30, 'hinh2.jpg', 'CT001'),
('TD003', '2024-06-01 11:00:00', N'Lắp đặt khung thép', '2024-06-01', 0, 50, 'hinh3.jpg', 'CT002');
INSERT INTO BangPhanCong (MaBangPhanCong, MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) VALUES
('PC001', 'CT001', 'TC001', '2024-04-01', '2024-04-10', 10),
('PC002', 'CT001', 'TP001', '2024-04-05', '2024-04-15', 11),
('PC003', 'CT002', 'TC002', '2024-05-01', '2024-05-12', 12),
('PC004', 'CT002', 'TP002', '2024-05-03', '2024-05-20', 18),
('PC005', 'CT003', 'QL001', '2024-06-01', '2024-06-30', 30);
INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, SoDT, DiaChi, LoaiHinhCungCap) VALUES
('NCC001', N'Công ty Vật liệu Xây dựng A', '0901122334', N'123 Nguyễn Trãi, Q1, TP.HCM', N'Vật liệu xây thô'),
('NCC002', N'Công ty Thiết bị Điện B', '0911223344', N'456 Lê Lợi, Q3, TP.HCM', N'Thiết bị điện'),
('NCC003', N'Cửa hàng Sơn C', '0922334455', N'789 CMT8, Q10, TP.HCM', N'Sơn và hóa chất'),
('NCC004', N'Nhà máy Xi măng D', '0933445566', N'KCN Long Thành, Đồng Nai', N'Xi măng'),
('NCC005', N'Công ty Nội thất E', '0944556677', N'12 Trường Chinh, Q.Tân Bình, TP.HCM', N'Nội thất và trang trí');
INSERT INTO LoaiThietBiVatTu (MaLoaiThietBiVatTu, TenLoai, DonViTinh) VALUES
('TB001', N'Thép xây dựng', N'kg'),
('TB002', N'Gạch ống', N'viên'),
('TB003', N'Xi măng', N'bao'),
('TB004', N'Sơn nước', N'lít'),
('TB005', N'Đèn chiếu sáng', N'cái');
INSERT INTO ThietBiVatTu (MaThietBiVatTu, TenThietBiVatTu, SoLuongTon, TrangThai, MaLoaiThietBiVatTu, MaNhaCungCap) VALUES
('TBV001', N'Thép Việt Nhật 16mm', 2000, N'Còn hàng', 'TB001', 'NCC001'),
('TBV002', N'Gạch Tuynel Bình Dương', 10000, N'Còn hàng', 'TB002', 'NCC001'),
('TBV003', N'Xi măng Hà Tiên', 500, N'Còn hàng', 'TB003', 'NCC004'),
('TBV004', N'Sơn Dulux ngoại thất', 150, N'Còn hàng', 'TB004', 'NCC003'),
('TBV005', N'Đèn LED tròn 18W', 300, N'Còn hàng', 'TB005', 'NCC002');
INSERT INTO PhieuNhap (MaPhieuNhap, NgayNhap, TongTien, TrangThai, MaNhaCungCap, MaNhanVien) VALUES
('PN001', '2024-04-01', 50000000, N'Đã nhập', 'NCC001', 'KT001'),
('PN002', '2024-04-10', 35000000, N'Đã nhập', 'NCC003', 'KT001'),
('PN003', '2024-04-15', 40000000, N'Đã nhập', 'NCC004', 'KT001');
INSERT INTO ChiTietPhieuNhap (MaChiTietPhieuNhap, MaPhieuNhap, MaThietBiVatTu, SoLuong, DonGia) VALUES
(1, 'PN001', 'TBV001', 1000, 40000),
(2, 'PN001', 'TBV002', 5000, 2000),
(3, 'PN002', 'TBV004', 100, 250000),
(4, 'PN003', 'TBV003', 300, 80000),
(5, 'PN001', 'TBV005', 200, 120000);
INSERT INTO ChiTietThiCong (MaChiTietThiCong, MaCongTrinh, MaThietBiVatTu, TrangThai, NgayRoiKho, NgayHoanKho) VALUES
(1, 'CT001', 'TBV001', N'Đang sử dụng', '2024-04-05', NULL),
(2, 'CT001', 'TBV002', N'Đang sử dụng', '2024-04-06', NULL),
(3, 'CT002', 'TBV004', N'Đã hoàn thành', '2024-04-10', '2024-04-25'),
(4, 'CT002', 'TBV003', N'Đã hoàn thành', '2024-04-12', '2024-04-20'),
(5, 'CT003', 'TBV005', N'Đang sử dụng', '2024-04-18', NULL);


