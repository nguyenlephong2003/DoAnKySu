import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./page/login.jsx";
import AdminPage from "./page/Admin.jsx";
import GiamDocPage from "./page/GiamDoc.jsx";
import KeToanPage from "./page/KeToan.jsx";
import NhanSuPage from "./page/NhanSu.jsx";
import QLCongTrinhPage from "./page/QLCongTrinh.jsx";
import PageNhanVienKho from "./page/NhanVienKho.jsx";
import PageNhanVienTuVan from "./page/NhanVienTuVan.jsx";
import Page404 from "./page/404.jsx";
import QL_NguoiDung from "./components/QL_NguoiDung.jsx";
import QuanLyDanhMuc from "./components/QuanLyDanhMuc.jsx";
import BaoGia from "./components/BaoGia.jsx";
import { useEffect, useState } from "react";
import QL_NhanVien from "./components/QL_NhanVien.jsx";
import QuanLyCongTrinh from "./components/QuanLyCongTrinh.jsx";
import QuanLyThietBiVatTu from "./components/QuanLyThietBiVatTu.jsx";
import LapDeXuatMua from "./components/LapDeXuatMua.jsx";
import DuyetHopDong from "./components/DuyetHopDong.jsx";
import DuyetBaoGia from "./components/DuyetBaoGia.jsx";
import HopDong from "./components/HopDong.jsx";// Component bảo vệ route với kiểm tra token hết hạn
import QuanLyLuong from "./components/QuanLyLuong.jsx";
import QuanLyTienDo from "./components/QuanLyTienDo.jsx";
import QuanLyNhaCungCap from "./components/QuanLyNhaCungCap.jsx";
import TaoDeXuat from "./components/TaoDeXuat.jsx";
import DuyetDeXuat from "./components/DuyetDeXuat.jsx";
import BASE_URL from "./Config.js";  // Thêm dòng này
import Backup_Restore from "./components/Backup_Restore.jsx";
import QuanLyChamCong from "./components/QuanLyChamCong.jsx";
import ChamCongNhanVien from "./components/ChamCongNhanVien.jsx";
import { AuthProvider } from './Config/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}NguoiDung_API/KiemTraToken_API.php`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok || data.message !== "success") {
          navigate("/login");
          return;
        }
        // Lấy loại nhân viên (TenLoai) từ API
        const userInfo = data.nhanvien[0];
        const tenLoai = userInfo.loainhanvien[0].TenLoai;
        // So sánh với allowedRole
        if (tenLoai !== allowedRole) {
          navigate("/404");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, allowedRole]);
  if (isLoading) {
    return <div>Đang kiểm tra thông tin đăng nhập...</div>;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Trang mặc định và trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Trang 404 */}
        <Route path="/404" element={<Page404 />} />

        {/* Các trang được bảo vệ với kiểm tra vai trò */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        >
          <Route path="quantringuoidung" element={<QL_NguoiDung />} />
          <Route path="saoluuphuchoi" element={<Backup_Restore />} />
        </Route>
        <Route
          path="/giamdoc"
          element={
            <ProtectedRoute allowedRole="Giám đốc">
              <GiamDocPage />
            </ProtectedRoute>
          }
        >
          <Route path="duyetdexuat" element={<DuyetDeXuat/>} />
          <Route path="duyetbaogia" element={<DuyetBaoGia />} />
          <Route path="baocaothongke" element={<h1>Báo cáo thống kê</h1>} />
          <Route path="duyethopdong" element={<DuyetHopDong />} />
          <Route path="quanlynhanvien" element={<h1>Quản lý nhân viên</h1>} />
          <Route path="quanlyluong" element={<h1>Quản lý lương</h1>} />
        </Route>
        <Route
          path="/ketoan"
          element={
            <ProtectedRoute allowedRole="Kế toán">
              <KeToanPage />
            </ProtectedRoute>
          }
        >
          <Route path="quanlydanhmuc" element={<QuanLyDanhMuc />} />
          <Route path="quanlyluong" element={<QuanLyLuong/>} />
          <Route path="thanhtoan" element={<h1>Thanh toán</h1>} />
          <Route path="quanlygiaingan" element={<h1>Quản lý giải ngân</h1>} />
        </Route>

        <Route
          path="/nhansu"
          element={
            <ProtectedRoute allowedRole="Nhân sự">
              <NhanSuPage />
            </ProtectedRoute>
          }
        >
          <Route path="quan-ly-nhan-vien" element={<QL_NhanVien />} />
          <Route path="chamcong" element={<ChamCongNhanVien />} />
          <Route path="timkiem" element={<div>Tìm kiếm</div>} />
          <Route path="baocaothongke" element={<div>Báo cáo thống kê</div>} />
        </Route>

        <Route
          path="/qlcongtrinh"
          element={
            <ProtectedRoute allowedRole="Quản lý công trình">
              <QLCongTrinhPage />
            </ProtectedRoute>
          }
        >
          <Route path="quanlycongtrinh" element={<QuanLyCongTrinh />} />
          <Route path="quanlytiendo" element={<QuanLyTienDo />} />
          <Route path="lapdexuat" element={<TaoDeXuat />} />
          <Route path="lapdexuatmua" element={<LapDeXuatMua />} />
          <Route path="quanlydanhmuc" element={<div>Quản lý danh mục</div>} />
          <Route path="timkiem" element={<div>Tìm kiếm</div>} />
          <Route path="chamcongtho" element={<QuanLyChamCong />} />
        </Route>

        <Route
          path="/nhanvienkho"
          element={
            <ProtectedRoute allowedRole="Nhân viên kho">
              <PageNhanVienKho />
            </ProtectedRoute>
          }
        >
          <Route path="quanlythietbivattu" element={<QuanLyThietBiVatTu />} />
          <Route path="lapphieukiemtra" element={<div>Lập phiếu kiểm tra</div>} />
          <Route path="danhsachphieukiemtra" element={<div>Danh sách phiếu kiểm tra</div>} />
          <Route path="danhsachphieunhap" element={<div>Danh sách phiếu nhập</div>} />
          <Route path="quanlynhacungcap" element={<QuanLyNhaCungCap />} />
        </Route>
        <Route
          path="/nhanvientuvan"
          element={
            <ProtectedRoute allowedRole="Nhân viên tư vấn">
              <PageNhanVienTuVan />
            </ProtectedRoute>
          }
        >
          <Route path="lapbaogia" element={<BaoGia />} />
          <Route path="laphopdong" element={<HopDong />} />
        </Route>
        {/* <Route
          path="admin/quantringuoidung"
          element={
            <ProtectedRoute allowedRole="AD">
              <UserManager />
            </ProtectedRoute>
          }
        /> */}

        {/* Xử lý tất cả các route không xác định */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
