import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, Form, Switch, Tooltip, Popconfirm } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const QuanLyThietBiVatTu = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [autoMaThietBiVatTu, setAutoMaThietBiVatTu] = useState('');
  const [loaiThietBiVatTuList, setLoaiThietBiVatTuList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ MaNhaCungCap: '', SoLuongTon: '' });

  useEffect(() => {
    fetchData();
    fetchLoaiThietBiVatTuList();
    fetchAllSuppliers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}DeXuat_API/ThietBiVatTu_API.php?action=GET`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu thiết bị vật tư');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoaiThietBiVatTuList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=GET`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.data.status === 'success') {
        setLoaiThietBiVatTuList(response.data.data);
      } else {
        message.error('Không thể lấy danh sách loại thiết bị vật tư');
      }
    } catch (error) {
      console.error('Error fetching loại thiết bị vật tư:', error);
    }
  };

  const fetchAllSuppliers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setSuppliers(response.data.data);
        console.log('Suppliers loaded:', response.data.data);
      } else {
        message.error('Không thể lấy danh sách nhà cung cấp');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Lỗi khi lấy danh sách nhà cung cấp');
    }
  };

  const fetchSuppliersByEquipmentType = async (maLoaiThietBiVatTu) => {
    try {
      const response = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_ALL`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setSuppliers(response.data.data);
      } else {
        message.error('Không thể lấy danh sách nhà cung cấp');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Lỗi khi lấy danh sách nhà cung cấp');
    }
  };

  const generateAutoMaThietBiVatTu = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const newMaThietBiVatTu = `TB${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    setAutoMaThietBiVatTu(newMaThietBiVatTu);
    return newMaThietBiVatTu;
  };

  useEffect(() => {
    if (addModalVisible) {
      const newCode = generateAutoMaThietBiVatTu();
      addForm.resetFields();
      addForm.setFieldsValue({
        MaThietBiVatTu: newCode,
      });
    }
  }, [addModalVisible]);

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const requestData = {
        ...values,
        suppliers: supplierDetails.length > 0 ? supplierDetails.map(supplier => ({
          MaNhaCungCap: supplier.MaNhaCungCap,
          SoLuongTon: supplier.SoLuongTon,
          GhiChu: supplier.GhiChu || ''
        })) : []
      };

      const response = await axios.post(
        `${BASE_URL}DeXuat_API/ThietBiVatTu_API.php?action=POST`,
        requestData,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Thêm mới thiết bị vật tư thành công');
        setAddModalVisible(false);
        addForm.resetFields();
        setSupplierDetails([]);
        await fetchData();
      } else {
        message.error(response.data.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      console.error('Error adding equipment:', error.response?.data || error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm mới');
    } finally {
      setLoading(false);
    }
  };

  const loaiThietBiVatTuOptions = [
    { value: 'all', label: 'Tất cả loại thiết bị vật tư' },
    ...Array.from(new Set(data.map(item => item.TenLoaiThietBiVatTu).filter(Boolean))).map(loai => ({ value: loai, label: loai }))
  ];

  const getFilteredData = () => {
    let filtered = data;
    if (selectedLoai !== 'all') {
      filtered = filtered.filter(item => item.TenLoaiThietBiVatTu === selectedLoai);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        item =>
          (item.MaThietBiVatTu && item.MaThietBiVatTu.toLowerCase().includes(lower)) ||
          (item.TenThietBiVatTu && item.TenThietBiVatTu.toLowerCase().includes(lower)) ||
          (item.TenLoaiThietBiVatTu && item.TenLoaiThietBiVatTu.toLowerCase().includes(lower))
      );
    }
    return filtered;
  };

  const fetchSuppliersForEquipment = async (maThietBiVatTu) => {
    try {
      const response = await axios.get(
        `${BASE_URL}DeXuat_API/CungUng_API.php?action=getByEquipment&MaThietBiVatTu=${maThietBiVatTu}`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setSupplierDetails(response.data.data.map(item => ({
          MaNhaCungCap: item.MaNhaCungCap,
          SoLuongTon: item.SoLuongTon,
          isExisting: true
        })));
        
        // Fetch unlinked suppliers
        const unlinkedResponse = await axios.get(
          `${BASE_URL}DeXuat_API/CungUng_API.php?action=getUnlinkedSuppliers&MaThietBiVatTu=${maThietBiVatTu}`,
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        if (unlinkedResponse.data.status === 'success') {
          setSuppliers(unlinkedResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching suppliers for equipment:', error);
      message.error('Không thể lấy thông tin nhà cung cấp');
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setEditFormData({
      MaThietBiVatTu: record.MaThietBiVatTu,
      TenThietBiVatTu: record.TenThietBiVatTu,
      TrangThai: record.TrangThai,
      MaLoaiThietBiVatTu: record.MaLoaiThietBiVatTu
    });
    setEditModalVisible(true);
    fetchSuppliersForEquipment(record.MaThietBiVatTu);
    fetchSuppliersByEquipmentType(record.MaLoaiThietBiVatTu);
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const values = await editForm.validateFields();
      
      const requestData = {
        ...values,
        suppliers: supplierDetails.map(supplier => ({
          MaNhaCungCap: supplier.MaNhaCungCap,
          SoLuongTon: supplier.SoLuongTon,
          isExisting: supplier.isExisting
        }))
      };

      const response = await axios.put(
        `${BASE_URL}DeXuat_API/ThietBiVatTu_API.php?action=PUT`,
        requestData,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Cập nhật thiết bị vật tư thành công');
        setEditModalVisible(false);
        editForm.resetFields();
        setSupplierDetails([]);
        await fetchData();
      } else {
        message.error(response.data.message || 'Cập nhật thiết bị vật tư thất bại');
      }
    } catch (error) {
      console.error('Error updating:', error);
      message.error('Có lỗi xảy ra khi cập nhật thiết bị vật tư');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplierToEquipment = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}DeXuat_API/CungUng_API.php?action=POST`,
        {
          MaThietBiVatTu: editFormData.MaThietBiVatTu,
          MaNhaCungCap: newSupplier.MaNhaCungCap,
          SoLuongTon: newSupplier.SoLuongTon
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
        message.success('Thêm nhà cung cấp thành công');
        setNewSupplier({ MaNhaCungCap: '', SoLuongTon: '' });
        setShowNewSupplierForm(false);
        // Refresh both current suppliers and unlinked suppliers
        await fetchSuppliersForEquipment(editFormData.MaThietBiVatTu);
      } else {
        message.error(response.data.message || 'Thêm nhà cung cấp thất bại');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      message.error('Thêm nhà cung cấp thất bại');
    }
  };

  const handleRemoveSupplier = async (index) => {
    const supplierToRemove = supplierDetails[index];
    
    // If it's an existing supplier (has MaCungUng), call API to delete
    if (supplierToRemove.isExisting) {
      try {
        const response = await axios.delete(
          `${BASE_URL}DeXuat_API/CungUng_API.php?action=deleteByEquipmentAndSupplier&MaThietBiVatTu=${editFormData.MaThietBiVatTu}&MaNhaCungCap=${supplierToRemove.MaNhaCungCap}`,
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.status === 'success') {
          message.success('Đã xóa nhà cung cấp thành công');
          // Remove from local state
          const newDetails = [...supplierDetails];
          newDetails.splice(index, 1);
          setSupplierDetails(newDetails);
          // Refresh the supplier list
          await fetchSuppliersForEquipment(editFormData.MaThietBiVatTu);
        } else {
          message.error('Xóa nhà cung cấp thất bại');
        }
      } catch (error) {
        console.error('Error removing supplier:', error);
        message.error('Không thể xóa nhà cung cấp');
      }
    } else {
      // If it's a new supplier (not yet saved), just remove from local state
      const newDetails = [...supplierDetails];
      newDetails.splice(index, 1);
      setSupplierDetails(newDetails);
    }
  };

  const handleAddSupplier = () => {
    setSupplierDetails([...supplierDetails, { 
      MaNhaCungCap: '', 
      SoLuongTon: 0, 
      isExisting: false,
      MaCungUng: null 
    }]);
  };

  const handleSupplierChange = (index, field, value) => {
    const newDetails = [...supplierDetails];
    newDetails[index] = {
      ...newDetails[index],
      [field]: value
    };
    setSupplierDetails(newDetails);
  };

  const columns = [
    { title: 'Mã thiết bị vật tư', dataIndex: 'MaThietBiVatTu', key: 'MaThietBiVatTu', width: 120, align: 'center' },
    { title: 'Tên thiết bị vật tư', dataIndex: 'TenThietBiVatTu', key: 'TenThietBiVatTu', width: 200, align: 'center' },
    { title: 'Loại thiết bị vật tư', dataIndex: 'TenLoaiThietBiVatTu', key: 'TenLoaiThietBiVatTu', width: 180, align: 'center' },
    { title: 'Số lượng tồn', dataIndex: 'TongSoLuongTon', key: 'TongSoLuongTon', width: 120, align: 'center' },
    { title: 'Trạng thái', dataIndex: 'TrangThai', key: 'TrangThai', width: 120, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleRemoveSupplier(record.index)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAddClick = async () => {
    setShowAddForm(true);
    try {
      const response = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_ALL`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setSuppliers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Không thể lấy danh sách nhà cung cấp');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Quản lý thiết bị vật tư
      </h1>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <Select
          value={selectedLoai}
          onChange={setSelectedLoai}
          style={{ width: 200 }}
          options={loaiThietBiVatTuOptions}
          className="self-end md:self-auto"
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
          rowKey="MaThietBiVatTu"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} thiết bị vật tư`,
          }}
        />
      </div>
      
      {/* Edit Modal */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>Chỉnh sửa thiết bị vật tư</span>}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditFormData({});
          setSupplierDetails([]);
          setNewSupplier({ MaNhaCungCap: '', SoLuongTon: '' });
          setShowNewSupplierForm(false);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={editFormData}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="MaThietBiVatTu"
              label="Mã thiết bị vật tư"
            >
              <Input disabled style={{ borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item
              name="TenThietBiVatTu"
              label="Tên thiết bị vật tư"
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị vật tư' }]}
            >
              <Input placeholder="Nhập tên thiết bị vật tư" style={{ borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item
              name="MaLoaiThietBiVatTu"
              label="Loại thiết bị vật tư"
            >
              <Input disabled style={{ borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item
              name="TrangThai"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái" style={{ borderRadius: '6px' }}>
                <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ marginTop: '24px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Danh sách nhà cung cấp</h3>
              <Button
                type="primary"
                onClick={handleAddSupplier}
                icon={<PlusOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm nhà cung cấp
              </Button>
            </div>

            <div className="space-y-4">
              {supplierDetails.map((detail, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-4">
                      <Form.Item
                        label={
                          <span className="text-gray-700 font-medium">
                            Chọn nhà cung cấp <span className="text-red-500">*</span>
                          </span>
                        }
                        required
                        rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
                      >
                        <Select
                          placeholder="Chọn nhà cung cấp"
                          value={detail.MaNhaCungCap}
                          onChange={(value) => handleSupplierChange(index, 'MaNhaCungCap', value)}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          className="rounded-lg"
                          disabled={detail.isExisting}
                        >
                          {suppliers
                            .filter(supplier => 
                              supplier.MaNhaCungCap === detail.MaNhaCungCap || 
                              !supplierDetails.some((d, i) => i !== index && d.MaNhaCungCap === supplier.MaNhaCungCap)
                            )
                            .map(supplier => (
                              <Select.Option
                                key={supplier.MaNhaCungCap}
                                value={supplier.MaNhaCungCap}
                                label={supplier.TenNhaCungCap}
                                disabled={supplier.MaNhaCungCap !== detail.MaNhaCungCap && supplierDetails.some(d => d.MaNhaCungCap === supplier.MaNhaCungCap)}
                              >
                                <div>
                                  <div className="font-medium">{supplier.TenNhaCungCap}</div>
                                  <div className="text-gray-500 text-sm">SĐT: {supplier.SoDT || 'Chưa có'}</div>
                                  {supplier.Email && <div className="text-gray-500 text-sm">Email: {supplier.Email}</div>}
                                </div>
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="text-gray-700 font-medium">
                            Số lượng <span className="text-red-500">*</span>
                          </span>
                        }
                        required
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng' },
                          { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          placeholder="Nhập số lượng"
                          value={detail.SoLuongTon}
                          onChange={(e) => handleSupplierChange(index, 'SoLuongTon', parseInt(e.target.value) || 0)}
                          style={{ width: '100%' }}
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveSupplier(index)}
                      className="mt-8 hover:bg-red-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button 
              onClick={() => setEditModalVisible(false)}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-2xl font-bold text-gray-800 border-b pb-4">
            Thêm thiết bị vật tư mới
          </div>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={800}
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
            name="MaThietBiVatTu"
            label="Mã thiết bị vật tư"
            hidden
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="TenThietBiVatTu"
              label={
                <span className="text-gray-700 font-medium">
                  Tên thiết bị vật tư <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị vật tư' }]}
            >
              <Input 
                placeholder="Nhập tên thiết bị vật tư" 
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="MaLoaiThietBiVatTu"
              label={
                <span className="text-gray-700 font-medium">
                  Loại thiết bị vật tư <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị vật tư' }]}
            >
              <Select 
                placeholder="Chọn loại thiết bị vật tư"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  fetchSuppliersByEquipmentType(value);
                }}
                className="rounded-lg"
              >
                {loaiThietBiVatTuList.map(loai => (
                  <Select.Option 
                    key={loai.MaLoaiThietBiVatTu} 
                    value={loai.MaLoaiThietBiVatTu}
                    label={loai.TenLoai}
                  >
                    {loai.TenLoai}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="TrangThai"
            label={
              <span className="text-gray-700 font-medium">
                Trạng thái <span className="text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { value: 'Còn hàng', label: 'Còn hàng' },
                { value: 'Hết hàng', label: 'Hết hàng' },
                { value: 'Sắp hết', label: 'Sắp hết' }
              ]}
              className="rounded-lg"
            />
          </Form.Item>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Danh sách nhà cung cấp</h3>
              <Button
                type="primary"
                onClick={handleAddSupplier}
                icon={<PlusOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm nhà cung cấp
              </Button>
            </div>

            <div className="space-y-4">
              {supplierDetails.map((detail, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-4">
                      <Form.Item
                        label={
                          <span className="text-gray-700 font-medium">
                            Chọn nhà cung cấp <span className="text-red-500">*</span>
                          </span>
                        }
                        required
                        rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
                      >
                        <Select
                          placeholder="Chọn nhà cung cấp"
                          value={detail.MaNhaCungCap}
                          onChange={(value) => handleSupplierChange(index, 'MaNhaCungCap', value)}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          className="rounded-lg"
                          disabled={detail.isExisting}
                        >
                          {suppliers
                            .filter(supplier => 
                              supplier.MaNhaCungCap === detail.MaNhaCungCap || 
                              !supplierDetails.some((d, i) => i !== index && d.MaNhaCungCap === supplier.MaNhaCungCap)
                            )
                            .map(supplier => (
                              <Select.Option
                                key={supplier.MaNhaCungCap}
                                value={supplier.MaNhaCungCap}
                                label={supplier.TenNhaCungCap}
                                disabled={supplier.MaNhaCungCap !== detail.MaNhaCungCap && supplierDetails.some(d => d.MaNhaCungCap === supplier.MaNhaCungCap)}
                              >
                                <div>
                                  <div className="font-medium">{supplier.TenNhaCungCap}</div>
                                  <div className="text-gray-500 text-sm">SĐT: {supplier.SoDT || 'Chưa có'}</div>
                                  {supplier.Email && <div className="text-gray-500 text-sm">Email: {supplier.Email}</div>}
                                </div>
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="text-gray-700 font-medium">
                            Số lượng <span className="text-red-500">*</span>
                          </span>
                        }
                        required
                        rules={[
                          { required: true, message: 'Vui lòng nhập số lượng' },
                          { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                        ]}
                      >
                        <Input
                          type="number"
                          min={0}
                          placeholder="Nhập số lượng"
                          value={detail.SoLuongTon}
                          onChange={(e) => handleSupplierChange(index, 'SoLuongTon', parseInt(e.target.value) || 0)}
                          style={{ width: '100%' }}
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveSupplier(index)}
                      className="mt-8 hover:bg-red-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThietBiVatTu; 