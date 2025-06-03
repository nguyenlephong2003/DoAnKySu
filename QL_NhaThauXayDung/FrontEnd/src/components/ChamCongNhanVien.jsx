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
  InputNumber,
  Select,
  Descriptions,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  SearchOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;

const statusColors = {
  "Đã thanh toán": "green",
  "Chưa thanh toán": "orange",
};

const ChamCongNhanVien = () => {
  const [chamCongList, setChamCongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedChamCong, setSelectedChamCong] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setCurrentUser(userInfo);
    fetchData();
    fetchNhanVien();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_BY_MONTH_KHONG_PHAI_THO`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setChamCongList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const fetchNhanVien = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_NHAN_VIEN_KHONG_PHAI_THO`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        setNhanVienList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Lỗi khi kết nối đến server");
    }
  };

  const getFilteredData = () => {
    let filteredData = [...chamCongList];

    // Lọc theo tháng được chọn
    if (selectedMonth) {
      filteredData = filteredData.filter(month => 
        month.Nam === selectedMonth.year() && 
        month.Thang === selectedMonth.month() + 1
      );
    }

    // Gộp dữ liệu theo nhân viên trong mỗi tháng
    filteredData = filteredData.map(month => {
      const employeeMap = new Map();
      
      month.DanhSachChamCong.forEach(record => {
        const key = record.MaNhanVien;
        if (!employeeMap.has(key)) {
          employeeMap.set(key, {
            ...record,
            TongSoNgayLam: record.SoNgayLam,
            DanhSachChamCong: [record]
          });
        } else {
          const existingRecord = employeeMap.get(key);
          existingRecord.TongSoNgayLam += record.SoNgayLam;
          existingRecord.DanhSachChamCong.push(record);
        }
      });

      return {
        ...month,
        DanhSachChamCong: Array.from(employeeMap.values())
      };
    });

    if (searchText) {
      filteredData = filteredData.map(month => ({
        ...month,
        DanhSachChamCong: month.DanhSachChamCong.filter(
          item =>
            item.MaNhanVien.toLowerCase().includes(searchText.toLowerCase()) ||
            item.TenNhanVien.toLowerCase().includes(searchText.toLowerCase())
        )
      })).filter(month => month.DanhSachChamCong.length > 0);
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.map(month => ({
        ...month,
        DanhSachChamCong: month.DanhSachChamCong.filter(
          item => item.TrangThai === selectedStatus
        )
      })).filter(month => month.DanhSachChamCong.length > 0);
    }

    return filteredData;
  };

  const handleCreateChamCong = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const chamCongData = {
        MaNhanVien: values.MaNhanVien,
        LoaiChamCong: values.LoaiChamCong,
        SoNgayLam: 1,
        KyLuong: new Date().toISOString().split('T')[0],
        TrangThai: 'Chưa thanh toán',
        GioVao: values.GioVao || '08:00:00',
        GioRa: values.GioRa || '17:00:00'
      };

      const response = await axios.post(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=POST_BANG_CHAM_CONG`,
        chamCongData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        message.success("Tạo chấm công thành công");
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(response.data.message || "Tạo chấm công thất bại");
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
      message.error("Lỗi khi tạo chấm công");
    } finally {
      setLoading(false);
    }
  };

  const showDetailModal = (record) => {
    setSelectedChamCong(record);
    setDetailModalVisible(true);
  };

  const handleChamCong = (record) => {
    setSelectedChamCong(record);
    form.setFieldsValue({
      MaNhanVien: record.MaNhanVien,
      GioVao: '08:00',
      GioRa: '17:00'
    });
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "MaNhanVien",
      key: "MaNhanVien",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Nhân viên",
      dataIndex: "TenNhanVien",
      key: "TenNhanVien",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Loại nhân viên",
      dataIndex: "LoaiNhanVien",
      key: "LoaiNhanVien",
      width: 120,
      align: "center",
    },
    {
      title: "Tổng số ngày làm",
      dataIndex: "TongSoNgayLam",
      key: "TongSoNgayLam",
      width: 120,
      align: "center",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<InfoCircleOutlined />}
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            onClick={() => handleChamCong(record)}
            style={{
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
              boxShadow: '0 2px 0 rgba(82, 196, 26, 0.1)',
            }}
          >
            Chấm công
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Quản lý chấm công nhân viên
        </h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả</Option>
              <Option value="Chưa thanh toán">Chưa thanh toán</Option>
              <Option value="Đã thanh toán">Đã thanh toán</Option>
            </Select>
          </div>
          <MonthPicker
            value={selectedMonth}
            onChange={setSelectedMonth}
            format="MM/YYYY"
            placeholder="Chọn tháng"
            style={{ width: 200 }}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getFilteredData()[0]?.DanhSachChamCong || []}
            columns={columns}
            rowKey="MaNhanVien"
            pagination={false}
            loading={loading}
            bordered
            size="middle"
          />
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        title="Chấm công nhân viên"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateChamCong}>
          <Form.Item
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="LoaiChamCong"
            label="Loại chấm công"
            rules={[{ required: true, message: "Vui lòng chọn loại chấm công" }]}
          >
            <Select placeholder="Chọn loại chấm công">
              <Option value="Ngày thường">Ngày thường</Option>
              <Option value="Cuối tuần">Cuối tuần</Option>
              <Option value="Ngày lễ">Ngày lễ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="GioVao"
            label="Giờ vào"
            rules={[{ required: true, message: "Vui lòng nhập giờ vào" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            name="GioRa"
            label="Giờ ra"
            rules={[{ required: true, message: "Vui lòng nhập giờ ra" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
              }}
            >
              Chấm công
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết chấm công"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedChamCong && (
          <>
            <Descriptions bordered column={2} className="mb-4">
              <Descriptions.Item label="Mã nhân viên" span={2}>
                {selectedChamCong.MaNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên" span={2}>
                {selectedChamCong.TenNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Loại nhân viên" span={2}>
                {selectedChamCong.LoaiNhanVien}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số ngày làm" span={2}>
                {selectedChamCong.TongSoNgayLam} ngày
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Chi tiết chấm công</Divider>
            
            <Table
              dataSource={selectedChamCong.DanhSachChamCong}
              columns={[
                {
                  title: "Loại chấm công",
                  dataIndex: "LoaiChamCong",
                  key: "LoaiChamCong",
                },
                {
                  title: "Số ngày làm",
                  dataIndex: "SoNgayLam",
                  key: "SoNgayLam",
                },
                {
                  title: "Kỳ lương",
                  dataIndex: "KyLuong",
                  key: "KyLuong",
                  render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Giờ làm",
                  key: "GioLam",
                  render: (_, record) => `${record.GioVao} - ${record.GioRa}`,
                },
                {
                  title: "Trạng thái",
                  dataIndex: "TrangThai",
                  key: "TrangThai",
                  render: (text) => (
                    <Tag color={statusColors[text] || "default"}>
                      {text}
                    </Tag>
                  ),
                },
              ]}
              pagination={false}
              bordered
              size="small"
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ChamCongNhanVien; 