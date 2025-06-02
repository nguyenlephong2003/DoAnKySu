import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, Form } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

const QuanLyNhaCungCap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    TenNhaCungCap: '',
    SoDT: '',
    Email: '',
    DiaChi: '',
    LoaiHinhCungCap: ''
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('all');

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
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu nhà cung cấp');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editRecord) {
      setEditForm({
        TenNhaCungCap: editRecord.TenNhaCungCap,
        SoDT: editRecord.SoDT,
        Email: editRecord.Email,
        DiaChi: editRecord.DiaChi,
        LoaiHinhCungCap: editRecord.LoaiHinhCungCap
      });
    }
  }, [editRecord]);

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

  const getFilteredData = () => {
    let filtered = data;
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        item =>
          (item.MaNhaCungCap && item.MaNhaCungCap.toLowerCase().includes(lower)) ||
          (item.TenNhaCungCap && item.TenNhaCungCap.toLowerCase().includes(lower)) ||
          (item.SoDT && item.SoDT.toLowerCase().includes(lower)) ||
          (item.Email && item.Email.toLowerCase().includes(lower)) ||
          (item.DiaChi && item.DiaChi.toLowerCase().includes(lower)) ||
          (item.LoaiHinhCungCap && item.LoaiHinhCungCap.toLowerCase().includes(lower))
      );
    }
    return filtered;
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRecord = {
        ...editRecord,
        ...editForm,
      };

      const res = await axios.put(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=PUT`,
        updatedRecord,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.status === 'success') {
        message.success('Cập nhật nhà cung cấp thành công');
        fetchData();
        setEditVisible(false);
      } else {
        message.error('Cập nhật nhà cung cấp thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi kết nối đến server');
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
        message.success('Thêm mới nhà cung cấp thành công');
        setAddModalVisible(false);
        addForm.resetFields();
        await fetchData();
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

  const columns = [
    { title: 'Mã nhà cung cấp', dataIndex: 'MaNhaCungCap', key: 'MaNhaCungCap', width: 120, align: 'center' },
    { title: 'Tên nhà cung cấp', dataIndex: 'TenNhaCungCap', key: 'TenNhaCungCap', width: 200, align: 'center' },
    { title: 'Số điện thoại', dataIndex: 'SoDT', key: 'SoDT', width: 120, align: 'center' },
    { title: 'Email', dataIndex: 'Email', key: 'Email', width: 180, align: 'center' },
    { title: 'Địa chỉ', dataIndex: 'DiaChi', key: 'DiaChi', width: 200, align: 'center' },
    { title: 'Loại hình cung cấp', dataIndex: 'LoaiHinhCungCap', key: 'LoaiHinhCungCap', width: 150, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button type="primary" onClick={() => { setCurrentRecord(record); setDetailVisible(true); }}>
            Xem chi tiết
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Quản lý nhà cung cấp</h1>
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
        >
          Thêm mới
        </Button>
      </div>
      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="MaNhaCungCap"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} nhà cung cấp`,
          }}
        />
      </div>
      
      {/* Chi tiết nhà cung cấp modal */}
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
            {currentRecord.MaNhaCungCap && (
              <p><strong>Mã nhà cung cấp:</strong> {currentRecord.MaNhaCungCap}</p>
            )}
            {currentRecord.TenNhaCungCap && (
              <p><strong>Tên nhà cung cấp:</strong> {currentRecord.TenNhaCungCap}</p>
            )}
            {currentRecord.SoDT && (
              <p><strong>Số điện thoại:</strong> {currentRecord.SoDT}</p>
            )}
            {currentRecord.Email && (
              <p><strong>Email:</strong> {currentRecord.Email}</p>
            )}
            {currentRecord.DiaChi && (
              <p><strong>Địa chỉ:</strong> {currentRecord.DiaChi}</p>
            )}
            {currentRecord.LoaiHinhCungCap && (
              <p><strong>Loại hình cung cấp:</strong> {currentRecord.LoaiHinhCungCap}</p>
            )}
          </div>
        )}
      </Modal>
      
      {/* Sửa nhà cung cấp modal */}
      <Modal
        title="Sửa nhà cung cấp"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={[
          <Button key="close" onClick={() => setEditVisible(false)}>
            Đóng
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            Lưu
          </Button>
        ]}
      >
        {editRecord && (
          <div className="space-y-4">
            <div>
              <strong>Mã nhà cung cấp:</strong>
              <Input 
                value={editRecord.MaNhaCungCap} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên nhà cung cấp:</strong>
              <Input 
                value={editForm.TenNhaCungCap}
                onChange={(e) => setEditForm({ ...editForm, TenNhaCungCap: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <strong>Số điện thoại:</strong>
              <Input 
                value={editForm.SoDT}
                onChange={(e) => setEditForm({ ...editForm, SoDT: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <strong>Email:</strong>
              <Input 
                value={editForm.Email}
                onChange={(e) => setEditForm({ ...editForm, Email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <strong>Địa chỉ:</strong>
              <Input 
                value={editForm.DiaChi}
                onChange={(e) => setEditForm({ ...editForm, DiaChi: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <strong>Loại hình cung cấp:</strong>
              <Input 
                value={editForm.LoaiHinhCungCap}
                onChange={(e) => setEditForm({ ...editForm, LoaiHinhCungCap: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
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
        width={600}
        className="custom-modal"
        styles={{
          body: { padding: '24px' }
        }}
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
            label="Tên nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
          >
            <Input placeholder="Nhập tên nhà cung cấp" />
          </Form.Item>

          <Form.Item
            name="SoDT"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="DiaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            name="LoaiHinhCungCap"
            label="Loại hình cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập loại hình cung cấp' }]}
          >
            <Input placeholder="Nhập loại hình cung cấp" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyNhaCungCap; 