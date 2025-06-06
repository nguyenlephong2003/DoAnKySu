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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import PageAdmin from '../page/Admin';
// import { BASE_URL } from '../config';

const { Option } = Select;

const QL_NguoiDung = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const BASE_URL = 'http://localhost/DoAnKySu/QL_NhaThauXayDung/BackEnd/Api/';

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=GET`);
      console.log("Lấy api người dùng thành công");
      if (res.data.status === 'success') {
        const usersData = res.data.data.map(user => ({
          ...user,
          MatKhau: user.MatKhau || '********',
        }));
        setUsers(usersData);
        const uniqueRoles = [...new Set(res.data.data.map(user => user.LoaiNhanVien))];
        setRoles(uniqueRoles);
      } else {
        message.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi kết nối đến API');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=getNhanVienWithoutAccount`);
      console.log("Response:", res);  
      console.log("Lấy api nhân viên thành công");
      if (res.data.status === 'success') {
        if (res.data.data.length === 0) {
        }
        setEmployees(res.data.data);
      } else {
        message.error('Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    const employee = employees.find(emp => emp.MaNhanVien === record.MaNhanVien);
    form.setFieldsValue({
      ...record,
      employeeId: employee ? employee.MaNhanVien : undefined,
      LoaiNhanVien: record.LoaiNhanVien,
    });
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const res = await axios.delete(`${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=DELETE`, {
        data: { MaTaiKhoan: record.MaTaiKhoan },
      });
      if (res.data.status === 'success') {
        message.success('Xóa thành công');
        fetchUsers();
        fetchEmployees(); // Refresh employees after deletion
      } else {
        message.error(res.data.message || 'Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(error.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  const handleEmployeeChange = (value) => {
    const selectedEmployee = employees.find(emp => emp.MaNhanVien === value);
    if (selectedEmployee) {
      form.setFieldsValue({
        MaNhanVien: selectedEmployee.MaNhanVien,
        TenNhanVien: selectedEmployee.TenNhanVien,
      });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const isEditing = !!editingUser;
      const url = `${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=${isEditing ? 'PUT' : 'POST'}`;
      const payload = { ...values };
      if (isEditing) payload.MaTaiKhoan = editingUser.MaTaiKhoan;
      delete payload.employeeId;

      // Không gửi MatKhau khi cập nhật
      if (isEditing) {
        delete payload.MatKhau;
      }

      const res = await axios({
        method: isEditing ? 'put' : 'post',
        url,
        data: payload,
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.data.status === 'success') {
        message.success(isEditing ? 'Cập nhật thành công' : 'Thêm mới thành công');
        setModalVisible(false);
        fetchUsers();
        fetchEmployees(); // Refresh employees after adding/updating
      } else {
        message.error('Thao tác thất bại: ' + (res.data.message || ''));
      }
    } catch (err) {
      console.error('Lỗi xác thực form:', err);
      message.error('Lỗi khi xác thực form');
    }
  };

  const showUserDetail = (record) => {
    setSelectedUser(record);
    setDetailVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredUsers = users.filter(item => 
    item.MaTaiKhoan?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.MaNhanVien?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.TenNhanVien?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.LoaiNhanVien?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã Tài Khoản',
      dataIndex: 'MaTaiKhoan',
      key: 'MaTaiKhoan',
    },
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'MaNhanVien',
      key: 'MaNhanVien',
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'Quyền',
      dataIndex: 'LoaiNhanVien',
      key: 'LoaiNhanVien',
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
    <div style={{ padding: 24, backgroundColor: '#fff', borderRadius: 12, margin: 24 }}>
      <h2 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">Quản lý người dùng</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Select
            placeholder="Chọn quyền"
            style={{ width: 200 }}
            onChange={(value) => handleSearch(value)}
            allowClear
          >
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
          <Input.Search 
            placeholder="Tìm kiếm..." 
            style={{ maxWidth: 300 }} 
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="MaTaiKhoan"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => showUserDetail(record),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        open={modalVisible}
        title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          {!editingUser && (
            <Form.Item 
              name="employeeId" 
              label="Chọn nhân viên" 
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select
                placeholder="Chọn nhân viên"
                showSearch={false}
                onChange={handleEmployeeChange}
                disabled={false}
              >
                {employees.map(emp => (
                  <Option key={emp.MaNhanVien} value={emp.MaNhanVien}>
                    {emp.TenNhanVien} ({emp.MaNhanVien})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.Item 
            name="MaNhanVien" 
            label="Mã nhân viên" 
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item 
            name="TenNhanVien" 
            label="Tên nhân viên" 
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item 
            name="LoaiNhanVien" 
            label="Quyền" 
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Select placeholder="Chọn quyền">
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="MatKhau"
            label="Mật khẩu"
            rules={[{ required: editingUser === null, message: 'Bắt buộc' }]}
          >
            <Input 
              type="password"
              placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : 'Nhập mật khẩu'}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết tài khoản"
        open={detailVisible}
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
          </Popconfirm>,
        ]}
        width={600}
        centered
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã Tài Khoản">{selectedUser.MaTaiKhoan}</Descriptions.Item>
            <Descriptions.Item label="Mã Nhân Viên">{selectedUser.MaNhanVien}</Descriptions.Item>
            <Descriptions.Item label="Tên Nhân Viên">{selectedUser.TenNhanVien}</Descriptions.Item>
            <Descriptions.Item label="Quyền">{selectedUser.LoaiNhanVien}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default QL_NguoiDung;