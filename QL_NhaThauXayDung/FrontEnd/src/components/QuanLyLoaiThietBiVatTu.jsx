import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Popconfirm, Radio } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const QuanLyLoaiThietBiVatTu = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=GET`);
      let arr = [];
      if (Array.isArray(response.data)) {
        arr = response.data;
      } else if (Array.isArray(response.data.data)) {
        arr = response.data.data;
      }
      setData(arr);
      setPagination(prev => ({
        ...prev,
        total: arr.length
      }));
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const getFilteredData = () => {
    if (!data) return [];
    
    let filteredData = [...data];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(
        item => 
          (item.MaLoaiThietBiVatTu && item.MaLoaiThietBiVatTu.toString().toLowerCase().includes(searchLower)) ||
          (item.TenLoai && item.TenLoai.toString().toLowerCase().includes(searchLower)) ||
          (item.DonViTinh && item.DonViTinh.toString().toLowerCase().includes(searchLower))
      );
    }

    return filteredData;
  };

  const showDetailModal = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      TenLoai: record.TenLoai,
      DonViTinh: record.DonViTinh,
      LaThietBi: record.LaThietBi
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const response = await axios.put(
        `${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=PUT`,
        {
          MaLoaiThietBiVatTu: currentRecord.MaLoaiThietBiVatTu,
          ...values
        }
      );

      if (response.data.status === 'success' || response.data.message?.includes('đã được cập nhật')) {
        message.success('Cập nhật thành công');
        setEditModalVisible(false);
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
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

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      setLoading(true);
      const values = await addForm.validateFields();
      
      const response = await axios.post(
        `${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=POST`,
        values
      );

      if (response.data.status === 'success' || response.data.message?.includes('đã được thêm')) {
        message.success('Thêm mới thành công');
        setAddModalVisible(false);
        addForm.resetFields();
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
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

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}DanhMuc_API/LoaiThietBiVatTu_API.php?action=DELETE`,
        { data: { MaLoaiThietBiVatTu: record.MaLoaiThietBiVatTu } }
      );
      if (response.data.status === 'success') {
        message.success('Xóa thành công');
        await fetchData();
        setPagination(prev => ({ ...prev, current: 1 }));
      } else {
        message.error(response.data.message || 'Xóa thất bại');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã loại',
      dataIndex: 'MaLoaiThietBiVatTu',
      key: 'MaLoaiThietBiVatTu',
      width: 90,
      align: 'center',
      sorter: (a, b) => {
        if (!a.MaLoaiThietBiVatTu) return -1;
        if (!b.MaLoaiThietBiVatTu) return 1;
        return a.MaLoaiThietBiVatTu.toString().localeCompare(b.MaLoaiThietBiVatTu.toString());
      },
    },
    {
      title: 'Tên loại',
      dataIndex: 'TenLoai',
      key: 'TenLoai',
      width: 300,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a.TenLoai) return -1;
        if (!b.TenLoai) return 1;
        return a.TenLoai.toString().localeCompare(b.TenLoai.toString());
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'DonViTinh',
      key: 'DonViTinh',
      width: 180,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a.DonViTinh) return -1;
        if (!b.DonViTinh) return 1;
        return a.DonViTinh.toString().localeCompare(b.DonViTinh.toString());
      },
    },
    {
      title: 'Loại',
      dataIndex: 'LaThietBi',
      key: 'LaThietBi',
      width: 120,
      align: 'center',
      render: (laThietBi) => (
        <span>{laThietBi ? 'Thiết bị' : 'Vật tư'}</span>
      ),
      filters: [
        { text: 'Thiết bị', value: true },
        { text: 'Vật tư', value: false }
      ],
      onFilter: (value, record) => record.LaThietBi === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            icon={<EditOutlined />} 
            type="default"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    }
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="MaLoaiThietBiVatTu"
        loading={loading}
        pagination={{
          ...pagination,
          total: getFilteredData().length,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Sửa loại thiết bị vật tư
          </div>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={500}
        className="custom-modal"
        bodyStyle={{ padding: '24px' }}
        footer={[
          <div key="footer" className="flex justify-end gap-2 border-t pt-4">
            <Button 
              key="cancel" 
              onClick={() => setEditModalVisible(false)}
              className="px-6"
            >
              Đóng
            </Button>
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleUpdate}
              loading={loading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Lưu
            </Button>
          </div>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="TenLoai"
            label={
              <span className="text-gray-700 font-medium">
                Tên loại
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại' },
              { min: 2, message: 'Tên loại phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input 
              placeholder="Nhập tên loại"
              className="hover:border-blue-400 focus:border-blue-400"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="DonViTinh"
            label={
              <span className="text-gray-700 font-medium">
                Đơn vị tính
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập đơn vị tính' },
              { min: 1, message: 'Đơn vị tính phải có ít nhất 1 ký tự' }
            ]}
          >
            <Input 
              placeholder="Nhập đơn vị tính"
              className="hover:border-blue-400 focus:border-blue-400"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="LaThietBi"
            label={
              <span className="text-gray-700 font-medium">
                Loại
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng chọn loại' }
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Thiết bị</Radio>
              <Radio value={false}>Vật tư</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Thêm loại thiết bị vật tư mới
          </div>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        maskClosable={false}
        keyboard={false}
        closable={false}
        width={500}
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
          <Form.Item
            name="TenLoai"
            label={
              <span className="text-gray-700 font-medium">
                Tên loại
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại' },
              { min: 2, message: 'Tên loại phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input 
              placeholder="Nhập tên loại"
              className="hover:border-blue-400 focus:border-blue-400"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="DonViTinh"
            label={
              <span className="text-gray-700 font-medium">
                Đơn vị tính
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng nhập đơn vị tính' },
              { min: 1, message: 'Đơn vị tính phải có ít nhất 1 ký tự' }
            ]}
          >
            <Input 
              placeholder="Nhập đơn vị tính"
              className="hover:border-blue-400 focus:border-blue-400"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="LaThietBi"
            label={
              <span className="text-gray-700 font-medium">
                Loại
              </span>
            }
            rules={[
              { required: true, message: 'Vui lòng chọn loại' }
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Thiết bị</Radio>
              <Radio value={false}>Vật tư</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết loại thiết bị vật tư"
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
            {Object.entries(currentRecord).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default QuanLyLoaiThietBiVatTu; 