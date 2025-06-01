import React from 'react';
import { Modal, Button, Tag, Spin, Typography, Card, Divider } from 'antd';
import { InfoCircleOutlined, FileOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "green",
  "Từ chối": "red",
};

const ChiTietHopDong = ({ 
  visible, 
  onClose, 
  contract, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  if (!contract) return null;

  const handleViewFile = (fileUrl) => {
    if (!fileUrl) return;
    
    // Sử dụng Google Docs Viewer để xem cả PDF và DOCX
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    
    Modal.info({
      title: 'Xem file hợp đồng',
      width: '80%',
      content: (
        <iframe
          src={googleDocsUrl}
          style={{ width: '100%', height: '80vh', border: 'none' }}
          title="File Viewer"
        />
      ),
      onOk() {},
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          <span>Chi tiết hợp đồng</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        contract.TrangThai !== "Đã duyệt" && (
          <>
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(contract)}
              style={{ marginLeft: 8 }}
            >
              Chỉnh sửa
            </Button>
            <Button
              key="delete"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(contract.MaHopDong)}
              style={{ marginLeft: 8 }}
            >
              Xóa
            </Button>
          </>
        ),
        contract.FileHopDong && (
          <Button
            key="view"
            icon={<EyeOutlined />}
            onClick={() => handleViewFile(contract.FileHopDong)}
          >
            Xem file
          </Button>
        ),
      ]}
      width={800}
    >
      <Spin spinning={loading}>
        <div style={{ height: "600px", overflowY: "auto", paddingRight: "8px" }}>
          {/* Thông tin chung về hợp đồng */}
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>Thông tin hợp đồng</Title>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ minWidth: "200px" }}>
                <Text strong>Mã hợp đồng:</Text>
                <div>{contract.MaHopDong}</div>
              </div>
              <div style={{ minWidth: "200px" }}>
                <Text strong>Ngày ký:</Text>
                <div>{new Date(contract.NgayKy).toLocaleDateString('vi-VN')}</div>
              </div>
              <div>
                <Text strong>Trạng thái:</Text>
                <div>
                  <Tag color={statusColors[contract.TrangThai] || "default"}>
                    {contract.TrangThai}
                  </Tag>
                </div>
              </div>
              <div style={{ minWidth: "200px" }}>
                <Text strong>Tổng tiền:</Text>
                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(contract.TongTien)}</div>
              </div>
              {contract.GhiChu && (
                <div style={{ minWidth: "100%" }}>
                  <Text strong>Ghi chú:</Text>
                  <div>{contract.GhiChu}</div>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Thông tin chi tiết */}
          <Card title="Thông tin chi tiết" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ minWidth: "45%" }}>
                <Text strong>Mô tả:</Text>
                <div>{contract.MoTa}</div>
              </div>
              <div style={{ minWidth: "45%" }}>
                <Text strong>Loại hợp đồng:</Text>
                <div>{contract.LoaiHopDong || 'Chưa cập nhật'}</div>
              </div>
            </div>
          </Card>

          {/* Thông tin nhân viên */}
          <Card title="Thông tin nhân viên" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ minWidth: "45%" }}>
                <Text strong>Mã nhân viên:</Text>
                <div>{contract.MaNhanVien}</div>
              </div>
              <div style={{ minWidth: "45%" }}>
                <Text strong>Tên nhân viên:</Text>
                <div>{contract.TenNhanVien}</div>
              </div>
              <div style={{ minWidth: "45%" }}>
                <Text strong>Số điện thoại:</Text>
                <div>{contract.SoDT}</div>
              </div>
            </div>
          </Card>

          {/* Tài liệu */}
          <Card title="Tài liệu" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ minWidth: "100%" }}>
                <Text strong>File hợp đồng:</Text>
                <div>
                  {contract.FileHopDong ? (
                    <Button
                      type="primary"
                      icon={<FileOutlined />}
                      onClick={() => handleViewFile(contract.FileHopDong)}
                    >
                      Xem file hợp đồng
                    </Button>
                  ) : (
                    <Text type="danger">Chưa có file</Text>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Spin>
    </Modal>
  );
};

export default ChiTietHopDong; 