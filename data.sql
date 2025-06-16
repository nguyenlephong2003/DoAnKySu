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
('TC001', 'Trịnh Văn Thợ', '0967890123', '079789012345', 'thochinh1@congty.com', '2020-07-10', 370000, 6),
('TC002', 'Đặng Thợ Chính', '0978901234', '079890123456', 'thochinh2@congty.com', '2020-08-05', 370000, 6),
('TC003', 'Đặng Thành Tâm', '0978738493', '079984498142', 'tamdt@congty.com', '2021-08-05', 350000, 6),
('TC004', 'Ngô Tuấn Phát', '0378274214', '079912734760', 'phatnt@congty.com', '2021-02-05', 350000, 6),
('TC005', 'Trương Công Lợi', '0903478341', '079432018972', 'loitc@congty.com', '2021-10-05', 350000, 6),
('TC006', 'Cao Tấn Tài', '0913089432', '079102983425', 'taict@congty.com', '2021-08-05', 350000, 6),
('TC007', 'Huỳnh Thanh Tiến', '0721089343', '079120943890', 'tienht@congty.com', '2022-03-01', 350000, 6),
('TC008', 'Nguyễn Văn Công', '0912345678', '043586372017', 'congnv@congty.com', '2022-03-02', 350000, 6),
('TC009', 'Trần Tuấn Kiệt', '0923456789', '009810610388', 'kiettt@congty.com', '2022-03-03', 350000, 6),
('TC010', 'Lê Văn Tài', '0934567890', '022107953614', 'tailv@congty.com', '2022-03-04', 340000, 6),
('TC011', 'Phạm Thành Trung', '0945678901', '070217636692', 'trungpt@congty.com', '2022-03-05', 340000, 6),
('TC012', 'Hoàng Văn Chiến', '0956789012', '043073259418', 'chienhv@congty.com', '2022-03-06', 350000, 6),
('TC013', 'Đặng Nguyên Bảo', '0967890123', '073365450521', 'baodn@congty.com', '2022-03-07', 350000, 6),
('TC014', 'Lý Văn Sung', '0978901234', '029199092231', 'sunglv@congty.com', '2022-03-08', 350000, 6),
('TC015', 'Trịnh Thành Phát', '0989012345', '094212928441', 'phattt@congty.com', '2022-03-09', 350000, 6),
('TC016', 'Tô Văn Tùng', '0990123456', '027836266990', 'tungtv@congty.com', '2022-03-10', 340000, 6),
('TC017', 'Ngô Tùng Lâm', '0901234567', '031449609686', 'lamnt@congty.com', '2022-03-11', 370000, 6),
('TC018', 'Vũ Văn Vương', '0912233445', '054839354740', 'vuongvv@congty.com', '2022-03-12', 350000, 6),
('TC019', 'Bùi Công Thành Danh', '0923344556', '067073966805', 'danhbct@congty.com', '2022-03-13', 350000, 6),
('TC020', 'Đinh Văn Mến', '0934455667', '081647280385', 'mendv@congty.com', '2022-03-14', 340000, 6),
('TC021', 'Châu Thành Long', '0945566778', '088835326006', 'longct@congty.com', '2022-03-15', 330000, 6),
('TC022', 'Dương Văn Đạt', '0956677889', '046266491859', 'vano@congty.com', '2022-03-16', 340000, 6),
('TC023', 'Trà Lộc', '0967788990', '059573485004', 'loct@congty.com', '2022-03-17', 360000, 6),
('TC024', 'Thái Văn Tài', '0978899001', '007297734123', 'taitv@congty.com', '2022-03-18', 370000, 6),
('TC025', 'Phan Thiên Phúc', '0989900112', '057594954650', 'phucpt@congty.com', '2022-03-19', 360000, 6),
('TP001', 'Ngô Văn Phụ', '0989012345', '079901234567', 'thophu1@congty.com', '2020-09-01', 0, 7),
('TP002', 'Mai Thị Phụ', '0990123456', '079012345678', 'thophu2@congty.com', '2020-10-10', 0, 7),
('TP003', 'Mai Hoàng Long', '0901239412', '079124512467', 'longmh@congty.com', '2021-05-10', 0, 7),
('K001', 'Phạm Văn Kho', '0901111222', '079222333444', 'kho1@congty.com', '2021-01-15', 5500000, 8),
('K002', 'Trần Thị Kho', '0902222333', '079333444555', 'kho2@congty.com', '2021-03-20', 5500000, 8),
('TV001', 'Lê Văn Tư Vấn', '0903333444', '079444555666', 'tuvan1@congty.com', '2021-02-10', 5500000, 9),
('TV002', 'Nguyễn Thị Tư Vấn', '0904444555', '079555666777', 'tuvan2@congty.com', '2021-04-25', 5500000, 9);

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

-- Bảng NhaCungCap (Suppliers)
INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, SoDT, Email, DiaChi, LoaiHinhCungCap) VALUES
('NCC001', 'Công ty TNHH Vật liệu Xây dựng ABC', '0987654321', 'abc@example.com', 'Quận 12, TP.HCM', 'Vật liệu xây dựng'),
('NCC002', 'Công ty CP Thiết bị Nội thất XYZ', '0976543210', 'xyz@example.com', 'Quận Bình Thạnh, TP.HCM', 'Thiết bị nội thất'),
('NCC003', 'Cơ sở Sắt thép Hưng Thịnh', '0965432109', 'hungthinh@example.com', 'Quận 9, TP.HCM', 'Sắt thép xây dựng'),
('NCC004', 'Vật liệu xây dựng Thanh Vân', '0973039431', 'thanhvan@example.com', 'Quận 5, TP.HCM', 'Vật liệu xây dựng'),
('NCC005', 'Trang trí nội thất Gia Phú', '0387847298', 'giaphu@example.com', 'Quận Thủ Đức, TP.HCM', 'Trang trí nội thất'),
('NCC006', 'Cơ sở Sắt thép Hưng Phát', '0320492184', 'hungphat@example.com', 'Huyện Bình Chánh, TP.HCM', 'Sắt thép xây dựng'),
('NCC007', 'Vật liệu xây dựng Thảo Trang', '0790349325', 'thaotrang@example.com', 'Quận Tân Phú, TP.HCM', 'Vật liệu xây dựng'),
('NCC008', 'Tôn thép Thành Phát', '0802494824', 'thanhphat@example.com', 'Quận 8, TP.HCM', 'Tôn thiết'),
('NCC009', 'Vật liệu Xây dựng Minh Hiếu', '0839290211', 'minhhieu@example.com', 'Huyện Hóc Môn, TP.HCM', 'Vật liệu xây dựng'),
('NCC010', 'Cơ sở đồ sắt Thiện Minh Châu', '0732304025', 'thienminhchau@example.com', 'Huyện Củ Chi, TP.HCM', 'Dụng cụ sắt');

-- Bảng LoaiCongTrinh (Construction Types)
INSERT INTO LoaiCongTrinh (TenLoaiCongTrinh) VALUES
('Nhà phố'),
('Biệt thự'),
('Căn hộ'),
('Văn phòng'),
('Nhà xưởng'),
('Sân vườn'),
('Tiểu cảnh'),
('Showroom'),
('Trường học'),
('Cửa hàng');

-- Bảng LoaiBaoGia (Quotation Types)
INSERT INTO LoaiBaoGia (TenLoai) VALUES
('Xây dựng cơ bản'),
('Nội thất'),
('Trọn gói'),
('Thi công phần thô'),
('Thi công hoàn thiện'),
('Cải tạo, sửa chữa'),
('Thi công cửa, lan can, cầu thang'),
('Thi công gạch, đá, sàn gỗ'),
('Thi công trần – vách thạch cao'),
('Thi công điện nước'),
('Thi công cảnh quan'),
('Thi công nhà tiền chế'),
('Thi công mái và kết cấu');

-- Bảng LoaiThietBiVatTu (Equipment/Material Types)
INSERT INTO LoaiThietBiVatTu (TenLoai, DonViTinh, LaThietBi) VALUES
('Xi măng', 'Bao', 0),
('Gạch', 'Viên', 0),
('Cát', 'm³', 0),
('Đá', 'm³', 0),
('Bê tông', 'm³', 0),
('Tôn', 'Tấm', 0),
('Ngói', 'Viên', 0),
('Sơn', 'Thùng', 0),
('Ống nhựa', 'm', 0),
('Sắt', 'kg', 0),
('Dây điện', 'm', 0),
('Sơn ','thùng', 0),
('Gỗ ','tấm', 0)

;

-- Bảng BangBaoGia (Quotations)
INSERT INTO BangBaoGia (MaBaoGia, TenBaoGia, TrangThai, GhiChu, MaLoai) VALUES
('BG001', 'Báo giá xây dựng nhà phố', 'Đã duyệt', 'Báo giá cho công trình nhà phố 3 tầng', 1),
('BG002', 'Báo giá thiết kế nội thất biệt thự', 'Đã duyệt', 'Báo giá cho biệt thự 2 tầng', 2),
('BG003', 'Báo giá trọn gói căn hộ', 'Chờ duyệt', 'Báo giá cho căn hộ 2 phòng ngủ', 3),
('BG004', 'Báo giá xây phòng trọ tường 20', 'Chờ duyệt', 'Báo giá cho tường 20', 5),
('BG005', 'Báo giá xây hàng rào', 'Đã duyệt', 'Báo giá khu hàng rào B40', 11),
('BG006', 'Báo giá dán gạch cho nhà trọ', 'Chờ duyệt', 'Dán gạch bông loại 1 cho nhà trọ', 9),
('BG007', 'Báo giá lộp lao phông nhà cấp 4', 'Chờ duyệt', 'Báo giá lộp la phông bằng thạch cao', 10),
('BG008', 'Báo giá xây mái nhà cấp 4', 'Đã duyệt', 'Báo giá cho nhà cấp 4 sử dụng dàn sắt', 8),
('BG009', 'Báo giá dàn móng công ty', 'Chờ duyệt', 'Báo giá dàn móng ép cọc bê tông', 4),
('BG010', 'Báo giá xây nền nhà cấp 4', 'Đã duyệt', 'Báo giá nền nhà cấp 4 diện tích 0.02 ha', 5)
;

-- Bảng KhachHang (Customers)
INSERT INTO KhachHang (MaKhachHang, TenKhachHang, SoDT, CCCD, Email) VALUES
('KH001', 'Trần Văn Khách', '0912345000', '079123000000', 'khach1@gmail.com'),
('KH002', 'Nguyễn Thị Hàng', '0923456000', '079234000000', 'khach2@gmail.com'),
('KH003', 'Lê Văn Người', '0934567000', '079345000000', 'khach3@gmail.com'),
('KH004', 'Nguyễn Thanh Bình', '0389194520', '079095822934', 'binhbt@gmail.com'),
('KH005', 'Trương Hảo Minh', '0938530404', '079203569421', 'minhht@gmail.com'),
('KH006', 'Phạm Chí Cường', '0308494343', '079099534343', 'cuongpc@gmail.com'),
('KH007', 'Hồ Thanh Hải', '0702545498', '079203948411', 'haiht@gmail.com'),
('KH008', 'Cao Trường Vinh', '0389302313', '079912109222', 'vinhct@gmail.com'),
('KH009', 'Nguyễn Hoàng Thảo', '0991675413', '079067029391', 'thaonh@gmail.com'),
('KH010', 'Lê Thành Nhân', '0945924107', '079895357203', 'nhanlt@gmail.com');

-- Bảng HopDong (Contracts)
INSERT INTO HopDong (MaHopDong, NgayKy, MoTa, TongTien, FileHopDong, TrangThai, GhiChu, MaNhanVien, MaKhachHang) VALUES
('HD001', '2023-01-15', 'Hợp đồng xây dựng nhà phố 3 tầng', 1500000000, 'HD001.pdf', 'Đã duyệt', 'Khách hàng đã ký hợp đồng', 'TV001', 'KH001'),
('HD002', '2023-02-20', 'Hợp đồng thiết kế và thi công biệt thự', 3500000000, 'HD002.pdf', 'Chờ duyệt', 'Đang chờ giám đốc xem xét', 'TV001', 'KH002'),
('HD003', '2023-03-10', 'Hợp đồng cải tạo căn hộ', 800000000, 'HD003.pdf', 'Từ chối', 'Không đạt yêu cầu về ngân sách', 'TV001', 'KH003'),
('HD004', '2024-04-05', 'Hợp đồng xây dựng nhà cấp 4 Gò Vấp', 900000000, 'HD004.pdf', 'Đã duyệt', 'Đã ký và tạm ứng 30%', 'TV002', 'KH004'),
('HD005', '2024-04-18', 'Hợp đồng thiết kế biệt thự hiện đại', 4200000000, 'HD005.pdf', 'Chờ duyệt', 'Chờ xác nhận thanh toán từ khách', 'TV002', 'KH005'),
('HD006', '2024-05-12', 'Hợp đồng thi công văn phòng 5 tầng', 2500000000, 'HD006.pdf', 'Đã duyệt', 'Dự kiến khởi công trong tháng 6', 'TV002', 'KH006'),
('HD007', '2024-06-01', 'Hợp đồng xây dựng nhà phố Tân Bình', 1300000000, 'HD007.pdf', 'Đã duyệt', 'Hợp đồng bổ sung thêm tầng tum', 'TV001', 'KH007'),
('HD008', '2024-06-22', 'Hợp đồng làm sân vườn biệt thự Nhà Bè', 600000000, 'HD008.pdf', 'Chờ duyệt', 'Đang điều chỉnh thiết kế cảnh quan', 'TV001', 'KH008'),
('HD009', '2024-07-08', 'Hợp đồng xây dựng dãy nhà trọ Quận 8', 950000000, 'HD009.pdf', 'Đã duyệt', 'Thanh toán đủ 50%', 'TV002', 'KH009'),
('HD010', '2024-08-03', 'Hợp đồng xây dựng showroom ô tô Quận 3', 2700000000, 'HD010.pdf', 'Chờ duyệt', 'Chưa ký do thay đổi mặt bằng', 'TV001', 'KH010');

-- Bảng CongTrinh (Construction Projects)
INSERT INTO CongTrinh (MaCongTrinh, TenCongTrinh, Dientich, FileThietKe, DiaChi, MaHopDong, MaBaoGia, MaLoaiCongTrinh, NgayDuKienHoanThanh) VALUES
('CT001', 'Nhà phố Quận 7', 120, 'TK001.pdf', '123 Đường Nguyễn Thị Thập, Quận 7, TP.HCM', 'HD001', 'BG001', 1, '2023-07-15'),
('CT002', 'Biệt thự Thủ Đức', 350, 'TK002.pdf', '456 Đường Võ Văn Ngân, Thủ Đức, TP.HCM', 'HD002', 'BG002', 2, '2023-12-20'),
('CT003', 'Căn hộ Quận 2', 85, 'TK003.pdf', '789 Đường Nguyễn Duy Trinh, Quận 2, TP.HCM', 'HD003', 'BG003', 3, '2023-06-10'),
('CT004', 'Nhà cấp 4 Gò Vấp', 90, 'TK004.pdf', '12 Đường Lê Đức Thọ, Gò Vấp, TP.HCM', 'HD004', 'BG004', 1, '2023-09-30'),
('CT005', 'Biệt thự hiện đại Quận 9', 400, 'TK005.pdf', '88 Đường Nguyễn Xiển, Quận 9, TP.HCM', 'HD005', 'BG005', 2, '2024-01-25'),
('CT006', 'Văn phòng Bình Thạnh', 150, 'TK006.pdf', '10 Đường Điện Biên Phủ, Bình Thạnh, TP.HCM', 'HD006', 'BG006', 4, '2023-11-10'),
('CT007', 'Nhà phố Tân Bình', 110, 'TK007.pdf', '55 Đường Cộng Hòa, Tân Bình, TP.HCM', 'HD007', 'BG007', 1, '2023-10-05'),
('CT008', 'Sân vườn Nhà Bè', 300, 'TK008.pdf', '21 Đường Huỳnh Tấn Phát, Nhà Bè, TP.HCM', 'HD008', 'BG008', 7, '2024-03-15'),
('CT009', 'Nhà trọ Quận 8', 100, 'TK009.pdf', '63 Đường Phạm Thế Hiển, Quận 8, TP.HCM', 'HD009', 'BG009', 7, '2023-12-01'),
('CT010', 'Showroom Quận 3', 180, 'TK010.pdf', '27 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'HD010', 'BG010', 6, '2024-02-20')
;

-- Bảng ThietBiVatTu (Equipment/Materials)
INSERT INTO ThietBiVatTu (MaThietBiVatTu, TenThietBiVatTu, MaLoaiThietBiVatTu) VALUES
('TBVT001', 'Xi măng Hà Tiên', 1),
('TBVT002', 'Gạch ống Tuynel', 2),
('TBVT003', 'Cát xây dựng', 3),
('TBVT004', 'Đá 1x2 xanh Biên Hòa', 4),
('TBVT005', 'Thép Việt Nhật phi 16', 10),
('TBVT006', 'Ống nước Bình Minh', 9),
('TBVT007', 'Dây điện Cadivi 2.5mm', 11),
('TBVT008', 'Sơn Jotun nội thất', 12),
('TBVT009', 'Sơn Dulux ngoại thất', 12),
('TBVT010', 'Gỗ tự nhiên căm xe', 13),
('TBVT011', 'Đá 2x3 xanh Biên Hòa', 4)
;

-- Bảng ChiTietThiCong (Construction Details)
INSERT INTO ChiTietThiCong (MaCongTrinh, MaThietBiVatTu, TrangThai, NgayRoiKho, NgayHoanKho) VALUES
('CT001', 'TBVT001', 'Đã xuất kho', '2023-01-25', NULL),
('CT001', 'TBVT002', 'Đã xuất kho', '2023-01-25', NULL),
('CT002', 'TBVT001', 'Đã xuất kho', '2023-03-05', NULL),
('CT002', 'TBVT003', 'Đã xuất kho', '2023-03-05', NULL),
('CT002', 'TBVT004', 'Đã xuất kho', '2023-03-05', NULL),
('CT002', 'TBVT011', 'Đã xuất kho', '2023-03-05', NULL),
('CT002', 'TBVT005', 'Đã xuất kho', '2023-03-05', NULL),
('CT003', 'TBVT001', 'Đã xuất kho', '2023-03-15', NULL),
('CT003', 'TBVT002', 'Đã xuất kho', '2023-03-15', NULL),
('CT003', 'TBVT003', 'Đã xuất kho', '2023-03-15', NULL)
;

-- Bảng DeXuat (Proposals)
-- Để trống theo cấu trúc mới

-- Bảng ChiTietDeXuat (Proposal Details)
-- Để trống theo cấu trúc mới

-- Bảng PhieuNhap (Import Receipts)
-- Để trống theo cấu trúc mới

-- Bảng ChiTietPhieuNhap (Import Receipt Details)
-- Để trống theo cấu trúc mới

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

INSERT INTO HangMuc (TenHangMuc, DonViTinh, CongTho, GiaTienCacKhoanKhac) VALUES
('Lót gạch', 'm²', 100000, 250000),
('Đổ bê tông', 'm³', 350000, 1800000),
('Xây tường', 'm²', 120000, 350000),
('Trát tường', 'm²', 70000, 120000),
('Sơn tường', 'm²', 60000, 80000),
('Lắp đặt điện', 'm²', 100000, 150000),
('Lắp đặt nước', 'm²', 110000, 180000),
('Lắp đặt cửa', 'cái', 300000, 2500000);

-- Bảng ChiTietBaoGia (Quotation Details)
INSERT INTO ChiTietBaoGia (MaBaoGia, MaHangMuc, MaThietBiVatTu, GiaBaoGia, NoiDung) VALUES 
('BG001', 1, 'TBVT001', 25000000, 'Lót gạch phòng khách và phòng ngủ'),
('BG001', 2, 'TBVT002', 18000000, 'Đổ bê tông móng và sàn'),
('BG001', 3, 'TBVT004', 23000000, 'Xây tường sử dụng đá 1x2 Biên Hòa'),
('BG001', 4, 'TBVT003', 14000000, 'Trát tường bằng cát mịn sạch'),
('BG001', 5, 'TBVT008', 16000000, 'Sơn nội thất bằng sơn Jotun'),
('BG001', 6, 'TBVT007', 17500000, 'Lắp hệ thống điện Cadivi toàn nhà'),
('BG001', 7, 'TBVT006', 16500000, 'Lắp đặt hệ thống nước Bình Minh'),
('BG002', 5, 'TBVT009', 17000000, 'Sơn mặt ngoài bằng sơn Dulux'),
('BG002', 3, 'TBVT003', 21000000, 'Xây tường bao và vách ngăn'),
('BG002', 4, 'TBVT001', 15000000, 'Trát tường toàn bộ công trình'),
('BG002', 8, 'TBVT010', 25000000, 'Lắp cửa gỗ tự nhiên phòng khách'),
('BG003', 5, 'TBVT002', 12000000, 'Sơn tường nội thất'),
('BG003', 6, 'TBVT003', 18000000, 'Lắp đặt hệ thống điện'),
('BG003', 1, 'TBVT002', 14000000, 'Lát gạch sàn căn hộ 2PN'),
('BG004', 3, 'TBVT005', 22000000, 'Xây tường 20 bằng gạch đặc và thép')
;

-- Bảng BangBaoCaoTienDo (Progress Reports)
INSERT INTO BangBaoCaoTienDo (MaTienDo, ThoiGianHoanThanhThucTe, CongViec, NoiDungCongViec, NgayBaoCao, TrangThai, TiLeHoanThanh, HinhAnhTienDo, MaCongTrinh) VALUES
('TD001', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-02-15', 1, 0.2, 'anh_mong.jpg', 'CT001'),
('TD002', NULL, 'Khung sườn', 'Đã hoàn thành 50% khung sườn', '2023-04-20', 1, 0.4, 'anh_khung.jpg', 'CT001'),
('TD003', NULL, 'Móng', 'Đã hoàn thành đổ móng', '2023-03-10', 1, 0.1, 'anh_mong_bt.jpg', 'CT002'),
('TD004',NULL, 'Lắp đặt móng', 'Móng đã hoàn tất 100%', '2023-05-10', 1, 1.0, 'mong_ct002.jpg', 'CT002'),
('TD005',NULL, 'Lắp đặt khung', 'Khung thép hoàn thiện 60%', '2023-06-12', 1, 0.6, 'khung_ct002.jpg', 'CT002'),
('TD006', NULL,'Lợp mái', 'Đã lợp xong 80% mái', '2023-07-20', 1, 0.8, 'mai_ct002.jpg', 'CT002'),
('TD007',NULL, 'Lắp đặt điện', 'Đang thi công hệ thống điện', '2023-08-01', 0, 0.3, 'dien_ct002.jpg', 'CT002'),
('TD008', NULL,'Lát gạch', 'Đã lát được 50%', '2023-08-15', 0, 0.5, 'lat_ct002.jpg', 'CT002'),
('TD009', NULL,'Xây tường tầng 1', 'Tường tầng 1 hoàn tất', '2023-04-10', 1, 1.0, 'tuong1_ct003.jpg', 'CT003'),
('TD010', NULL,'Tô trát tầng 2', 'Đang tô tường tầng 2', '2023-05-20', 1, 0.6, 'totang2_ct003.jpg', 'CT003'),
('TD011', NULL,'Lắp cửa', 'Cửa chính đang được lắp', '2023-06-10', 1, 0.4, 'cuachinh_ct003.jpg', 'CT003'),
('TD012',NULL, 'Sơn nước', 'Đã sơn lót xong', '2023-06-28', 1, 0.5, 'sonlot_ct003.jpg', 'CT003'),
('TD013', NULL,'Hoàn thiện nội thất', 'Đang lắp nội thất cơ bản', '2023-07-15', 0, 0.3, 'noithat_ct003.jpg', 'CT003'),
('TD014',NULL, 'Xây nền', 'Nền nhà đã đổ xong', '2023-03-18', 1, 1.0, 'xaynencap4.jpg', 'CT004'),
('TD015', NULL,'Đổ bê tông sàn', 'Đã đổ xong tầng trệt', '2023-04-05', 1, 1.0, 'betong_ct004.jpg', 'CT004'),
('TD016', NULL,'Đi dây điện', 'Thi công âm tường', '2023-04-20', 1, 0.7, 'daydien_ct004.jpg', 'CT004'),
('TD017',NULL, 'Ốp lát nhà vệ sinh', 'Đã xong 80%', '2023-05-10', 1, 0.8, 'nhavesinh_ct004.jpg', 'CT004'),
('TD018',NULL, 'Sơn hoàn thiện', 'Sơn hoàn tất bên trong', '2023-06-01', 1, 1.0, 'son_ct004.jpg', 'CT004'),
('TD019', NULL,'Xây móng biệt thự', 'Đổ móng xong', '2024-01-05', 1, 1.0, 'mong_bt_ct005.jpg', 'CT005'),
('TD020', NULL,'Dựng cột tầng 1', 'Cột tầng 1 đạt 50%', '2024-01-25', 0, 0.5, 'cot_tang1_ct005.jpg', 'CT005'),
('TD021',NULL,'Thi công mái', 'Khởi công phần mái', '2024-02-10', 0, 0.2, 'maibt_ct005.jpg', 'CT005'),
('TD022', NULL,'Lắp kính văn phòng', 'Lắp kính mặt tiền', '2023-10-01', 1, 0.7, 'kinh_ct006.jpg', 'CT006'),
('TD023',NULL, 'Trần thạch cao', 'Đã hoàn tất 100%', '2023-10-15', 1, 1.0, 'tranthachcao_ct006.jpg', 'CT006'),
('TD024', NULL,'Trang trí nội thất', 'Đang setup bàn ghế', '2023-11-01', 0, 0.3, 'noithat_ct006.jpg', 'CT006'),
('TD025',NULL, 'Đào móng', 'Đào móng chuẩn bị đổ', '2023-07-01', 1, 1.0, 'daomong_ct007.jpg', 'CT007'),
('TD026', NULL,'Tô tường ngoài', 'Hoàn thiện mặt tiền', '2023-08-05', 1, 1.0, 'mattien_ct007.jpg', 'CT007'),
('TD027',NULL, 'Trồng cây sân vườn', 'Trồng cây cảnh 50%', '2024-01-10', 0, 0.5, 'caycanh_ct008.jpg', 'CT008'),
('TD028',NULL, 'Lát gạch sân vườn', 'Gần hoàn thiện', '2024-02-01', 0, 0.9, 'latgach_ct008.jpg', 'CT008'),
('TD029',NULL, 'Xây móng nhà trọ', 'Hoàn tất đổ móng', '2023-10-15', 1, 1.0, 'mong_nt_ct009.jpg', 'CT009'),
('TD030', NULL,'Xây tường phòng', 'Tường các phòng gần xong', '2023-11-01', 1, 0.8, 'tuong_nt_ct009.jpg', 'CT009'),
('TD031', NULL,'Lắp đặt showroom', 'Bắt đầu dựng mô hình', '2024-01-15', 0, 0.2, 'lapdatshowroom_ct010.jpg', 'CT010'),
('TD032', NULL,'Thi công bảng hiệu', 'Gắn logo mặt tiền', '2024-02-01', 0, 0.5, 'banghai_ct010.jpg', 'CT010'),
('TD033', NULL,'Thi công ánh sáng', 'Lắp hệ thống đèn LED', '2024-02-18', 0, 0.8, 'led_ct010.jpg', 'CT010')
;

-- Bảng BangPhanCong (Work Assignments)
DELETE FROM BangPhanCong;
INSERT INTO BangPhanCong (MaBangPhanCong, MaCongTrinh, MaNhanVien, NgayThamGia, NgayKetThuc, SoNgayThamGia) VALUES
-- TC001: Làm CT001 10 ngày và CT002 11 ngày
(1, 'CT001', 'TC001', '2025-01-01', '2025-01-10', 10),
(2, 'CT002', 'TC001', '2025-01-01', '2025-01-11', 11),
-- TP001: Làm CT001 15 ngày
(3, 'CT001', 'TP001', '2025-01-01', '2025-01-15', 15),
-- TP002: Làm CT002 12 ngày và CT001 8 ngày
(4, 'CT002', 'TP002', '2025-01-01', '2025-01-12', 12),
(5, 'CT001', 'TP002', '2025-01-01', '2025-01-08', 8),
(6, 'CT002', 'TC006', '2025-09-07', '2025-09-24', 18),
(7, 'CT003', 'TP002', '2025-06-04', '2025-06-09', 6),
(8, 'CT007', 'TC008', '2025-03-09', '2025-03-26', 18),
(9, 'CT009', 'TC008', '2025-01-01', '2025-01-11', 11),
(10, 'CT003', 'TC007', '2025-01-23', '2025-01-31', 9),
(11, 'CT008', 'TC006', '2025-02-02', '2025-02-06', 5),
(12, 'CT007', 'TC011', '2025-04-06', '2025-04-24', 19),
(13, 'CT004', 'TC005', '2025-10-31', '2025-11-11', 12),
(14, 'CT001', 'TC009', '2025-08-04', '2025-08-23', 20),
(15, 'CT003', 'TC003', '2025-09-21', '2025-10-03', 13),
(16, 'CT010', 'TC015', '2025-03-03', '2025-03-11', 9),
(17, 'CT002', 'TC020', '2025-01-04', '2025-01-20', 17),
(18, 'CT007', 'TP003', '2025-08-05', '2025-08-18', 14),
(19, 'CT001', 'TC009', '2025-01-21', '2025-02-03', 14),
(20, 'CT003', 'TC010', '2025-06-22', '2025-07-05', 14),
(21, 'CT005', 'TC014', '2025-05-29', '2025-06-12', 15),
(22, 'CT008', 'TC008', '2025-09-20', '2025-09-26', 7),
(23, 'CT006', 'TC015', '2025-07-17', '2025-08-03', 18),
(24, 'CT001', 'TC004', '2025-11-30', '2025-12-08', 9),
(25, 'CT007', 'TC009', '2025-04-11', '2025-04-30', 20);
-- Bảng CungUng (Supply)
INSERT INTO CungUng (MaThietBiVatTu, MaNhaCungCap, SoLuongTon, DonGia, NgayCapNhat) VALUES
('TBVT001', 'NCC001', 100, 100000, CURRENT_TIMESTAMP),
('TBVT002', 'NCC001', 5000, 5000, CURRENT_TIMESTAMP),
('TBVT003', 'NCC001', 20, 500000, CURRENT_TIMESTAMP),
('TBVT004', 'NCC003', 2782, 8000, CURRENT_TIMESTAMP),
('TBVT005', 'NCC001', 1238, 139000, CURRENT_TIMESTAMP),
('TBVT006', 'NCC003', 8776, 360000, CURRENT_TIMESTAMP),
('TBVT007', 'NCC001', 2046, 290000, CURRENT_TIMESTAMP),
('TBVT008', 'NCC002', 8123, 333000, CURRENT_TIMESTAMP),
('TBVT009', 'NCC002', 3750, 361000, CURRENT_TIMESTAMP),
('TBVT010', 'NCC002', 6127, 157000, CURRENT_TIMESTAMP),
('TBVT011', 'NCC003', 4616, 386000, CURRENT_TIMESTAMP),
('TBVT001', 'NCC003', 1581, 131000, CURRENT_TIMESTAMP),
('TBVT009', 'NCC001', 3303, 123000, CURRENT_TIMESTAMP),
('TBVT005', 'NCC001', 8168, 131000, CURRENT_TIMESTAMP),
('TBVT005', 'NCC002', 8551, 437000, CURRENT_TIMESTAMP),
('TBVT004', 'NCC002', 1941, 433000, CURRENT_TIMESTAMP),
('TBVT007', 'NCC003', 6986, 299000, CURRENT_TIMESTAMP),
('TBVT008', 'NCC003', 8419, 261000, CURRENT_TIMESTAMP),
('TBVT006', 'NCC003', 4712, 484000, CURRENT_TIMESTAMP),
('TBVT010', 'NCC003', 7131, 381000, CURRENT_TIMESTAMP);