import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tag,
  Card,
  Spin,
  Typography,
  Divider,
  List,
  Table,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

// Component hiển thị chi tiết báo giá với thông tin đơn giản
const DetailBaoGiaModal = ({ visible, onCancel, baoGia }) => {
  const [loading, setLoading] = useState(false);
  const [baoGiaDetails, setBaoGiaDetails] = useState(null);

  const statusColors = {
    "Chờ duyệt": "orange",
    "Đã duyệt": "green",
    "Từ chối": "red",
    "Hoàn thành": "blue",
  };

  // Lấy dữ liệu chi tiết báo giá khi mở modal
  useEffect(() => {
    if (visible && baoGia) {
      fetchBaoGiaDetails();
    }
  }, [visible, baoGia]);

  // Hàm lấy chi tiết báo giá
  const fetchBaoGiaDetails = async () => {
    if (!baoGia || !baoGia.MaBaoGia) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getQuotationDetails&MaBaoGia=${baoGia.MaBaoGia}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setBaoGiaDetails(response.data.data);
      } else {
        console.error("Không thể lấy chi tiết báo giá:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching quotation details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Định dạng số tiền VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const columns = [
    {
      title: "Nội dung",
      dataIndex: "NoiDung",
      key: "NoiDung",
    },
    {
      title: "Giá báo giá",
      dataIndex: "GiaBaoGia",
      key: "GiaBaoGia",
      render: (value) => formatCurrency(value),
      align: "right",
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          <span>Chi tiết báo giá</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[]}
      width={800}
    >
      {baoGia ? (
        <Spin spinning={loading}>
          <div
            style={{
              height: "600px",
              overflowY: "auto",
              paddingRight: "8px",
            }}
          >
            {/* Thông tin chung về báo giá */}
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>Thông tin báo giá</Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ minWidth: "200px" }}>
                  <Text strong>Mã báo giá:</Text>
                  <div>{baoGiaDetails?.bao_gia?.MaBaoGia}</div>
                </div>
                <div style={{ minWidth: "200px" }}>
                  <Text strong>Tên báo giá:</Text>
                  <div>{baoGiaDetails?.bao_gia?.TenBaoGia}</div>
                </div>
                <div>
                  <Text strong>Trạng thái:</Text>
                  <div>
                    <Tag color={statusColors[baoGiaDetails?.bao_gia?.TrangThai] || "default"}>
                      {baoGiaDetails?.bao_gia?.TrangThai}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Thông tin công trình */}
            {baoGiaDetails?.cong_trinh && (
              <Card title="Thông tin công trình" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ minWidth: "45%" }}>
                    <Text strong>Tên công trình:</Text>
                    <div>{baoGiaDetails.cong_trinh.TenCongTrinh}</div>
                  </div>
                  <div style={{ minWidth: "45%" }}>
                    <Text strong>Diện tích:</Text>
                    <div>{baoGiaDetails.cong_trinh.Dientich} m²</div>
                  </div>
                  <div style={{ minWidth: "45%" }}>
                    <Text strong>Thông tin khách hàng:</Text>
                    <div>{baoGiaDetails.cong_trinh.khach_hang.TenKhachHang}</div>
                    <div>{baoGiaDetails.cong_trinh.khach_hang.SoDT}</div>
                  </div>
                  <div style={{ minWidth: "45%" }}>
                    <Text strong>Loại công trình:</Text>
                    <div>{baoGiaDetails.cong_trinh.loai_cong_trinh.TenLoaiCongTrinh}</div>
                  </div>
                  <div style={{ minWidth: "45%" }}>
                    <Text strong>Ngày dự kiến hoàn thành:</Text>
                    <div>{formatDate(baoGiaDetails.cong_trinh.NgayDuKienHoanThanh)}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Chi tiết báo giá */}
            {baoGiaDetails?.chi_tiet_bao_gia && (
              <Card 
                title="Chi tiết báo giá" 
                style={{ marginBottom: 16 }}
                extra={
                  <Text strong style={{ fontSize: 16, color: "#ff4d4f" }}>
                    Tổng giá: {formatCurrency(baoGiaDetails.tong_gia)}
                  </Text>
                }
              >
                <Table
                  columns={columns}
                  dataSource={baoGiaDetails.chi_tiet_bao_gia.map((item, index) => ({
                    ...item,
                    key: index,
                  }))}
                  pagination={false}
                  
                />
              </Card>
            )}
          </div>
        </Spin>
      ) : (
        <div style={{ textAlign: "center", padding: 24 }}>
          Không có dữ liệu báo giá
        </div>
      )}
    </Modal>
  );
};

export default DetailBaoGiaModal;