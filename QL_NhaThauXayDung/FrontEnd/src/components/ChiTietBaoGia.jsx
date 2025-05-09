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

      if (response.data.status === "success" && response.data.data.length > 0) {
        setBaoGiaDetails(response.data.data[0]);
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

  // Kiểm tra xem thông tin công trình có dữ liệu không
  const hasConstructionInfo = () => {
    if (!baoGiaDetails) return false;
    
    return !!(
      baoGiaDetails.TenCongTrinh || 
      baoGiaDetails.Dientich || 
      baoGiaDetails.TenKhachHang || 
      baoGiaDetails.SoDienThoai || 
      baoGiaDetails.SoDT ||
      baoGiaDetails.TenLoaiCongTrinh || 
      baoGiaDetails.NgayDuKienHoanThanh
    );
  };

  // Kiểm tra xem thông tin giá có dữ liệu không
  const hasPriceInfo = () => {
    if (!baoGiaDetails) return false;
    
    return (
      baoGiaDetails.GiaBaoGia  !== null && 
      baoGiaDetails.GiaBaoGia  !== undefined && 
      baoGiaDetails.GiaBaoGia  !== ""
    );
  };

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
      width={700}
    >
      {baoGia ? (
        <Spin spinning={loading}>
          <div
            style={{
              height: "450px", // Chiều cao cố định bạn mong muốn (có thể điều chỉnh)
              overflowY: "auto", // Cho phép cuộn dọc
              paddingRight: "8px", // Tránh bị che nội dung bởi thanh cuộn
            }}
          >
            {/* Thông tin chung về báo giá */}

            <div style={{ marginBottom: 24 }}>
              <Title level={4}>Thông tin báo giá</Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ minWidth: "200px" }}>
                  <Text strong>Mã báo giá:</Text>
                  <div>{baoGia.MaBaoGia}</div>
                </div>
                <div style={{ minWidth: "200px" }}>
                  <Text strong>Tên báo giá:</Text>
                  <div>{baoGia.TenBaoGia}</div>
                </div>
                <div style={{ minWidth: "200px" }}>
                  <Text strong>Loại báo giá:</Text>
                  <div>{baoGia.TenLoaiBaoGia || `Loại ${baoGia.MaLoai}`}</div>
                </div>
                <div>
                  <Text strong>Trạng thái:</Text>
                  <div>
                    <Tag color={statusColors[baoGia.TrangThai] || "default"}>
                      {baoGia.TrangThai}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {baoGiaDetails ? (
              <>
                {/* Thông tin về giá thấp nhất - chỉ hiển thị nếu có dữ liệu */}
                {hasPriceInfo() && (
                  <div style={{ display: "flex", gap: "16px", marginBottom: 20 }}>
                    <Card
                      title="Giá báo giá"
                      style={{ width: "50%" }}
                      bordered={false}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#ff4d4f",
                          fontWeight: "bold",
                        }}
                      >
                        {formatCurrency(baoGiaDetails.GiaBaoGia)}
                      </Text>
                    </Card>
                  </div>
                )}

                {/* Thông tin công trình - chỉ hiển thị nếu có dữ liệu */}
                {hasConstructionInfo() && (
                  <Card title="Thông tin công trình" style={{ marginBottom: 16 }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
                    >
                      <div style={{ minWidth: "45%" }}>
                        <Text strong>Tên công trình:</Text>
                        <div>{baoGiaDetails.TenCongTrinh}</div>
                      </div>
                      <div style={{ minWidth: "45%" }}>
                        <Text strong>Diện tích:</Text>
                        <div>{baoGiaDetails.Dientich} m²</div>
                      </div>

                      <div style={{ minWidth: "45%" }}>
                        <Text strong>Thông tin khách hàng:</Text>
                        <div>{baoGiaDetails.TenKhachHang}</div>
                        <div>{baoGiaDetails.SoDienThoai || baoGiaDetails.SoDT}</div>
                      </div>
                      <div style={{ minWidth: "45%" }}>
                        <Text strong>Loại công trình:</Text>
                        <div>{baoGiaDetails.TenLoaiCongTrinh}</div>
                      </div>
                      <div style={{ minWidth: "45%" }}>
                        <Text strong>Ngày dự kiến hoàn thành:</Text>
                        <div>{formatDate(baoGiaDetails.NgayDuKienHoanThanh)}</div>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 20, color: "#999" }}>
                <Spin size="small" /> Đang tải thông tin chi tiết...
              </div>
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