import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Spin, message, Pagination, Modal, Form, Select } from 'antd';
import { SearchOutlined, InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import ChiTietHopDong from './ChiTietHopDong';

const { Option } = Select;
const { confirm } = Modal;

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "green",
  "Từ chối": "red",
};

const DuyetHopDong = () => {
  const [hopDongList, setHopDongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteForm] = Form.useForm();
  const [currentAction, setCurrentAction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const hopDongResponse = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=GET`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (hopDongResponse.data.data) {
        setHopDongList(hopDongResponse.data.data);
        setPagination(prev => ({
          ...prev,
          total: hopDongResponse.data.data.length
        }));

        const nhanVienMap = {};
        for (const hopDong of hopDongResponse.data.data) {
          if (hopDong.MaNhanVien && !nhanVienMap[hopDong.MaNhanVien]) {
            try {
              const nhanVienResponse = await axios.get(
                `${BASE_URL}NguoiDung_API/NhanVien_API.php?action=getById&MaNhanVien=${hopDong.MaNhanVien}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              if (nhanVienResponse.data.data) {
                nhanVienMap[hopDong.MaNhanVien] = nhanVienResponse.data.data;
              }
            } catch (error) {
              console.error(`Error fetching employee info for ${hopDong.MaNhanVien}:`, error);
            }
          }
        }
        setNhanVienList(nhanVienMap);
      } else {
        message.error('Không thể lấy dữ liệu hợp đồng');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...hopDongList];

    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaHopDong.toLowerCase().includes(searchText.toLowerCase()) ||
          item.MoTa.toLowerCase().includes(searchText.toLowerCase()) ||
          (nhanVienList[item.MaNhanVien]?.TenNhanVien || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(item => item.TrangThai === selectedStatus);
    }

    filteredData.sort((a, b) => b.MaHopDong.localeCompare(a.MaHopDong));

    return filteredData;
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return filteredData.slice(startIndex, endIndex);
  };

  const showDetailModal = (record) => {
    setSelectedContract(record);
    setDetailModalVisible(true);
  };

  const handleDuyet = (record) => {
    setSelectedContract(record);
    setCurrentAction('duyet');
    setNoteModalVisible(true);
  };

  const handleTuChoi = (record) => {
    setSelectedContract(record);
    setCurrentAction('tuChoi');
    setNoteModalVisible(true);
  };

  const handleNoteSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=PUT`,
        {
          MaHopDong: selectedContract.MaHopDong,
          TenHopDong: selectedContract.TenHopDong,
          MaNhanVien: selectedContract.MaNhanVien,
          TrangThai: currentAction === 'duyet' ? 'Đã duyệt' : 'Từ chối',
          GhiChu: values.GhiChu,
          NgayKy: selectedContract.NgayKy,
          MoTa: selectedContract.MoTa,
          TongTien: selectedContract.TongTien,
          FileHopDong: selectedContract.FileHopDong
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Cập nhật hợp đồng thành công.") {
        message.success({
          content: currentAction === 'duyet' ? 'Duyệt hợp đồng thành công' : 'Từ chối hợp đồng thành công',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          style: {
            marginTop: '20vh',
          },
        });
        setNoteModalVisible(false);
        noteForm.resetFields();
        fetchData();
      } else {
        message.error({
          content: response.data.message || (currentAction === 'duyet' ? 'Duyệt hợp đồng thất bại' : 'Từ chối hợp đồng thất bại'),
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          style: {
            marginTop: '20vh',
          },
        });
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error({
        content: 'Lỗi: ' + (error.response?.data?.message || error.message),
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        style: {
          marginTop: '20vh',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Duyệt hợp đồng</h1>
        
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm hợp đồng..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Từ chối">Từ chối</Option>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              {
                title: 'Mã hợp đồng',
                dataIndex: 'MaHopDong',
                key: 'MaHopDong',
                width: '15%',
              },
              {
                title: 'Ngày ký',
                dataIndex: 'NgayKy',
                key: 'NgayKy',
                width: '10%',
                render: (text) => new Date(text).toLocaleDateString('vi-VN'),
              },
              {
                title: 'Mô tả',
                dataIndex: 'MoTa',
                key: 'MoTa',
                width: '20%',
                ellipsis: true,
              },
              {
                title: 'Tổng tiền',
                dataIndex: 'TongTien',
                key: 'TongTien',
                width: '12%',
                align: 'right',
                render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
              },
              {
                title: 'Trạng thái',
                dataIndex: 'TrangThai',
                key: 'TrangThai',
                width: '10%',
                align: 'center',
                render: (text) => (
                  <Tag color={statusColors[text] || 'default'}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: '33%',
                align: 'center',
                render: (_, record) => (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
                    <Button
                      icon={<InfoCircleOutlined />}
                      type="primary"
                      onClick={() => showDetailModal(record)}
                    >
                      Chi tiết
                    </Button>
                    {record.TrangThai === 'Chờ duyệt' && (
                      <>
                        <Button
                          icon={<CheckCircleOutlined />}
                          type="primary"
                          style={{ backgroundColor: '#52c41a' }}
                          onClick={() => handleDuyet(record)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          icon={<CloseCircleOutlined />}
                          danger
                          onClick={() => handleTuChoi(record)}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            rowKey="MaHopDong"
            pagination={false}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 1000 }}
          />
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={getFilteredData().length}
            onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} mục`}
            showQuickJumper
          />
        </div>
      </div>

      {/* Detail Modal */}
      <ChiTietHopDong
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        contract={selectedContract}
        loading={loading}
      />

      {/* Note Modal */}
      <Modal
        title={currentAction === 'duyet' ? "Duyệt hợp đồng" : "Từ chối hợp đồng"}
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          noteForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={noteForm}
          onFinish={handleNoteSubmit}
          layout="vertical"
        >
          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea 
              rows={4} 
              placeholder={currentAction === 'duyet' ? "Nhập ghi chú khi duyệt hợp đồng (không bắt buộc)" : "Nhập lý do từ chối hợp đồng (không bắt buộc)"}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button 
                onClick={() => {
                  setNoteModalVisible(false);
                  noteForm.resetFields();
                }}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
              >
                {currentAction === 'duyet' ? 'Duyệt' : 'Từ chối'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DuyetHopDong; 