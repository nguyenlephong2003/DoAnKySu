import React, { useState } from 'react';
import { Table, Button, Input, Space, message, Modal, Form, Select, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const BaoCaoThongKe = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data cho danh sách file báo cáo
  const mockData = [
    {
      key: '1',
      File: 'Báo cáo tồn kho tháng 3-2024.xlsx',
      NgayTao: '2024-03-20',
      LoaiBaoCao: 'Tồn kho'
    },
    {
      key: '2',
      File: 'Báo cáo nhập xuất tháng 3-2024.xlsx',
      NgayTao: '2024-03-20',
      LoaiBaoCao: 'Nhập xuất'
    },
    {
      key: '3',
      File: 'Báo cáo chi phí tháng 3-2024.xlsx',
      NgayTao: '2024-03-20',
      LoaiBaoCao: 'Chi phí'
    },
    {
      key: '4',
      File: 'Báo cáo công trình tháng 3-2024.xlsx',
      NgayTao: '2024-03-20',
      LoaiBaoCao: 'Công trình'
    },
    {
      key: '5',
      File: 'Báo cáo nhà cung cấp tháng 3-2024.xlsx',
      NgayTao: '2024-03-20',
      LoaiBaoCao: 'Nhà cung cấp'
    }
  ];

  const handleDownload = async (record) => {
    try {
      setLoading(true);
      // Gọi API để tải file
      const response = await axios.get(`${BASE_URL}/BaoCao_API.php?action=DOWNLOAD&fileName=${record.File}`, {
        responseType: 'blob'
      });

      // Tạo URL để tải file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', record.File);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success('Tải file thành công');
    } catch (error) {
      message.error('Lỗi khi tải file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    return mockData.filter(item => 
      item.File.toLowerCase().includes(searchText.toLowerCase()) ||
      item.LoaiBaoCao.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const columns = [
    {
      title: 'Tên file',
      dataIndex: 'File',
      key: 'File',
      sorter: (a, b) => a.File.localeCompare(b.File)
    },
    {
      title: 'Loại báo cáo',
      dataIndex: 'LoaiBaoCao',
      key: 'LoaiBaoCao',
      sorter: (a, b) => a.LoaiBaoCao.localeCompare(b.LoaiBaoCao)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'NgayTao',
      key: 'NgayTao',
      sorter: (a, b) => new Date(a.NgayTao) - new Date(b.NgayTao)
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tải xuống
          </Button>
        </Space>
      )
    }
  ];

  const handleCreateReport = async (values) => {
    try {
      setLoading(true);
      // Gọi API để tạo báo cáo
      const response = await axios.post(`${BASE_URL}/BaoCao_API.php?action=CREATE`, {
        LoaiBaoCao: values.LoaiBaoCao,
        ThangNam: values.ThangNam.format('YYYY-MM')
      });

      if (response.data.status === 'success') {
        message.success('Tạo báo cáo thành công');
        setModalVisible(false);
        form.resetFields();
        // Refresh danh sách báo cáo
        // fetchData();
      } else {
        message.error(response.data.message || 'Lỗi khi tạo báo cáo');
      }
    } catch (error) {
      message.error('Lỗi khi tạo báo cáo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
          Báo cáo thống kê
        </h1>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Tìm kiếm theo tên file hoặc loại báo cáo..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: '100%', maxWidth: 350 }}
          allowClear
        />
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tạo thống kê mới
          </Button>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={() => setSearchText('')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="key"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} báo cáo`,
          }}
        />
      </div>

      {/* Modal tạo báo cáo mới */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800 border-b pb-4">
            Tạo thống kê mới
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        className="custom-modal"
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateReport}
          className="mt-4"
        >
          <Form.Item
            name="LoaiBaoCao"
            label="Loại báo cáo"
            rules={[{ required: true, message: 'Vui lòng chọn loại báo cáo' }]}
          >
            <Select placeholder="Chọn loại báo cáo">
              <Option value="Tồn kho">Báo cáo tồn kho</Option>
              <Option value="Nhập xuất">Báo cáo nhập xuất</Option>
              <Option value="Chi phí">Báo cáo chi phí</Option>
              <Option value="Công trình">Báo cáo công trình</Option>
              <Option value="Nhà cung cấp">Báo cáo nhà cung cấp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ThangNam"
            label="Tháng/Năm"
            rules={[{ required: true, message: 'Vui lòng chọn tháng/năm' }]}
          >
            <DatePicker 
              picker="month" 
              format="MM/YYYY"
              className="w-full"
              defaultValue={moment()}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right border-t pt-4">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tạo thống kê
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BaoCaoThongKe; 