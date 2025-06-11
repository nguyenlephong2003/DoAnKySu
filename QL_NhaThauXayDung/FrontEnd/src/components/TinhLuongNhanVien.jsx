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
  HistoryOutlined,
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

const columnColors = {
  MaNhanVien: "#f0f5ff",
  TenNhanVien: "#f0f5ff",
  LoaiNhanVien: "#f6ffed",
  TongSoNgayLam: "#fff7e6",
  TongSoNgayThuong: "#fff7e6",
  TongSoNgayCuoiTuan: "#fff7e6",
  TongSoNgayLe: "#fff7e6",
};

const styles = `
  .table-row-light {
    background-color: #ffffff;
  }
  .table-row-dark {
    background-color: #fafafa;
  }
  .ant-table-tbody > tr.table-row-light:hover > td {
    background-color: #e6f7ff !important;
  }
  .ant-table-tbody > tr.table-row-dark:hover > td {
    background-color: #e6f7ff !important;
  }
`;

const TinhLuongNhanVien = () => {
  const [chamCongList, setChamCongList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [selectedThang, setSelectedThang] = useState(dayjs().month() + 1);
  const [selectedNam, setSelectedNam] = useState(dayjs().year());
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_NHAN_VIEN_BY_MONTH&thang=${selectedThang}&nam=${selectedNam}`,
        {
          withCredentials: true
        }
      );

      if (response.data.status === "success") {
        // Lấy thông tin nhân viên để có lương cơ bản
        const nhanVienResponse = await axios.get(
          `${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`,
          {
            withCredentials: true
          }
        );

        if (nhanVienResponse.data.status === "success") {
          // Map lương cơ bản vào danh sách chấm công
          const chamCongWithLuong = response.data.data.DanhSachNhanVien.map(chamCong => {
            const nhanVien = nhanVienResponse.data.data.find(nv => nv.MaNhanVien === chamCong.MaNhanVien);
            return {
              ...chamCong,
              LuongCanBan: nhanVien ? nhanVien.LuongCanBan : 300000 // Fallback to 300,000đ nếu không có lương cơ bản
            };
          });

          setChamCongList(chamCongWithLuong);
          setPagination((prev) => ({
            ...prev,
            total: chamCongWithLuong.length,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryData = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_LICH_SU_CHAM_CONG&thang=${selectedThang}&nam=${selectedNam}`,
        {
          withCredentials: true
        }
      );

      if (response.data.status === "success") {
        setHistoryData(response.data.data.DanhSachNhanVien);
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      message.error("Lỗi khi lấy lịch sử chấm công");
    } finally {
      setHistoryLoading(false);
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
    // Lấy lương cơ bản từ dữ liệu nhân viên
    const baseSalary = record.LuongCanBan || 300000; // Fallback to 300,000đ nếu không có lương cơ bản
    
    // Tính lương theo ngày thường
    const normalDaysSalary = record.TongSoNgayThuong * baseSalary;
    
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

  const showHistoryModal = () => {
    setHistoryModalVisible(true);
    fetchHistoryData();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
          Tính lương nhân viên
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
          <Button 
            type="primary" 
            icon={<HistoryOutlined />}
            onClick={showHistoryModal}
          >
            Xem lịch sử
          </Button>
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
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.MaNhanVien,
                  },
                }),
              },
              {
                title: "Tên nhân viên",
                dataIndex: "TenNhanVien",
                key: "TenNhanVien",
                width: 200,
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TenNhanVien,
                  },
                }),
              },
              {
                title: "Chức vụ",
                dataIndex: "LoaiNhanVien",
                key: "LoaiNhanVien",
                width: 120,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.LoaiNhanVien,
                  },
                }),
              },
              {
                title: "Số ngày làm",
                dataIndex: "TongSoNgayLam",
                key: "TongSoNgayLam",
                width: 100,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayLam,
                    fontWeight: "bold",
                  },
                }),
              },
              {
                title: "Số ngày thường",
                dataIndex: "TongSoNgayThuong",
                key: "TongSoNgayThuong",
                width: 120,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayThuong,
                  },
                }),
              },
              {
                title: "Số ngày cuối tuần",
                dataIndex: "TongSoNgayCuoiTuan",
                key: "TongSoNgayCuoiTuan",
                width: 150,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayCuoiTuan,
                  },
                }),
              },
              {
                title: "Số ngày lễ",
                dataIndex: "TongSoNgayLe",
                key: "TongSoNgayLe",
                width: 100,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayLe,
                  },
                }),
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
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
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

      {/* History Modal */}
      <Modal
        title={`Lịch sử chấm công - Tháng ${selectedThang}/${selectedNam}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setHistoryModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={1000}
      >
        <Spin spinning={historyLoading}>
          <Table
            dataSource={historyData}
            columns={[
              {
                title: "Mã nhân viên",
                dataIndex: "MaNhanVien",
                key: "MaNhanVien",
                width: 120,
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.MaNhanVien,
                  },
                }),
              },
              {
                title: "Tên nhân viên",
                dataIndex: "TenNhanVien",
                key: "TenNhanVien",
                width: 200,
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TenNhanVien,
                  },
                }),
              },
              {
                title: "Chức vụ",
                dataIndex: "LoaiNhanVien",
                key: "LoaiNhanVien",
                width: 120,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.LoaiNhanVien,
                  },
                }),
              },
              {
                title: "Số ngày làm",
                dataIndex: "TongSoNgayLam",
                key: "TongSoNgayLam",
                width: 100,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayLam,
                    fontWeight: "bold",
                  },
                }),
              },
              {
                title: "Số ngày thường",
                dataIndex: "TongSoNgayThuong",
                key: "TongSoNgayThuong",
                width: 120,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayThuong,
                  },
                }),
              },
              {
                title: "Số ngày cuối tuần",
                dataIndex: "TongSoNgayCuoiTuan",
                key: "TongSoNgayCuoiTuan",
                width: 150,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayCuoiTuan,
                  },
                }),
              },
              {
                title: "Số ngày lễ",
                dataIndex: "TongSoNgayLe",
                key: "TongSoNgayLe",
                width: 100,
                align: "center",
                onCell: () => ({
                  style: {
                    backgroundColor: columnColors.TongSoNgayLe,
                  },
                }),
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
                    onClick={() => {
                      setSelectedNhanVien(record);
                      setDetailModalVisible(true);
                    }}
                  >
                    Chi tiết
                  </Button>
                ),
              },
            ]}
            rowKey="MaNhanVien"
            pagination={false}
            loading={historyLoading}
            bordered
            size="middle"
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          />
        </Spin>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết lương nhân viên"
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
              <Descriptions.Item label="Chức vụ">
                {selectedNhanVien.LoaiNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Tháng/Năm">
                {selectedThang}/{selectedNam}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số ngày làm">
                {selectedNhanVien.TongSoNgayLam}
              </Descriptions.Item>
              <Descriptions.Item label="Số ngày thường">
                {selectedNhanVien.TongSoNgayThuong}
              </Descriptions.Item>
              <Descriptions.Item label="Số ngày cuối tuần">
                {selectedNhanVien.TongSoNgayCuoiTuan}
              </Descriptions.Item>
              <Descriptions.Item label="Số ngày lễ">
                {selectedNhanVien.TongSoNgayLe}
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
                  onCell: () => ({
                    style: {
                      backgroundColor: "#f0f5ff",
                    },
                  }),
                },
                {
                  title: "Loại ngày",
                  dataIndex: "LoaiChamCong",
                  key: "LoaiChamCong",
                  width: "15%",
                  onCell: () => ({
                    style: {
                      backgroundColor: "#f6ffed",
                    },
                  }),
                },
                {
                  title: "Giờ vào",
                  dataIndex: "GioVao",
                  key: "GioVao",
                  width: "15%",
                  onCell: () => ({
                    style: {
                      backgroundColor: "#fff7e6",
                    },
                  }),
                },
                {
                  title: "Giờ ra",
                  dataIndex: "GioRa",
                  key: "GioRa",
                  width: "15%",
                  onCell: () => ({
                    style: {
                      backgroundColor: "#fff7e6",
                    },
                  }),
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
                  onCell: () => ({
                    style: {
                      backgroundColor: "#f0f5ff",
                    },
                  }),
                },
              ]}
              rowKey="MaChamCong"
              pagination={false}
              bordered
              size="small"
              rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
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

export default TinhLuongNhanVien; 