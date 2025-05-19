INSERT INTO LoaiNhanVien (TenLoai) VALUES
('Admin'),
('Giám đốc'),
('Kế toán'),
('Nhân sự'),
('Quản lý công trình'),
('Thợ chính'),
('Thợ phụ'),
('Nhân viên kho'),
('Nhân viên tư vấn');

-- Bảng NhanVien (Đã sửa MaLoaiNhanVien để sử dụng số tương ứng)
INSERT INTO NhanVien (MaNhanVien, TenNhanVien, SoDT, CCCD, Email, NgayVao, LuongCanBan, MaLoaiNhanVien) VALUES
('AD001', 'Nguyễn Văn Admin', '0901234567', '079123456789', 'admin@congty.com', '2020-01-01', 15000000, 1),
('GD001', 'Trần Thị Giám Đốc', '0912345678', '079234567890', 'giamdoc@congty.com', '2019-01-01', 20000000, 2),
('KT001', 'Lê Văn Kế Toán', '0923456789', '079345678901', 'ketoan@congty.com', '2020-03-15', 12000000, 3),
('NS001', 'Phạm Thị Nhân Sự', '0934567890', '079456789012', 'nhansu@congty.com', '2020-05-10', 10000000, 4),
('QL001', 'Hoàng Quản Lý', '0945678901', '079567890123', 'quanly1@congty.com', '2020-02-20', 15000000, 5),
('QL002', 'Lý Thị Quản Lý', '0956789012', '079678901234', 'quanly2@congty.com', '2020-06-15', 15000000, 5),
('TC001', 'Trịnh Văn Thợ', '0967890123', '079789012345', 'thochinh1@congty.com', '2020-07-10', 8000000, 6),
('TC002', 'Đặng Thợ Chính', '0978901234', '079890123456', 'thochinh2@congty.com', '2020-08-05', 8000000, 6),
('TP001', 'Ngô Văn Phụ', '0989012345', '079901234567', 'thophu1@congty.com', '2020-09-01', 6000000, 7),
('TP002', 'Mai Thị Phụ', '0990123456', '079012345678', 'thophu2@congty.com', '2020-10-10', 6000000, 7),
('K001', 'Phạm Văn Kho', '0901111222', '079222333444', 'kho1@congty.com', '2021-01-15', 7000000, 8),
('K002', 'Trần Thị Kho', '0902222333', '079333444555', 'kho2@congty.com', '2021-03-20', 7000000, 8),
('TV001', 'Lê Văn Tư Vấn', '0903333444', '079444555666', 'tuvan1@congty.com', '2021-02-10', 9000000, 9),
('TV002', 'Nguyễn Thị Tư Vấn', '0904444555', '079555666777', 'tuvan2@congty.com', '2021-04-25', 9000000, 9);

-- Bảng NhaCungCap (Suppliers)
INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, SoDT, Email, DiaChi, LoaiHinhCungCap) VALUES
('NCC001', 'Công ty TNHH Vật liệu Xây dựng ABC', '0987654321', 'abc@example.com', 'Quận 12, TP.HCM', 'Vật liệu xây dựng'),
('NCC002', 'Công ty CP Thiết bị Nội thất XYZ', '0976543210', 'xyz@example.com', 'Quận Bình Thạnh, TP.HCM', 'Thiết bị nội thất'),
('NCC003', 'Cơ sở Sắt thép Hưng Thịnh', '0965432109', 'hungthinh@example.com', 'Quận 9, TP.HCM', 'Sắt thép xây dựng');

-- Bảng DeXuat (Proposals)
INSERT INTO DeXuat (MaDeXuat, NgayLap, NgayGiaoDuKien, NgayDuyet, MaNhanVien, LoaiDeXuat, TrangThai, GhiChu) VALUES
('DX001', '2023-01-10', '2023-01-15', NULL, 'QL001', 'Vật tư', 'Chờ duyệt', 'Đề xuất mua thêm xi măng'),
('DX002', '2023-02-05', '2023-02-10', '2023-02-08', 'QL002', 'Thiết bị', 'Đã duyệt', 'Đề xuất mua máy khoan mới'),
('DX003', '2023-03-15', '2023-03-20', NULL, 'K001', 'Vật tư', 'Chờ duyệt', 'Đề xuất mua thêm gạch');

-- Bảng TaiKhoan (Không cần sửa đổi)
INSERT INTO TaiKhoan (MaTaiKhoan, MatKhau, MaNhanVien) VALUES
('TK001', MD5('123'), 'AD001'),
('TK002', MD5('123'), 'GD001'),
('TK003', MD5('123'), 'KT001'),
('TK004', MD5('123'), 'NS001'),
('TK005', MD5('123'), 'QL001'),
('TK006', MD5('123'), 'QL002'),
('TK007', MD5('123'), 'TC001'),
('TK008', MD5('123'), 'TC002'),
('TK009', MD5('123'), 'TP001'),
('TK010', MD5('123'), 'TP002'),
('TK011', MD5('123'), 'K001'),
('TK012', MD5('123'), 'K002'),
('TK013', MD5('123'), 'TV001'),
('TK014', MD5('123'), 'TV002');

-- Bảng LoaiCongTrinh (Construction Types)
INSERT INTO LoaiCongTrinh (TenLoaiCongTrinh) VALUES
('Nhà phố'),
('Biệt thự'),
('Căn hộ');

-- Bảng LoaiBaoGia (Quotation Types)
INSERT INTO LoaiBaoGia (TenLoai) VALUES
('Xây dựng cơ bản'),
('Nội thất'),
('Trọn gói');

-- Bảng LoaiThietBiVatTu (Equipment/Material Types)
INSERT INTO LoaiThietBiVatTu (TenLoai, DonViTinh) VALUES
('Xi măng', 'Bao'),
('Gạch', 'Viên'),
('Cát', 'M³');

-- Bảng BangChamCong (Timesheet)
INSERT INTO BangChamCong (MaChamCong, SoNgayLam, KyLuong, MaNhanVien) VALUES
('CC001', 22, 5, 'TC001'),
('CC002', 20, 5, 'TC002'),
('CC003', 21, 5, 'TP001');

INSERT INTO HopDong (MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, MaNhanVien, TrangThai, GhiChu) VALUES
('HD001', '2023-01-15', 'Hợp đồng xây dựng nhà phố 3 tầng', 1500000000, 'HD001', 'GD001', 'Đã Duyệt', 'Khách hàng đã ký hợp đồng.'),
('HD002', '2023-02-20', 'Hợp đồng thiết kế và thi công biệt thự', 3500000000, 'HD002', 'GD001', 'Chờ Duyệt', 'Đang chờ giám đốc xem xét.'),
('HD003', '2023-03-10', 'Hợp đồng cải tạo căn hộ', 800000000, 'HD003', 'TV001', 'Từ Chối', 'Không đạt yêu cầu về ngân sách.');

-- Bảng KhachHang (Customers)
INSERT INTO KhachHang (MaKhachHang, TenKhachHang, SoDT, CCCD, Email) VALUES
('KH001', 'Trần Văn Khách', '0912345000', '079123000000', 'khach1@gmail.com'),
('KH002', 'Nguyễn Thị Hàng', '0923456000', '079234000000', 'khach2@gmail.com'),
('KH003', 'Lê Văn Người', '0934567000', '079345000000', 'khach3@gmail.com');

-- Bảng BangBaoGia (Quotations)
INSERT INTO BangBaoGia (MaBaoGia, TenBaoGia, TrangThai, MaLoai) VALUES
('BG001', 'Báo giá xây dựng nhà phố', 'Đã duyệt', 1),
('BG002', 'Báo giá thiết kế nội thất biệt thự', 'Đã duyệt', 2),
('BG003', 'Báo giá trọn gói căn hộ', 'Chờ duyệt', 3);

-- Bảng CongTrinh (Construction Projects)
INSERT INTO CongTrinh (MaCongTrinh, TenCongTrinh, Dientich, FileThietKe, MaKhachHang, MaHopDong, MaLoaiCongTrinh, NgayDuKienHoanThanh) VALUES
('CT001', 'Nhà phố Quận 7', 120, 'TK001', 'KH001', 'HD001', 1, '2023-07-15'),
('CT002', 'Biệt thự Thủ Đức', 350, 'TK002', 'KH002', 'HD002', 2, '2023-12-20'),
('CT003', 'Căn hộ Quận 2', 85, 'TK003', 'KH003', 'HD003', 3, '2023-06-10');

INSERT INTO ChiTietBaoGia (MaChiTietBaoGia, MaBaoGia, MaCongTrinh, GiaBaoGia, NoiDung) VALUES 
(1, 'BG001', 'CT001', 25000000, 'Lót gạch'),
(2, 'BG001', 'CT002', 18000000, 'Đổ Bê tông'),
(3, 'BG002', 'CT003', 21000000, 'Xây nhà vệ sinh');

-- Bảng BangBaoCaoTienDo (Progress Reports)
INSERT INTO BangBaoCaoTienDo (MaTienDo, ThoiGianHoanThanhThucTe, CongViec, NoiDungCongViec, NgayBaoCao, TrangThai, TiLeHoanThanh, HinhAnhTienDo, MaCongTrinh) VALUES
('TD001', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-02-15', 1, 0.2, 'anh_mong.jpg', 'CT001'),
('TD002', NULL, 'Khung sườn', 'Đã hoàn thành 50% khung sườn', '2023-04-20', 1, 0.4, 'anh_khung.jpg', 'CT001'),
('TD003', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-03-10', 1, 0.1, 'anh_mong_bt.jpg', 'CT002');

-- Bảng BangPhanCong (Work Assignments)
INSERT INTO BangPhanCong (MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) VALUES
('CT001', 'TC001', '2023-01-20', '2023-07-15', 120),
('CT001', 'TP001', '2023-01-20', '2023-07-15', 120),
('CT002', 'TC002', '2023-03-01', '2023-12-20', 200);

-- Bảng ThietBiVatTu (Equipment/Materials)
INSERT INTO ThietBiVatTu (MaThietBiVatTu, TenThietBiVatTu, SoLuongTon, TrangThai, MaLoaiThietBiVatTu, MaNhaCungCap) VALUES
('TBVT001', 'Xi măng Hà Tiên', 100, 'Sẵn sàng', 1, 'NCC001'),
('TBVT002', 'Gạch ống Tuynel', 5000, 'Sẵn sàng', 2, 'NCC001'),
('TBVT003', 'Cát xây dựng', 20, 'Sẵn sàng', 3, 'NCC001');

-- Bảng PhieuNhap (Import Receipts)
INSERT INTO PhieuNhap (MaPhieuNhap, NgayNhap, TongTien, TrangThai, MaNhaCungCap, MaNhanVien) VALUES
('PN001', '2023-01-10', 50000000, 'Đã thanh toán', 'NCC001', 'K001'),
('PN002', '2023-02-05', 30000000, 'Đã thanh toán', 'NCC002', 'K001'),
('PN003', '2023-03-15', 70000000, 'Chưa thanh toán', 'NCC003', 'K002');

-- Bảng ChiTietPhieuNhap (Import Receipt Details)
INSERT INTO ChiTietPhieuNhap (MaPhieuNhap, MaThietBiVatTu, SoLuong, DonGia) VALUES
('PN001', 'TBVT001', 100, 100000),
('PN001', 'TBVT002', 5000, 5000),
('PN002', 'TBVT003', 20, 500000);

-- Bảng ChiTietThiCong (Construction Details)
INSERT INTO ChiTietThiCong (MaCongTrinh, MaThietBiVatTu, TrangThai, NgayRoiKho, NgayHoanKho) VALUES
('CT001', 'TBVT001', 'Đã xuất kho', '2023-01-25', NULL),
('CT001', 'TBVT002', 'Đã xuất kho', '2023-01-25', NULL),
('CT002', 'TBVT003', 'Đã xuất kho', '2023-03-05', NULL); 