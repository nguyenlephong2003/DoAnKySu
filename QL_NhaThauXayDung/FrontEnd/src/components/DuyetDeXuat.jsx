import React, { useState, useEffect } from 'react';
import { Select, Table, Button, Input, Tag, Spin, message, Pagination, Modal, Form } from 'antd';
import { SearchOutlined, InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "green",
  "Từ chối": "red",
};

const DuyetDeXuat = () => {
  const [deXuatList, setDeXuatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDeXuat, setSelectedDeXuat] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [chiTietLoading, setChiTietLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteForm] = Form.useForm();
  const [currentAction, setCurrentAction] = useState(null); // 'duyet' | 'tuChoi'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}DeXuat_API/DeXuat_API.php?action=GET_ALL`);
      if (response.data.data) {
        setDeXuatList(response.data.data);
        setPagination(prev => ({ ...prev, total: response.data.data.length }));
      } else {
        message.error('Không thể lấy dữ liệu đề xuất');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...deXuatList];
    if (searchText) {
      filteredData = filteredData.filter(
        item =>
          (item.MaDeXuat && item.MaDeXuat.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.LoaiDeXuat && item.LoaiDeXuat.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.TrangThai && item.TrangThai.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(item => item.TrangThai === selectedStatus);
    }
    filteredData.sort((a, b) => b.MaDeXuat.localeCompare(a.MaDeXuat));
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

  const showDetailModal = async (record) => {
    setSelectedDeXuat(record);
    setDetailModalVisible(true);
    setChiTietLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}DeXuat_API/ChiTietDeXuat_API.php?action=GET_BY_DEXUAT&MaDeXuat=${record.MaDeXuat}`);
      if (response.data.data) {
        setChiTietList(response.data.data);
      } else {
        setChiTietList([]);
      }
    } catch (error) {
      setChiTietList([]);
      message.error('Không thể lấy chi tiết đề xuất');
    } finally {
      setChiTietLoading(false);
    }
  };

  // Sinh mã phiếu nhập tự động
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

  // Xử lý duyệt/từ chối
  const handleAction = (record, action) => {
    setSelectedDeXuat(record);
    setCurrentAction(action);
    setNoteModalVisible(true);
  };

  // Gửi cập nhật trạng thái và tạo phiếu nhập nếu duyệt
  const handleNoteSubmit = async (values) => {
    try {
      setLoading(true);
      // 1. Cập nhật trạng thái đề xuất
      const updateRes = await axios.put(`${BASE_URL}DeXuat_API/DeXuat_API.php`, {
        MaDeXuat: selectedDeXuat.MaDeXuat,
        TrangThai: currentAction === 'duyet' ? 'Đã duyệt' : 'Từ chối',
        GhiChu: values.GhiChu || null
      });
      if (updateRes.data.status !== 'success') {
        message.error(updateRes.data.message || 'Cập nhật trạng thái thất bại');
        return;
      }
      // 2. Nếu duyệt, tạo phiếu nhập và chi tiết phiếu nhập
      if (currentAction === 'duyet') {
        // Lấy lại chi tiết đề xuất
        const chiTietRes = await axios.get(`${BASE_URL}DeXuat_API/ChiTietDeXuat_API.php?action=GET_BY_DEXUAT&MaDeXuat=${selectedDeXuat.MaDeXuat}`);
        const chiTietList = chiTietRes.data.data || [];
        if (chiTietList.length === 0) {
          message.error('Không có chi tiết đề xuất để tạo phiếu nhập');
          return;
        }
        // Lấy MaNhaCungCap từ chi tiết đầu tiên (giả định cùng nhà cung cấp)
        const maNhaCungCap = chiTietList[0].MaNhaCungCap;
        // Sinh mã phiếu nhập
        const maPhieuNhap = generateAutoMaPhieuNhap();
        // Ngày nhập là ngày giao dự kiến của đề xuất
        const ngayNhap = selectedDeXuat.NgayGiaoDuKien;
        // Tạo phiếu nhập (chưa có tổng tiền)
        const phieuNhapRes = await axios.post(`${BASE_URL}DeXuat_API/PhieuNhap_API.php?action=POST`, {
          MaPhieuNhap: maPhieuNhap,
          NgayNhap: ngayNhap,
          TongTien: 0,
          TrangThai: 'Chưa giao',
          MaNhaCungCap: maNhaCungCap,
          MaNhanVien: selectedDeXuat.MaNhanVien
        });
        if (phieuNhapRes.data.status !== 'success') {
          message.error(phieuNhapRes.data.message || 'Tạo phiếu nhập thất bại');
          return;
        }
        // Tạo chi tiết phiếu nhập
        let tongTien = 0;
        for (const ct of chiTietList) {
          await axios.post(`${BASE_URL}DeXuat_API/ChiTietPhieuNhap_API.php?action=POST`, {
            MaPhieuNhap: maPhieuNhap,
            MaThietBiVatTu: ct.MaThietBiVatTu,
            SoLuong: ct.SoLuong,
            DonGia: ct.DonGia
          });
          tongTien += parseFloat(ct.SoLuong) * parseFloat(ct.DonGia);
        }
        // Cập nhật tổng tiền phiếu nhập
        await axios.put(`${BASE_URL}DeXuat_API/PhieuNhap_API.php?action=PUT`, {
          MaPhieuNhap: maPhieuNhap,
          NgayNhap: ngayNhap,
          TongTien: tongTien,
          TrangThai: 'Chưa giao',
          MaNhaCungCap: maNhaCungCap,
          MaNhanVien: selectedDeXuat.MaNhanVien
        });
      }
      message.success(currentAction === 'duyet' ? 'Duyệt đề xuất thành công!' : 'Từ chối đề xuất thành công!');
      setNoteModalVisible(false);
      noteForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Duyệt đề xuất</h1>
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm đề xuất..."
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
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
              <Select.Option value="Đã duyệt">Đã duyệt</Select.Option>
              <Select.Option value="Từ chối">Từ chối</Select.Option>
            </Select>
          </div>
        </div>
        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              {
                title: 'Mã đề xuất',
                dataIndex: 'MaDeXuat',
                key: 'MaDeXuat',
                width: '15%',
              },
              {
                title: 'Ngày lập',
                dataIndex: 'NgayLap',
                key: 'NgayLap',
                width: '15%',
                render: (text) => text ? new Date(text).toLocaleDateString('vi-VN') : '',
              },
              {
                title: 'Ngày giao dự kiến',
                dataIndex: 'NgayGiaoDuKien',
                key: 'NgayGiaoDuKien',
                width: '15%',
                render: (text) => text ? new Date(text).toLocaleDateString('vi-VN') : '',
              },
              {
                title: 'Loại đề xuất',
                dataIndex: 'LoaiDeXuat',
                key: 'LoaiDeXuat',
                width: '15%',
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
                width: '25%',
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
                          onClick={() => handleAction(record, 'duyet')}
                        >
                          Duyệt
                        </Button>
                        <Button
                          icon={<CloseCircleOutlined />}
                          danger
                          onClick={() => handleAction(record, 'tuChoi')}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            rowKey="MaDeXuat"
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
      <Modal
        title={`Chi tiết đề xuất: ${selectedDeXuat?.MaDeXuat || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {chiTietLoading ? (
          <Spin />
        ) : (
          <Table
            dataSource={chiTietList}
            columns={[
              { title: 'Tên thiết bị/vật tư', dataIndex: 'TenThietBiVatTu', key: 'TenThietBiVatTu' },
              { title: 'Số lượng', dataIndex: 'SoLuong', key: 'SoLuong' },
              { title: 'Đơn giá', dataIndex: 'DonGia', key: 'DonGia', render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text) },
              { title: 'Nhà cung cấp', dataIndex: 'TenNhaCungCap', key: 'TenNhaCungCap' },
            ]}
            rowKey="MaThietBiVatTu"
            pagination={false}
            size="small"
            bordered
          />
        )}
      </Modal>
      {/* Note Modal */}
      <Modal
        title={currentAction === 'duyet' ? "Duyệt đề xuất" : "Từ chối đề xuất"}
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          noteForm.resetFields();
        }}
        footer={null}
        maskClosable={false}
        closable={false}
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
              placeholder={currentAction === 'duyet' ? "Nhập ghi chú khi duyệt đề xuất (không bắt buộc)" : "Nhập lý do từ chối đề xuất (không bắt buộc)"}
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

export default DuyetDeXuat; 