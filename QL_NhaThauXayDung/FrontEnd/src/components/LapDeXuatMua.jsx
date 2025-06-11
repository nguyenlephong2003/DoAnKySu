import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, InputNumber, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import moment from 'moment';
import { useAuth } from '../Config/AuthContext';

const LapDeXuatMua = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [thietBiVatTuList, setThietBiVatTuList] = useState([]);
  const [filteredThietBiVatTuList, setFilteredThietBiVatTuList] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const { user } = useAuth();
  const maNhanVien = user?.MaNhanVien || "";

  const fetchNhaCungCapList = async () => {
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
        setNhaCungCapList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching NhaCungCap:', error.response?.data || error);
      message.error('Không thể lấy danh sách nhà cung cấp');
    }
  };

  const fetchThietBiVatTuList = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}DeXuat_API/ThietBiVatTu_API.php?action=GET`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setThietBiVatTuList(response.data.data);
        setFilteredThietBiVatTuList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ThietBiVatTu:', error.response?.data || error);
      message.error('Không thể lấy danh sách thiết bị vật tư');
    }
  };

  // Hàm lấy thiết bị vật tư theo nhà cung cấp
  const fetchThietBiVatTuByNhaCungCap = async (maNhaCungCap) => {
    if (!maNhaCungCap) {
      setFilteredThietBiVatTuList(thietBiVatTuList);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_EQUIPMENT_BY_SUPPLIER&maNhaCungCap=${maNhaCungCap}`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setFilteredThietBiVatTuList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching equipment by supplier:', error.response?.data || error);
      message.error('Không thể lấy danh sách thiết bị vật tư của nhà cung cấp');
      setFilteredThietBiVatTuList([]);
    }
  };

  // Fetch danh sách nhà cung cấp và thiết bị vật tư
  useEffect(() => {
    fetchNhaCungCapList();
    fetchThietBiVatTuList();
  }, []);

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
    
    return `PN${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Kiểm tra trường NgayGiaoDuKien không được null
      if (!values.NgayGiaoDuKien) {
        message.error('Vui lòng chọn ngày giao dự kiến');
        setLoading(false);
        return;
      }
      // Tạo mã đề xuất tự động
      const maDeXuat = generateAutoMaPhieuNhap();
      // Format dữ liệu đề xuất
      const deXuatData = {
        MaDeXuat: maDeXuat,
        NgayLap: values.NgayLap.format('YYYY-MM-DD'),
        NgayGiaoDuKien: values.NgayGiaoDuKien.format('YYYY-MM-DD'),
        MaNhanVien: values.MaNhanVien,
        LoaiDeXuat: 'Mua thiết bị vật tư',
        TrangThai: values.TrangThai,
        GhiChu: values.GhiChu || null
      };
      console.log('Sending deXuatData:', deXuatData); // Debug

      // Gửi tạo đề xuất
      const response = await axios.post(
        `${BASE_URL}DeXuat_API/DeXuat_API.php?action=POST`,
        deXuatData,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        // Gửi từng chi tiết đề xuất
        const chiTietPromises = values.ChiTietPhieuNhap.map(item => {
          return axios.post(
            `${BASE_URL}DeXuat_API/ChiTietDeXuat_API.php?action=POST`,
            {
              MaDeXuat: maDeXuat,
              MaThietBiVatTu: item.MaThietBiVatTu,
              SoLuong: parseInt(item.SoLuong),
              DonGia: parseFloat(item.DonGia),
              MaNhaCungCap: values.MaNhaCungCap
            },
            {
              withCredentials: true,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
        });

        await Promise.all(chiTietPromises);
        Modal.success({
          title: 'Thành công',
          content: 'Tạo đề xuất thành công!',
          centered: true,
          okText: 'Đóng',
        });
        form.resetFields();
      } else {
        message.error(response.data.message || 'Tạo đề xuất thất bại');
      }
    } catch (error) {
      console.error('Error creating proposal:', error.response?.data || error);
      message.error('Có lỗi xảy ra khi tạo đề xuất');
    } finally {
      setLoading(false);
    }
  };

  const renderChiTietPhieuNhap = () => {
    return (
      <Form.List name="ChiTietPhieuNhap">
        {(fields, { add, remove }) => (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Chi tiết phiếu nhập</h3>
              <Button
                type="dashed"
                onClick={() => add({
                  MaThietBiVatTu: null,
                  SoLuong: null,
                  DonGia: null
                })}
                icon={<PlusOutlined />}
                disabled={!(form.getFieldValue('MaNhaCungCap'))}
              >
                Thêm vật tư
              </Button>
            </div>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-white shadow-sm">
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
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                      const selectedItem = filteredThietBiVatTuList.find(tb => tb.MaThietBiVatTu === value);
                      if (selectedItem) {
                        setSelectedUnits(prev => ({
                          ...prev,
                          [name]: selectedItem.DonViTinh
                        }));
                      }
                    }}
                    disabled={!(form.getFieldValue('MaNhaCungCap'))}
                    dropdownStyle={{ backgroundColor: 'white' }}
                    dropdownRender={menu => (
                      <div style={{ backgroundColor: 'white' }}>
                        {menu}
                      </div>
                    )}
                  >
                    {filteredThietBiVatTuList.map(tb => (
                      <Select.Option
                        key={tb.MaThietBiVatTu}
                        value={tb.MaThietBiVatTu}
                        label={tb.TenThietBiVatTu}
                      >
                        <div className="p-2">
                          <div className="font-medium">{tb.TenThietBiVatTu}</div>
                          <div className="text-gray-500 text-sm">Loại: {tb.TenLoaiThietBiVatTu}</div>
                          <div className="text-gray-500 text-sm">Đơn vị: {tb.DonViTinh}</div>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'SoLuong']}
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                  className="flex items-center"
                >
                  <div className="flex items-center gap-2">
                    <InputNumber
                      placeholder="Số lượng"
                      min={1}
                      className="w-full"
                      disabled={!(form.getFieldValue('MaNhaCungCap'))}
                    />
                    <span className="text-gray-600 text-base font-medium px-2 whitespace-nowrap">
                      {selectedUnits[name] || ''}
                    </span>
                  </div>
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
                    disabled={!(form.getFieldValue('MaNhaCungCap'))}
                  />
                </Form.Item>
                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                    className="absolute top-2 right-2"
                    disabled={!(form.getFieldValue('MaNhaCungCap'))}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </Form.List>
    );
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Lập đề xuất mua vật tư/thiết bị
      </h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          MaNhanVien: maNhanVien,
          NgayLap: moment(),
          TrangThai: 'Chờ duyệt',
          ChiTietPhieuNhap: [{
            MaThietBiVatTu: null,
            SoLuong: null,
            DonGia: null
          }]
        }}
      >
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-6 rounded-lg">
          <Form.Item
            name="MaNhaCungCap"
            label="Nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
          >
            <Select
              placeholder="Chọn nhà cung cấp"
              showSearch
              optionFilterProp="children"
              optionLabelProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => {
                fetchThietBiVatTuByNhaCungCap(value);
                const chiTietPhieuNhap = form.getFieldValue('ChiTietPhieuNhap');
                if (chiTietPhieuNhap) {
                  const resetChiTiet = chiTietPhieuNhap.map(item => ({
                    MaThietBiVatTu: null,
                    SoLuong: null,
                    DonGia: null
                  }));
                  form.setFieldsValue({ ChiTietPhieuNhap: resetChiTiet });
                  setSelectedUnits({});
                }
              }}
              dropdownStyle={{ backgroundColor: 'white' }}
              dropdownRender={menu => (
                <div style={{ backgroundColor: 'white' }}>
                  {menu}
                </div>
              )}
            >
              {nhaCungCapList.map(ncc => (
                <Select.Option
                  key={ncc.MaNhaCungCap}
                  value={ncc.MaNhaCungCap}
                  label={ncc.TenNhaCungCap}
                >
                  <div className="p-2">
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
          >
            <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Item>

          <Form.Item
            name="NgayLap"
            label="Ngày lập phiếu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày lập phiếu' }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              disabled
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </Form.Item>

          <Form.Item
            name="NgayGiaoDuKien"
            label="Ngày giao dự kiến"
            rules={[{ required: true, message: 'Vui lòng chọn ngày giao dự kiến' }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Chọn ngày giao dự kiến"
            />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
          >
            <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Item>
        </div>

        {/* Chi tiết phiếu nhập */}
        <div className="mb-6 relative">
          {/* Thông báo khi chưa chọn nhà cung cấp */}
          {!(form.getFieldValue('MaNhaCungCap')) && (
            <div className="mb-4 flex justify-center">
              <span className="text-lg font-semibold text-gray-700">Vui lòng chọn nhà cung cấp trước</span>
            </div>
          )}
          <div className={!(form.getFieldValue('MaNhaCungCap')) ? 'pointer-events-none select-none opacity-60' : ''}>
            {renderChiTietPhieuNhap()}
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            Tạo đề xuất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LapDeXuatMua; 