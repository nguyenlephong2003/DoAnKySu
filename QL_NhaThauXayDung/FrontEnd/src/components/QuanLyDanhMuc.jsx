import React, { useState } from 'react';
import { Select } from 'antd';
import QuanLyLoaiBaoGia from './QuanLyLoaiBaoGia';
import QuanLyLoaiCongTrinh from './QuanLyLoaiCongTrinh';
import QuanLyLoaiThietBiVatTu from './QuanLyLoaiThietBiVatTu';
import QuanLyLoaiNhanVien from './QuanLyLoaiNhanVien';

const QuanLyDanhMuc = () => {
  const [selectedType, setSelectedType] = useState('loaibaogia');

  const renderComponent = () => {
    switch (selectedType) {
      case 'loaibaogia':
        return <QuanLyLoaiBaoGia />;
      case 'loaicongtrinh':
        return <QuanLyLoaiCongTrinh />;
      case 'loaithietbivattu':
        return <QuanLyLoaiThietBiVatTu />;
      case 'loainhanvien':
        return <QuanLyLoaiNhanVien />;
      default:
        return <QuanLyLoaiBaoGia />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Select
          value={selectedType}
          onChange={setSelectedType}
          style={{ width: 200 }}
          options={[
            { value: 'loaibaogia', label: 'Loại báo giá' },
            { value: 'loaicongtrinh', label: 'Loại công trình' },
            { value: 'loaithietbivattu', label: 'Loại thiết bị vật tư' },
            { value: 'loainhanvien', label: 'Loại nhân viên' }
          ]}
        />
      </div>
      
      <div className="mt-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default QuanLyDanhMuc;
