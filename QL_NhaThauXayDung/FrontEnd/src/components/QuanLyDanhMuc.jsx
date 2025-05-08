import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal, Form, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const QuanLyDanhMuc = () => {
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
  const [selectedType, setSelectedType] = useState('loaibaogia');

  const typeConfig = {
    loaibaogia: {
      title: 'Quản lý loại báo giá',
      apiPath: 'DanhMuc_API/LoaiBaoGia_API_Duy.php',
      fields: {
        id: 'MaLoai',
        name: 'TenLoai'
      },
      formFields: [
        {
          name: 'TenLoai',
          label: 'Tên loại báo giá',
          rules: [
            { required: true, message: 'Vui lòng nhập tên loại báo giá' },
            { min: 2, message: 'Tên loại báo giá phải có ít nhất 2 ký tự' }
          ]
        }
      ]
    },
    loaicongtrinh: {
      title: 'Quản lý loại công trình',
      apiPath: 'DanhMuc_API/LoaiCongTrinh_API.php',
      fields: {
        id: 'MaLoaiCongTrinh',
        name: 'TenLoaiCongTrinh'
      },
      formFields: [
        {
          name: 'TenLoaiCongTrinh',
          label: 'Tên loại công trình',
          rules: [
            { required: true, message: 'Vui lòng nhập tên loại công trình' },
            { min: 2, message: 'Tên loại công trình phải có ít nhất 2 ký tự' }
          ]
        }
      ]
    },
    loaithietbivattu: {
      title: 'Quản lý loại thiết bị vật tư',
      apiPath: 'DanhMuc_API/LoaiThietBiVatTu_API.php',
      fields: {
        id: 'MaLoaiThietBiVatTu',
        name: 'TenLoai'
      },
      formFields: [
        {
          name: 'TenLoai',
          label: 'Tên loại',
          rules: [
            { required: true, message: 'Vui lòng nhập tên loại' },
            { min: 2, message: 'Tên loại phải có ít nhất 2 ký tự' }
          ]
        },
        {
          name: 'DonViTinh',
          label: 'Đơn vị tính',
          rules: [
            { required: true, message: 'Vui lòng nhập đơn vị tính' },
            { min: 1, message: 'Đơn vị tính phải có ít nhất 1 ký tự' }
          ]
        }
      ]
    },
    loainhanvien: {
      title: 'Quản lý loại nhân viên',
      apiPath: 'NguoiDung_API/LoaiNhanVien_API.php',
      fields: {
        id: 'MaLoaiNhanVien',
        name: 'TenLoai'
      },
      formFields: [
        {
          name: 'TenLoai',
          label: 'Tên loại nhân viên',
          rules: [
            { required: true, message: 'Vui lòng nhập tên loại nhân viên' },
            { min: 2, message: 'Tên loại nhân viên phải có ít nhất 2 ký tự' }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${typeConfig[selectedType].apiPath}?action=GET`);
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
    const { id, name } = typeConfig[selectedType].fields;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(
        item => 
          (item[id] && item[id].toString().toLowerCase().includes(searchLower)) ||
          (item[name] && item[name].toString().toLowerCase().includes(searchLower))
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
    const formValues = {};
    typeConfig[selectedType].formFields.forEach(field => {
      formValues[field.name] = record[field.name];
    });
    form.setFieldsValue(formValues);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { id } = typeConfig[selectedType].fields;
      
      const response = await axios.put(
        `${BASE_URL}${typeConfig[selectedType].apiPath}?action=PUT`,
        {
          [id]: currentRecord[id],
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
        `${BASE_URL}${typeConfig[selectedType].apiPath}?action=POST`,
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

  const getColumns = () => {
    const { id, name } = typeConfig[selectedType].fields;
    let columns = [];

    // Always show code column for all types
    columns.push({
      title: selectedType === 'loaibaogia' ? 'Mã loại báo giá' : (selectedType === 'loaicongtrinh' ? 'Mã loại công trình' : (selectedType === 'loainhanvien' ? 'Mã loại nhân viên' : 'Mã loại')),
      dataIndex: id,
      key: id,
      width: 90,
      align: 'center',
      sorter: (a, b) => {
        if (!a[id]) return -1;
        if (!b[id]) return 1;
        return a[id].toString().localeCompare(b[id].toString());
      },
    });

    columns.push({
      title: selectedType === 'loaibaogia' ? 'Tên loại báo giá' : (selectedType === 'loaicongtrinh' ? 'Tên loại công trình' : (selectedType === 'loainhanvien' ? 'Tên loại nhân viên' : 'Tên loại')),
      dataIndex: name,
      key: name,
      width: 300,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a[name]) return -1;
        if (!b[name]) return 1;
        return a[name].toString().localeCompare(b[name].toString());
      },
    });

    if (selectedType === 'loaithietbivattu') {
      columns.push({
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
      });
    }

    columns.push({
      title: 'Thao tác',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            icon={<InfoCircleOutlined />} 
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          <Button 
            icon={<EditOutlined />} 
            type="default"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </div>
      ),
    });

    return columns;
  };

  const renderFormFields = (formInstance) => {
    return typeConfig[selectedType].formFields.map(field => (
      <Form.Item
        key={field.name}
        name={field.name}
        label={
          <span className="text-gray-700 font-medium">
            {field.label}
          </span>
        }
        rules={field.rules}
      >
        <Input 
          placeholder={`Nhập ${field.label.toLowerCase()}`}
          className="hover:border-blue-400 focus:border-blue-400"
          size="large"
        />
      </Form.Item>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{typeConfig[selectedType].title}</h1>
        <Select
          value={selectedType}
          onChange={setSelectedType}
          style={{ width: 200 }}
          options={[
            { value: 'loaibaogia', label: 'Loại báo giá' },
            { value: 'loaicongtrinh', label: 'Loại công trình' },
            { value: 'loaithietbivattu', label: 'Loại thiết bị vật tư' },
            { value: 'loainhanvien', label: 'Loại nhân viên' }
          ]}
        />
      </div>
      
      <div className="mt-6">
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
          columns={getColumns()}
          dataSource={getFilteredData()}
          rowKey={typeConfig[selectedType].fields.id}
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
              Sửa {typeConfig[selectedType].title.toLowerCase()}
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
            {renderFormFields(form)}
          </Form>
        </Modal>

        {/* Add Modal */}
        <Modal
          title={
            <div className="text-xl font-semibold text-gray-800 border-b pb-4">
              Thêm {typeConfig[selectedType].title.toLowerCase()} mới
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
            {renderFormFields(addForm)}
          </Form>
        </Modal>

        <Modal
          title={`Chi tiết ${typeConfig[selectedType].title.toLowerCase()}`}
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
      </div>
    </div>
  );
};

export default QuanLyDanhMuc;
