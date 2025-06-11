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
('AD001', 'Nguyễn Văn Admin', '0901234567', '079123456789', 'admin@congty.com', '2020-01-01', 5500000, 1),
('GD001', 'Trần Thị Giám Đốc', '0912345678', '079234567890', 'giamdoc@congty.com', '2019-01-01', 5500000, 2),
('KT001', 'Lê Văn Kế Toán', '0923456789', '079345678901', 'ketoan@congty.com', '2020-03-15', 5500000, 3),
('NS001', 'Phạm Thị Nhân Sự', '0934567890', '079456789012', 'nhansu@congty.com', '2020-05-10', 5500000, 4),
('QL001', 'Hoàng Quản Lý', '0945678901', '079567890123', 'quanly1@congty.com', '2020-02-20', 5500000, 5),
('QL002', 'Lý Thị Quản Lý', '0956789012', '079678901234', 'quanly2@congty.com', '2020-06-15', 5500000, 5),
('TC001', 'Trịnh Văn Thợ', '0967890123', '079789012345', 'thochinh1@congty.com', '2020-07-10', 0, 6),
('TC002', 'Đặng Thợ Chính', '0978901234', '079890123456', 'thochinh2@congty.com', '2020-08-05', 0, 6),
('TP001', 'Ngô Văn Phụ', '0989012345', '079901234567', 'thophu1@congty.com', '2020-09-01', 0, 7),
('TP002', 'Mai Thị Phụ', '0990123456', '079012345678', 'thophu2@congty.com', '2020-10-10', 0, 7),
('K001', 'Phạm Văn Kho', '0901111222', '079222333444', 'kho1@congty.com', '2021-01-15', 5500000, 8),
('K002', 'Trần Thị Kho', '0902222333', '079333444555', 'kho2@congty.com', '2021-03-20', 5500000, 8),
('TV001', 'Lê Văn Tư Vấn', '0903333444', '079444555666', 'tuvan1@congty.com', '2021-02-10', 5500000, 9),
('TV002', 'Nguyễn Thị Tư Vấn', '0904444555', '079555666777', 'tuvan2@congty.com', '2021-04-25', 5500000, 9);

-- Bảng NhaCungCap (Suppliers)
INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, SoDT, Email, DiaChi, LoaiHinhCungCap) VALUES
('NCC001', 'Công ty TNHH Vật liệu Xây dựng ABC', '0987654321', 'abc@example.com', 'Quận 12, TP.HCM', 'Vật liệu xây dựng'),
('NCC002', 'Công ty CP Thiết bị Nội thất XYZ', '0976543210', 'xyz@example.com', 'Quận Bình Thạnh, TP.HCM', 'Thiết bị nội thất'),
('NCC003', 'Cơ sở Sắt thép Hưng Thịnh', '0965432109', 'hungthinh@example.com', 'Quận 9, TP.HCM', 'Sắt thép xây dựng');

-- Bảng DeXuat (Proposals)
-- Để trống theo cấu trúc mới

-- Bảng ChiTietDeXuat (Proposal Details)
-- Để trống theo cấu trúc mới

-- Bảng PhieuNhap (Import Receipts)
-- Để trống theo cấu trúc mới

-- Bảng ChiTietPhieuNhap (Import Receipt Details)
-- Để trống theo cấu trúc mới

-- Bảng ChiTietThiCong (Construction Details)
INSERT INTO ChiTietThiCong (MaCongTrinh, MaThietBiVatTu, TrangThai, NgayRoiKho, NgayHoanKho) VALUES
('CT001', 'TBVT001', 'Đã xuất kho', '2023-01-25', NULL),
('CT001', 'TBVT002', 'Đã xuất kho', '2023-01-25', NULL),
('CT002', 'TBVT003', 'Đã xuất kho', '2023-03-05', NULL);

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
('Cát', 'm³'),
('Đá', 'm³'),
('Bê tông', 'm³'),
('Tôn', 'Tấm'),
('Ngói', 'Viên'),
('Sơn', 'Thùng'),
('Ống nhựa', 'm');

-- Bảng BangChamCong (Timesheet)
DELETE FROM BangChamCong WHERE DATE(KyLuong) = '2025-06-05';

-- Thêm dữ liệu chấm công mới cho các nhân viên không phải thợ
-- Mỗi nhân viên: 7 ngày tháng 5/2025 (Đã thanh toán), 7 ngày tháng 6/2025 (Chưa thanh toán)
-- Loại chấm công luân phiên: Ngày thường, Cuối tuần, Ngày lễ

INSERT INTO BangChamCong (MaChamCong, SoNgayLam, KyLuong, TrangThai, GioVao, GioRa, LoaiChamCong, MaNhanVien) VALUES
-- Admin (AD001)
('CC100001', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
('CC100002', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'AD001'),
('CC100003', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'AD001'),
('CC100004', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
('CC100005', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'AD001'),
('CC100006', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
('CC100007', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
('CC100008', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'AD001'),
('CC100009', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'AD001'),
('CC100010', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
('CC100011', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'AD001'),
('CC100012', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'AD001'),
('CC100013', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'AD001'),
-- Giám đốc (GD001)
('CC100014', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
('CC100015', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'GD001'),
('CC100016', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'GD001'),
('CC100017', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
('CC100018', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'GD001'),
('CC100019', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
('CC100020', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
('CC100021', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'GD001'),
('CC100022', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'GD001'),
('CC100023', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
('CC100024', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'GD001'),
('CC100025', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'GD001'),
('CC100026', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'GD001'),
-- Kế toán (KT001)
('CC100027', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
('CC100028', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'KT001'),
('CC100029', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'KT001'),
('CC100030', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
('CC100031', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'KT001'),
('CC100032', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
('CC100033', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
('CC100034', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'KT001'),
('CC100035', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'KT001'),
('CC100036', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
('CC100037', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'KT001'),
('CC100038', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'KT001'),
('CC100039', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'KT001'),
-- Nhân sự (NS001)
('CC100040', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
('CC100041', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'NS001'),
('CC100042', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'NS001'),
('CC100043', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
('CC100044', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'NS001'),
('CC100045', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
('CC100046', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
('CC100047', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'NS001'),
('CC100048', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'NS001'),
('CC100049', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
('CC100050', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'NS001'),
('CC100051', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'NS001'),
('CC100052', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'NS001'),
-- Quản lý công trình (QL001)
('CC100053', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
('CC100054', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL001'),
('CC100055', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL001'),
('CC100056', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
('CC100057', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL001'),
('CC100058', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
('CC100059', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
('CC100060', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL001'),
('CC100061', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL001'),
('CC100062', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
('CC100063', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL001'),
('CC100064', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL001'),
('CC100065', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL001'),
-- Quản lý công trình (QL002)
('CC100066', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
('CC100067', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL002'),
('CC100068', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL002'),
('CC100069', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
('CC100070', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL002'),
('CC100071', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
('CC100072', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
('CC100073', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL002'),
('CC100074', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL002'),
('CC100075', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
('CC100076', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'QL002'),
('CC100077', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'QL002'),
('CC100078', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'QL002'),
-- Nhân viên kho (K001)
('CC100079', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
('CC100080', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K001'),
('CC100081', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K001'),
('CC100082', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
('CC100083', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K001'),
('CC100084', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
('CC100085', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
('CC100086', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K001'),
('CC100087', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K001'),
('CC100088', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
('CC100089', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K001'),
('CC100090', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K001'),
('CC100091', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K001'),
-- Nhân viên kho (K002)
('CC100092', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
('CC100093', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K002'),
('CC100094', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K002'),
('CC100095', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
('CC100096', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K002'),
('CC100097', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
('CC100098', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
('CC100099', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K002'),
('CC100100', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K002'),
('CC100101', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
('CC100102', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'K002'),
('CC100103', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'K002'),
('CC100104', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'K002'),
-- Nhân viên tư vấn (TV001)
('CC100105', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
('CC100106', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV001'),
('CC100107', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV001'),
('CC100108', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
('CC100109', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV001'),
('CC100110', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
('CC100111', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
('CC100112', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV001'),
('CC100113', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV001'),
('CC100114', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
('CC100115', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV001'),
('CC100116', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV001'),
('CC100117', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV001'),
-- Nhân viên tư vấn (TV002)
('CC100118', 1, '2025-05-01', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002'),
('CC100119', 1, '2025-05-02', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV002'),
('CC100120', 1, '2025-05-03', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV002'),
('CC100121', 1, '2025-05-04', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002'),
('CC100122', 1, '2025-05-05', 'Đã thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV002'),
('CC100123', 1, '2025-05-07', 'Đã thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002'),
('CC100124', 1, '2025-06-01', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002'),
('CC100125', 1, '2025-06-02', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV002'),
('CC100126', 1, '2025-06-03', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV002'),
('CC100127', 1, '2025-06-04', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002'),
('CC100128', 1, '2025-06-05', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Cuối tuần', 'TV002'),
('CC100129', 1, '2025-06-06', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày lễ', 'TV002'),
('CC100130', 1, '2025-06-07', 'Chưa thanh toán', '08:00:00', '17:00:00', 'Ngày thường', 'TV002');

INSERT INTO HangMuc (TenHangMuc, DonViTinh, CongTho, GiaTien) VALUES
('Lót gạch', 'm²', 0.5, 250000),
('Đổ bê tông', 'm³', 1.0, 1800000),
('Xây tường', 'm²', 0.8, 350000),
('Trát tường', 'm²', 0.3, 120000),
('Sơn tường', 'm²', 0.2, 80000),
('Lắp đặt điện', 'm²', 0.4, 150000),
('Lắp đặt nước', 'm²', 0.4, 180000),
('Lắp đặt cửa', 'cái', 0.5, 2500000),
('Lắp đặt thiết bị vệ sinh', 'bộ', 1.0, 3500000),
('Hoàn thiện nội thất', 'm²', 0.6, 450000);

-- Bảng KhachHang (Customers)
INSERT INTO KhachHang (MaKhachHang, TenKhachHang, SoDT, CCCD, Email) VALUES
('KH001', 'Trần Văn Khách', '0912345000', '079123000000', 'khach1@gmail.com'),
('KH002', 'Nguyễn Thị Hàng', '0923456000', '079234000000', 'khach2@gmail.com'),
('KH003', 'Lê Văn Người', '0934567000', '079345000000', 'khach3@gmail.com');

-- Bảng HopDong (Contracts)
INSERT INTO HopDong (MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, TrangThai, GhiChu, MaNhanVien, MaKhachHang) VALUES
('HD001', '2023-01-15', 'Hợp đồng xây dựng nhà phố 3 tầng', 1500000000, 'HD001.pdf', 'Đã duyệt', 'Khách hàng đã ký hợp đồng', 'GD001', 'KH001'),
('HD002', '2023-02-20', 'Hợp đồng thiết kế và thi công biệt thự', 3500000000, 'HD002.pdf', 'Chờ duyệt', 'Đang chờ giám đốc xem xét', 'GD001', 'KH002'),
('HD003', '2023-03-10', 'Hợp đồng cải tạo căn hộ', 800000000, 'HD003.pdf', 'Từ chối', 'Không đạt yêu cầu về ngân sách', 'TV001', 'KH003');

-- Bảng CongTrinh (Construction Projects)
INSERT INTO CongTrinh (MaCongTrinh, TenCongTrinh, Dientich, FileThietKe, DiaChi, MaHopDong, MaLoaiCongTrinh, NgayDuKienHoanThanh) VALUES
('CT001', 'Nhà phố Quận 7', 120, 'TK001.pdf', '123 Đường Nguyễn Thị Thập, Quận 7, TP.HCM', 'HD001', 1, '2023-07-15'),
('CT002', 'Biệt thự Thủ Đức', 350, 'TK002.pdf', '456 Đường Võ Văn Ngân, Thủ Đức, TP.HCM', 'HD002', 2, '2023-12-20'),
('CT003', 'Căn hộ Quận 2', 85, 'TK003.pdf', '789 Đường Nguyễn Duy Trinh, Quận 2, TP.HCM', 'HD003', 3, '2023-06-10');

-- Bảng BangBaoGia (Quotations)
INSERT INTO BangBaoGia (MaBaoGia, TenBaoGia, TrangThai, MaLoai) VALUES
('BG001', 'Báo giá xây dựng nhà phố', 'Đã duyệt', 1),
('BG002', 'Báo giá thiết kế nội thất biệt thự', 'Đã duyệt', 2),
('BG003', 'Báo giá trọn gói căn hộ', 'Chờ duyệt', 3);

-- Bảng ChiTietBaoGia (Quotation Details)
INSERT INTO ChiTietBaoGia (MaBaoGia, MaHangMuc, GiaBaoGia, NoiDung) VALUES 
('BG001', 1, 25000000, 'Lót gạch phòng khách và phòng ngủ'),
('BG001', 2, 18000000, 'Đổ bê tông móng và sàn'),
('BG002', 3, 21000000, 'Xây tường bao và vách ngăn'),
('BG002', 4, 15000000, 'Trát tường toàn bộ công trình'),
('BG003', 5, 12000000, 'Sơn tường nội thất'),
('BG003', 6, 18000000, 'Lắp đặt hệ thống điện');

-- Bảng BangBaoCaoTienDo (Progress Reports)
INSERT INTO BangBaoCaoTienDo (MaTienDo, ThoiGianHoanThanhThucTe, CongViec, NoiDungCongViec, NgayBaoCao, TrangThai, TiLeHoanThanh, HinhAnhTienDo, MaCongTrinh) VALUES
('TD001', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-02-15', 1, 0.2, 'anh_mong.jpg', 'CT001'),
('TD002', NULL, 'Khung sườn', 'Đã hoàn thành 50% khung sườn', '2023-04-20', 1, 0.4, 'anh_khung.jpg', 'CT001'),
('TD003', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-03-10', 1, 0.1, 'anh_mong_bt.jpg', 'CT002');

-- Bảng BangPhanCong (Work Assignments)
DELETE FROM BangPhanCong;
INSERT INTO BangPhanCong (MaBangPhanCong, MaCongTrinh, MaNhanVien, NgayThamGia, SoNgayThamGia) VALUES
-- TC001: Làm CT001 10 ngày và CT002 11 ngày
(1, 'CT001', 'TC001', '2025-01-01', 10),
(2, 'CT002', 'TC001', '2025-01-01', 11),
-- TP001: Làm CT001 15 ngày
(3, 'CT001', 'TP001', '2025-01-01', 15),
-- TP002: Làm CT002 12 ngày và CT001 8 ngày
(4, 'CT002', 'TP002', '2025-01-01', 12),
(5, 'CT001', 'TP002', '2025-01-01', 8);

-- Bảng ThietBiVatTu (Equipment/Materials)
INSERT INTO ThietBiVatTu (MaThietBiVatTu, TenThietBiVatTu, MaLoaiThietBiVatTu) VALUES
('TBVT001', 'Xi măng Hà Tiên', 1),
('TBVT002', 'Gạch ống Tuynel', 2),
('TBVT003', 'Cát xây dựng', 3);

-- Bảng CungUng (Supply)
INSERT INTO CungUng (MaThietBiVatTu, MaNhaCungCap, SoLuongTon, DonGia) VALUES
('TBVT001', 'NCC001', 100, 100000),
('TBVT002', 'NCC001', 5000, 5000),
('TBVT003', 'NCC001', 20, 500000);

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