import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import { useAuth } from '../Config/AuthContext';

const QuanLyLoaiBaoGia = () => {
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
  const { user } = useAuth();

  // Kiểm tra quyền
  const canAdd = user?.TenLoaiNhanVien === 'Admin' || 
                user?.TenLoaiNhanVien === 'Giám đốc' ||
                user?.TenLoaiNhanVien === 'Kế toán';
  
  const canEdit = user?.TenLoaiNhanVien === 'Admin' || 
                 user?.TenLoaiNhanVien === 'Giám đốc'||
                 user?.TenLoaiNhanVien === 'Kế toán';
  
  const canDelete = user?.TenLoaiNhanVien === 'Admin'||
                    user?.TenLoaiNhanVien === 'Kế toán';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getAllLoaiBaoGia`,
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 'success') {
        setData(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.length
        }));
      } else {
        message.error('Lỗi khi lấy dữ liệu');
      }
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
          (item.MaLoai && item.MaLoai.toString().toLowerCase().includes(searchLower)) ||
          (item.TenLoai && item.TenLoai.toString().toLowerCase().includes(searchLower))
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
      TenLoai: record.TenLoai
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const response = await axios.put(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=updateLoaiBaoGia`,
        {
          MaLoai: currentRecord.MaLoai,
          TenLoai: values.TenLoai
        },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
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
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=createLoaiBaoGia`,
        {
          TenLoai: values.TenLoai
        },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
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
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=deleteLoaiBaoGia`,
        { 
          data: { MaLoai: record.MaLoai },
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
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
      title: 'Mã loại báo giá',
      dataIndex: 'MaLoai',
      key: 'MaLoai',
      width: 90,
      align: 'center',
      sorter: (a, b) => {
        if (!a.MaLoai) return -1;
        if (!b.MaLoai) return 1;
        return a.MaLoai.toString().localeCompare(b.MaLoai.toString());
      },
    },
    {
      title: 'Tên loại báo giá',
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
      title: 'Thao tác',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {canEdit || canDelete ? (
            <>
              {canEdit && (
                <Button 
                  icon={<EditOutlined />} 
                  type="default"
                  onClick={() => handleEdit(record)}
                >
                  Sửa
                </Button>
              )}
              {canDelete && (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(record)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>Bạn không đủ quyền hạn để thao tác</span>
          )}
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
        {canAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="MaLoai"
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
      {canEdit && (
        <Modal
          title={
            <div className="text-xl font-semibold text-gray-800 border-b pb-4">
              Sửa loại báo giá
            </div>
          }
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          maskClosable={false}
          keyboard={false}
          closable={false}
          width={500}
          className="custom-modal"
          styles={{
            body: { padding: '24px' }
          }}
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
                  Tên loại báo giá
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập tên loại báo giá' },
                { min: 2, message: 'Tên loại báo giá phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập tên loại báo giá"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Add Modal */}
      {canAdd && (
        <Modal
          title={
            <div className="text-xl font-semibold text-gray-800 border-b pb-4">
              Thêm loại báo giá mới
            </div>
          }
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          maskClosable={false}
          keyboard={false}
          closable={false}
          width={500}
          className="custom-modal"
          styles={{
            body: { padding: '24px' }
          }}
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
                  Tên loại báo giá
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập tên loại báo giá' },
                { min: 2, message: 'Tên loại báo giá phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập tên loại báo giá"
                className="hover:border-blue-400 focus:border-blue-400"
                size="large"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      <Modal
        title="Chi tiết loại báo giá"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        styles={{
          body: { padding: '24px' }
        }}
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

export default QuanLyLoaiBaoGia; 