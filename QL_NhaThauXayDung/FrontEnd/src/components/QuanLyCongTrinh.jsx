import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';

const QuanLyCongTrinh = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  const columns = [
    { title: 'Mã công trình', dataIndex: 'MaCongTrinh', key: 'MaCongTrinh', width: 120, align: 'center', sorter: (a, b) => a.MaCongTrinh.localeCompare(b.MaCongTrinh) },
    { title: 'Tên công trình', dataIndex: 'TenCongTrinh', key: 'TenCongTrinh', width: 250, align: 'center', sorter: (a, b) => a.TenCongTrinh.localeCompare(b.TenCongTrinh) },
    { title: 'Loại công trình', dataIndex: 'TenLoaiCongTrinh', key: 'TenLoaiCongTrinh', width: 180, align: 'center', sorter: (a, b) => (a.TenLoaiCongTrinh || '').localeCompare(b.TenLoaiCongTrinh || '') },
    { title: 'Tên khách hàng', dataIndex: 'TenKhachHang', key: 'TenKhachHang', width: 200, align: 'center', sorter: (a, b) => (a.TenKhachHang || '').localeCompare(b.TenKhachHang || '') },
    { title: 'Ngày dự kiến hoàn thành', dataIndex: 'NgayDuKienHoanThanh', key: 'NgayDuKienHoanThanh', width: 180, align: 'center', sorter: (a, b) => (a.NgayDuKienHoanThanh || '').localeCompare(b.NgayDuKienHoanThanh || '') },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button type="primary" onClick={() => message.info(`Xem chi tiết: ${record.MaCongTrinh}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý công trình</h1>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="MaCongTrinh"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default QuanLyCongTrinh;