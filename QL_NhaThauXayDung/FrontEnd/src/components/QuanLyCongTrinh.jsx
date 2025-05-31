import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Select, DatePicker, Form, Switch, Tooltip } from 'antd';
import axios from 'axios';
import BASE_URL from '../Config';
import { SearchOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const QuanLyCongTrinh = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    NgayDuKienHoanThanh: null,
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [useAutoMaCongTrinh, setUseAutoMaCongTrinh] = useState(true);
  const [autoMaCongTrinh, setAutoMaCongTrinh] = useState('');
  const [khachHangList, setKhachHangList] = useState([]);
  const [hopDongList, setHopDongList] = useState([]);
  const [loaiCongTrinhList, setLoaiCongTrinhList] = useState([]);
  const [hopDongLoading, setHopDongLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchKhachHangList();
    fetchHopDongList();
    fetchLoaiCongTrinhList();
  }, []);

  useEffect(() => {
    if (editRecord) {
      const date = editRecord.NgayDuKienHoanThanh ? moment(editRecord.NgayDuKienHoanThanh) : null;
      setEditForm({
        NgayDuKienHoanThanh: date,
      });
    }
  }, [editRecord]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=GET`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu công trình');
      }
    } catch {
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const fetchKhachHangList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/KhachHang_API.php?action=GET`, {
        withCredentials: true
      });
      console.log('KhachHang Response:', response.data);
      if (response.data.status === 'success') {
        setKhachHangList(response.data.data);
      } else if (Array.isArray(response.data)) {
        setKhachHangList(response.data);
      } else {
        console.error('Invalid response format for KhachHang:', response.data);
        message.error('Định dạng dữ liệu khách hàng không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching khách hàng:', error);
      message.error('Không thể lấy danh sách khách hàng');
    }
  };

  const fetchHopDongList = async () => {
    setHopDongLoading(true);
    try {
      console.log('Fetching unused contracts...');
      const response = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=GET_UNUSED`, {
        withCredentials: true
      });
      console.log('HopDong Response:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.data.status === 'success') {
        console.log('Setting hopDongList with success data:', response.data.data);
        setHopDongList(response.data.data);
      } else if (Array.isArray(response.data)) {
        console.log('Setting hopDongList with array data:', response.data);
        setHopDongList(response.data);
      } else {
        console.error('Invalid response format for HopDong:', response.data);
        message.error('Định dạng dữ liệu hợp đồng không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching hợp đồng:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      message.error('Không thể lấy danh sách hợp đồng');
    } finally {
      setHopDongLoading(false);
    }
  };

  const fetchLoaiCongTrinhList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DanhMuc_API/LoaiCongTrinh_API.php?action=GET`, {
        withCredentials: true
      });
      console.log('LoaiCongTrinh Response:', response.data);
      if (response.data.status === 'success') {
        setLoaiCongTrinhList(response.data.data);
      } else if (Array.isArray(response.data)) {
        setLoaiCongTrinhList(response.data);
      } else {
        console.error('Invalid response format for LoaiCongTrinh:', response.data);
        message.error('Định dạng dữ liệu loại công trình không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching loại công trình:', error);
    }
  };

  const generateAutoMaCongTrinh = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const newMaCongTrinh = `CT${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    setAutoMaCongTrinh(newMaCongTrinh);
    
    if (useAutoMaCongTrinh) {
      addForm.setFieldsValue({ MaCongTrinh: newMaCongTrinh });
    }
  };

  const handleAutoMaCongTrinhChange = (checked) => {
    setUseAutoMaCongTrinh(checked);
    if (checked) {
      addForm.setFieldsValue({ MaCongTrinh: autoMaCongTrinh });
    } else {
      addForm.setFieldsValue({ MaCongTrinh: '' });
    }
  };

  const refreshAutoMaCongTrinh = () => {
    generateAutoMaCongTrinh();
    message.success('Đã làm mới mã công trình');
  };

  useEffect(() => {
    if (addModalVisible) {
      generateAutoMaCongTrinh();
      addForm.resetFields();
      addForm.setFieldsValue({
        MaCongTrinh: useAutoMaCongTrinh ? autoMaCongTrinh : '',
      });
    }
  }, [addModalVisible]);

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const response = await axios.post(
        `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=POST`,
        values,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Thêm mới công trình thành công');
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

  // Lấy danh sách loại công trình duy nhất từ data
  const loaiCongTrinhOptions = [
    { value: 'all', label: 'Tất cả loại công trình' },
    ...Array.from(new Set(data.map(item => item.TenLoaiCongTrinh).filter(Boolean))).map(loai => ({ value: loai, label: loai }))
  ];

  const getFilteredData = () => {
    let filtered = data;
    if (selectedLoai !== 'all') {
      filtered = filtered.filter(item => item.TenLoaiCongTrinh === selectedLoai);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        item =>
          (item.MaCongTrinh && item.MaCongTrinh.toLowerCase().includes(lower)) ||
          (item.TenCongTrinh && item.TenCongTrinh.toLowerCase().includes(lower)) ||
          (item.TenKhachHang && item.TenKhachHang.toLowerCase().includes(lower)) ||
          (item.TenLoaiCongTrinh && item.TenLoaiCongTrinh.toLowerCase().includes(lower))
      );
    }
    return filtered;
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditVisible(true);
  };

  const handleDateChange = (date) => {
    setEditForm({
      ...editForm,
      NgayDuKienHoanThanh: date,
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Format date to YYYY-MM-DD format
      const formattedDate = editForm.NgayDuKienHoanThanh ? 
                            editForm.NgayDuKienHoanThanh.format('YYYY-MM-DD') : null;
      
      // Create updated record with only the editable date field
      const updatedRecord = {
        ...editRecord,
        NgayDuKienHoanThanh: formattedDate,
      };

      // API call to update the record
      const res = await axios.put(
        `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=PUT`, 
        updatedRecord,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.status === 'success') {
        message.success('Cập nhật công trình thành công');
        fetchData(); // Refresh data
        setEditVisible(false);
      } else {
        message.error('Cập nhật công trình thất bại');
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
    { title: 'Mã công trình', dataIndex: 'MaCongTrinh', key: 'MaCongTrinh', width: 120, align: 'center' },
    { title: 'Tên công trình', dataIndex: 'TenCongTrinh', key: 'TenCongTrinh', width: 250, align: 'center' },
    { title: 'Loại công trình', dataIndex: 'TenLoaiCongTrinh', key: 'TenLoaiCongTrinh', width: 180, align: 'center' },
    { title: 'Tên khách hàng', dataIndex: 'TenKhachHang', key: 'TenKhachHang', width: 200, align: 'center' },
    { title: 'Ngày dự kiến hoàn thành', dataIndex: 'NgayDuKienHoanThanh', key: 'NgayDuKienHoanThanh', width: 180, align: 'center' },
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
        <h1 className="text-2xl font-bold">Quản lý công trình</h1>
        <Select
          value={selectedLoai}
          onChange={setSelectedLoai}
          style={{ width: 200 }}
          options={loaiCongTrinhOptions}
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
          rowKey="MaCongTrinh"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} công trình`,
          }}
        />
      </div>
      
      {/* Chi tiết công trình modal */}
      <Modal
        title="Chi tiết công trình"
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
            {currentRecord.MaCongTrinh && (
              <p><strong>Mã công trình:</strong> {currentRecord.MaCongTrinh}</p>
            )}
            {currentRecord.TenCongTrinh && (
              <p><strong>Tên công trình:</strong> {currentRecord.TenCongTrinh}</p>
            )}
            {currentRecord.Dientich && (
              <p><strong>Diện tích:</strong> {currentRecord.Dientich}m²</p>
            )}
            {currentRecord.FileThietKe && (
              <p><strong>File thiết kế:</strong> {currentRecord.FileThietKe}</p>
            )}
            {currentRecord.TenKhachHang && (
              <p><strong>Tên khách hàng:</strong> {currentRecord.TenKhachHang}</p>
            )}
            {currentRecord.MaHopDong && (
              <p><strong>Mã hợp đồng:</strong> {currentRecord.MaHopDong}</p>
            )}
            {currentRecord.TenLoaiCongTrinh && (
              <p><strong>Loại công trình:</strong> {currentRecord.TenLoaiCongTrinh}</p>
            )}
            {currentRecord.NgayDuKienHoanThanh && (
              <p><strong>Ngày dự kiến hoàn thành:</strong> {currentRecord.NgayDuKienHoanThanh}</p>
            )}
          </div>
        )}
      </Modal>
      
      {/* Sửa công trình modal */}
      <Modal
        title="Sửa công trình"
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
              <strong>Mã công trình:</strong>
              <Input 
                value={editRecord.MaCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên công trình:</strong>
              <Input 
                value={editRecord.TenCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Diện tích (m²):</strong>
              <Input 
                value={editRecord.Dientich} 
                className="mt-1" 
                suffix="m²" 
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>File thiết kế:</strong>
              <Input 
                value={editRecord.FileThietKe} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Tên khách hàng:</strong>
              <Input 
                value={editRecord.TenKhachHang} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Mã hợp đồng:</strong>
              <Input 
                value={editRecord.MaHopDong} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Loại công trình:</strong>
              <Input 
                value={editRecord.TenLoaiCongTrinh} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Ngày dự kiến hoàn thành:</strong>
              <DatePicker 
                className="mt-1 w-full"
                value={editForm.NgayDuKienHoanThanh}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                placeholder="Chọn ngày"
              />
            </div>
          </div>
        )}
      </Modal>
      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Thêm công trình mới
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
          <Form.Item label="Mã công trình">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Switch
                checked={useAutoMaCongTrinh}
                onChange={handleAutoMaCongTrinhChange}
                style={{ marginRight: '8px' }}
              />
              <span>Sử dụng mã tự động</span>
              {useAutoMaCongTrinh && (
                <Button 
                  type="link" 
                  onClick={refreshAutoMaCongTrinh} 
                  style={{ marginLeft: '8px' }}
                >
                  Làm mới
                </Button>
              )}
              <Tooltip title="Mã sẽ được tạo theo định dạng CT + năm tháng ngày giờ phút giây">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
              </Tooltip>
            </div>
            
            <Form.Item
              name="MaCongTrinh"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập mã công trình' }]}
            >
              <Input 
                placeholder="Mã công trình" 
                disabled={useAutoMaCongTrinh}
                style={{ width: '100%', fontWeight: '500' }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="TenCongTrinh"
            label="Tên công trình"
            rules={[{ required: true, message: 'Vui lòng nhập tên công trình' }]}
          >
            <Input placeholder="Nhập tên công trình" />
          </Form.Item>

          <Form.Item
            name="Dientich"
            label="Diện tích (m²)"
            rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
          >
            <Input type="number" placeholder="Nhập diện tích" suffix="m²" />
          </Form.Item>

          <Form.Item
            name="FileThietKe"
            label="File thiết kế"
          >
            <Input placeholder="Nhập đường dẫn file thiết kế" />
          </Form.Item>

          <Form.Item
            name="MaKhachHang"
            label="Khách hàng"
            rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
          >
            <Select
              placeholder="Chọn khách hàng"
              showSearch
              optionFilterProp="children"
              optionLabelProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              loading={!khachHangList.length}
              notFoundContent={!khachHangList.length ? "Đang tải dữ liệu..." : "Không tìm thấy khách hàng"}
            >
              {khachHangList.map(kh => (
                <Select.Option
                  key={kh.MaKhachHang}
                  value={kh.MaKhachHang}
                  label={kh.TenKhachHang}
                >
                  <div>
                    <div className="font-medium">{kh.TenKhachHang}</div>
                    <div className="text-gray-500 text-sm">SĐT: {kh.SoDT}</div>
                    {kh.Email && <div className="text-gray-500 text-sm">Email: {kh.Email}</div>}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MaHopDong"
            label="Hợp đồng"
            rules={[{ required: true, message: 'Vui lòng chọn hợp đồng' }]}
          >
            <Select
              placeholder="Chọn hợp đồng"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              loading={hopDongLoading}
              notFoundContent={hopDongLoading ? "Đang tải dữ liệu..." : "Không tìm thấy hợp đồng"}
            >
              {hopDongList.map(hd => (
                <Select.Option
                  key={hd.MaHopDong}
                  value={hd.MaHopDong}
                  label={`${hd.MaHopDong} - ${hd.MoTa}`}
                >
                  <div>
                    <div className="font-medium">{hd.MaHopDong}</div>
                    <div className="text-gray-500 text-sm">Ngày ký: {moment(hd.NgayKy).format('DD/MM/YYYY')}</div>
                    <div className="text-gray-500 text-sm">Tổng tiền: {hd.TongTien?.toLocaleString('vi-VN')} VNĐ</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MaLoaiCongTrinh"
            label="Loại công trình"
            rules={[{ required: true, message: 'Vui lòng chọn loại công trình' }]}
          >
            <Select 
              placeholder="Chọn loại công trình"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              loading={!loaiCongTrinhList.length}
              notFoundContent={!loaiCongTrinhList.length ? "Đang tải dữ liệu..." : "Không tìm thấy loại công trình"}
            >
              {loaiCongTrinhList.map(lct => (
                <Select.Option 
                  key={lct.MaLoaiCongTrinh} 
                  value={lct.MaLoaiCongTrinh}
                  label={lct.TenLoaiCongTrinh}
                >
                  {lct.TenLoaiCongTrinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="NgayDuKienHoanThanh"
            label="Ngày dự kiến hoàn thành"
            rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến hoàn thành' }]}
          >
            <DatePicker 
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyCongTrinh;