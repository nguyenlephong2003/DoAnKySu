import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, InputNumber, Space, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import moment from 'moment';

const LapDeXuatMua = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [nhaCungCapList, setNhaCungCapList] = useState([]);
  const [thietBiVatTuList, setThietBiVatTuList] = useState([]);
  const [filteredThietBiVatTuList, setFilteredThietBiVatTuList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const maNhanVienSession = sessionStorage.getItem("maNhanVien") || "";

  // Fetch danh sách nhà cung cấp, thiết bị vật tư và nhân viên
  useEffect(() => {
    fetchNhaCungCapList();
    fetchThietBiVatTuList();
    fetchNhanVienList();
  }, []);

  const fetchNhaCungCapList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET`);
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
        setFilteredThietBiVatTuList(response.data.data);
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

  // Hàm lấy thiết bị vật tư theo nhà cung cấp
  const fetchThietBiVatTuByNhaCungCap = async (maNhaCungCap) => {
    if (!maNhaCungCap) {
      setFilteredThietBiVatTuList(thietBiVatTuList);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}DanhMuc_API/NhaCungCap_API.php?action=GET_EQUIPMENT_BY_SUPPLIER&maNhaCungCap=${maNhaCungCap}`
      );
      if (response.data.status === 'success') {
        setFilteredThietBiVatTuList(response.data.data);
      }
    } catch (error) {
      message.error('Không thể lấy danh sách thiết bị vật tư của nhà cung cấp');
      setFilteredThietBiVatTuList([]);
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
    
    return `PN${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Tạo mã đề xuất tự động
      const maDeXuat = generateAutoMaPhieuNhap();
      // Format dữ liệu đề xuất
      const deXuatData = {
        MaDeXuat: maDeXuat,
        NgayLap: values.NgayLap.format('YYYY-MM-DD'),
        NgayGiaoDuKien: values.NgayGiaoDuKien ? values.NgayGiaoDuKien.format('YYYY-MM-DD') : null,
        MaNhanVien: values.MaNhanVien,
        LoaiDeXuat: 'Mua thiết bị vật tư',
        TrangThai: values.TrangThai,
        GhiChu: values.GhiChu || null
      };
      // Gửi tạo đề xuất
      const response = await axios.post(
        `${BASE_URL}DeXuat_API/DeXuat_API.php`,
        deXuatData
      );
      if (response.data.status === 'success') {
        // Gửi từng chi tiết đề xuất
        const chiTietPromises = values.ChiTietPhieuNhap.map(item => {
          return axios.post(`${BASE_URL}DeXuat_API/ChiTietDeXuat_API.php`, {
            MaDeXuat: maDeXuat,
            MaThietBiVatTu: item.MaThietBiVatTu,
            SoLuong: parseInt(item.SoLuong),
            DonGia: parseFloat(item.DonGia),
            MaNhaCungCap: values.MaNhaCungCap
          });
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
      console.error('Error:', error);
      message.error('Có lỗi xảy ra khi tạo đề xuất');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Lập đề xuất mua vật tư/thiết bị</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          TrangThai: 'Chờ duyệt',
          MaNhanVien: maNhanVienSession,
          NgayLap: moment(),
          ChiTietPhieuNhap: [{
            MaThietBiVatTu: null,
            SoLuong: null,
            DonGia: null
          }]
        }}
      >
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
              optionLabelProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => {
                fetchThietBiVatTuByNhaCungCap(value);
                // Reset các trường chi tiết khi thay đổi nhà cung cấp
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
            >
              {nhaCungCapList.map(ncc => (
                <Select.Option
                  key={ncc.MaNhaCungCap}
                  value={ncc.MaNhaCungCap}
                  label={ncc.TenNhaCungCap}
                >
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
          >
            <Input value={maNhanVienSession} disabled />
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
            initialValue="Chờ duyệt"
          >
            <Input disabled value="Chờ duyệt" />
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
                    disabled={!(form.getFieldValue('MaNhaCungCap'))}
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
                        >
                          {filteredThietBiVatTuList.map(tb => (
                            <Select.Option
                              key={tb.MaThietBiVatTu}
                              value={tb.MaThietBiVatTu}
                              label={tb.TenThietBiVatTu}
                            >
                              <div>
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
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="px-6"
          >
            Tạo đề xuất
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LapDeXuatMua; 