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
  FaSignOutAlt,
  FaListAlt,
} from "react-icons/fa";

import { GoBell } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import LogoHUIT from "../assets/logohuit.png";

const PageKeToan = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("chitietgv"); // Menu mặc định
  const [currentComponent, setCurrentComponent] = useState(null);

  const sidebarRef = useRef();
  const userMenuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa cấu trúc menu
  const menuItems = [
    {
      id: "quanlydanhmuc",
      label: "Quản lý danh mục",
      icon: <FaListAlt />,
      path: "/ketoan/quanlydanhmuc",
    },
    {
      id: "quanlyluong",
      label: "Quản lý lương",
      icon: <FaClipboardList />,
      path: "/ketoan/quanlyluong",
    },
    {
      id: "thanhtoanvatlieuthietbi",
      label: "Thanh toán vật liệu thiết bị",
      icon: <FaClipboardList />,
      path: "/ketoan/thanhtoanvatlieuthietbi",
    },
    {
      id: "quanlygiaingan",
      label: "Quản lý giải ngân",
      icon: <FaLaptopCode />,
      path: "/ketoan/quanlygiaingan",
    },
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
      const storedUserInfo = JSON.parse(
        localStorage.getItem("userInfo") || "{}"
      );
      if (storedUserInfo && storedUserInfo.TenNhanVien) {
        setUserInfo({
          name: storedUserInfo.TenNhanVien,
          role: storedUserInfo.TenLoaiNhanVien || "Admin",
        });
      }
    } catch (error) {
      console.error("Lỗi khi đọc thông tin người dùng:", error);
    }

    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) => currentPath.includes(item.id));
    if (activeItem) {
      setActiveMenu(activeItem.id);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    // Xác nhận đăng xuất
    setIsLogoutModalOpen(false);

    // Xóa tất cả thông tin đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expires");

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  const handleProfileEdit = () => {
    // Đóng menu người dùng
    setUserMenuOpen(false);

    // Chuyển hướng đến trang chỉnh sửa hồ sơ
    navigate("/profile");
  };

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    setCurrentComponent(menuId); // Thêm dòng này
    navigate(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div
        ref={sidebarRef}
        className={`h-screen w-64 bg-[#ffffff] border-r border-gray-300 text-gray-700 lg:static absolute z-20 ${
          sidebarToggle ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-all duration-300`}
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
          <ul className="space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
                  activeMenu === item.id
                    ? "bg-[#2e7d32] text-white font-medium"
                    : "text-black hover:bg-[#b3b3b3] hover:text-[#010e0a]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-semibold">{item.label}</span>
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

        <div className="flex-1 bg-[#e4e4e4] p-6">
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

export default PageKeToan;
