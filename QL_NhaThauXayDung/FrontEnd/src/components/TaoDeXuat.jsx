import React, { useState } from 'react';
import { Select } from 'antd';
import LapDeXuatMua from './LapDeXuatMua';

const TaoDeXuat = () => {
  const [selectedType, setSelectedType] = useState('');

  const renderComponent = () => {
    switch (selectedType) {
      case 'muatbvt':
        return <LapDeXuatMua />;
      default:
        return null;
    }
  };

  const options = selectedType === ''
    ? [
        { value: '', label: 'Chọn loại đề xuất', disabled: true },
        { value: 'muatbvt', label: 'Mua thiết bị vật tư' },
        // Thêm các loại khác nếu cần
      ]
    : [
        { value: 'muatbvt', label: 'Mua thiết bị vật tư' },
        // Thêm các loại khác nếu cần
      ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tạo đề xuất</h1>
        <Select
          value={selectedType}
          onChange={setSelectedType}
          style={{ width: 220 }}
          placeholder="Chọn loại đề xuất"
          options={options}
        />
      </div>
      <div className="mt-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default TaoDeXuat; 