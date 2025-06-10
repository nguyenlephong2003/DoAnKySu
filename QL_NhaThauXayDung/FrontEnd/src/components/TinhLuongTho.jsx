import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Spin,
  message,
  Pagination,
  Modal,
  Form,
  DatePicker,
  Select,
  Descriptions,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  SearchOutlined,
  InfoCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors = {
  "Đã thanh toán": "green",
  "Chưa thanh toán": "orange",
};

const TinhLuongTho = () => {
  const [chamCongList, setChamCongList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [selectedThang, setSelectedThang] = useState(dayjs().month() + 1);
  const [selectedNam, setSelectedNam] = useState(dayjs().year());

  useEffect(() => {
    fetchData();
  }, [selectedThang, selectedNam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_THO_BY_MONTH&thang=${selectedThang}&nam=${selectedNam}`,
        {
          withCredentials: true
        }
      );

      if (response.data.status === "success") {
        setChamCongList(response.data.data.DanhSachNhanVien);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.DanhSachNhanVien.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...chamCongList];

    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.MaNhanVien.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenNhanVien.toLowerCase().includes(searchText.toLowerCase())
      );
    }

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
    setSelectedNhanVien(record);
    setDetailModalVisible(true);
  };

  const calculateSalary = (record) => {
    // Giả sử lương cơ bản là 200,000đ/ngày cho thợ chính và 150,000đ/ngày cho thợ phụ
    const baseSalary = record.LoaiNhanVien === "Thợ chính" ? 200000 : 150000;
    
    // Tính lương theo ngày thường
    const normalDaysSalary = record.TongSoNgayLam * baseSalary;
    
    // Tính lương ngày cuối tuần (x1.5)
    const weekendDaysSalary = record.TongSoNgayCuoiTuan * baseSalary * 1.5;
    
    // Tính lương ngày lễ (x2)
    const holidayDaysSalary = record.TongSoNgayLe * baseSalary * 2;
    
    // Tổng lương
    const totalSalary = normalDaysSalary + weekendDaysSalary + holidayDaysSalary;
    
    return {
      baseSalary,
      normalDaysSalary,
      weekendDaysSalary,
      holidayDaysSalary,
      totalSalary
    };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
          Tính lương thợ
        </h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={selectedThang}
              onChange={setSelectedThang}
              style={{ width: 120 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </Option>
              ))}
            </Select>
            <Select
              value={selectedNam}
              onChange={setSelectedNam}
              style={{ width: 120 }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = dayjs().year() - 2 + i;
                return (
                  <Option key={year} value={year}>
                    Năm {year}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              {
                title: "Mã nhân viên",
                dataIndex: "MaNhanVien",
                key: "MaNhanVien",
                width: 120,
              },
              {
                title: "Tên nhân viên",
                dataIndex: "TenNhanVien",
                key: "TenNhanVien",
                width: 200,
              },
              {
                title: "Loại thợ",
                dataIndex: "LoaiNhanVien",
                key: "LoaiNhanVien",
                width: 120,
                align: "center",
              },
              {
                title: "Số ngày làm",
                dataIndex: "TongSoNgayLam",
                key: "TongSoNgayLam",
                width: 100,
                align: "center",
              },
              {
                title: "Số ngày nghỉ",
                dataIndex: "TongSoNgayNghi",
                key: "TongSoNgayNghi",
                width: 100,
                align: "center",
              },
              {
                title: "Số ngày đi muộn",
                dataIndex: "TongSoNgayDiMuon",
                key: "TongSoNgayDiMuon",
                width: 120,
                align: "center",
              },
              {
                title: "Số ngày về sớm",
                dataIndex: "TongSoNgayVeSom",
                key: "TongSoNgayVeSom",
                width: 120,
                align: "center",
              },
              {
                title: "Thao tác",
                key: "action",
                width: 120,
                align: "center",
                render: (_, record) => (
                  <Button
                    icon={<InfoCircleOutlined />}
                    type="primary"
                    onClick={() => showDetailModal(record)}
                  >
                    Chi tiết
                  </Button>
                ),
              },
            ]}
            rowKey="MaNhanVien"
            pagination={false}
            loading={loading}
            bordered
            size="middle"
          />
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={getFilteredData().length}
            onChange={(page, pageSize) =>
              setPagination({ ...pagination, current: page, pageSize })
            }
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} nhân viên`}
            showQuickJumper
          />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết lương thợ"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedNhanVien && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã nhân viên" span={2}>
                {selectedNhanVien.MaNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Tên nhân viên" span={2}>
                {selectedNhanVien.TenNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Loại thợ">
                {selectedNhanVien.LoaiNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Tháng/Năm">
                {selectedThang}/{selectedNam}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Chi tiết chấm công</Divider>
            
            <Table
              dataSource={selectedNhanVien.DanhSachChamCong}
              columns={[
                {
                  title: "Ngày",
                  dataIndex: "KyLuong",
                  key: "KyLuong",
                  width: "15%",
                  render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Loại ngày",
                  dataIndex: "LoaiChamCong",
                  key: "LoaiChamCong",
                  width: "15%",
                },
                {
                  title: "Giờ vào",
                  dataIndex: "GioVao",
                  key: "GioVao",
                  width: "15%",
                },
                {
                  title: "Giờ ra",
                  dataIndex: "GioRa",
                  key: "GioRa",
                  width: "15%",
                },
                {
                  title: "Trạng thái",
                  dataIndex: "TrangThai",
                  key: "TrangThai",
                  width: "15%",
                  render: (text) => (
                    <Tag color={statusColors[text] || "default"}>
                      {text}
                    </Tag>
                  ),
                },
              ]}
              rowKey="MaChamCong"
              pagination={false}
              bordered
              size="small"
            />

            <Divider orientation="left">Tính lương</Divider>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Lương cơ bản">
                {calculateSalary(selectedNhanVien).baseSalary.toLocaleString('vi-VN')}đ/ngày
              </Descriptions.Item>
              <Descriptions.Item label="Lương ngày thường">
                {calculateSalary(selectedNhanVien).normalDaysSalary.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Lương ngày cuối tuần">
                {calculateSalary(selectedNhanVien).weekendDaysSalary.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Lương ngày lễ">
                {calculateSalary(selectedNhanVien).holidayDaysSalary.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Tổng lương">
                <Text strong style={{ color: '#1890ff', fontSize: '18px' }}>
                  {calculateSalary(selectedNhanVien).totalSalary.toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TinhLuongTho; 