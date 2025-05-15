import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Switch, Tooltip, Space, InputNumber } from 'antd';
import { InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const { Option } = Select;

const AddBaoGiaForm = ({ visible, onCancel, onSuccess, loaiBaoGiaList = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [useAutoMaBaoGia, setUseAutoMaBaoGia] = useState(true);
  const [autoMaBaoGia, setAutoMaBaoGia] = useState('');
  const [loaiCongTrinhList, setLoaiCongTrinhList] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Danh sách trạng thái
  const trangThaiOptions = [
    { value: 'Chờ duyệt', label: 'Chờ duyệt' },
    { value: 'Đã duyệt', label: 'Đã duyệt' },
    { value: 'Từ chối', label: 'Từ chối' },
    { value: 'Hoàn thành', label: 'Hoàn thành' }
  ];

  // Fetch danh sách loại công trình khi component mount
  useEffect(() => {
    fetchLoaiCongTrinhList();
  }, []);

  const fetchLoaiCongTrinhList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}LoaiCongTrinh_API/LoaiCongTrinh_API.php?action=GET_ALL`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 'success') {
        setLoaiCongTrinhList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching loại công trình:', error);
    }
  };

  // Tạo mã báo giá tự động theo định dạng BG + ngày tháng năm giờ phút giây
  useEffect(() => {
    generateAutoMaBaoGia();
  }, []);

  const generateAutoMaBaoGia = () => {
    const now = new Date();
    
    // Lấy các thành phần thời gian
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    // Tạo mã theo định dạng BG + năm tháng ngày giờ phút giây mili giây
    const newMaBaoGia = `BG${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    
    setAutoMaBaoGia(newMaBaoGia);
    
    // Cập nhật giá trị mặc định cho form nếu đang sử dụng mã tự động
    if (useAutoMaBaoGia) {
      form.setFieldsValue({ MaBaoGia: newMaBaoGia });
    }
  };

  // Xử lý việc thay đổi giữa mã tự động và mã tùy chỉnh
  const handleAutoMaBaoGiaChange = (checked) => {
    setUseAutoMaBaoGia(checked);
    
    if (checked) {
      form.setFieldsValue({ MaBaoGia: autoMaBaoGia });
    } else {
      form.setFieldsValue({ MaBaoGia: '' });
    }
  };

  // Làm mới mã tự động
  const refreshAutoMaBaoGia = () => {
    generateAutoMaBaoGia();
    message.success('Đã làm mới mã báo giá');
  };

  // Reset form khi mở modal
  useEffect(() => {
    if (visible) {
      // Tạo mã mới mỗi khi mở modal
      generateAutoMaBaoGia();
      
      form.resetFields();
      
      // Thiết lập giá trị mặc định
      form.setFieldsValue({
        TrangThai: 'Chờ duyệt',
        MaBaoGia: useAutoMaBaoGia ? autoMaBaoGia : '',
        ChiTietLoaiBaoGia: [{
          MaCongTrinh: null,
          NoiDung: '',
          GiaBaoGia: null
        }]
      });
    }
  }, [visible, form, useAutoMaBaoGia]);

  // Hàm submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const requestData = {
        MaBaoGia: values.MaBaoGia,
        TenBaoGia: values.TenBaoGia,
        TrangThai: values.TrangThai,
        MaLoai: values.MaLoai,
        ChiTietLoaiBaoGia: values.ChiTietLoaiBaoGia.map(item => ({
          NoiDung: item.NoiDung,
          GiaBaoGia: item.GiaBaoGia
        }))
      };

      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=POST`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      if (response.data.status === 'success') {
        // Hiển thị thông báo tùy chỉnh
        setShowNotification(true);
        
        // Đóng form và reset
        form.resetFields();
        onSuccess();
        onCancel();

        // Ẩn thông báo sau 2 giây
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      } else {
        message.error(response.data.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi thêm mới báo giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới báo giá"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            Thêm mới
          </Button>
        ]}
        width={800}
      >
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            TrangThai: 'Chờ duyệt',
            MaBaoGia: autoMaBaoGia,
            ChiTietLoaiBaoGia: [{
              MaCongTrinh: null,
              NoiDung: '',
              GiaBaoGia: null
            }]
          }}
        >
          {/* Tùy chọn mã tự động */}
          <Form.Item label="Mã báo giá">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Switch
                checked={useAutoMaBaoGia}
                onChange={handleAutoMaBaoGiaChange}
                style={{ marginRight: '8px' }}
              />
              <span>Sử dụng mã tự động</span>
              {useAutoMaBaoGia && (
                <Button 
                  type="link" 
                  onClick={refreshAutoMaBaoGia} 
                  style={{ marginLeft: '8px' }}
                >
                  Làm mới
                </Button>
              )}
              <Tooltip title="Mã sẽ được tạo theo định dạng BG + năm tháng ngày giờ phút giây">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff' }} />
              </Tooltip>
            </div>
            
            <Form.Item
              name="MaBaoGia"
              noStyle
              rules={[{ required: true, message: 'Vui lòng nhập mã báo giá' }]}
            >
              <Input 
                placeholder="Mã báo giá" 
                disabled={useAutoMaBaoGia}
                style={{ width: '100%', fontWeight: '500' }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="TenBaoGia"
            label="Tên báo giá"
            rules={[{ required: true, message: 'Vui lòng nhập tên báo giá' }]}
          >
            <Input placeholder="Nhập tên báo giá" style={{ fontWeight: '500' }} />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            initialValue="Chờ duyệt"
          >
            <Input disabled value="Chờ duyệt" style={{ fontWeight: '500' }} />
          </Form.Item>

          <Form.Item
            name="MaLoai"
            label="Loại báo giá"
            rules={[{ required: true, message: 'Vui lòng chọn loại báo giá' }]}
          >
            <Select placeholder="Chọn loại báo giá">
              {loaiBaoGiaList.map(loai => (
                <Option key={loai.MaLoai} value={loai.MaLoai}>
                  {loai.TenLoai}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Chi tiết loại báo giá section */}
          <Form.List name="ChiTietLoaiBaoGia">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3>Chi tiết loại báo giá</h3>
                  <Button
                    type="dashed"
                    onClick={() => add({
                      MaCongTrinh: null,
                      NoiDung: '',
                      GiaBaoGia: null
                    })}
                    icon={<PlusOutlined />}
                  >
                    Thêm chi tiết loại
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'NoiDung']}
                      rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                      <Input placeholder="Nội dung" style={{ width: 200, fontWeight: '500' }} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'GiaBaoGia']}
                      rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                      <InputNumber
                        placeholder="Giá báo giá"
                        style={{ width: 200 }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Custom Notification */}
      {showNotification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-lg font-semibold">Thêm mới báo giá thành công!</span>
          </div>
        </div>
      )}
    </>
  );
};

// Thêm styles cho animation
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Thêm style tag vào document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AddBaoGiaForm;