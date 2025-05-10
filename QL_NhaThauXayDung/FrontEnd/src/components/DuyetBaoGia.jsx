import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Spin, message, Pagination, Modal, Form } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import DetailBaoGiaModal from './ChiTietBaoGia';

const { Option } = Select;
const { confirm } = Modal;

const DuyetBaoGia = () => {
  const [bangBaoGiaList, setBangBaoGiaList] = useState([]);
  const [loaiBaoGiaList, setLoaiBaoGiaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentBaoGia, setCurrentBaoGia] = useState(null);

  const statusColors = {
    'Chờ duyệt': 'orange',
    'Đã duyệt': 'green',
    'Từ chối': 'red',
    'Hoàn thành': 'blue'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
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

  const getFilteredData = () => {
    let filteredData = [...bangBaoGiaList];

    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TrangThai.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.TenLoaiBaoGia && item.TenLoaiBaoGia.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (selectedLoai !== 'all') {
      filteredData = filteredData.filter(item => item.MaLoai === selectedLoai);
    }

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(item => item.TrangThai === selectedStatus);
    }

    filteredData.sort((a, b) => b.MaBaoGia.localeCompare(a.MaBaoGia));

    return filteredData;
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return filteredData.slice(startIndex, endIndex);
  };

  const handleDuyet = async (record) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: 'PUT',
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=updateBangBaoGia`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          MaBaoGia: record.MaBaoGia,
          TenBaoGia: record.TenBaoGia,
          MaLoai: record.MaLoai,
          TrangThai: 'Đã duyệt',
          ChiTietLoaiBaoGia: record.ChiTietLoaiBaoGia || []
        }
      });

      if (response.data.status === 'success') {
        message.success('Duyệt báo giá thành công');
        fetchData();
      } else {
        message.error(response.data.message || 'Duyệt báo giá thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi duyệt:', error);
      message.error('Lỗi khi duyệt báo giá: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTuChoi = async (record) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: 'PUT',
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=updateBangBaoGia`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          MaBaoGia: record.MaBaoGia,
          TenBaoGia: record.TenBaoGia,
          MaLoai: record.MaLoai,
          TrangThai: 'Từ chối',
          ChiTietLoaiBaoGia: record.ChiTietLoaiBaoGia || []
        }
      });

      if (response.data.status === 'success') {
        message.success('Từ chối báo giá thành công');
        fetchData();
      } else {
        message.error(response.data.message || 'Từ chối báo giá thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi từ chối:', error);
      message.error('Lỗi khi từ chối báo giá: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const showDetailModal = (record) => {
    setCurrentBaoGia(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã báo giá',
      dataIndex: 'MaBaoGia',
      key: 'MaBaoGia',
    },
    {
      title: 'Tên báo giá',
      dataIndex: 'TenBaoGia',
      key: 'TenBaoGia',
    },
    {
      title: 'Loại báo giá',
      dataIndex: 'TenLoaiBaoGia',
      key: 'TenLoaiBaoGia',
      render: (text, record) => text || `Loại ${record.MaLoai}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
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
          {record.TrangThai === 'Chờ duyệt' && (
            <>
              <Button 
                icon={<CheckCircleOutlined />} 
                type="primary"
                style={{ backgroundColor: '#52c41a' }}
                onClick={() => handleDuyet(record)}
              >
                Duyệt
              </Button>
              <Button 
                icon={<CloseCircleOutlined />} 
                danger
                onClick={() => handleTuChoi(record)}
              >
                Từ chối
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Duyệt báo giá
      </h1>
      
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

        <Select
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
          value={selectedStatus}
          onChange={value => setSelectedStatus(value)}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Đã duyệt">Đã duyệt</Option>
          <Option value="Từ chối">Từ chối</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
        </Select>
      </div>
      
      <Spin spinning={loading}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table
            columns={columns}
            dataSource={getPaginatedData()}
            rowKey="MaBaoGia"
            pagination={false}
            onChange={handleTableChange}
            className="rounded-lg"
            style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}
          />
        </div>
        
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
      
      <DetailBaoGiaModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        baoGia={currentBaoGia}
      />
    </div>
  );
};

export default DuyetBaoGia; 