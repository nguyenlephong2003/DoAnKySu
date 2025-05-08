import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const { Option } = Select;

const AddBaoGiaForm = ({ visible, onCancel, onSuccess, loaiBaoGiaList = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [useAutoMaBaoGia, setUseAutoMaBaoGia] = useState(true);
  const [autoMaBaoGia, setAutoMaBaoGia] = useState('');

  // Danh sách trạng thái
  const trangThaiOptions = [
    { value: 'Chờ duyệt', label: 'Chờ duyệt' },
    { value: 'Đã duyệt', label: 'Đã duyệt' },
    { value: 'Từ chối', label: 'Từ chối' },
    { value: 'Hoàn thành', label: 'Hoàn thành' }
  ];

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
    
    // Tạo mã theo định dạng BG + năm tháng ngày giờ phút giây
    const newMaBaoGia = `BG${year}${month}${day}${hours}${minutes}${seconds}`;
    
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
      form.resetFields();
      
      // Thiết lập giá trị mặc định
      form.setFieldsValue({
        TrangThai: 'Chờ duyệt',
        MaBaoGia: useAutoMaBaoGia ? autoMaBaoGia : ''
      });
    }
  }, [visible, form, autoMaBaoGia, useAutoMaBaoGia]);

  // Hàm submit form
  const handleSubmit = async () => {
    try {
      // Validate form trước khi submit
      const values = await form.validateFields();
      setLoading(true);

      // Chuẩn bị dữ liệu gửi đi theo cấu trúc API yêu cầu
      const requestData = {
        MaBaoGia: values.MaBaoGia,
        TenBaoGia: values.TenBaoGia,
        TrangThai: values.TrangThai,
        MaLoai: values.MaLoai
      };

      // Gọi API tạo mới báo giá
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
        message.success('Thêm mới báo giá thành công');
        form.resetFields();
        onSuccess();
        onCancel();
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
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical"
        initialValues={{
          TrangThai: 'Chờ duyệt',
          MaBaoGia: autoMaBaoGia
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
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="TenBaoGia"
          label="Tên báo giá"
          rules={[{ required: true, message: 'Vui lòng nhập tên báo giá' }]}
        >
          <Input placeholder="Nhập tên báo giá" />
        </Form.Item>

        <Form.Item
          name="TrangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {trangThaiOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
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
      </Form>
    </Modal>
  );
};

export default AddBaoGiaForm;