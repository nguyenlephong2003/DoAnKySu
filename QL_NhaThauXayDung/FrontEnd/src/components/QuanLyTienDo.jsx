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
  Upload,
  Descriptions,
  Card,
  Typography,
  Divider,
  Progress,
} from "antd";
import {
  SearchOutlined,
  FileOutlined,
  UserOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import dayjs from "dayjs";
import { uploadFileAndGetURL, uploadMultipleFiles } from "../services/firebaseStorage";
import { ref, deleteObject, getStorage } from "firebase/storage";
import { app } from "../firebase/config";

const storage = getStorage(app);

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors = {
  "Chưa hoàn thành": "orange",
  "Hoàn thành": "green",
};

// Hàm chuyển đổi trạng thái từ boolean sang tiếng Việt
const convertStatus = (status) => {
  return status === 1 ? "Hoàn thành" : "Chưa hoàn thành";
};

const QuanLyTienDo = () => {
  const [baoCaolist, setBaoCaoList] = useState([]);
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentBaoCaoCode, setCurrentBaoCaoCode] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBaoCao, setSelectedBaoCao] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedConstruction, setSelectedConstruction] = useState("all");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setCurrentUser(userInfo);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch progress reports
      const baoCaoResponse = await axios.get(
        `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=GET`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (baoCaoResponse.data.data) {
        setBaoCaoList(baoCaoResponse.data.data);
        setPagination((prev) => ({
          ...prev,
          total: baoCaoResponse.data.data.length,
        }));

        // Fetch construction information for each report
        const congTrinhMap = {};
        for (const baoCao of baoCaoResponse.data.data) {
          if (baoCao.MaCongTrinh && !congTrinhMap[baoCao.MaCongTrinh]) {
            try {
              const congTrinhResponse = await axios.get(
                `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=getById&MaCongTrinh=${baoCao.MaCongTrinh}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (congTrinhResponse.data.data) {
                congTrinhMap[baoCao.MaCongTrinh] = congTrinhResponse.data.data;
              }
            } catch (error) {
              console.error(
                `Error fetching construction info for ${baoCao.MaCongTrinh}:`,
                error
              );
            }
          }
        }
        setCongTrinhList(congTrinhMap);
      } else {
        message.error("Không thể lấy dữ liệu báo cáo tiến độ");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllConstructions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=GET`,
        {
          withCredentials: true
        }
      );
      if (response.data.data) {
        const constructionMap = {};
        response.data.data.forEach((construction) => {
          constructionMap[construction.MaCongTrinh] = construction;
        });
        setCongTrinhList(constructionMap);
      }
    } catch (error) {
      console.error("Error fetching all constructions:", error);
      message.error("Lỗi khi lấy danh sách công trình");
    }
  };

  const getFilteredData = () => {
    let filteredData = [...baoCaolist];

    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.MaTienDo.toLowerCase().includes(searchText.toLowerCase()) ||
          item.CongViec.toLowerCase().includes(searchText.toLowerCase()) ||
          (congTrinhList[item.MaCongTrinh]?.TenCongTrinh || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => item.TrangThai === selectedStatus
      );
    }

    if (selectedConstruction !== "all") {
      filteredData = filteredData.filter(
        (item) => item.MaCongTrinh === selectedConstruction
      );
    }

    filteredData.sort((a, b) => b.MaTienDo.localeCompare(a.MaTienDo));

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

  const handleCreateBaoCao = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baoCaoCode = "BC" + dayjs().format("DDMMYYYYHHmmss");
      setCurrentBaoCaoCode(baoCaoCode);
      // Nếu HinhAnhTienDo là mảng, stringify để backend nhận được chuỗi
      const hinhAnh = Array.isArray(values.HinhAnhTienDo) ? JSON.stringify(values.HinhAnhTienDo) : values.HinhAnhTienDo;
      const baoCaoData = {
        MaTienDo: baoCaoCode,
        ThoiGianHoanThanhThucTe:
          values.ThoiGianHoanThanhThucTe?.format("YYYY-MM-DD"),
        CongViec: values.CongViec,
        NoiDungCongViec: values.NoiDungCongViec,
        NgayBaoCao: values.NgayBaoCao.format("YYYY-MM-DD"),
        TrangThai: values.TrangThai === 1 ? 1 : 0,
        TiLeHoanThanh: values.TiLeHoanThanh,
        HinhAnhTienDo: hinhAnh,
        MaCongTrinh: values.MaCongTrinh,
      };

      const response = await axios.post(
        `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=POST`,
        baoCaoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Tạo báo cáo tiến độ thành công.") {
        message.success("Tạo báo cáo tiến độ thành công");
        setModalVisible(false);
        form.resetFields();
        setUploadedFile(null);
        fetchData();
      } else {
        message.error(response.data.message || "Tạo báo cáo tiến độ thất bại");
      }
    } catch (error) {
      console.error("Error creating progress report:", error);
      message.error("Lỗi khi tạo báo cáo tiến độ");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    const files = info.fileList.map(f => f.originFileObj || f);
    if (files && files.length > 0) {
      setImageUploading(true);
      try {
        const baoCaoCode = currentBaoCaoCode || "BC" + dayjs().format("DDMMYYYYHHmmss");
        // Upload từng file với tên riêng biệt
        const uploadPromises = files.map((file, idx) => {
          const ext = file.name.split('.').pop();
          const fileName = `${baoCaoCode}_${idx + 1}.${ext}`;
          return uploadFileAndGetURL(file, "img", fileName);
        });
        const urls = await Promise.all(uploadPromises);
        form.setFieldsValue({ HinhAnhTienDo: urls }); // Lưu mảng link
        setUploadedFile(files);
        message.success("Tất cả ảnh đã được upload thành công");
      } catch (error) {
        message.error("Upload failed");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const showDetailModal = (record) => {
    setSelectedBaoCao(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedBaoCao(record);
    editForm.setFieldsValue({
      ...record,
      NgayBaoCao: dayjs(record.NgayBaoCao),
      ThoiGianHoanThanhThucTe: record.ThoiGianHoanThanhThucTe
        ? dayjs(record.ThoiGianHoanThanhThucTe)
        : null,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (maTienDo) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa báo cáo tiến độ này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const baoCaoToDelete = baoCaolist.find(
            (bc) => bc.MaTienDo === maTienDo
          );
          if (!baoCaoToDelete) {
            throw new Error("Không tìm thấy báo cáo tiến độ");
          }

          if (baoCaoToDelete.HinhAnhTienDo) {
            try {
              const fileRef = ref(storage, `progress/${maTienDo}.jpg`);
              await deleteObject(fileRef);
            } catch (error) {
              console.error("Lỗi khi xóa hình ảnh:", error);
            }
          }

          const response = await axios.delete(
            `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=DELETE&id=${maTienDo}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.message === "Xóa báo cáo tiến độ thành công.") {
            setDetailModalVisible(false);
            await fetchData();
            message.success("Xóa báo cáo tiến độ thành công");
          } else {
            message.error(
              response.data.message || "Xóa báo cáo tiến độ thất bại"
            );
          }
        } catch (error) {
          console.error("Error deleting progress report:", error);
          message.error("Lỗi khi xóa báo cáo tiến độ");
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
        `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=PUT`,
        {
          ...values,
          NgayBaoCao: values.NgayBaoCao.format("YYYY-MM-DD"),
          ThoiGianHoanThanhThucTe:
            values.ThoiGianHoanThanhThucTe?.format("YYYY-MM-DD"),
          TrangThai: values.TrangThai === 1 ? 1 : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Cập nhật báo cáo tiến độ thành công.") {
        setEditModalVisible(false);
        setDetailModalVisible(false);
        editForm.resetFields();
        await fetchData();
        message.success("Cập nhật báo cáo tiến độ thành công");
      } else {
        message.error(
          response.data.message || "Cập nhật báo cáo tiến độ thất bại"
        );
      }
    } catch (error) {
      console.error("Error updating progress report:", error);
      message.error("Lỗi khi cập nhật báo cáo tiến độ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Quản lý báo cáo tiến độ
        </h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm báo cáo..."
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
              <Option value="Chưa hoàn thành">Chưa hoàn thành</Option>
              <Option value="Đang thực hiện">Đang thực hiện</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Tạm dừng">Tạm dừng</Option>
            </Select>
            <Select
              placeholder="Chọn công trình"
              style={{ width: 200 }}
              value={selectedConstruction}
              onChange={(value) => setSelectedConstruction(value)}
              allowClear
            >
              <Option value="all">Tất cả công trình</Option>
              {Object.values(congTrinhList).map((congTrinh) => (
                <Option
                  key={congTrinh.MaCongTrinh}
                  value={congTrinh.MaCongTrinh}
                >
                  {congTrinh.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              fetchAllConstructions();
              setModalVisible(true);
            }}
          >
            Tạo báo cáo mới
          </Button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              {
                title: "Công trình",
                dataIndex: "MaCongTrinh",
                key: "MaCongTrinh",
                width: "20%",
                render: (text) => congTrinhList[text]?.TenCongTrinh || text,
                ellipsis: true,
              },
              {
                title: "Công việc",
                dataIndex: "CongViec",
                key: "CongViec",
                width: "20%",
                ellipsis: true,
              },
              {
                title: "Ngày báo cáo",
                dataIndex: "NgayBaoCao",
                key: "NgayBaoCao",
                width: "12%",
                align: "center",
                render: (text) => new Date(text).toLocaleDateString("vi-VN"),
              },
              {
                title: "Tiến độ",
                dataIndex: "TiLeHoanThanh",
                key: "TiLeHoanThanh",
                width: "12%",
                align: "center",
                render: (text) => <Progress percent={text} size="small" />,
              },
              {
                title: "Trạng thái",
                dataIndex: "TrangThai",
                key: "TrangThai",
                width: "12%",
                align: "center",
                ellipsis: true,
                render: (text) => {
                  const statusText = convertStatus(text);
                  return (
                    <Tag color={statusColors[statusText] || "default"}>
                      {statusText}
                    </Tag>
                  );
                },
              },
              {
                title: "Thao tác",
                key: "action",
                width: "24%",
                align: "center",
                render: (_, record) => (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      icon={<InfoCircleOutlined />}
                      type="primary"
                      onClick={() => showDetailModal(record)}
                    >
                      Chi tiết
                    </Button>
                    {record.TrangThai !== "Hoàn thành" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Button
                          icon={<EditOutlined />}
                          type="default"
                          onClick={() => handleEdit(record)}
                        >
                          Sửa
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleDelete(record.MaTienDo)}
                        >
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            rowKey="MaTienDo"
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
            showTotal={(total) => `Tổng cộng ${total} mục`}
            showQuickJumper
          />
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        title="Tạo báo cáo tiến độ mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setUploadedFile(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateBaoCao}>
          <Form.Item
            name="MaCongTrinh"
            label="Công trình"
            rules={[{ required: true, message: "Vui lòng chọn công trình" }]}
          >
            <Select placeholder="Chọn công trình" loading={loading}>
              {Object.values(congTrinhList).map((congTrinh) => (
                <Option
                  key={congTrinh.MaCongTrinh}
                  value={congTrinh.MaCongTrinh}
                >
                  {congTrinh.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="CongViec"
            label="Công việc"
            rules={[{ required: true, message: "Vui lòng nhập công việc" }]}
          >
            <Input placeholder="Nhập công việc" />
          </Form.Item>

          <Form.Item
            name="NoiDungCongViec"
            label="Nội dung công việc"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung công việc" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung chi tiết công việc"
            />
          </Form.Item>

          <Form.Item
            name="NgayBaoCao"
            label="Ngày báo cáo"
            rules={[{ required: true, message: "Vui lòng chọn ngày báo cáo" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="ThoiGianHoanThanhThucTe"
            label="Thời gian hoàn thành thực tế"
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="TiLeHoanThanh"
            label="Tỷ lệ hoàn thành (%)"
            rules={[
              { required: true, message: "Vui lòng nhập tỷ lệ hoàn thành" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>

          <Form.Item name="TrangThai" label="Trạng thái" initialValue={0}>
            <Select>
              <Option value={0}>Chưa hoàn thành</Option>
              <Option value={1}>Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item name="HinhAnhTienDo" label="Hình ảnh tiến độ">
            <Upload
              name="file"
              listType="picture"
              multiple
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setUploadedFile(null);
              }}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={imageUploading || !form.getFieldValue("HinhAnhTienDo") || form.getFieldValue("HinhAnhTienDo").length === 0}
            >
              Tạo báo cáo
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa báo cáo tiến độ"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="MaTienDo" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="MaCongTrinh"
            label="Công trình"
            rules={[{ required: true, message: "Vui lòng chọn công trình" }]}
          >
            <Select placeholder="Chọn công trình" loading={loading}>
              {Object.values(congTrinhList).map((congTrinh) => (
                <Option
                  key={congTrinh.MaCongTrinh}
                  value={congTrinh.MaCongTrinh}
                >
                  {congTrinh.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="CongViec"
            label="Công việc"
            rules={[{ required: true, message: "Vui lòng nhập công việc" }]}
          >
            <Input placeholder="Nhập công việc" />
          </Form.Item>

          <Form.Item
            name="NoiDungCongViec"
            label="Nội dung công việc"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung công việc" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung chi tiết công việc"
            />
          </Form.Item>

          <Form.Item
            name="NgayBaoCao"
            label="Ngày báo cáo"
            rules={[{ required: true, message: "Vui lòng chọn ngày báo cáo" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="ThoiGianHoanThanhThucTe"
            label="Thời gian hoàn thành thực tế"
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="TiLeHoanThanh"
            label="Tỷ lệ hoàn thành (%)"
            rules={[
              { required: true, message: "Vui lòng nhập tỷ lệ hoàn thành" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value={0}>Chưa hoàn thành</Option>
              <Option value={1}>Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item name="HinhAnhTienDo" label="Hình ảnh tiến độ">
            <Upload
              name="file"
              listType="picture"
              multiple
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
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
        title="Chi tiết báo cáo tiến độ"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedBaoCao?.TrangThai !== "Hoàn thành" && (
            <Button
              key="edit"
              type="primary"
              onClick={() => handleEdit(selectedBaoCao)}
            >
              Chỉnh sửa
            </Button>
          ),
          selectedBaoCao?.TrangThai !== "Hoàn thành" && (
            <Button
              key="delete"
              danger
              onClick={() => handleDelete(selectedBaoCao.MaTienDo)}
            >
              Xóa
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedBaoCao && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã báo cáo" span={2}>
              {selectedBaoCao.MaTienDo}
            </Descriptions.Item>
            <Descriptions.Item label="Công trình" span={2}>
              {congTrinhList[selectedBaoCao.MaCongTrinh]?.TenCongTrinh}
            </Descriptions.Item>
            <Descriptions.Item label="Công việc" span={2}>
              {selectedBaoCao.CongViec}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung công việc" span={2}>
              {selectedBaoCao.NoiDungCongViec}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày báo cáo">
              {new Date(selectedBaoCao.NgayBaoCao).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian hoàn thành thực tế">
              {selectedBaoCao.ThoiGianHoanThanhThucTe
                ? new Date(
                    selectedBaoCao.ThoiGianHoanThanhThucTe
                  ).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Tỷ lệ hoàn thành" span={2}>
              <Progress percent={selectedBaoCao.TiLeHoanThanh} />
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag
                color={
                  statusColors[convertStatus(selectedBaoCao.TrangThai)] ||
                  "default"
                }
              >
                {convertStatus(selectedBaoCao.TrangThai)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Hình ảnh tiến độ" span={2}>
              {selectedBaoCao.HinhAnhTienDo && (() => {
                let images = [];
                try {
                  // Nếu là chuỗi JSON (mảng link)
                  if (selectedBaoCao.HinhAnhTienDo.trim().startsWith("[")) {
                    images = JSON.parse(selectedBaoCao.HinhAnhTienDo);
                  } else {
                    // Nếu là tên file cũ hoặc 1 link
                    images = [selectedBaoCao.HinhAnhTienDo];
                  }
                } catch {
                  images = [selectedBaoCao.HinhAnhTienDo];
                }
                return (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith("http") ? img : `${BASE_URL}img/${img}`}
                        alt={`Tiến độ ${idx + 1}`}
                        style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, border: "1px solid #eee" }}
                      />
                    ))}
                  </div>
                );
              })()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default QuanLyTienDo;
