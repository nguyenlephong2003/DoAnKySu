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
  Descriptions,
} from 'antd';
import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import BASE_URL from '../Config';
import PageAdmin from '../page/Admin';

const { Option } = Select;
const roles = ['Admin', 'Giám đốc', 'Kế toán', 'Nhân sự', 'Quản lý', 'Thợ chính', 'Thợ phụ'];

const QL_NguoiDung = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleMapping = {
    AD: 'Admin',
    GD: 'Giám đốc',
    KT: 'Kế toán',
    NS: 'Nhân sự',
    QL: 'Quản lý',
    TC: 'Thợ chính',
    TP: 'Thợ phụ',
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=GET`);
      if (res.data.status === 'success') {
        // Gán quyền dựa vào 2 ký tự đầu tiên của MaTaiKhoan
        const usersWithRole = res.data.data.map(user => {
          const prefix = user.MaNhanVien.substring(0, 2); // lấy 2 ký tự đầu
          return {
            ...user,
            Quyen: roleMapping[prefix] || 'Không xác định',
            MatKhau: user.MatKhau || '********', // Mặc định nếu API không trả về mật khẩu
          };
        });
        setUsers(usersWithRole);
      } else {
        message.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      message.error('Lỗi kết nối đến API');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const res = await axios.post(`${BASE_URL}TaiKhoan_API.php?action=delete`, {
        MaTaiKhoan: record.MaTaiKhoan,
      });
      if (res.data.status === 'success') {
        message.success('Xóa thành công');
        fetchUsers();
      } else {
        message.error('Không thể xóa người dùng');
      }
    } catch {
      message.error('Lỗi khi xóa');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const url = editingUser
        ? `${BASE_URL}TaiKhoan_API.php?action=update`
        : `${BASE_URL}TaiKhoan_API.php?action=add`;

      const payload = {
        ...values,
        MaTaiKhoan: editingUser?.MaTaiKhoan,
      };

      const res = await axios.post(url, payload);

      if (res.data.status === 'success') {
        message.success(editingUser ? 'Cập nhật thành công' : 'Thêm mới thành công');
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error('Thao tác thất bại');
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const showUserDetail = (record) => {
    setSelectedUser(record);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: 'Mã Tài Khoản',
      dataIndex: 'MaTaiKhoan',
      key: 'MaTaiKhoan',
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(record);
            }}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            onCancel={(e) => e.stopPropagation()}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger
              onClick={(e) => e.stopPropagation()}
            >
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageAdmin>
      <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: 24 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Quản lý người dùng</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Input.Search placeholder="Tìm kiếm..." style={{ maxWidth: 300 }} />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
          >
            Thêm mới
          </Button>
        </div>

        <Table
          rowKey="MaTaiKhoan"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => showUserDetail(record),
            style: { cursor: 'pointer' }
          })}
        />

        <Modal
          visible={modalVisible}
          title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}
          onCancel={() => setModalVisible(false)}
          onOk={handleModalOk}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="MaNhanVien" label="Mã nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="TenNhanVien" label="Tên nhân viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Quyen" label="Quyền" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Select>
                {roles.map((role) => (
                  <Option key={role} value={role}>{role}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="MatKhau" label="Mật khẩu" rules={[{ required: editingUser === null, message: 'Bắt buộc' }]}>
              <Input.Password
                placeholder={editingUser ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Chi tiết tài khoản"
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>,
            <Button 
              key="edit" 
              icon={<EditOutlined />} 
              onClick={() => {
                setDetailVisible(false);
                openEditModal(selectedUser);
              }}
              style={{ marginRight: 8 }}
            >
              Sửa
            </Button>,
            <Popconfirm
              key="delete"
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => {
                handleDelete(selectedUser);
                setDetailVisible(false);
              }}
            >
              <Button icon={<DeleteOutlined />} danger>
                Xóa
              </Button>
            </Popconfirm>
          ]}
          width={600}
          centered
        >
          {selectedUser && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã Tài Khoản">{selectedUser.MaTaiKhoan}</Descriptions.Item>
              <Descriptions.Item label="Mã Nhân Viên">{selectedUser.MaNhanVien}</Descriptions.Item>
              <Descriptions.Item label="Tên Nhân Viên">{selectedUser.TenNhanVien}</Descriptions.Item>
              <Descriptions.Item label="Quyền">{selectedUser.Quyen}</Descriptions.Item>
              <Descriptions.Item label="Mật Khẩu">
                <Input.Password
                  value={selectedUser.MatKhau}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  readOnly
                  style={{ width: '100%' }}
                />
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </PageAdmin>
  );
};

export default QL_NguoiDung;