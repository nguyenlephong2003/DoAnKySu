import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Spin, message, Pagination, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config'; // Đường dẫn đến file config của bạn
import AddBaoGiaForm from './AddBaoGia'; // Import component form thêm mới
import DetailBaoGiaModal from './ChiTietBaoGia'; // Import component modal chi tiết

const { Option } = Select;

const BaoGia = () => {
  const [bangBaoGiaList, setBangBaoGiaList] = useState([]);
  const [loaiBaoGiaList, setLoaiBaoGiaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [addModalVisible, setAddModalVisible] = useState(false); // State cho modal thêm mới
  const [detailModalVisible, setDetailModalVisible] = useState(false); // State cho modal chi tiết
  const [currentBaoGia, setCurrentBaoGia] = useState(null); // Báo giá đang được xem chi tiết

  const statusColors = {
    'Chờ duyệt': 'orange',
    'Đã duyệt': 'green',
    'Từ chối': 'red',
    'Hoàn thành': 'blue'
  };

  // Lấy danh sách báo giá và loại báo giá
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Lấy tất cả báo giá
      const baoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=GET`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (baoGiaResponse.data.status === 'success') {
        setBangBaoGiaList(baoGiaResponse.data.data);
        setPagination(prev => ({
          ...prev,
          total: baoGiaResponse.data.data.length
        }));
      } else {
        message.error('Không thể lấy dữ liệu báo giá');
      }

      // Lấy tất cả loại báo giá
      const loaiBaoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getAllLoaiBaoGia`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (loaiBaoGiaResponse.data.status === 'success') {
        setLoaiBaoGiaList(loaiBaoGiaResponse.data.data);
      } else {
        message.error('Không thể lấy dữ liệu loại báo giá');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên tìm kiếm và loại báo giá
  const getFilteredData = () => {
    let filteredData = [...bangBaoGiaList];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TrangThai.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.TenLoaiBaoGia && item.TenLoaiBaoGia.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Lọc theo loại báo giá
    if (selectedLoai !== 'all') {
      filteredData = filteredData.filter(item => item.MaLoai === selectedLoai);
    }

    return filteredData;
  };

  // Xử lý phân trang
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Hiển thị dữ liệu phân trang
  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return filteredData.slice(startIndex, endIndex);
  };

  // Columns của bảng
  const columns = [
    {
      title: 'Mã báo giá',
      dataIndex: 'MaBaoGia',
      key: 'MaBaoGia',
      sorter: (a, b) => a.MaBaoGia.localeCompare(b.MaBaoGia),
    },
    {
      title: 'Tên báo giá',
      dataIndex: 'TenBaoGia',
      key: 'TenBaoGia',
      sorter: (a, b) => a.TenBaoGia.localeCompare(b.TenBaoGia),
    },
    {
      title: 'Loại báo giá',
      dataIndex: 'TenLoaiBaoGia',
      key: 'TenLoaiBaoGia',
      sorter: (a, b) => {
        if (!a.TenLoaiBaoGia) return -1;
        if (!b.TenLoaiBaoGia) return 1;
        return a.TenLoaiBaoGia.localeCompare(b.TenLoaiBaoGia);
      },
      render: (text, record) => text || `Loại ${record.MaLoai}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      sorter: (a, b) => a.TrangThai.localeCompare(b.TrangThai),
      render: (text) => (
        <Tag color={statusColors[text] || 'default'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<InfoCircleOutlined />} 
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          <Button 
            icon={<EditOutlined />} 
            type="default"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Hiển thị modal chi tiết
  const showDetailModal = (record) => {
    setCurrentBaoGia(record);
    setDetailModalVisible(true);
  };

  // Hàm xử lý sửa (có thể mở modal sửa)
  const handleEdit = (record) => {
    message.info(`Đang chuẩn bị sửa báo giá: ${record.MaBaoGia}`);
    // Thêm code xử lý sửa báo giá ở đây
  };

  // Hàm xử lý xóa (hiển thị xác nhận trước khi xóa)
  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa báo giá "${record.TenBaoGia}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios({
            method: 'DELETE',
            url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=deleteBangBaoGia`,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            data: {
              MaBaoGia: record.MaBaoGia
            }
          });

          if (response.data.status === 'success') {
            message.success('Xóa báo giá thành công');
            fetchData(); // Tải lại dữ liệu
          } else {
            message.error(response.data.message || 'Xóa báo giá thất bại');
          }
        } catch (error) {
          console.error('Error deleting data:', error);
          message.error('Lỗi khi xóa báo giá');
        }
      }
    });
  };

  // Hàm thêm báo giá mới - mở modal thêm mới
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // Hàm xử lý sau khi thêm thành công
  const handleAddSuccess = () => {
    fetchData(); // Tải lại dữ liệu
  };

  return (
    <div className="bao-gia-management" >
<h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
  Quản lý báo giá
</h1>      
      {/* Thanh tìm kiếm và lọc */}
      <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Tìm kiếm báo giá..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        
        <Select
          placeholder="Chọn loại báo giá"
          style={{ width: 200 }}
          value={selectedLoai}
          onChange={value => setSelectedLoai(value)}
        >
          <Option value="all">Tất cả loại</Option>
          {loaiBaoGiaList.map(loai => (
            <Option key={loai.MaLoai} value={loai.MaLoai}>
              {loai.TenLoai}
            </Option>
          ))}
        </Select>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm báo giá
        </Button>
      </div>
      
      {/* Bảng dữ liệu */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={getPaginatedData()}
          rowKey="MaBaoGia"
          pagination={false}
          onChange={handleTableChange}
        />
        
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={getFilteredData().length}
          onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
          style={{ marginTop: 16, textAlign: 'right' }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} mục`}
        />
      </Spin>
      
      {/* Form thêm mới báo giá */}
      <AddBaoGiaForm
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={handleAddSuccess}
        loaiBaoGiaList={loaiBaoGiaList}
      />
      
      {/* Modal chi tiết báo giá */}
      <DetailBaoGiaModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        baoGia={currentBaoGia}
      />
    </div>
  );
};

export default BaoGia;