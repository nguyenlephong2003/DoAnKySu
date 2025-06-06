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
  Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const QL_NhanVien = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]); // Danh sách nhân viên
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNV, setEditingNV] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedNV, setSelectedNV] = useState(null);

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

  // Cấu hình axios mặc định
  axios.defaults.withCredentials = true;

  // Cấu hình interceptor để xử lý lỗi 401
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    console.log('Component QL_NhanVien mounted');
    fetchData();
    return () => console.log('Component QL_NhanVien unmounted');
  }, []);

  const fetchData = async () => {
    console.log('Fetching data...');
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`, {
        withCredentials: true
      });
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
      if (err.response && err.response.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        message.error('Lỗi khi kết nối API');
      }
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
        withCredentials: true,
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
      if (err.response && err.response.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        message.error('Lỗi khi xóa nhân viên');
      }
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      if (editingNV) {
        // Cập nhật nhân viên
        const response = await axios.put(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=PUT`, values, {
          withCredentials: true
        });

        if (response.data.status === 'success') {
          message.success('Cập nhật thành công');
          fetchData(); // Tải lại dữ liệu sau khi cập nhật
        } else {
          message.error('Lỗi: ' + response.data.message || 'Không thể cập nhật nhân viên');
        }
      } else {
        // Thêm nhân viên mới
        const response = await axios.post(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=POST`, values, {
          withCredentials: true
        });

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
      if (err.response && err.response.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        message.error('Lỗi khi lưu dữ liệu');
      }
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
    sorter: (a, b) => a.MaNhanVien.localeCompare(b.MaNhanVien),
    width: 110,
  },
  {
    title: 'Tên NV',
    dataIndex: 'TenNhanVien',
    key: 'TenNhanVien',
    sorter: (a, b) => a.TenNhanVien.localeCompare(b.TenNhanVien),
    width: 180,
  },
  {
    title: 'SĐT',
    dataIndex: 'SoDT',
    key: 'SoDT',
    sorter: (a, b) => a.SoDT.localeCompare(b.SoDT),
    width: 120,
  },
  {
    title: 'Loại NV',
    dataIndex: 'TenLoaiNhanVien',
    key: 'TenLoaiNhanVien',
    sorter: (a, b) => a.TenLoaiNhanVien.localeCompare(b.TenLoaiNhanVien),
    width: 160,
  },
  {
    title: 'Hành động',
    key: 'actions',
    width: 180,
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
        <Button
          type="primary"
          style={{ marginLeft: 8, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => showDetailModal(record)}
        >
          Chi tiết
        </Button>
      </>
    ),
  },
];

  console.log("Render QL Nhân Viên");

  // Kiểm tra nếu đang được render trong route trực tiếp
  const isDirectRoute = window.location.pathname.includes("/nhansu/quan-ly-nhan-vien");

  const showDetailModal = (record) => {
    setSelectedNV(record);
    setDetailVisible(true);
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: isDirectRoute ? 0 : 24 }}>
      <h2 className='text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6'>Quản lý nhân viên</h2>
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
        pagination={{ pageSize: 10 }}
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

      <Modal
        open={detailVisible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: 22 }} />
            <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: 20 }}>Chi tiết nhân viên</span>
          </div>
        }
        onCancel={() => setDetailVisible(false)}
        footer={<Button onClick={() => setDetailVisible(false)}>Đóng</Button>}
      >
        {selectedNV && (
          <div style={{ padding: 16 }}>
            <Descriptions
              bordered
              column={1}
              style={{ borderColor: '#1890ff', background: '#f6fbff', borderRadius: 8 }}
              labelStyle={{ fontWeight: 'bold', color: '#1890ff', width: 160, textAlign: 'left' }}
              contentStyle={{ color: '#222', textAlign: 'left', background: '#fff' }}
            >
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Mã NV</span>}>{selectedNV.MaNhanVien}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Tên NV</span>}>{selectedNV.TenNhanVien}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>SĐT</span>}>{selectedNV.SoDT}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>CCCD</span>}>{selectedNV.CCCD}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Email</span>}>{selectedNV.Email}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Ngày vào</span>}>{selectedNV.NgayVao}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Lương Căn bản</span>}>{selectedNV.LuongCanBan}</Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>Loại NV</span>}>{selectedNV.TenLoaiNhanVien}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QL_NhanVien;
