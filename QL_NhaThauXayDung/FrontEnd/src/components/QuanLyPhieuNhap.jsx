import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Space, message, Tag, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../Config/AuthContext';
import BASE_URL from '../Config';

const { Search } = Input;

const QuanLyPhieuNhap = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [thietBiVatTuList, setThietBiVatTuList] = useState([]);
  const [chiTietPhieuNhap, setChiTietPhieuNhap] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const { user } = useAuth();

  // Mock data
  const mockData = [
    {
      MaPhieuNhap: 'PN001',
      NgayNhap: '2024-03-20',
      MaNhaCungCap: 'NCC001',
      TenNhaCungCap: 'Công ty TNHH Vật liệu xây dựng ABC',
      TongTien: 15000000,
      TrangThai: 'Đã giao',
      GhiChu: 'Giao hàng đúng hẹn'
    },
    {
      MaPhieuNhap: 'PN002',
      NgayNhap: '2024-03-19',
      MaNhaCungCap: 'NCC002',
      TenNhaCungCap: 'Công ty CP Thiết bị xây dựng XYZ',
      TongTien: 25000000,
      TrangThai: 'Chưa giao',
      GhiChu: 'Đang chờ xác nhận'
    },
    {
      MaPhieuNhap: 'PN003',
      NgayNhap: '2024-03-18',
      MaNhaCungCap: 'NCC003',
      TenNhaCungCap: 'Công ty TNHH Vật tư xây dựng 123',
      TongTien: 18000000,
      TrangThai: 'Đã giao',
      GhiChu: 'Giao hàng sớm hơn dự kiến'
    },
    {
      MaPhieuNhap: 'PN004',
      NgayNhap: '2024-03-17',
      MaNhaCungCap: 'NCC001',
      TenNhaCungCap: 'Công ty TNHH Vật liệu xây dựng ABC',
      TongTien: 22000000,
      TrangThai: 'Chưa giao',
      GhiChu: 'Đang chuẩn bị hàng'
    },
    {
      MaPhieuNhap: 'PN005',
      NgayNhap: '2024-03-16',
      MaNhaCungCap: 'NCC002',
      TenNhaCungCap: 'Công ty CP Thiết bị xây dựng XYZ',
      TongTien: 30000000,
      TrangThai: 'Đã giao',
      GhiChu: 'Giao hàng đúng hẹn'
    }
  ];

  useEffect(() => {
    fetchData();
    fetchNhaCungCap();
    fetchThietBiVatTu();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`${BASE_URL}/PhieuNhap_API.php?action=GET`);
      // setData(response.data.data);
      setData(mockData); // Using mock data for now
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNhaCungCap = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/NhaCungCap_API.php?action=GET`);
      setNhaCungCapList(response.data.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhà cung cấp: ' + error.message);
    }
  };

  const fetchThietBiVatTu = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ThietBiVatTu_API.php?action=GET`);
      setThietBiVatTuList(response.data.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thiết bị/vật tư: ' + error.message);
    }
  };

  const fetchChiTietPhieuNhap = async (maPhieuNhap) => {
    try {
      const response = await axios.get(`${BASE_URL}/ChiTietPhieuNhap_API.php?action=getByPhieuNhap&MaPhieuNhap=${maPhieuNhap}`);
      setChiTietPhieuNhap(response.data.data);
    } catch (error) {
      message.error('Lỗi khi tải chi tiết phiếu nhập: ' + error.message);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      NgayNhap: moment(record.NgayNhap)
    });
    setModalVisible(true);
  };

  const handleViewDetails = async (record) => {
    await fetchChiTietPhieuNhap(record.MaPhieuNhap);
    setEditingRecord(record);
    setDetailVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`${BASE_URL}/PhieuNhap_API.php?action=DELETE`, {
        data: { MaPhieuNhap: record.MaPhieuNhap }
      });
      message.success('Xóa phiếu nhập thành công');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa phiếu nhập: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        NgayNhap: values.NgayNhap.format('YYYY-MM-DD'),
        MaNhanVien: user.MaNhanVien
      };

      if (editingRecord) {
        await axios.put(`${BASE_URL}/PhieuNhap_API.php?action=PUT`, data);
        message.success('Cập nhật phiếu nhập thành công');
      } else {
        await axios.post(`${BASE_URL}/PhieuNhap_API.php?action=POST`, data);
        message.success('Thêm phiếu nhập thành công');
      }

      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Lỗi khi lưu phiếu nhập: ' + error.message);
    }
  };

  const getFilteredData = () => {
    return data.filter(item => {
      const matchesSearch = searchText === '' || 
        item.MaPhieuNhap.toLowerCase().includes(searchText.toLowerCase()) ||
        item.TenNhaCungCap.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = filterStatus === null || item.TrangThai === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
  };

  const handleReset = () => {
    setSearchText('');
    setFilterStatus(null);
  };

  const getTotalValue = () => {
    return data.reduce((sum, item) => sum + item.TongTien, 0);
  };

  const getStatusCount = (status) => {
    return data.filter(item => item.TrangThai === status).length;
  };

  const columns = [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'MaPhieuNhap',
      key: 'MaPhieuNhap',
      sorter: (a, b) => a.MaPhieuNhap.localeCompare(b.MaPhieuNhap)
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'NgayNhap',
      key: 'NgayNhap',
      sorter: (a, b) => new Date(a.NgayNhap) - new Date(b.NgayNhap)
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'TenNhaCungCap',
      key: 'TenNhaCungCap'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'TongTien',
      key: 'TongTien',
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
      sorter: (a, b) => a.TongTien - b.TongTien
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      render: (text) => {
        let color = 'blue';
        if (text === 'Đã giao') color = 'green';
        if (text === 'Chưa giao') color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          {user.LoaiNhanVien === 'Admin' && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            >
              Xóa
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">Quản lý phiếu nhập</h1>
        <Select
          value={filterStatus}
          onChange={handleStatusFilter}
          style={{ width: 200 }}
          placeholder="Lọc theo trạng thái"
          allowClear
          className="self-end md:self-auto"
        >
          <Select.Option value="Đã giao">Đã giao</Select.Option>
          <Select.Option value="Chưa giao">Chưa giao</Select.Option>
        </Select>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: 350 }}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm mới
        </Button>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="MaPhieuNhap"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} phiếu nhập`,
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            {editingRecord ? 'Sửa phiếu nhập' : 'Thêm phiếu nhập mới'}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        className="custom-modal"
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="MaPhieuNhap"
            label="Mã phiếu nhập"
            rules={[{ required: true, message: 'Vui lòng nhập mã phiếu nhập' }]}
          >
            <Input disabled={!!editingRecord} />
          </Form.Item>

          <Form.Item
            name="NgayNhap"
            label="Ngày nhập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhập' }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="MaNhaCungCap"
            label="Nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
          >
            <Select
              showSearch
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {nhaCungCapList.map(ncc => (
                <Select.Option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap} label={ncc.TenNhaCungCap}>
                  {ncc.TenNhaCungCap}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="Đã giao">Đã giao</Select.Option>
              <Select.Option value="Chưa giao">Chưa giao</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right border-t pt-4">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Chi tiết phiếu nhập
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1000}
        className="custom-modal"
        bodyStyle={{ padding: '24px' }}
      >
        {editingRecord && (
          <div>
            <p><strong>Mã phiếu nhập:</strong> {editingRecord.MaPhieuNhap}</p>
            <p><strong>Ngày nhập:</strong> {editingRecord.NgayNhap}</p>
            <p><strong>Nhà cung cấp:</strong> {editingRecord.TenNhaCungCap}</p>
            <p><strong>Trạng thái:</strong> {editingRecord.TrangThai}</p>
            <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(editingRecord.TongTien)}</p>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Chi tiết vật tư/thiết bị</h3>
              <Table
                columns={[
                  {
                    title: 'Mã vật tư/thiết bị',
                    dataIndex: 'MaThietBiVatTu',
                    key: 'MaThietBiVatTu'
                  },
                  {
                    title: 'Tên vật tư/thiết bị',
                    dataIndex: 'TenThietBiVatTu',
                    key: 'TenThietBiVatTu'
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'SoLuong',
                    key: 'SoLuong',
                    align: 'right'
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'DonGia',
                    key: 'DonGia',
                    align: 'right',
                    render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
                  },
                  {
                    title: 'Thành tiền',
                    key: 'ThanhTien',
                    align: 'right',
                    render: (_, record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.SoLuong * record.DonGia)
                  }
                ]}
                dataSource={chiTietPhieuNhap}
                rowKey="MaChiTietPhieuNhap"
                pagination={false}
                bordered
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuanLyPhieuNhap; 