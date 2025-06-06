import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import QuanLyLoaiBaoGia from './QuanLyLoaiBaoGia';
import QuanLyLoaiCongTrinh from './QuanLyLoaiCongTrinh';
import QuanLyLoaiThietBiVatTu from './QuanLyLoaiThietBiVatTu';
import QuanLyLoaiNhanVien from './QuanLyLoaiNhanVien';
import QuanLyNhaCungCap from './QuanLyNhaCungCap';
import { useAuth } from '../Config/AuthContext';

const QuanLyDanhMuc = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('loaibaogia');

  // Kiểm tra quyền truy cập
  const canAccess = user?.TenLoaiNhanVien === 'Admin' || 
                   user?.TenLoaiNhanVien === 'Kế toán' ||
<<<<<<< Updated upstream
                   user?.TenLoaiNhanVien === 'Giám đốc'||
                   user?.TenLoaiNhanVien === 'Quản lý công trình';
=======
                   user?.TenLoaiNhanVien === 'Giám đốc' ||
                   user?.TenLoaiNhanVien === 'Nhân viên kho';
>>>>>>> Stashed changes

  // Kiểm tra quyền xem loại nhân viên
  const canViewLoaiNhanVien = user?.TenLoaiNhanVien === 'Admin' || 
                             user?.TenLoaiNhanVien === 'Giám đốc'||
                             user?.TenLoaiNhanVien === 'Quản lý công trình';

  // Kiểm tra xem có phải nhân viên kho không
  const isWarehouseStaff = user?.TenLoaiNhanVien === 'Nhân viên kho';

  // Tạo danh sách options dựa trên quyền
  const getDropdownOptions = () => {
    if (isWarehouseStaff) {
      return [
        { value: 'loaithietbivattu', label: 'Loại thiết bị vật tư' },
        { value: 'nhacungcap', label: 'Nhà cung cấp' }
      ];
    }

    const options = [
      { value: 'loaibaogia', label: 'Loại báo giá' },
      { value: 'loaicongtrinh', label: 'Loại công trình' },
      { value: 'loaithietbivattu', label: 'Loại thiết bị vật tư' },
      { value: 'nhacungcap', label: 'Nhà cung cấp' }
    ];

    if (canViewLoaiNhanVien) {
      options.push({ value: 'loainhanvien', label: 'Loại nhân viên' });
    }

    return options;
  };

  const dropdownOptions = getDropdownOptions();

  // Xử lý khi component mount và khi role thay đổi
  useEffect(() => {
    if (isWarehouseStaff) {
      setSelectedType('loaithietbivattu');
    } else {
      setSelectedType('loaibaogia');
    }
  }, [isWarehouseStaff]);

  if (!canAccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-10">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">Không có quyền truy cập</h2>
          <p>Bạn không có quyền truy cập vào trang này.</p>
        </div>
      </div>
    );
  }

  const renderComponent = () => {
    switch (selectedType) {
      case 'loaibaogia':
        return <QuanLyLoaiBaoGia />;
      case 'loaicongtrinh':
        return <QuanLyLoaiCongTrinh />;
      case 'loaithietbivattu':
        return <QuanLyLoaiThietBiVatTu />;
      case 'nhacungcap':
        return <QuanLyNhaCungCap />;
      case 'loainhanvien':
        return canViewLoaiNhanVien ? <QuanLyLoaiNhanVien /> : <QuanLyLoaiBaoGia />;
      default:
        return <QuanLyLoaiBaoGia />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">Quản lý danh mục</h1>
        <Select
          value={selectedType}
          onChange={setSelectedType}
          style={{ width: 200 }}
          options={dropdownOptions}
        />
      
      <div className="mt-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default QuanLyDanhMuc;
