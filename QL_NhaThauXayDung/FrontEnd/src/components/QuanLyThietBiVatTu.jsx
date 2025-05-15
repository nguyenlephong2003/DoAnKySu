import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, Form, Switch, Tooltip } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

const QuanLyThietBiVatTu = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    SoLuongTon: 0,
    TrangThai: '',
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [useAutoMaThietBiVatTu, setUseAutoMaThietBiVatTu] = useState(true);
  const [autoMaThietBiVatTu, setAutoMaThietBiVatTu] = useState('');
  const [loaiThietBiVatTuList, setLoaiThietBiVatTuList] = useState([]);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);

  useEffect(() => {
    fetchData();
    fetchLoaiThietBiVatTuList();
    fetchNhaCungCapList();
  }, []);

  useEffect(() => {
    if (editRecord) {
      setEditForm({
        SoLuongTon: editRecord.SoLuongTon,
        TrangThai: editRecord.TrangThai,
      });
    }
  }, [editRecord]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}QuanLyThietBiVatTu_API/ThietBiVatTu_API.php?action=GET`);
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu thiết bị vật tư');
      }
    } catch {
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoaiThietBiVatTuList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=GET`);
      if (response.data.status === 'success') {
        setLoaiThietBiVatTuList(response.data.data);
      } else {
        message.error('Không thể lấy danh sách loại thiết bị vật tư');
      }
    } catch (error) {
      console.error('Error fetching loại thiết bị vật tư:', error);
    }
  };

  const fetchNhaCungCapList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET`);
      if (response.data.status === 'success') {
        setNhaCungCapList(response.data.data);
      } else {
        message.error('Không thể lấy danh sách nhà cung cấp');
      }
    } catch (error) {
      console.error('Error fetching nhà cung cấp:', error);
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
    
    if (useAutoMaThietBiVatTu) {
      addForm.setFieldsValue({ MaThietBiVatTu: newMaThietBiVatTu });
    }
  };

  const handleAutoMaThietBiVatTuChange = (checked) => {
    setUseAutoMaThietBiVatTu(checked);
    if (checked) {
      addForm.setFieldsValue({ MaThietBiVatTu: autoMaThietBiVatTu });
    } else {
      addForm.setFieldsValue({ MaThietBiVatTu: '' });
    }
  };

  const refreshAutoMaThietBiVatTu = () => {
    generateAutoMaThietBiVatTu();
    message.success('Đã làm mới mã thiết bị vật tư');
  };

  useEffect(() => {
    if (addModalVisible) {
      generateAutoMaThietBiVatTu();
      addForm.resetFields();
      addForm.setFieldsValue({
        MaThietBiVatTu: useAutoMaThietBiVatTu ? autoMaThietBiVatTu : '',
      });
    }
  }, [addModalVisible]);

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const response = await axios.post(
        `${BASE_URL}QuanLyThietBiVatTu_API/ThietBiVatTu_API.php?action=POST`,
        values
      );

      if (response.data.status === 'success') {
        message.success('Thêm mới thiết bị vật tư thành công');
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
          (item.TenLoaiThietBiVatTu && item.TenLoaiThietBiVatTu.toLowerCase().includes(lower)) ||
          (item.TenNhaCungCap && item.TenNhaCungCap.toLowerCase().includes(lower))
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

      const res = await axios.put(`${BASE_URL}QuanLyThietBiVatTu_API/ThietBiVatTu_API.php?action=PUT`, updatedRecord);
      
      if (res.data.status === 'success') {
        message.success('Cập nhật thiết bị vật tư thành công');
        fetchData();
        setEditVisible(false);
      } else {
        message.error('Cập nhật thiết bị vật tư thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi kết nối đến server');
    }
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const columns = [
    { title: 'Mã thiết bị vật tư', dataIndex: 'MaThietBiVatTu', key: 'MaThietBiVatTu', width: 120, align: 'center' },
    { title: 'Tên thiết bị vật tư', dataIndex: 'TenThietBiVatTu', key: 'TenThietBiVatTu', width: 200, align: 'center' },
    { title: 'Loại thiết bị vật tư', dataIndex: 'TenLoaiThietBiVatTu', key: 'TenLoaiThietBiVatTu', width: 180, align: 'center' },
    { title: 'Đơn vị tính', dataIndex: 'DonViTinh', key: 'DonViTinh', width: 120, align: 'center' },
    { title: 'Số lượng tồn', dataIndex: 'SoLuongTon', key: 'SoLuongTon', width: 120, align: 'center' },
    { title: 'Trạng thái', dataIndex: 'TrangThai', key: 'TrangThai', width: 120, align: 'center' },
    { title: 'Nhà cung cấp', dataIndex: 'TenNhaCungCap', key: 'TenNhaCungCap', width: 200, align: 'center' },
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
        <h1 className="text-2xl font-bold">Quản lý thiết bị vật tư</h1>
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
      
      {/* Chi tiết thiết bị vật tư modal */}
      <Modal
        title="Chi tiết thiết bị vật tư"
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
            {currentRecord.MaThietBiVatTu && (
              <p><strong>Mã thiết bị vật tư:</strong> {currentRecord.MaThietBiVatTu}</p>
            )}
            {currentRecord.TenThietBiVatTu && (
              <p><strong>Tên thiết bị vật tư:</strong> {currentRecord.TenThietBiVatTu}</p>
            )}
            {currentRecord.TenLoaiThietBiVatTu && (
              <p><strong>Loại thiết bị vật tư:</strong> {currentRecord.TenLoaiThietBiVatTu}</p>
            )}
            {currentRecord.DonViTinh && (
              <p><strong>Đơn vị tính:</strong> {currentRecord.DonViTinh}</p>
            )}
            {currentRecord.SoLuongTon && (
              <p><strong>Số lượng tồn:</strong> {currentRecord.SoLuongTon}</p>
            )}
            {currentRecord.TrangThai && (
              <p><strong>Trạng thái:</strong> {currentRecord.TrangThai}</p>
            )}
            {currentRecord.TenNhaCungCap && (
              <p><strong>Nhà cung cấp:</strong> {currentRecord.TenNhaCungCap}</p>
            )}
          </div>
        )}
      </Modal>
      
      {/* Sửa thiết bị vật tư modal */}
      <Modal
        title="Sửa thiết bị vật tư"
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
              <strong>Mã thiết bị vật tư:</strong>
              <Input 
                value={editRecord.MaThietBiVatTu} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên thiết bị vật tư:</strong>
              <Input 
                value={editRecord.TenThietBiVatTu} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Loại thiết bị vật tư:</strong>
              <Input 
                value={editRecord.TenLoaiThietBiVatTu} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Đơn vị tính:</strong>
              <Input 
                value={editRecord.DonViTinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Số lượng tồn:</strong>
              <Input 
                type="number"
                value={editForm.SoLuongTon}
                onChange={(e) => setEditForm({ ...editForm, SoLuongTon: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <strong>Trạng thái:</strong>
              <Select
                value={editForm.TrangThai}
                onChange={(value) => setEditForm({ ...editForm, TrangThai: value })}
                className="mt-1 w-full"
                options={[
                  { value: 'Còn hàng', label: 'Còn hàng' },
                  { value: 'Hết hàng', label: 'Hết hàng' },
                  { value: 'Sắp hết', label: 'Sắp hết' }
                ]}
              />
            </div>
            <div>
              <strong>Nhà cung cấp:</strong>
              <Input 
                value={editRecord.TenNhaCungCap} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Thêm thiết bị vật tư mới
          </div>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={600}
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
          <Form.Item label="Mã thiết bị vật tư">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Switch
                checked={useAutoMaThietBiVatTu}
                onChange={handleAutoMaThietBiVatTuChange}
                style={{ marginRight: '8px' }}
              />
              <span>Sử dụng mã tự động</span>
              {useAutoMaThietBiVatTu && (
                <Button 
                  type="link" 
                  onClick={refreshAutoMaThietBiVatTu} 
                  style={{ marginLeft: '8px' }}
                >
                  Làm mới
                </Button>
              )}
              <Tooltip title="Mã sẽ được tạo theo định dạng TB + năm tháng ngày giờ phút giây">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
              </Tooltip>
            </div>
            
            <Form.Item
              name="MaThietBiVatTu"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị vật tư' }]}
            >
              <Input 
                placeholder="Mã thiết bị vật tư" 
                disabled={useAutoMaThietBiVatTu}
                style={{ width: '100%', fontWeight: '500' }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="TenThietBiVatTu"
            label="Tên thiết bị vật tư"
            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị vật tư' }]}
          >
            <Input placeholder="Nhập tên thiết bị vật tư" />
          </Form.Item>

          <Form.Item
            name="MaLoaiThietBiVatTu"
            label="Loại thiết bị vật tư"
            rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị vật tư' }]}
          >
            <Select 
              placeholder="Chọn loại thiết bị vật tư"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
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

          <Form.Item
            name="SoLuongTon"
            label="Số lượng tồn"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn' }]}
          >
            <Input type="number" placeholder="Nhập số lượng tồn" />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { value: 'Còn hàng', label: 'Còn hàng' },
                { value: 'Hết hàng', label: 'Hết hàng' },
                { value: 'Sắp hết', label: 'Sắp hết' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="MaNhaCungCap"
            label="Nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
          >
            <Select
              placeholder="Chọn nhà cung cấp"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {nhaCungCapList.map(ncc => (
                <Select.Option 
                  key={ncc.MaNhaCungCap} 
                  value={ncc.MaNhaCungCap}
                  label={ncc.TenNhaCungCap}
                >
                  {ncc.TenNhaCungCap}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThietBiVatTu; 