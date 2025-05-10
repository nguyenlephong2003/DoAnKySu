import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const QuanLyCongTrinh = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    NgayDuKienHoanThanh: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editRecord) {
      const date = editRecord.NgayDuKienHoanThanh ? moment(editRecord.NgayDuKienHoanThanh) : null;
      setEditForm({
        NgayDuKienHoanThanh: date,
      });
    }
  }, [editRecord]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=GET`);
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu công trình');
      }
    } catch {
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách loại công trình duy nhất từ data
  const loaiCongTrinhOptions = [
    { value: 'all', label: 'Tất cả loại công trình' },
    ...Array.from(new Set(data.map(item => item.TenLoaiCongTrinh).filter(Boolean))).map(loai => ({ value: loai, label: loai }))
  ];

  const getFilteredData = () => {
    let filtered = data;
    if (selectedLoai !== 'all') {
      filtered = filtered.filter(item => item.TenLoaiCongTrinh === selectedLoai);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        item =>
          (item.MaCongTrinh && item.MaCongTrinh.toLowerCase().includes(lower)) ||
          (item.TenCongTrinh && item.TenCongTrinh.toLowerCase().includes(lower)) ||
          (item.TenKhachHang && item.TenKhachHang.toLowerCase().includes(lower)) ||
          (item.TenLoaiCongTrinh && item.TenLoaiCongTrinh.toLowerCase().includes(lower))
      );
    }
    return filtered;
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditVisible(true);
  };

  const handleDateChange = (date) => {
    setEditForm({
      ...editForm,
      NgayDuKienHoanThanh: date,
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Format date to YYYY-MM-DD format
      const formattedDate = editForm.NgayDuKienHoanThanh ? 
                            editForm.NgayDuKienHoanThanh.format('YYYY-MM-DD') : null;
      
      // Create updated record with only the editable date field
      const updatedRecord = {
        ...editRecord,
        NgayDuKienHoanThanh: formattedDate,
      };

      // API call to update the record
      const res = await axios.put(`${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=PUT`, updatedRecord);
      
      if (res.data.status === 'success') {
        message.success('Cập nhật công trình thành công');
        fetchData(); // Refresh data
        setEditVisible(false);
      } else {
        message.error('Cập nhật công trình thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi kết nối đến server');
    }
  };

  const columns = [
    { title: 'Mã công trình', dataIndex: 'MaCongTrinh', key: 'MaCongTrinh', width: 120, align: 'center' },
    { title: 'Tên công trình', dataIndex: 'TenCongTrinh', key: 'TenCongTrinh', width: 250, align: 'center' },
    { title: 'Loại công trình', dataIndex: 'TenLoaiCongTrinh', key: 'TenLoaiCongTrinh', width: 180, align: 'center' },
    { title: 'Tên khách hàng', dataIndex: 'TenKhachHang', key: 'TenKhachHang', width: 200, align: 'center' },
    { title: 'Ngày dự kiến hoàn thành', dataIndex: 'NgayDuKienHoanThanh', key: 'NgayDuKienHoanThanh', width: 180, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button type="primary" onClick={() => { setCurrentRecord(record); setDetailVisible(true); }}>
            Xem chi tiết
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Quản lý công trình</h1>
        <Select
          value={selectedLoai}
          onChange={setSelectedLoai}
          style={{ width: 200 }}
          options={loaiCongTrinhOptions}
          className="self-end md:self-auto"
        />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: 350 }}
          allowClear
        />
      </div>
      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="MaCongTrinh"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} công trình`,
          }}
        />
      </div>
      
      {/* Chi tiết công trình modal */}
      <Modal
        title="Chi tiết công trình"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {currentRecord && (
          <div>
            {currentRecord.MaCongTrinh && (
              <p><strong>Mã công trình:</strong> {currentRecord.MaCongTrinh}</p>
            )}
            {currentRecord.TenCongTrinh && (
              <p><strong>Tên công trình:</strong> {currentRecord.TenCongTrinh}</p>
            )}
            {currentRecord.Dientich && (
              <p><strong>Diện tích:</strong> {currentRecord.Dientich}m²</p>
            )}
            {currentRecord.FileThietKe && (
              <p><strong>File thiết kế:</strong> {currentRecord.FileThietKe}</p>
            )}
            {currentRecord.TenKhachHang && (
              <p><strong>Tên khách hàng:</strong> {currentRecord.TenKhachHang}</p>
            )}
            {currentRecord.MaHopDong && (
              <p><strong>Mã hợp đồng:</strong> {currentRecord.MaHopDong}</p>
            )}
            {currentRecord.TenLoaiCongTrinh && (
              <p><strong>Loại công trình:</strong> {currentRecord.TenLoaiCongTrinh}</p>
            )}
            {currentRecord.NgayDuKienHoanThanh && (
              <p><strong>Ngày dự kiến hoàn thành:</strong> {currentRecord.NgayDuKienHoanThanh}</p>
            )}
          </div>
        )}
      </Modal>
      
      {/* Sửa công trình modal */}
      <Modal
        title="Sửa công trình"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={[
          <Button key="close" onClick={() => setEditVisible(false)}>
            Đóng
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            Lưu
          </Button>
        ]}
      >
        {editRecord && (
          <div className="space-y-4">
            <div>
              <strong>Mã công trình:</strong>
              <Input 
                value={editRecord.MaCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên công trình:</strong>
              <Input 
                value={editRecord.TenCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Diện tích (m²):</strong>
              <Input 
                value={editRecord.Dientich} 
                className="mt-1" 
                suffix="m²" 
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>File thiết kế:</strong>
              <Input 
                value={editRecord.FileThietKe} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên khách hàng:</strong>
              <Input 
                value={editRecord.TenKhachHang} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Mã hợp đồng:</strong>
              <Input 
                value={editRecord.MaHopDong} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Loại công trình:</strong>
              <Input 
                value={editRecord.TenLoaiCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Ngày dự kiến hoàn thành:</strong>
              <DatePicker 
                className="mt-1 w-full"
                value={editForm.NgayDuKienHoanThanh}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                placeholder="Chọn ngày"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuanLyCongTrinh;