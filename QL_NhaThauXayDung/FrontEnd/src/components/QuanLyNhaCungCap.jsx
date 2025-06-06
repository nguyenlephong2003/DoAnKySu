import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, Form, Popconfirm } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../Config/AuthContext';

const QuanLyNhaCungCap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('all');
  const { user } = useAuth();

  // Kiểm tra quyền
  const canAdd = user?.TenLoaiNhanVien === 'Admin' || 
                user?.TenLoaiNhanVien === 'Giám đốc' ||
                user?.TenLoaiNhanVien === 'Kế toán';
  
  const canEdit = user?.TenLoaiNhanVien === 'Admin' || 
                 user?.TenLoaiNhanVien === 'Giám đốc' ||
                 user?.TenLoaiNhanVien === 'Kế toán';
  
  const canDelete = user?.TenLoaiNhanVien === 'Admin' ||
                   user?.TenLoaiNhanVien === 'Kế toán';

  useEffect(() => {
    fetchData();
    fetchEquipmentTypes();
  }, []);

  useEffect(() => {
    if (selectedEquipmentType !== 'all') {
      fetchSuppliersByEquipmentType(selectedEquipmentType);
    } else {
      fetchData();
    }
  }, [selectedEquipmentType]);

  const fetchEquipmentTypes = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_EQUIPMENT_TYPES`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data.status === 'success') {
        setEquipmentTypes(res.data.data);
      } else {
        message.error('Không thể tải danh sách loại thiết bị');
      }
    } catch (error) {
      console.error('Error fetching equipment types:', error);
      message.error('Lỗi khi kết nối đến server');
    }
  };

  const fetchSuppliersByEquipmentType = async (maLoaiThietBiVatTu) => {
    if (!maLoaiThietBiVatTu || maLoaiThietBiVatTu === 'all') {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_BY_EQUIPMENT_TYPE&maLoaiThietBiVatTu=${maLoaiThietBiVatTu}`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data && res.data.status === 'success') {
        setData(res.data.data || []);
      } else {
        console.error('Invalid response format:', res.data);
        message.error('Không thể tải dữ liệu nhà cung cấp');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        message.error(error.response.data.message || 'Lỗi khi tải dữ liệu nhà cung cấp');
      } else {
        message.error('Lỗi khi kết nối đến server');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data.status === 'success') {
        setData(res.data.data);
        setPagination(prev => ({
          ...prev,
          total: res.data.data.length
        }));
      } else {
        message.error('Không thể tải dữ liệu nhà cung cấp');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const getFilteredData = () => {
    if (!data) return [];
    
    let filteredData = [...data];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(
        item => 
          (item.MaNhaCungCap && item.MaNhaCungCap.toString().toLowerCase().includes(searchLower)) ||
          (item.TenNhaCungCap && item.TenNhaCungCap.toString().toLowerCase().includes(searchLower)) ||
          (item.SoDT && item.SoDT.toString().toLowerCase().includes(searchLower)) ||
          (item.Email && item.Email.toString().toLowerCase().includes(searchLower)) ||
          (item.DiaChi && item.DiaChi.toString().toLowerCase().includes(searchLower)) ||
          (item.LoaiHinhCungCap && item.LoaiHinhCungCap.toString().toLowerCase().includes(searchLower))
      );
    }

    return filteredData;
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      TenNhaCungCap: record.TenNhaCungCap,
      SoDT: record.SoDT,
      Email: record.Email,
      DiaChi: record.DiaChi,
      LoaiHinhCungCap: record.LoaiHinhCungCap
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const response = await axios.put(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=PUT`,
        {
          MaNhaCungCap: currentRecord.MaNhaCungCap,
          ...values
        },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Cập nhật thành công');
        setEditModalVisible(false);
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
      } else {
        message.error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating:', error.response?.data || error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const response = await axios.post(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=POST`,
        values,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Thêm mới thành công');
        setAddModalVisible(false);
        addForm.resetFields();
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
      } else {
        message.error(response.data.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      console.error('Error adding:', error.response?.data || error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm mới');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=DELETE`,
        { 
          data: { MaNhaCungCap: record.MaNhaCungCap },
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        message.success('Xóa thành công');
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
      } else {
        message.error(response.data.message || 'Xóa thất bại');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'MaNhaCungCap',
      key: 'MaNhaCungCap',
      width: 120,
      align: 'center',
      sorter: (a, b) => {
        if (!a.MaNhaCungCap) return -1;
        if (!b.MaNhaCungCap) return 1;
        return a.MaNhaCungCap.toString().localeCompare(b.MaNhaCungCap.toString());
      },
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'TenNhaCungCap',
      key: 'TenNhaCungCap',
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a.TenNhaCungCap) return -1;
        if (!b.TenNhaCungCap) return 1;
        return a.TenNhaCungCap.toString().localeCompare(b.TenNhaCungCap.toString());
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'SoDT',
      key: 'SoDT',
      width: 120,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Loại hình cung cấp',
      dataIndex: 'LoaiHinhCungCap',
      key: 'LoaiHinhCungCap',
      width: 150,
      align: 'center',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {canEdit || canDelete ? (
            <>
              {canEdit && (
                <Button 
                  icon={<EditOutlined />} 
                  type="default"
                  onClick={() => handleEdit(record)}
                >
                  Sửa
                </Button>
              )}
              {canDelete && (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(record)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>Bạn không đủ quyền hạn để thao tác</span>
          )}
        </div>
      ),
    }
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={selectedEquipmentType}
            onChange={setSelectedEquipmentType}
            style={{ width: 250 }}
            options={[
              { value: 'all', label: 'Tất cả loại thiết bị' },
              ...equipmentTypes.map(type => ({
                value: type.MaLoaiThietBiVatTu,
                label: `${type.TenLoai} (${type.DonViTinh})`
              }))
            ]}
            placeholder="Chọn loại thiết bị"
          />
        </div>
        {canAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="MaNhaCungCap"
        loading={loading}
        pagination={{
          ...pagination,
          total: getFilteredData().length,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
        bordered
      />

      {/* Edit Modal */}
      {canEdit && (
        <Modal
          title={
            <div className="text-xl font-semibold text-gray-800 border-b pb-4">
              Sửa nhà cung cấp
            </div>
          }
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          maskClosable={false}
          keyboard={false}
          closable={false}
          width={500}
          className="custom-modal"
          bodyStyle={{ padding: '24px' }}
          footer={[
            <div key="footer" className="flex justify-end gap-2 border-t pt-4">
              <Button 
                key="cancel" 
                onClick={() => setEditModalVisible(false)}
                className="px-6"
              >
                Đóng
              </Button>
              <Button 
                key="submit" 
                type="primary" 
                onClick={handleUpdate}
                loading={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Lưu
              </Button>
            </div>
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="TenNhaCungCap"
              label={
                <span className="text-gray-700 font-medium">
                  Tên nhà cung cấp
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhà cung cấp' },
                { min: 2, message: 'Tên nhà cung cấp phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập tên nhà cung cấp"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="SoDT"
              label={
                <span className="text-gray-700 font-medium">
                  Số điện thoại
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input 
                placeholder="Nhập số điện thoại"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="Email"
              label={
                <span className="text-gray-700 font-medium">
                  Email
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input 
                placeholder="Nhập email"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="DiaChi"
              label={
                <span className="text-gray-700 font-medium">
                  Địa chỉ
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ' }
              ]}
            >
              <Input 
                placeholder="Nhập địa chỉ"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="LoaiHinhCungCap"
              label={
                <span className="text-gray-700 font-medium">
                  Loại hình cung cấp
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập loại hình cung cấp' }
              ]}
            >
              <Input 
                placeholder="Nhập loại hình cung cấp"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Add Modal */}
      {canAdd && (
        <Modal
          title={
            <div className="text-xl font-semibold text-gray-800 border-b pb-4">
              Thêm nhà cung cấp mới
            </div>
          }
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          maskClosable={false}
          keyboard={false}
          closable={false}
          width={500}
          className="custom-modal"
          bodyStyle={{ padding: '24px' }}
          footer={[
            <div key="footer" className="flex justify-end gap-2 border-t pt-4">
              <Button 
                key="cancel" 
                onClick={() => {
                  setAddModalVisible(false);
                  addForm.resetFields();
                }}
                className="px-6"
              >
                Đóng
              </Button>
              <Button 
                key="submit" 
                type="primary" 
                onClick={handleAddSubmit}
                loading={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
          ]}
        >
          <Form
            form={addForm}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="TenNhaCungCap"
              label={
                <span className="text-gray-700 font-medium">
                  Tên nhà cung cấp
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhà cung cấp' },
                { min: 2, message: 'Tên nhà cung cấp phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập tên nhà cung cấp"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="SoDT"
              label={
                <span className="text-gray-700 font-medium">
                  Số điện thoại
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input 
                placeholder="Nhập số điện thoại"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="Email"
              label={
                <span className="text-gray-700 font-medium">
                  Email
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input 
                placeholder="Nhập email"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="DiaChi"
              label={
                <span className="text-gray-700 font-medium">
                  Địa chỉ
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ' }
              ]}
            >
              <Input 
                placeholder="Nhập địa chỉ"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="LoaiHinhCungCap"
              label={
                <span className="text-gray-700 font-medium">
                  Loại hình cung cấp
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập loại hình cung cấp' }
              ]}
            >
              <Input 
                placeholder="Nhập loại hình cung cấp"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      <Modal
        title="Chi tiết nhà cung cấp"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {currentRecord && (
          <div>
            {Object.entries(currentRecord).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default QuanLyNhaCungCap; 