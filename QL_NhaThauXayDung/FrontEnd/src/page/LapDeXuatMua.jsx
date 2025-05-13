import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, InputNumber, Switch, Tooltip, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import moment from 'moment';

const LapDeXuatMua = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [useAutoMaPhieuNhap, setUseAutoMaPhieuNhap] = useState(true);
  const [autoMaPhieuNhap, setAutoMaPhieuNhap] = useState('');
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [thietBiVatTuList, setThietBiVatTuList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const maNhanVienSession = sessionStorage.getItem("maNhanVien") || "";

  // Fetch danh sách nhà cung cấp, thiết bị vật tư và nhân viên
  useEffect(() => {
    fetchNhaCungCapList();
    fetchThietBiVatTuList();
    fetchNhanVienList();
  }, []);

  const fetchNhaCungCapList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/NhaCungCap_API.php?action=GET`);
      if (response.data.status === 'success') {
        setNhaCungCapList(response.data.data);
      }
    } catch (error) {
      message.error('Không thể lấy danh sách nhà cung cấp');
    }
  };

  const fetchThietBiVatTuList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DeXuat_API/ThietBiVatTu_API.php?action=GET`);
      if (response.data.status === 'success') {
        setThietBiVatTuList(response.data.data);
      }
    } catch (error) {
      message.error('Không thể lấy danh sách thiết bị vật tư');
    }
  };

  const fetchNhanVienList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}QuanLyCongTrinh_API/NhanVien_API.php?action=GET`);
      if (response.data.status === 'success') {
        setNhanVienList(response.data.data);
      }
    } catch (error) {
      message.error('Không thể lấy danh sách nhân viên');
    }
  };

  // Tạo mã phiếu nhập tự động
  const generateAutoMaPhieuNhap = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const newMaPhieuNhap = `PN${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    setAutoMaPhieuNhap(newMaPhieuNhap);
    
    if (useAutoMaPhieuNhap) {
      form.setFieldsValue({ MaPhieuNhap: newMaPhieuNhap });
    }
  };

  useEffect(() => {
    generateAutoMaPhieuNhap();
  }, []);

  const handleAutoMaPhieuNhapChange = (checked) => {
    setUseAutoMaPhieuNhap(checked);
    if (checked) {
      form.setFieldsValue({ MaPhieuNhap: autoMaPhieuNhap });
    } else {
      form.setFieldsValue({ MaPhieuNhap: '' });
    }
  };

  const refreshAutoMaPhieuNhap = () => {
    generateAutoMaPhieuNhap();
    message.success('Đã làm mới mã phiếu nhập');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Format dữ liệu trước khi gửi
      const formattedData = {
        ...values,
        NgayLap: values.NgayLap.format('YYYY-MM-DD'),
        ChiTietPhieuNhap: values.ChiTietPhieuNhap.map(item => ({
          ...item,
          DonGia: parseFloat(item.DonGia),
          SoLuong: parseInt(item.SoLuong)
        }))
      };

      const response = await axios.post(
        `${BASE_URL}DeXuat_API/PhieuNhap_API.php?action=POST`,
        formattedData
      );

      if (response.data.status === 'success') {
        message.success('Tạo phiếu nhập thành công');
        form.resetFields();
        generateAutoMaPhieuNhap();
      } else {
        message.error(response.data.message || 'Tạo phiếu nhập thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra khi tạo phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Lập đề xuất mua vật tư/thết bị</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          TrangThai: 'Chờ duyệt',
          MaNhanVien: maNhanVienSession,
          ChiTietPhieuNhap: [{
            MaThietBiVatTu: null,
            SoLuong: null,
            DonGia: null
          }]
        }}
      >
        {/* Mã phiếu nhập */}
        <Form.Item label="Mã phiếu nhập">
          <div className="flex items-center mb-2">
            <Switch
              checked={useAutoMaPhieuNhap}
              onChange={handleAutoMaPhieuNhapChange}
              className="mr-2"
            />
            <span>Sử dụng mã tự động</span>
            {useAutoMaPhieuNhap && (
              <Button 
                type="link" 
                onClick={refreshAutoMaPhieuNhap}
                className="ml-2"
              >
                Làm mới
              </Button>
            )}
            <Tooltip title="Mã sẽ được tạo theo định dạng PN + năm tháng ngày giờ phút giây">
              <InfoCircleOutlined className="ml-2 text-blue-500" />
            </Tooltip>
          </div>
          
          <Form.Item
            name="MaPhieuNhap"
            noStyle
            rules={[{ required: true, message: 'Vui lòng nhập mã phiếu nhập' }]}
          >
            <Input 
              placeholder="Mã phiếu nhập" 
              disabled={useAutoMaPhieuNhap}
              className="w-full font-medium"
            />
          </Form.Item>
        </Form.Item>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <Select.Option key={ncc.MaNhaCungCap} value={ncc.MaNhaCungCap} label={ncc.TenNhaCungCap}>
                  <div>
                    <div className="font-medium">{ncc.TenNhaCungCap}</div>
                    <div className="text-gray-500 text-sm">SĐT: {ncc.SoDT}</div>
                    {ncc.Email && <div className="text-gray-500 text-sm">Email: {ncc.Email}</div>}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MaNhanVien"
            label="Nhân viên lập phiếu"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            <Select
              placeholder="Chọn nhân viên"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {nhanVienList.map(nv => (
                <Select.Option key={nv.MaNhanVien} value={nv.MaNhanVien} label={nv.TenNhanVien}>
                  <div>
                    <div className="font-medium">{nv.TenNhanVien}</div>
                    <div className="text-gray-500 text-sm">Chức vụ: {nv.ChucVu}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="NgayLap"
            label="Ngày lập phiếu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày lập phiếu' }]}
          >
            <DatePicker 
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày"
            />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            initialValue="Chờ duyệt"
          >
            <Input disabled value="Chờ duyệt" />
          </Form.Item>
        </div>

        {/* Chi tiết phiếu nhập */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Chi tiết phiếu nhập</h3>
            <Form.List name="ChiTietPhieuNhap">
              {(fields, { add, remove }) => (
                <Button
                  type="dashed"
                  onClick={() => add({
                    MaThietBiVatTu: null,
                    SoLuong: null,
                    DonGia: null
                  })}
                  icon={<PlusOutlined />}
                >
                  Thêm chi tiết
                </Button>
              )}
            </Form.List>
          </div>

          <Form.List name="ChiTietPhieuNhap">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                    <Form.Item
                      {...restField}
                      name={[name, 'MaThietBiVatTu']}
                      rules={[{ required: true, message: 'Vui lòng chọn thiết bị/vật tư' }]}
                      className="md:col-span-2"
                    >
                      <Select
                        placeholder="Chọn thiết bị/vật tư"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {thietBiVatTuList.map(tb => (
                          <Select.Option key={tb.MaThietBiVatTu} value={tb.MaThietBiVatTu} label={tb.TenThietBiVatTu}>
                            <div>
                              <div className="font-medium">{tb.TenThietBiVatTu}</div>
                              <div className="text-gray-500 text-sm">Loại: {tb.Loai}</div>
                              <div className="text-gray-500 text-sm">Đơn vị: {tb.DonVi}</div>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'SoLuong']}
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                    >
                      <InputNumber
                        placeholder="Số lượng"
                        min={1}
                        className="w-full"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'DonGia']}
                      rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
                    >
                      <InputNumber
                        placeholder="Đơn giá"
                        min={0}
                        className="w-full"
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
                        className="absolute top-2 right-2"
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6"
          >
            Tạo phiếu nhập
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LapDeXuatMua; 