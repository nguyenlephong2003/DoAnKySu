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
import BASE_URL from '../Config';
import PageAdmin from '../page/Admin';

const { Option } = Select;
const roles = ['Admin', 'Giám đốc', 'Kế toán', 'Nhân sự', 'Quản lý', 'Thợ chính', 'Thợ phụ'];

const QL_NguoiDung = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên cho combobox
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
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
        const usersWithRole = res.data.data.map(user => {
          const prefix = user.MaNhanVien.substring(0, 2);
          return {
            ...user,
            Quyen: roleMapping[prefix] || 'Không xác định',
            MatKhau: user.MatKhau || '********',
          };
        });
        setUsers(usersWithRole);
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
      const res = await axios.get(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`);
      if (res.data.status === 'success') {
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
    
    // Tìm nhân viên tương ứng để hiển thị trong form
    const employee = employees.find(emp => emp.MaNhanVien === record.MaNhanVien);
    
    form.setFieldsValue({
      ...record,
      employeeId: employee ? employee.MaNhanVien : undefined,
    });
    
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const res = await axios.post(`${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=DELETE`, {
        MaTaiKhoan: record.MaTaiKhoan,
      });
      if (res.data.status === 'success') {
        message.success('Xóa thành công');
        fetchUsers();
      } else {
        message.error('Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Lỗi khi xóa');
    }
  };

  const handleEmployeeChange = (value) => {
    // Tìm nhân viên được chọn
    const selectedEmployee = employees.find(emp => emp.MaNhanVien === value);
    if (selectedEmployee) {
      // Cập nhật form với thông tin nhân viên được chọn
      form.setFieldsValue({
        MaNhanVien: selectedEmployee.MaNhanVien,
        TenNhanVien: selectedEmployee.TenNhanVien,
      });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const url = editingUser
        ? `${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=PUT`
        : `${BASE_URL}NguoiDung_API/TaiKhoan_API.php?action=POST`;

      const payload = {
        ...values,
        MaTaiKhoan: editingUser?.MaTaiKhoan,
      };

      // Xóa trường employeeId nếu có (vì đây chỉ là trường trợ giúp, không phải trường thực trong API)
      if (payload.employeeId) {
        delete payload.employeeId;
      }

      const res = await axios.post(url, payload);

      if (res.data.status === 'success') {
        message.success(editingUser ? 'Cập nhật thành công' : 'Thêm mới thành công');
        setModalVisible(false);
        fetchUsers();
      } else {
        message.error('Thao tác thất bại: ' + (res.data.message || ''));
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const showUserDetail = (record) => {
    setSelectedUser(record);
    setDetailVisible(true);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(item => 
    item.MaTaiKhoan?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.MaNhanVien?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.TenNhanVien?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Quyen?.toLowerCase().includes(searchText.toLowerCase())
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
      dataIndex: 'Quyen',
      key: 'Quyen',
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

        {/* Modal thêm/sửa */}
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
                  showSearch
                  optionFilterProp="children"
                  onChange={handleEmployeeChange}
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
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
              <Input disabled={!editingUser} />
            </Form.Item>
            
            <Form.Item 
              name="TenNhanVien" 
              label="Tên nhân viên" 
              rules={[{ required: true, message: 'Bắt buộc' }]}
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item 
              name="Quyen" 
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
              <Input.Password
                placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : 'Nhập mật khẩu'}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết */}
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
              <Descriptions.Item label="Quyền">{selectedUser.Quyen}</Descriptions.Item>
              <Descriptions.Item label="Mật Khẩu">
                <Input.Password
                  value={selectedUser.MatKhau}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
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