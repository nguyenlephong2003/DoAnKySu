import React, { useState } from 'react';
import { Select } from 'antd';
import QuanLyLoaiBaoGia from './QuanLyLoaiBaoGia';
import QuanLyLoaiCongTrinh from './QuanLyLoaiCongTrinh';
import QuanLyLoaiThietBiVatTu from './QuanLyLoaiThietBiVatTu';
import QuanLyLoaiNhanVien from './QuanLyLoaiNhanVien';
import { useAuth } from '../Config/AuthContext';

const QuanLyDanhMuc = () => {
  const [selectedType, setSelectedType] = useState('loaibaogia');
  const { user } = useAuth();

  // Kiểm tra quyền truy cập
  const canAccess = user?.TenLoaiNhanVien === 'Admin' || 
                   user?.TenLoaiNhanVien === 'Kế toán' ||
                   user?.TenLoaiNhanVien === 'Giám đốc';

  // Kiểm tra quyền xem loại nhân viên
  const canViewLoaiNhanVien = user?.TenLoaiNhanVien === 'Admin' || 
                             user?.TenLoaiNhanVien === 'Giám đốc';

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

  // Tạo danh sách options dựa trên quyền
  const dropdownOptions = [
    
    { value: 'loaibaogia', label: 'Loại báo giá' },
    { value: 'loaicongtrinh', label: 'Loại công trình' },
    { value: 'loaithietbivattu', label: 'Loại thiết bị vật tư' },
  ];

  // Thêm option loại nhân viên nếu có quyền
  if (canViewLoaiNhanVien) {
    dropdownOptions.push({ value: 'loainhanvien', label: 'Loại nhân viên' });
  }

  // Nếu đang chọn loại nhân viên nhưng không có quyền, chuyển về loại báo giá
  if (selectedType === 'loainhanvien' && !canViewLoaiNhanVien) {
    setSelectedType('loaibaogia');
  }

  const renderComponent = () => {
    switch (selectedType) {
      case 'loaibaogia':
        return <QuanLyLoaiBaoGia />;
      case 'loaicongtrinh':
        return <QuanLyLoaiCongTrinh />;
      case 'loaithietbivattu':
        return <QuanLyLoaiThietBiVatTu />;
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
