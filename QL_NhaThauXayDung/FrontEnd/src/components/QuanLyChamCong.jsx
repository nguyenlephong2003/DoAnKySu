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
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
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

const QuanLyChamCong = () => {
  const [chamCongList, setChamCongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [congTrinhList, setCongTrinhList] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedChamCong, setSelectedChamCong] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedNhanVien, setSelectedNhanVien] = useState("all");
  const [selectedKyLuong, setSelectedKyLuong] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setCurrentUser(userInfo);
    fetchData();
    fetchNhanVien();
    fetchCongTrinh();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        // Chuyển đổi cấu trúc dữ liệu để hiển thị
        const constructionData = response.data.data.map(item => 
          item.CongTrinh[0]
        );

        setChamCongList(constructionData);
        setPagination((prev) => ({
          ...prev,
          total: constructionData.length,
        }));
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
        `${BASE_URL}NguoiDung_API/NhanVien_API.php?action=GET`,
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

  const fetchCongTrinh = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=GET`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        const congTrinhMap = {};
        response.data.data.forEach((ct) => {
          congTrinhMap[ct.MaCongTrinh] = ct;
        });
        setCongTrinhList(congTrinhMap);
      }
    } catch (error) {
      console.error("Error fetching constructions:", error);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...chamCongList];

    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.MaCongTrinh.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenCongTrinh.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => item.TrangThai === selectedStatus
      );
    }

    // Sắp xếp theo tên công trình
    filteredData.sort((a, b) => a.TenCongTrinh.localeCompare(b.TenCongTrinh, 'vi'));

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

  const handleCreateChamCong = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const chamCongData = {
        MaCongTrinh: values.MaCongTrinh,
        MaNhanVien: values.MaNhanVien,
        NgayThamGia: values.NgayThamGia.format("YYYY-MM-DD"),
        NgayKetThuc: values.NgayKetThuc?.format("YYYY-MM-DD"),
        SoNgayThamGia: values.SoNgayThamGia,
      };

      const response = await axios.post(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=POST`,
        chamCongData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Tạo phân công và chấm công thành công.") {
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

  const handleEdit = (record) => {
    setSelectedChamCong(record);
    editForm.setFieldsValue({
      ...record,
      NgayThamGia: dayjs(record.NgayThamGia),
      NgayKetThuc: record.NgayKetThuc ? dayjs(record.NgayKetThuc) : null,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (maChamCong) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa bản ghi chấm công này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const response = await axios.delete(
            `${BASE_URL}ChamCong_API/ChamCong.php?action=DELETE&id=${maChamCong}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.message === "Xóa bản ghi chấm công thành công.") {
            setDetailModalVisible(false);
            await fetchData();
            message.success("Xóa bản ghi chấm công thành công");
          } else {
            message.error(response.data.message || "Xóa bản ghi chấm công thất bại");
          }
        } catch (error) {
          console.error("Error deleting attendance:", error);
          message.error("Lỗi khi xóa bản ghi chấm công");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}ChamCong_API/ChamCong.php?action=PUT`,
        {
          ...values,
          NgayThamGia: values.NgayThamGia.format("YYYY-MM-DD"),
          NgayKetThuc: values.NgayKetThuc?.format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Cập nhật bản ghi chấm công thành công.") {
        setEditModalVisible(false);
        setDetailModalVisible(false);
        editForm.resetFields();
        await fetchData();
        message.success("Cập nhật bản ghi chấm công thành công");
      } else {
        message.error(response.data.message || "Cập nhật bản ghi chấm công thất bại");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      message.error("Lỗi khi cập nhật bản ghi chấm công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Quản lý chấm công
        </h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm công trình..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              allowClear
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Đang thi công">Đang thi công</Option>
              <Option value="Đã hoàn thành">Đã hoàn thành</Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Tạo chấm công mới
          </Button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              
              {
                title: "Mã công trình",
                dataIndex: "MaCongTrinh",
                key: "MaCongTrinh",
                width: "15%",
                ellipsis: true,
              },
              {
                title: "Tên công trình",
                dataIndex: "TenCongTrinh",
                key: "TenCongTrinh",
                width: "35%",
                ellipsis: true,
              },
              {
                title: "Trạng thái",
                dataIndex: "TrangThai",
                key: "TrangThai",
                width: "14%",
                align: "center",
                render: (text) => (
                  <Tag color={text === "Đã hoàn thành" ? "green" : "blue"}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: "Số nhân viên",
                key: "SoNhanVien",
                width: "14%",
                align: "center",
                render: (_, record) => record.PhanCong.length,
              },
              {
                title: "Thao tác",
                key: "action",
                width: "22%",
                align: "center",
                render: (_, record) => (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: "8px",
                      justifyContent: "flex-start",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Button
                      icon={<InfoCircleOutlined />}
                      type="primary"
                      onClick={() => showDetailModal(record)}
                    >
                      Chi tiết
                    </Button>
                    {record.TrangThai !== "Đã hoàn thành" && (
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        style={{
                          background: "#faad14",
                          borderColor: "#faad14",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setModalVisible(true);
                        }}
                      >
                        Chấm công
                      </Button>
                    )}
                  </div>
                ),
                fixed: "left",
              },
            ]}
            rowKey="MaCongTrinh"
            pagination={false}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 900 }}
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
            showTotal={(total) => `Tổng cộng ${total} công trình`}
            showQuickJumper
          />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết công trình"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => handleEdit(selectedChamCong)}
          >
            Chỉnh sửa
          </Button>,
          <Button
            key="delete"
            danger
            onClick={() => handleDelete(selectedChamCong.MaCongTrinh)}
          >
            Xóa
          </Button>,
        ]}
        width={800}
      >
        {selectedChamCong && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã công trình" span={2}>
                {selectedChamCong.MaCongTrinh}
              </Descriptions.Item>
              <Descriptions.Item label="Tên công trình" span={2}>
                {selectedChamCong.TenCongTrinh}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={selectedChamCong.TrangThai === "Đã hoàn thành" ? "green" : "blue"}>
                  {selectedChamCong.TrangThai}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Danh sách phân công</Divider>
            
            <Table
              dataSource={selectedChamCong.PhanCong}
              columns={[
                {
                  title: "Nhân viên",
                  dataIndex: "TenNhanVien",
                  key: "TenNhanVien",
                  width: "22%",
                  ellipsis: true,
                },
                {
                  title: "Loại nhân viên",
                  dataIndex: "MaLoaiNhanVien",
                  key: "MaLoaiNhanVien",
                  width: "13%",
                  align: "center",
                  render: (text) => text === 6 ? "Thợ chính" : "Thợ phụ",
                },
                {
                  title: "Ngày tham gia",
                  dataIndex: "NgayThamGia",
                  key: "NgayThamGia",
                  width: "13%",
                  align: "center",
                  render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Ngày kết thúc",
                  dataIndex: "NgayKetThuc",
                  key: "NgayKetThuc",
                  width: "13%",
                  align: "center",
                  render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "-",
                },
                {
                  title: "Số ngày tham gia",
                  dataIndex: "SoNgayThamGia",
                  key: "SoNgayThamGia",
                  width: "13%",
                  align: "center",
                },
              ]}
              rowKey="MaBangPhanCong"
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 600 }}
            />
          </>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Tạo chấm công mới"
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
            name="MaCongTrinh"
            label="Công trình"
            rules={[{ required: true, message: "Vui lòng chọn công trình" }]}
          >
            <Select placeholder="Chọn công trình" loading={loading}>
              {Object.values(congTrinhList).map((ct) => (
                <Option key={ct.MaCongTrinh} value={ct.MaCongTrinh}>
                  {ct.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên" loading={loading}>
              {nhanVienList.map((nv) => (
                <Option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                  {nv.TenNhanVien}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="NgayThamGia"
            label="Ngày tham gia"
            rules={[{ required: true, message: "Vui lòng chọn ngày tham gia" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="NgayKetThuc" label="Ngày kết thúc">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="SoNgayThamGia"
            label="Số ngày tham gia"
            rules={[{ required: true, message: "Vui lòng nhập số ngày tham gia" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo chấm công
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa chấm công"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="MaChamCong" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="MaCongTrinh"
            label="Công trình"
            rules={[{ required: true, message: "Vui lòng chọn công trình" }]}
          >
            <Select placeholder="Chọn công trình" loading={loading}>
              {Object.values(congTrinhList).map((ct) => (
                <Option key={ct.MaCongTrinh} value={ct.MaCongTrinh}>
                  {ct.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên" loading={loading}>
              {nhanVienList.map((nv) => (
                <Option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                  {nv.TenNhanVien}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="NgayThamGia"
            label="Ngày tham gia"
            rules={[{ required: true, message: "Vui lòng chọn ngày tham gia" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="NgayKetThuc" label="Ngày kết thúc">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="SoNgayThamGia"
            label="Số ngày tham gia"
            rules={[{ required: true, message: "Vui lòng nhập số ngày tham gia" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button
              onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
              }}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyChamCong; 