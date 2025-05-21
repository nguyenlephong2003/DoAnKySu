import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../Config';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuanLyLuong = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLuong, setEditingLuong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [nhanVienOptions, setNhanVienOptions] = useState([]);

  useEffect(() => {
    console.log('Thành phần QL_Luong được gắn kết');
    fetchData();
    fetchNhanVien();
    return () => console.log('Thành phần QL_Luong được tháo gỡ');
  }, []);

  const fetchNhanVien = async () => {
    try {
      const response = await axios.get(`${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`);
      if (response.data.status === 'success') {
        setNhanVienOptions(response.data.data);
      } else {
        message.error('Không thể tải danh sách nhân viên');
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách nhân viên:', err);
      message.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  const fetchData = async () => {
    console.log('Đang tải dữ liệu lương...');
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}NguoiDung_API/BangChamCong_API.php?action=GET`);
      const res = response.data;
      if (res.status === 'success') {
        setData(res.data);
        console.log('Dữ liệu lương đã tải:', res.data);
      } else {
        message.error('Không thể tải dữ liệu lương');
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lương:', err);
      message.error('Lỗi khi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingLuong(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingLuong(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    console.log('Đang xóa bản ghi lương:', record);

    try {
      const response = await axios.delete(
        `${BASE_URL}NguoiDung_API/BangChamCong_API.php?action=DELETE&ma_cham_cong=${record.MaChamCong}`
      );

      console.log('Phản hồi từ API:', response.data);

      // Tạm bỏ điều kiện kiểm tra status
      message.success('Xóa thành công');
      fetchData();
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      message.error('Lỗi khi xóa bản ghi lương');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Giá trị biểu mẫu:', values);

      // Tính LuongThang = LuongCanBan * SoNgayLam
      values.LuongThang = values.LuongCanBan * values.SoNgayLam;


      if (editingLuong) {
        // Cập nhật bản ghi lương
        const response = await axios.put(`${BASE_URL}NguoiDung_API/BangChamCong_API.php?action=PUT`, values);
        if (response.data.status === 'success') {
          message.success('Cập nhật thành công');
          fetchData();
        } else {
          message.error('Lỗi: ' + response.data.message || 'Không thể cập nhật bản ghi lương');
        }
      } else {
        // Thêm bản ghi lương mới
        const response = await axios.post(`${BASE_URL}NguoiDung_API/BangChamCong_API.php?action=POST`, values);
        if (response.data.status === 'success') {
          message.success('Thêm mới thành công');
          fetchData();
        } else {
          message.error('Lỗi: ' + response.data.message || 'Không thể thêm bản ghi lương');
        }
      }
      setModalVisible(false);
    } catch (err) {
      console.error('Lỗi khi lưu biểu mẫu:', err);
      message.error('Lỗi khi lưu biểu mẫu');
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    if ('MaNhanVien' in changedValues) {
      const nv = nhanVienOptions.find(nv => nv.MaNhanVien === changedValues.MaNhanVien);
      if (nv) {
        form.setFieldsValue({ LuongCanBan: nv.LuongCanBan });

        const soNgayLam = allValues.SoNgayLam || 0;
        const luongThang = nv.LuongCanBan * soNgayLam;
        form.setFieldsValue({ LuongThang: luongThang });
      }
    }

    if ('SoNgayLam' in changedValues) {
      const luongCanBan = allValues.LuongCanBan || 0;
      const soNgayLam = changedValues.SoNgayLam;
      const luongThang = luongCanBan * soNgayLam;
      form.setFieldsValue({ LuongThang: luongThang });
    }
  };


  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.MaNhanVien.toLowerCase().includes(searchText.toLowerCase()) ||
      nhanVienOptions
        .find((nv) => nv.MaNhanVien === item.MaNhanVien)
        ?.TenNhanVien.toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'MaNhanVien',
      key: 'MaNhanVien',
    },
    {
      title: 'Tên Nhân Viên',
      key: 'TenNhanVien',
      render: (_, record) => {
        const nv = nhanVienOptions.find((nv) => nv.MaNhanVien === record.MaNhanVien);
        return nv ? nv.TenNhanVien : '';
      },
    },
    {
      title: 'Lương Căn Bản',
      key: 'LuongCanBan',
      render: (_, record) => {
        const nv = nhanVienOptions.find((nv) => nv.MaNhanVien === record.MaNhanVien);
        return nv && nv.LuongCanBan ? nv.LuongCanBan.toLocaleString('vi-VN') : '0';
      },
    },
    {
      title: 'Số Ngày Làm',
      dataIndex: 'SoNgayLam',
      key: 'SoNgayLam',
    },
    {
      title: 'Kỳ Lương',
      dataIndex: 'KyLuong',
      key: 'KyLuong',
    },
    {
      title: 'Lương Tháng',
      dataIndex: 'LuongThang',
      key: 'LuongThang',
      render: (text) => text ? text.toLocaleString('vi-VN') : '0',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record)}>
            <Button
              icon={<DeleteOutlined />}
              danger
              className="text-red-500 hover:text-red-700"
            >
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  console.log('Hiển thị QL Lương');

  const isDirectRoute = window.location.pathname.includes('/nhansu/quan-ly-luong');

  return (
    <div className={`p-6 bg-white rounded-xl ${isDirectRoute ? '' : 'm-6'}`}>
      <h2 className="font-bold text-2xl mb-5">Quản lý lương</h2>
      <div className="mb-4 flex justify-between">
        <Input.Search
          placeholder="Tìm kiếm mã nhân viên hoặc tên nhân viên..."
          className="max-w-xs"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Thêm mới
        </Button>
      </div>

      <Table
        rowKey="MaNhanVien"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
        className="border rounded"
      />

      <Modal
        open={modalVisible}
        title={editingLuong ? 'Cập nhật bản ghi lương' : 'Thêm bản ghi lương'}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4" onValuesChange={onValuesChange}>
          <Form.Item
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: 'Bắt buộc chọn nhân viên' }]}
          >
            <Select placeholder="Chọn nhân viên">
              {nhanVienOptions.map((item) => (
                <Option key={item.MaNhanVien} value={item.MaNhanVien}>
                  {item.TenNhanVien} ({item.MaNhanVien})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="KyLuong"
            label="Kỳ lương (Tháng)"
            rules={[{ required: true, message: 'Bắt buộc nhập kỳ lương' }]}
          >
            <Input type="number" min={1} max={12} />
          </Form.Item>
          <Form.Item
            name="SoNgayLam"
            label="Số ngày làm"
            rules={[{ required: true, message: 'Bắt buộc nhập số ngày làm' }]}
          >
            <Input type="number" min={0} max={31} />
          </Form.Item>
          <Form.Item
            name="LuongCanBan"
            label="Lương căn bản"
          >
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item
            name="LuongThang"
            label="Lương tháng"
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Input type="number" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyLuong;