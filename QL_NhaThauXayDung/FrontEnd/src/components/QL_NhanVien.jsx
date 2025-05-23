import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../Config';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QL_NhanVien = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]); // Danh sách nhân viên
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNV, setEditingNV] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Cập nhật danh sách loại nhân viên từ API
  const loaiNhanVienOptions = [
    { MaLoaiNhanVien: 1, TenLoaiNhanVien: 'Admin' },
    { MaLoaiNhanVien: 2, TenLoaiNhanVien: 'Giám đốc' },
    { MaLoaiNhanVien: 3, TenLoaiNhanVien: 'Kế toán' },
    { MaLoaiNhanVien: 4, TenLoaiNhanVien: 'Nhân sự' },
    { MaLoaiNhanVien: 5, TenLoaiNhanVien: 'Quản lý công trình' },
    { MaLoaiNhanVien: 6, TenLoaiNhanVien: 'Thợ chính' },
    { MaLoaiNhanVien: 7, TenLoaiNhanVien: 'Thợ phụ' },
    { MaLoaiNhanVien: 8, TenLoaiNhanVien: 'Nhân viên kho' },
    { MaLoaiNhanVien: 9, TenLoaiNhanVien: 'Nhân viên tư vấn' },
  ];

  useEffect(() => {
    console.log('Component QL_NhanVien mounted');
    fetchData();
    return () => console.log('Component QL_NhanVien unmounted');
  }, []);

  const fetchData = async () => {
    console.log('Fetching data...');
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`);
      const res = response.data;

      if (res.status === 'success') {
        const formattedData = res.data.map(item => ({
          ...item,
          NgayVao: item.NgayVao ? item.NgayVao.split(' ')[0] : '',
        }));

        setData(formattedData);
        console.log('Data loaded:', formattedData);
      } else {
        message.error('Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      message.error('Lỗi khi kết nối API');
    } finally {
      setLoading(false);
    }
  };

 const openAddModal = () => {
  setEditingNV(null);
  form.resetFields();

  // Sinh mã nhân viên mới
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const newMaNhanVien = `NV${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

  // Đặt giá trị mặc định
  form.setFieldsValue({
    MaNhanVien: newMaNhanVien,
    MaLoaiNhanVien: loaiNhanVienOptions[0].MaLoaiNhanVien, // Giá trị mặc định
  });

  setModalVisible(true);
};

  const openEditModal = (record) => {
    setEditingNV(record);
    form.setFieldsValue({
      ...record,
      NgayVao: record.NgayVao ? record.NgayVao.split(' ')[0] : ''
    });
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    console.log('Deleting record:', record);
    try {
      const response = await axios.delete(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=DELETE`, {
        data: { MaNhanVien: record.MaNhanVien }
      });

      if (response.data.status === 'success') {
        message.success('Xóa thành công');
        fetchData(); // Tải lại dữ liệu sau khi xóa
      } else {
        message.error('Lỗi: ' + response.data.message || 'Không thể xóa nhân viên');
      }
    } catch (err) {
      console.error('Error deleting:', err);
      message.error('Lỗi khi xóa nhân viên');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      if (editingNV) {
        // Cập nhật nhân viên
        const response = await axios.put(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=PUT`, values);

        if (response.data.status === 'success') {
          message.success('Cập nhật thành công');
          fetchData(); // Tải lại dữ liệu sau khi cập nhật
        } else {
          message.error('Lỗi: ' + response.data.message || 'Không thể cập nhật nhân viên');
        }
      } else {
        // Thêm nhân viên mới
        const response = await axios.post(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=POST`, values);

        if (response.data.status === 'success') {
          message.success('Thêm mới thành công');
          fetchData(); // Tải lại dữ liệu sau khi thêm
        } else {
          message.error('Lỗi: ' + response.data.message || 'Không thể thêm nhân viên');
        }
      }
      setModalVisible(false);
    } catch (err) {
      console.error('Error saving form:', err);
    }
  };

  const handleLoaiNhanVienChange = (value) => {
  console.log('Chọn loại NV:', value);
  form.setFieldValue('MaLoaiNhanVien', value);

  if (!editingNV) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const newMaNhanVien = `NV${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    form.setFieldValue('MaNhanVien', newMaNhanVien);
  } else {
    if (editingNV.MaLoaiNhanVien === value) {
      form.setFieldValue('MaNhanVien', editingNV.MaNhanVien);
    }
  }
};

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredData = data.filter(item =>
    item.MaNhanVien.toLowerCase().includes(searchText.toLowerCase()) ||
    item.TenNhanVien.toLowerCase().includes(searchText.toLowerCase()) ||
    item.SoDT.includes(searchText) ||
    item.CCCD.includes(searchText) ||
    item.Email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.TenLoaiNhanVien.toLowerCase().includes(searchText.toLowerCase())
  );

 const columns = [
  {
    title: 'Mã NV',
    dataIndex: 'MaNhanVien',
    key: 'MaNhanVien',
    sorter: (a, b) => a.MaNhanVien.localeCompare(b.MaNhanVien), // Sắp xếp chuỗi
  },
  {
    title: 'Tên NV',
    dataIndex: 'TenNhanVien',
    key: 'TenNhanVien',
    sorter: (a, b) => a.TenNhanVien.localeCompare(b.TenNhanVien), // Sắp xếp chuỗi
  },
  {
    title: 'SĐT',
    dataIndex: 'SoDT',
    key: 'SoDT',
    sorter: (a, b) => a.SoDT.localeCompare(b.SoDT), // Sắp xếp chuỗi
  },
  {
    title: 'CCCD',
    dataIndex: 'CCCD',
    key: 'CCCD',
    sorter: (a, b) => a.CCCD.localeCompare(b.CCCD), // Sắp xếp chuỗi
  },
  {
    title: 'Email',
    dataIndex: 'Email',
    key: 'Email',
    sorter: (a, b) => a.Email.localeCompare(b.Email), // Sắp xếp chuỗi
  },
  {
    title: 'Ngày vào',
    dataIndex: 'NgayVao',
    key: 'NgayVao',
    render: (text) => (text ? text.split(' ')[0] : ''),
    sorter: (a, b) => new Date(a.NgayVao) - new Date(b.NgayVao), // Sắp xếp ngày
  },
  {
    title: 'Lương Căn bản',
    dataIndex: 'LuongCanBan',
    key: 'LuongCanBan',
    sorter: (a, b) => a.LuongCanBan - b.LuongCanBan, // Sắp xếp số
  },
  {
    title: 'Loại NV',
    dataIndex: 'TenLoaiNhanVien',
    key: 'TenLoaiNhanVien',
    sorter: (a, b) => a.TenLoaiNhanVien.localeCompare(b.TenLoaiNhanVien), // Sắp xếp chuỗi
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <>
        <Button
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
          style={{ marginRight: 8 }}
        >
          Sửa
        </Button>
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record)}
        >
          <Button icon={<DeleteOutlined />} danger>
            Xóa
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

  console.log("Render QL Nhân Viên");

  // Kiểm tra nếu đang được render trong route trực tiếp
  const isDirectRoute = window.location.pathname.includes("/nhansu/quan-ly-nhan-vien");

  return (
    <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: isDirectRoute ? 0 : 24 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Quản lý nhân viên</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ maxWidth: 300 }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="MaNhanVien"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={modalVisible}
        title={editingNV ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="MaNhanVien" label="Mã nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="TenNhanVien" label="Tên nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="SoDT" label="Số điện thoại" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="CCCD" label="CCCD" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[
            { required: true, message: 'Bắt buộc' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="NgayVao" label="Ngày vào" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="LuongCanBan" label="Lương Căn bản" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="MaLoaiNhanVien"
            label="Loại nhân viên"
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Select placeholder="Chọn loại nhân viên" onChange={handleLoaiNhanVienChange}>
              {loaiNhanVienOptions.map((item) => (
                <Option key={item.MaLoaiNhanVien} value={item.MaLoaiNhanVien}>
                  {item.TenLoaiNhanVien}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QL_NhanVien;
