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
// import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PageNhanSu from '../page/NhanSu'; // Giữ nguyên import này
// import BASE_URL from '../Config';

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: GỌI API GET DANH SÁCH NHÂN VIÊN TẠI ĐÂY
      const res = {
        status: 'success',
        data: [
          {
            MaNhanVien: 'AD001',
            TenNhanVien: 'Nguyễn Văn Admin',
            SoDT: '0901234567',
            CCCD: '079123456789',
            Email: 'admin@congty.com',
            NgayVao: '2020-01-01 00:00:00',
            MaLoaiNhanVien: 'AD',
            TenLoaiNhanVien: 'Admin',
          },
          {
            MaNhanVien: 'GD001',
            TenNhanVien: 'Trần Thị Giám Đốc',
            SoDT: '0912345678',
            CCCD: '079234567890',
            Email: 'giamdoc@congty.com',
            NgayVao: '2019-01-01 00:00:00',
            MaLoaiNhanVien: 'GD',
            TenLoaiNhanVien: 'Giám đốc',
          },
        ],
      };
      if (res.status === 'success') {
        setData(res.data);
      } else {
        message.error('Không thể tải dữ liệu');
      }
    } catch (err) {
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
    // TODO: GỌI API DELETE TẠI ĐÂY
    message.success('Xóa thành công');
    fetchData();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingNV) {
        // TODO: GỌI API UPDATE TẠI ĐÂY
        message.success('Cập nhật thành công');
      } else {
        // TODO: GỌI API ADD TẠI ĐÂY
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
      fetchData();
    } catch (err) {
      console.error(err);
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
  
  // Nội dung chính của component
  const mainContent = (
    <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: isDirectRoute ? 0 : 24 }}>
      <h2>Quản lý nhân viên</h2>
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
        pagination={{ pageSize: 5 }}
      />

      <Modal
        visible={modalVisible}
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


// const QL_NhanVien = () => {

//   console.log("Render QL Nhân Viên");
//   return(
//     <div>
//       <h2>Quản lý nhân viên</h2>
//       <p>Chức năng này đang được phát triển...</p>
//     </div>
//   )
// }

// export default QL_NhanVien;