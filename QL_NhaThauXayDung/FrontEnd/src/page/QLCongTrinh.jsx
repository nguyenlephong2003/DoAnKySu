import React, { useState, useEffect, useRef } from "react";
import {
  FaLaptopCode,
  FaBox,
  FaUserFriends,
  FaChartBar,
  FaBars,
  FaTimes,
  FaClipboardList,
  FaCheckCircle,
  FaUserEdit,
  FaSignOutAlt
} from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import LogoHUIT from "../assets/logohuit.png";

const PageQuanLy = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("qlcongtrinh/quanlycongtrinh");

  const sidebarRef = useRef();
  const userMenuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "quanlycongtrinh", label: "Quản lý công trình", icon: <FaClipboardList />, path: "/qlcongtrinh/quanlycongtrinh" },
    { id: "quanlytiendo", label: "Quản lý tiến độ", icon: <FaClipboardList />, path: "/qlcongtrinh/quanlytiendo" },
    { id: "lapdexuatmua", label: "Lập đề xuất mua", icon: <FaLaptopCode />, path: "/qlcongtrinh/lapdexuatmua" },
    { id: "quanlydanhmuc", label: "Quản lý danh mục", icon: <FaUserFriends />, path: "/qlcongtrinh/quanlydanhmuc" },
   
  ];

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarToggle(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
      if (storedUserInfo && storedUserInfo.TenNhanVien) {
        setUserInfo({ 
          name: storedUserInfo.TenNhanVien, 
          role: storedUserInfo.TenLoaiNhanVien || "Admin" 
        });
      }
    } catch (error) {
      console.error("Lỗi khi đọc thông tin người dùng:", error);
    }

    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => currentPath.includes(item.id));
    if (activeItem) {
      setActiveMenu(activeItem.id);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expires");
    navigate("/login");
  };

  const handleProfileEdit = () => {
    setUserMenuOpen(false);
    navigate("/profile");
  };

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div
        ref={sidebarRef}
        className={`h-screen w-auto min-w-[170px] bg-[#ffffff] border-r border-gray-300 text-gray-700 lg:static absolute z-20 ${
          sidebarToggle ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-all duration-300 overflow-x-hidden`}
      >
        <div className="flex p-4 text-center text-2xl font-bold justify-between items-center">
          <img src={LogoHUIT} alt="Logo" className="h-9" />
          <div
            className="text-gray-500 block border border-gray-500 lg:hidden p-2 rounded-lg"
            onClick={() => setSidebarToggle(false)}
          >
            <FaTimes />
          </div>
        </div>
        <hr className="border-gray-400" />

        <div className="py-6 px-4">
          <ul className="space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeMenu === item.id
                    ? "bg-[#2e7d32] text-white font-medium shadow-md transform scale-[1.02]"
                    : "text-gray-700 hover:bg-[#e8f5e9] hover:text-[#2e7d32] hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-lg transition-colors duration-200 whitespace-nowrap ${
                    activeMenu === item.id ? "text-white" : "text-[#2e7d32]"
                  }`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeMenu === item.id ? "text-white" : "text-gray-700"
                  }`}>
                    {item.label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header với thông tin người dùng một hàng */}
        <div className="sticky top-0 z-10 w-full bg-white shadow px-4 py-4 flex justify-between items-center border-b border-gray-300">
          <div className="flex items-center space-x-4">
            <div
              className="block lg:hidden border border-stroke p-2 shadow-sm text-xl rounded-xl"
              onClick={() => setSidebarToggle(true)}
            >
              <FaBars />
            </div>
          </div>
          <div className="flex items-center gap-4 h-full">
            <div className="relative h-5/6 p-1.5 border border-[#2974d7] rounded-full bg-[#ededed] group">
              <GoBell className="text-xl text-gray-600 h-full w-full group-hover:text-[#3c6ae0da]" />
              <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-red-500 inline">
                <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-300"></span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right whitespace-nowrap">
                <p className="text-sm font-semibold">{userInfo.name}</p>
                <p className="text-xs text-gray-600">{userInfo.role}</p>
              </div>
              <div className="relative">
                <div
                  className="p-1.5 border border-[#2974d7] rounded-full bg-[#ededed] cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <CiUser className="text-xl text-gray-600" />
                </div>
                {/* Menu người dùng */}
                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200"
                  >
                    <div
                      onClick={handleProfileEdit}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaUserEdit className="mr-2" />
                      Chỉnh sửa hồ sơ
                    </div>
                    <div
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#e4e4e4] p-8">
          <Outlet />
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn đăng xuất?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageQuanLy;