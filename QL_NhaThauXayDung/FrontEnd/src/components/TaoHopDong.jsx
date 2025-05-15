import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Spin, message, Pagination, Modal, Form, DatePicker, InputNumber } from 'antd';
import { SearchOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import dayjs from 'dayjs';

const TaoHopDong = () => {
  const [hopDongList, setHopDongList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setCurrentUser(userInfo);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch contracts
      const hopDongResponse = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=GET`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (hopDongResponse.data.data) {
        setHopDongList(hopDongResponse.data.data);
        setPagination(prev => ({
          ...prev,
          total: hopDongResponse.data.data.length
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...hopDongList];

    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaHopDong.toLowerCase().includes(searchText.toLowerCase()) ||
          item.MoTa.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    filteredData.sort((a, b) => b.MaHopDong.localeCompare(a.MaHopDong));

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

  const handleCreateContract = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Generate contract code
      const contractCode = `HD${Date.now().toString().slice(-6)}`;

      const contractData = {
        MaHopDong: contractCode,
        NgayKy: values.NgayKy.format('YYYY-MM-DD'),
        MoTa: values.MoTa,
        TongTien: values.TongTien,
        MaNhanVien: currentUser.MaNhanVien // Lấy mã nhân viên từ localStorage
      };

      const response = await axios.post(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=POST`,
        contractData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Tạo hợp đồng thành công.") {
        message.success('Tạo hợp đồng thành công');
        setModalVisible(false);
        form.resetFields();
        fetchData(); // Refresh the list
      } else {
        message.error(response.data.message || 'Tạo hợp đồng thất bại');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      message.error('Lỗi khi tạo hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'MaHopDong',
      key: 'MaHopDong',
    },
    {
      title: 'Ngày ký',
      dataIndex: 'NgayKy',
      key: 'NgayKy',
      render: (text) => new Date(text).toLocaleDateString('vi-VN')
    },
    {
      title: 'Mô tả',
      dataIndex: 'MoTa',
      key: 'MoTa',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'TongTien',
      key: 'TongTien',
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
    },
    {
      title: 'File hợp đồng',
      key: 'FileHopDong',
      render: (_, record) => (
        record.FileHopDong ? (
          <Button
            type="link"
            icon={<FileOutlined />}
            onClick={() => window.open(record.FileHopDong, '_blank')}
          >
            Xem file
          </Button>
        ) : (
          <span>Chưa có file</span>
        )
      ),
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Tạo hợp đồng mới
      </h1>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Tìm kiếm hợp đồng..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Tạo hợp đồng mới
        </Button>
      </div>
      
      <Spin spinning={loading}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table
            columns={columns}
            dataSource={getPaginatedData()}
            rowKey="MaHopDong"
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

      <Modal
        title="Tạo hợp đồng mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateContract}
        >
          <Form.Item
            name="NgayKy"
            label="Ngày ký"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ký' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="MoTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả hợp đồng" />
          </Form.Item>

          <Form.Item
            name="TongTien"
            label="Tổng tiền"
            rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập tổng tiền"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo hợp đồng
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaoHopDong; 