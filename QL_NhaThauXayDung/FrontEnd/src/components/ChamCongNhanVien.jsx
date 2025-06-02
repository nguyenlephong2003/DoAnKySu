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

const ChamCongNhanVien = () => {
  const [chamCongList, setChamCongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
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
  const [selectedNhanVienChamCong, setSelectedNhanVienChamCong] = useState([]);
  const [loaiNgayChamCong, setLoaiNgayChamCong] = useState({});
  const [gioVao, setGioVao] = useState('08:00');
  const [gioRa, setGioRa] = useState({});

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
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_BY_EMPLOYEE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        setChamCongList(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.length,
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

    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.MaChamCong.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenNhanVien.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => item.TrangThai === selectedStatus
      );
    }

    // Sắp xếp theo tên nhân viên
    filteredData.sort((a, b) => a.TenNhanVien.localeCompare(b.TenNhanVien, 'vi'));

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
        MaNhanVien: values.MaNhanVien,
        LoaiChamCong: values.LoaiChamCong || 'Ngày thường',
        SoNgayLam: 1,
        KyLuong: new Date().toISOString().split('T')[0],
        TrangThai: 'Chưa thanh toán',
        GioVao: gioVao,
        GioRa: values.GioRa || '17:00'
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

  const handleEdit = (record) => {
    setSelectedChamCong(record);
    editForm.setFieldsValue({
      ...record,
      KyLuong: dayjs(record.KyLuong),
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
          KyLuong: values.KyLuong.format("YYYY-MM-DD"),
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
                title: "Mã chấm công",
                dataIndex: "MaChamCong",
                key: "MaChamCong",
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
                title: "Kỳ lương",
                dataIndex: "KyLuong",
                key: "KyLuong",
                width: 120,
                align: "center",
                render: (text) => new Date(text).toLocaleDateString("vi-VN"),
              },
              {
                title: "Số ngày làm",
                dataIndex: "SoNgayLam",
                key: "SoNgayLam",
                width: 100,
                align: "center",
              },
              {
                title: "Trạng thái",
                dataIndex: "TrangThai",
                key: "TrangThai",
                width: 120,
                align: "center",
                render: (text) => (
                  <Tag color={statusColors[text] || "default"}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: "Thao tác",
                key: "action",
                width: 150,
                align: "center",
                render: (_, record) => (
                  <div className="flex gap-2 justify-center">
                    <Button
                      icon={<InfoCircleOutlined />}
                      type="primary"
                      onClick={() => showDetailModal(record)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      type="primary"
                      onClick={() => handleEdit(record)}
                    >
                      Sửa
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      type="primary"
                      danger
                      onClick={() => handleDelete(record.MaChamCong)}
                    >
                      Xóa
                    </Button>
                  </div>
                ),
              },
            ]}
            rowKey="MaChamCong"
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
            showTotal={(total) => `Tổng cộng ${total} bản ghi`}
            showQuickJumper
          />
        </div>
      </div>

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
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select 
              placeholder="Chọn nhân viên" 
              loading={loading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {nhanVienList.map((nv) => (
                <Option 
                  key={nv.MaNhanVien} 
                  value={nv.MaNhanVien}
                  label={`${nv.TenNhanVien} - ${nv.LoaiNhanVien}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{nv.TenNhanVien}</span>
                    <span style={{ color: '#888' }}>{nv.LoaiNhanVien}</span>
                  </div>
                </Option>
              ))}
            </Select>
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
            <Input type="time" defaultValue="08:00" />
          </Form.Item>

          <Form.Item
            name="GioRa"
            label="Giờ ra"
            rules={[{ required: true, message: "Vui lòng nhập giờ ra" }]}
          >
            <Input type="time" defaultValue="17:00" />
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
            name="MaNhanVien"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên" loading={loading}>
              {nhanVienList.map((nv) => (
                <Option key={nv.MaNhanVien} value={nv.MaNhanVien}>
                  {nv.TenNhanVien} - {nv.LoaiNhanVien}
                </Option>
              ))}
            </Select>
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
            name="KyLuong"
            label="Kỳ lương"
            rules={[{ required: true, message: "Vui lòng chọn kỳ lương" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="SoNgayLam"
            label="Số ngày làm"
            rules={[{ required: true, message: "Vui lòng nhập số ngày làm" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Chưa thanh toán">Chưa thanh toán</Option>
              <Option value="Đã thanh toán">Đã thanh toán</Option>
            </Select>
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

      {/* Detail Modal */}
      <Modal
        title="Chi tiết chấm công"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              handleEdit(selectedChamCong);
              setDetailModalVisible(false);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {selectedChamCong && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã chấm công">
              {selectedChamCong.MaChamCong}
            </Descriptions.Item>
            <Descriptions.Item label="Nhân viên">
              {selectedChamCong.TenNhanVien}
            </Descriptions.Item>
            <Descriptions.Item label="Loại nhân viên">
              {selectedChamCong.LoaiNhanVien}
            </Descriptions.Item>
            <Descriptions.Item label="Kỳ lương">
              {new Date(selectedChamCong.KyLuong).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Số ngày làm">
              {selectedChamCong.SoNgayLam}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[selectedChamCong.TrangThai] || "default"}>
                {selectedChamCong.TrangThai}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ChamCongNhanVien; 