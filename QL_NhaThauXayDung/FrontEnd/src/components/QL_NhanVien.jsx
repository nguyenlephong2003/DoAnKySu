import React, { useEffect, useState } from 'react';
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
// Các import này sẽ được bỏ comment khi kết nối API thực tế
// import axios from 'axios';
// import BASE_URL from '../Config';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PageNhanSu from '../page/NhanSu';

const { Option } = Select;

const QL_NhanVien = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]); // Danh sách nhân viên
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNV, setEditingNV] = useState(null);
  const [loading, setLoading] = useState(false);

  const loaiNhanVienOptions = [ // DỮ LIỆU CỨNG — TÍCH HỢP API SAU
    { MaLoaiNhanVien: 'AD', TenLoaiNhanVien: 'Admin' },
    { MaLoaiNhanVien: 'GD', TenLoaiNhanVien: 'Giám đốc' },
    { MaLoaiNhanVien: 'KT', TenLoaiNhanVien: 'Kế toán' },
    { MaLoaiNhanVien: 'NS', TenLoaiNhanVien: 'Nhân sự' },
    { MaLoaiNhanVien: 'QL', TenLoaiNhanVien: 'Quản lý công trình' },
    { MaLoaiNhanVien: 'TC', TenLoaiNhanVien: 'Thợ chính' },
    { MaLoaiNhanVien: 'TP', TenLoaiNhanVien: 'Thợ phụ' },
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
      // Dữ liệu cứng cho giai đoạn phát triển UI
      const res = {
        status: 'success',
        data: [
          {
            MaNhanVien: 'AD001',
            TenNhanVien: 'Nguyễn Văn Admin',
            SoDT: '0901234567',
            CCCD: '079123456789',
            Email: 'admin@congty.com',
            NgayVao: '2020-01-01',
            MaLoaiNhanVien: 'AD',
            TenLoaiNhanVien: 'Admin',
          },
          {
            MaNhanVien: 'GD001',
            TenNhanVien: 'Trần Thị Giám Đốc',
            SoDT: '0912345678',
            CCCD: '079234567890',
            Email: 'giamdoc@congty.com',
            NgayVao: '2019-01-01',
            MaLoaiNhanVien: 'GD',
            TenLoaiNhanVien: 'Giám đốc',
          },
          {
            MaNhanVien: 'KT001',
            TenNhanVien: 'Lê Văn Kế Toán',
            SoDT: '0923456789',
            CCCD: '079345678901',
            Email: 'ketoan@congty.com',
            NgayVao: '2020-03-15',
            MaLoaiNhanVien: 'KT',
            TenLoaiNhanVien: 'Kế toán',
          },
          {
            MaNhanVien: 'NS001',
            TenNhanVien: 'Phạm Thị Nhân Sự',
            SoDT: '0934567890',
            CCCD: '079456789012',
            Email: 'nhansu@congty.com',
            NgayVao: '2020-05-10',
            MaLoaiNhanVien: 'NS',
            TenLoaiNhanVien: 'Nhân sự',
          },
          {
            MaNhanVien: 'QL001',
            TenNhanVien: 'Hoàng Quản Lý',
            SoDT: '0945678901',
            CCCD: '079567890123',
            Email: 'quanly1@congty.com',
            NgayVao: '2020-02-20',
            MaLoaiNhanVien: 'QL',
            TenLoaiNhanVien: 'Quản lý công trình',
          },
          {
            MaNhanVien: 'QL002',
            TenNhanVien: 'Lý Thị Quản Lý',
            SoDT: '0956789012',
            CCCD: '079678901234',
            Email: 'quanly2@congty.com',
            NgayVao: '2020-06-15',
            MaLoaiNhanVien: 'QL',
            TenLoaiNhanVien: 'Quản lý công trình',
          },
          {
            MaNhanVien: 'TC001',
            TenNhanVien: 'Trịnh Văn Thợ',
            SoDT: '0967890123',
            CCCD: '079789012345',
            Email: 'thochinh1@congty.com',
            NgayVao: '2020-07-10',
            MaLoaiNhanVien: 'TC',
            TenLoaiNhanVien: 'Thợ chính',
          },
          {
            MaNhanVien: 'TC002',
            TenNhanVien: 'Đặng Thợ Chính',
            SoDT: '0978901234',
            CCCD: '079890123456',
            Email: 'thochinh2@congty.com',
            NgayVao: '2020-08-05',
            MaLoaiNhanVien: 'TC',
            TenLoaiNhanVien: 'Thợ chính',
          },
          {
            MaNhanVien: 'TP001',
            TenNhanVien: 'Ngô Văn Phụ',
            SoDT: '0989012345',
            CCCD: '079901234567',
            Email: 'thophu1@congty.com',
            NgayVao: '2020-09-01',
            MaLoaiNhanVien: 'TP',
            TenLoaiNhanVien: 'Thợ phụ',
          },
          {
            MaNhanVien: 'TP002',
            TenNhanVien: 'Mai Thị Phụ',
            SoDT: '0990123456',
            CCCD: '079012345678',
            Email: 'thophu2@congty.com',
            NgayVao: '2020-10-10',
            MaLoaiNhanVien: 'TP',
            TenLoaiNhanVien: 'Thợ phụ',
          },
        ],
      };

      // Chuẩn bị cho API thực tế sau này
      // const response = await axios.get(`${BASE_URL}/api/NhanVien.php?action=GET`);
      // const res = response.data;

      if (res.status === 'success') {
        setData(res.data);
        console.log('Data loaded:', res.data);
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
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingNV(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    console.log('Deleting record:', record);
    // TODO: Sẽ thực hiện API call khi kết nối thực tế
    // try {
    //   const response = await axios.delete(`${BASE_URL}/api/NhanVien.php?action=DELETE`, {
    //     data: { MaNhanVien: record.MaNhanVien }
    //   });
    //   if (response.data.message) {
    //     message.success('Xóa thành công');
    //     fetchData();
    //   }
    // } catch (err) {
    //   console.error('Error deleting:', err);
    //   message.error('Lỗi khi xóa nhân viên');
    // }
    
    // Giả lập xóa thành công với dữ liệu cứng
    message.success('Xóa thành công');
    setData(data.filter(item => item.MaNhanVien !== record.MaNhanVien));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      
      if (editingNV) {
        // TODO: Cập nhật với API thực tế
        // const response = await axios.put(`${BASE_URL}/api/NhanVien.php?action=PUT`, values);
        
        // Cập nhật dữ liệu cứng
        setData(data.map(item => 
          item.MaNhanVien === editingNV.MaNhanVien ? { ...values, TenLoaiNhanVien: loaiNhanVienOptions.find(opt => opt.MaLoaiNhanVien === values.MaLoaiNhanVien)?.TenLoaiNhanVien } : item
        ));
        message.success('Cập nhật thành công');
      } else {
        // TODO: Thêm mới với API thực tế
        // const response = await axios.post(`${BASE_URL}/api/NhanVien.php?action=POST`, values);
        
        // Thêm mới với dữ liệu cứng
        const newRecord = {
          ...values,
          TenLoaiNhanVien: loaiNhanVienOptions.find(opt => opt.MaLoaiNhanVien === values.MaLoaiNhanVien)?.TenLoaiNhanVien
        };
        setData([...data, newRecord]);
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
    } catch (err) {
      console.error('Error saving form:', err);
    }
  };

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'MaNhanVien',
      key: 'MaNhanVien',
    },
    {
      title: 'Tên NV',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'SĐT',
      dataIndex: 'SoDT',
      key: 'SoDT',
    },
    {
      title: 'CCCD',
      dataIndex: 'CCCD',
      key: 'CCCD',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Ngày vào',
      dataIndex: 'NgayVao',
      key: 'NgayVao',
    },
    {
      title: 'Loại NV',
      dataIndex: 'TenLoaiNhanVien',
      key: 'TenLoaiNhanVien',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record)}>
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  console.log("Render QL Nhân Viên");
  
  // Kiểm tra nếu đang được render trong route trực tiếp (không phải qua PageNhanSu)
  const isDirectRoute = window.location.pathname.includes("/nhansu/quan-ly-nhan-vien");
  
  // Trả về JSX trực tiếp
  return (
    <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: isDirectRoute ? 0 : 24 }}>
         <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Quản lý nhân viên</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search placeholder="Tìm kiếm..." style={{ maxWidth: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="MaNhanVien"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5}}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={modalVisible} // Sử dụng open thay vì visible cho phiên bản Ant Design mới hơn
        title={editingNV ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="MaNhanVien" label="Mã nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input disabled={!!editingNV} />
          </Form.Item>
          <Form.Item name="TenNhanVien" label="Tên nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="SoDT" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="CCCD" label="CCCD">
            <Input />
          </Form.Item>
          <Form.Item name="Email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="NgayVao" label="Ngày vào">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="MaLoaiNhanVien" label="Loại nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
            <Select placeholder="Chọn loại nhân viên">
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