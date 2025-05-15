import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Spin, message, Pagination, Modal, Form, DatePicker, InputNumber } from 'antd';
import { SearchOutlined, FileOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import dayjs from 'dayjs';

const DuyetHopDong = () => {
  const [hopDongList, setHopDongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState({});
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

        // Fetch employee information for each contract
        const nhanVienMap = {};
        for (const hopDong of hopDongResponse.data.data) {
          if (hopDong.MaNhanVien && !nhanVienMap[hopDong.MaNhanVien]) {
            try {
              const nhanVienResponse = await axios.get(
                `${BASE_URL}NguoiDung_API/NhanVien_API.php?action=getById&MaNhanVien=${hopDong.MaNhanVien}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              if (nhanVienResponse.data.data) {
                nhanVienMap[hopDong.MaNhanVien] = nhanVienResponse.data.data;
              }
            } catch (error) {
              console.error(`Error fetching employee info for ${hopDong.MaNhanVien}:`, error);
            }
          }
        }
        setNhanVienList(nhanVienMap);
      } else {
        message.error('Không thể lấy dữ liệu hợp đồng');
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
          item.MoTa.toLowerCase().includes(searchText.toLowerCase()) ||
          (nhanVienList[item.MaNhanVien]?.TenNhanVien || '').toLowerCase().includes(searchText.toLowerCase())
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
        MaNhanVien: currentUser.MaNhanVien,
        TrangThai: values.TrangThai || 'Chờ duyệt',
        GhiChu: values.GhiChu || ''
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

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Danh sách hợp đồng</h1>
        <div className="flex justify-between items-center mb-6">
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

        <Table
          dataSource={getPaginatedData()}
          columns={[
            {
              title: 'Mã hợp đồng',
              dataIndex: 'MaHopDong',
              key: 'MaHopDong',
            },
            {
              title: 'Ngày ký',
              dataIndex: 'NgayKy',
              key: 'NgayKy',
              render: (text) => new Date(text).toLocaleDateString('vi-VN'),
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
              render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
            },
            {
              title: 'Trạng thái',
              dataIndex: 'TrangThai',
              key: 'TrangThai',
              render: (text) => (
                <Tag color={text === 'Đã duyệt' ? 'green' : text === 'Từ chối' ? 'red' : 'orange'}>
                  {text}
                </Tag>
              ),
            },
            {
              title: 'Ghi chú',
              dataIndex: 'GhiChu',
              key: 'GhiChu',
            },
            {
              title: 'File hợp đồng',
              dataIndex: 'FileHopDong',
              key: 'FileHopDong',
              render: (text) => text ? (
                <Button
                  type="link"
                  icon={<FileOutlined />}
                  onClick={() => window.open(text, '_blank')}
                >
                  Xem file
                </Button>
              ) : 'Chưa có file',
            },
          ]}
          rowKey="MaHopDong"
          pagination={false}
          loading={loading}
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={getFilteredData().length}
            onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} mục`}
          />
        </div>
      </div>

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
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả hợp đồng"
            />
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

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            initialValue="Chờ duyệt"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Tạo hợp đồng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DuyetHopDong; 