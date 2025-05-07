import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const QuanLyDanhMuc = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Chọn loại danh mục');

  const options = [
    'Loại báo giá',
    'Loại công trình',
    'Loại nhân viên',
    'Loại thiết bị vật tư'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <h1 className="text-2xl font-bold mb-6">Quản lý danh mục</h1>
      
      <div className="relative w-72">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm 
                    hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                    flex items-center justify-between transition-colors duration-150"
        >
          <span className={`${selectedOption === 'Chọn loại danh mục' ? 'text-gray-500' : 'text-black'}`}>
            {selectedOption}
          </span>
          <FaChevronDown className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <ul className="py-1">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedOption(option);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer
                           hover:text-blue-600 transition-colors duration-150"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuanLyDanhMuc;
