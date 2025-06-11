import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Input, Select, DatePicker, Form, Switch, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import moment from 'moment';
import { useAuth } from '../Config/AuthContext';

const QuanLyPhieuKiemTra = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [useAutoMaPhieu, setUseAutoMaPhieu] = useState(true);
  const [autoMaPhieu, setAutoMaPhieu] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Kiểm tra quyền xóa
  const canDelete = user?.TenLoaiNhanVien === 'Admin' || user?.TenLoaiNhanVien === 'Giám đốc';

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = [
      {
        id: 1,
        MaPhieu: 'PKT20240320001',
        NgayKiemTra: '2024-03-20',
        NguoiKiemTra: 'Nguyễn Văn A',
        TrangThai: 'Đã kiểm tra',
        GhiChu: 'Thiết bị hoạt động tốt, đã kiểm tra định kỳ'
      },
      {
        id: 2,
        MaPhieu: 'PKT20240319001',
        NgayKiemTra: '2024-03-19',
        NguoiKiemTra: 'Trần Thị B',
        TrangThai: 'Đã kiểm tra',
        GhiChu: 'Phát hiện một số thiết bị cần bảo trì, đã báo cáo'
      },
      {
        id: 3,
        MaPhieu: 'PKT20240318001',
        NgayKiemTra: '2024-03-18',
        NguoiKiemTra: 'Lê Văn C',
        TrangThai: 'Chưa kiểm tra',
        GhiChu: 'Đang chờ kiểm tra định kỳ'
      },
      {
        id: 4,
        MaPhieu: 'PKT20240317001',
        NgayKiemTra: '2024-03-17',
        NguoiKiemTra: 'Phạm Thị D',
        TrangThai: 'Đã kiểm tra',
        GhiChu: 'Tất cả thiết bị hoạt động bình thường'
      },
      {
        id: 5,
        MaPhieu: 'PKT20240316001',
        NgayKiemTra: '2024-03-16',
        NguoiKiemTra: 'Hoàng Văn E',
        TrangThai: 'Đã kiểm tra',
        GhiChu: 'Cần thay thế một số linh kiện đã cũ'
      }
    ];
    setData(mockData);
  }, []);

  useEffect(() => {
    if (addModalVisible) {
      generateAutoMaPhieu();
      addForm.resetFields();
      addForm.setFieldsValue({
        MaPhieu: useAutoMaPhieu ? autoMaPhieu : '',
      });
    }
  }, [addModalVisible]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}QuanLyPhieuKiemTra_API/PhieuKiemTra_API.php?action=GET`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        message.error('Không thể tải dữ liệu phiếu kiểm tra');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const generateAutoMaPhieu = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const newMaPhieu = `PKT${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    setAutoMaPhieu(newMaPhieu);
    
    if (useAutoMaPhieu) {
      addForm.setFieldsValue({ MaPhieu: newMaPhieu });
    }
  };

  const handleAutoMaPhieuChange = (checked) => {
    setUseAutoMaPhieu(checked);
    if (checked) {
      addForm.setFieldsValue({ MaPhieu: autoMaPhieu });
    } else {
      addForm.setFieldsValue({ MaPhieu: '' });
    }
  };

  const refreshAutoMaPhieu = () => {
    generateAutoMaPhieu();
    message.success('Đã làm mới mã phiếu');
  };

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const response = await axios.post(
        `${BASE_URL}QuanLyPhieuKiemTra_API/PhieuKiemTra_API.php?action=POST`,
        values,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Thêm mới phiếu kiểm tra thành công');
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

  const handleEdit = (record) => {
    setSelectedRecord(record);
    editForm.setFieldsValue({
      ...record,
      NgayKiemTra: record.NgayKiemTra ? moment(record.NgayKiemTra) : null,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const values = await editForm.validateFields();
      
      const response = await axios.put(
        `${BASE_URL}QuanLyPhieuKiemTra_API/PhieuKiemTra_API.php?action=PUT`,
        { ...values, MaPhieu: selectedRecord.MaPhieu },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        message.success('Cập nhật phiếu kiểm tra thành công');
        setEditModalVisible(false);
        await fetchData();
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

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}QuanLyPhieuKiemTra_API/PhieuKiemTra_API.php?action=DELETE&MaPhieu=${record.MaPhieu}`,
        {
          withCredentials: true
        }
      );

      if (response.data.status === 'success') {
        message.success('Xóa phiếu kiểm tra thành công');
        await fetchData();
      } else {
        message.error(response.data.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting:', error.response?.data || error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  const getFilteredData = () => {
    let filtered = data;
    if (selectedTrangThai !== 'all') {
      filtered = filtered.filter(item => item.TrangThai === selectedTrangThai);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        item =>
          (item.MaPhieu && item.MaPhieu.toLowerCase().includes(lower)) ||
          (item.NguoiKiemTra && item.NguoiKiemTra.toLowerCase().includes(lower)) ||
          (item.GhiChu && item.GhiChu.toLowerCase().includes(lower))
      );
    }
    return filtered;
  };

  const columns = [
    { 
      title: 'Mã phiếu', 
      dataIndex: 'MaPhieu', 
      key: 'MaPhieu', 
      width: 150, 
      align: 'center' 
    },
    { 
      title: 'Ngày kiểm tra', 
      dataIndex: 'NgayKiemTra', 
      key: 'NgayKiemTra', 
      width: 150, 
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY')
    },
    { 
      title: 'Người kiểm tra', 
      dataIndex: 'NguoiKiemTra', 
      key: 'NguoiKiemTra', 
      width: 200, 
      align: 'center' 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'TrangThai', 
      key: 'TrangThai', 
      width: 150, 
      align: 'center',
      render: (text) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          text === 'Đã kiểm tra' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {text}
        </span>
      )
    },
    { 
      title: 'Ghi chú', 
      dataIndex: 'GhiChu', 
      key: 'GhiChu', 
      width: 300, 
      align: 'center' 
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => {
              setCurrentRecord(record);
              setDetailVisible(true);
            }}
            type="primary"
          >
            Chi tiết
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Sửa
          </Button>
          {canDelete && (
            <Button 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              danger
            >
              Xóa
            </Button>
          )}
        </div>
      ),
    },
  ];

  const trangThaiOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'Đã kiểm tra', label: 'Đã kiểm tra' },
    { value: 'Chưa kiểm tra', label: 'Chưa kiểm tra' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
          Quản lý phiếu kiểm tra thiết bị
        </h1>
        <Select
          value={selectedTrangThai}
          onChange={setSelectedTrangThai}
          style={{ width: 200 }}
          options={trangThaiOptions}
          className="self-end md:self-auto"
        />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Tìm kiếm theo mã phiếu, người kiểm tra..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: 350 }}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Thêm mới
        </Button>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="MaPhieu"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} phiếu kiểm tra`,
          }}
        />
      </div>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Thêm phiếu kiểm tra mới
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
          <Form.Item label="Mã phiếu">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Switch
                checked={useAutoMaPhieu}
                onChange={handleAutoMaPhieuChange}
                style={{ marginRight: '8px' }}
              />
              <span>Sử dụng mã tự động</span>
              {useAutoMaPhieu && (
                <Button 
                  type="link" 
                  onClick={refreshAutoMaPhieu} 
                  style={{ marginLeft: '8px' }}
                >
                  Làm mới
                </Button>
              )}
              <Tooltip title="Mã sẽ được tạo theo định dạng PKT + năm tháng ngày giờ phút giây">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
              </Tooltip>
            </div>
            
            <Form.Item
              name="MaPhieu"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}
            >
              <Input 
                placeholder="Mã phiếu" 
                disabled={useAutoMaPhieu}
                style={{ width: '100%', fontWeight: '500' }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="NgayKiemTra"
            label="Ngày kiểm tra"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm tra' }]}
          >
            <DatePicker 
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày"
            />
          </Form.Item>

          <Form.Item
            name="NguoiKiemTra"
            label="Người kiểm tra"
            rules={[{ required: true, message: 'Vui lòng nhập tên người kiểm tra' }]}
          >
            <Input placeholder="Nhập tên người kiểm tra" />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Đã kiểm tra">Đã kiểm tra</Select.Option>
              <Select.Option value="Chưa kiểm tra">Chưa kiểm tra</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea 
              placeholder="Nhập ghi chú" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Sửa phiếu kiểm tra
          </div>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
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
                setEditModalVisible(false);
                editForm.resetFields();
              }}
              className="px-6"
            >
              Đóng
            </Button>
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleEditSubmit}
              loading={loading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Lưu
            </Button>
          </div>
        ]}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="MaPhieu"
            label="Mã phiếu"
          >
            <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Item>

          <Form.Item
            name="NgayKiemTra"
            label="Ngày kiểm tra"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm tra' }]}
          >
            <DatePicker 
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày"
            />
          </Form.Item>

          <Form.Item
            name="NguoiKiemTra"
            label="Người kiểm tra"
            rules={[{ required: true, message: 'Vui lòng nhập tên người kiểm tra' }]}
          >
            <Input placeholder="Nhập tên người kiểm tra" />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Đã kiểm tra">Đã kiểm tra</Select.Option>
              <Select.Option value="Chưa kiểm tra">Chưa kiểm tra</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea 
              placeholder="Nhập ghi chú" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết phiếu kiểm tra"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {currentRecord && (
          <div className="space-y-4">
            <div>
              <strong>Mã phiếu:</strong>
              <Input 
                value={currentRecord.MaPhieu} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Ngày kiểm tra:</strong>
              <Input 
                value={moment(currentRecord.NgayKiemTra).format('DD/MM/YYYY')} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Người kiểm tra:</strong>
              <Input 
                value={currentRecord.NguoiKiemTra} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
            <div>
              <strong>Trạng thái:</strong>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  currentRecord.TrangThai === 'Đã kiểm tra' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentRecord.TrangThai}
                </span>
              </div>
            </div>
            <div>
              <strong>Ghi chú:</strong>
              <Input.TextArea 
                value={currentRecord.GhiChu} 
                className="mt-1" 
                disabled 
                style={{ backgroundColor: '#f5f5f5' }}
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuanLyPhieuKiemTra; 