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
import UserManager from './components/QL_NguoiDung.jsx';
import QuanLyDanhMuc from "./components/QuanLyDanhMuc.jsx";
import BaoGia from "./components/Baogia.jsx";
import { useEffect, useState } from "react";
import PageTuVan from "./page/NhanVienTuVan.jsx";
import QL_NhanVien from './components/QL_NhanVien.jsx';
import PageNhanSu from "./page/NhanSu.jsx";

// Component bảo vệ route với kiểm tra token hết hạn
function ProtectedRoute({ children, allowedRole }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const expires = localStorage.getItem("expires");
      const currentTime = Math.floor(Date.now() / 1000);

      // Kiểm tra token tồn tại và chưa hết hạn
      if (!token || !expires) {
        alert("Vui lòng đăng nhập để tiếp tục");
        navigate("/login");
        return;
      }

      // Kiểm tra token hết hạn
      if (currentTime > parseInt(expires)) {
        // Xóa token hết hạn
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expires");

        // Thông báo và chuyển hướng
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      // Kiểm tra vai trò người dùng
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userRole = userInfo.MaNhanVien
        ? userInfo.MaNhanVien.substring(0, 2)
        : "";

      // Nếu vai trò không khớp với trang được phép
      if (userRole !== allowedRole) {
        navigate("/404");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, allowedRole]);

  if (isLoading) {
    return <div>Đang kiểm tra thông tin đăng nhập...</div>;
  }
  return children;
}

function App() {
  // Cấu hình Routes giữ nguyên như trước
  return (
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
          <ProtectedRoute allowedRole="AD">
            <AdminPage />
          </ProtectedRoute>
        }
      >
        </Route>
      <Route
        path="/giamdoc"
        element={
          <ProtectedRoute allowedRole="GD">
            <GiamDocPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ketoan"
        element={
          <ProtectedRoute allowedRole="KT">
            <KeToanPage />
          </ProtectedRoute>
        }
      >
        <Route path="quanlydanhmuc" element={<QuanLyDanhMuc />} />
        <Route path="quanlyluong" element={<h1>Quản lý lương</h1>} />
        <Route path="thanhtoanvatlieuthietbi" element={<h1>Thanh toán vật liệu thiết bị</h1>}/>
        <Route path="quanlygiaingan" element={<h1>Quản lý giải ngân</h1>} />
      </Route>
      <Route
        path="/nhansu"
        element={
          <ProtectedRoute allowedRole="NS">
            <PageNhanSu />
          </ProtectedRoute>
        }
      > 
      <Route path="quan-ly-nhan-vien" element={<QL_NhanVien />} />
      </Route>
      <Route
        path="/qlcongtrinh"
        element={
          <ProtectedRoute allowedRole="QL">
            <QLCongTrinhPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhanvienkho"
        element={
          <ProtectedRoute allowedRole="K">
            <PageNhanVienKho />
          </ProtectedRoute>
        }
      />
       <Route
        path="/nhanvientuvan/"
        element={
          <ProtectedRoute allowedRole="TV">
            <PageTuVan />
          </ProtectedRoute>
        }
      >
       <Route path="lapbaogia" element={<BaoGia />} />
       <Route path="laphopdong" element={<h1>Quản lý lương</h1>} />
      </Route>
      <Route path="admin/quantringuoidung" element={
        <ProtectedRoute allowedRole="AD">
          <UserManager />
        </ProtectedRoute>
      } /> 
    
      {/* Xử lý tất cả các route không xác định */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;