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
      // Fetch all constructions first
      const constructionResponse = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/CongTrinh_API.php?action=GET`,
        {
          withCredentials: true
        }
      );

      if (constructionResponse.data.data) {
        const constructionMap = {};
        constructionResponse.data.data.forEach((construction) => {
          constructionMap[construction.MaCongTrinh] = construction;
        });
        setCongTrinhList(constructionMap);
      }

      // Then fetch progress reports
      const baoCaoResponse = await axios.get(
        `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=GET`,
        {
          withCredentials: true
        }
      );

      if (baoCaoResponse.data.data) {
        setBaoCaoList(baoCaoResponse.data.data);
        setPagination((prev) => ({
          ...prev,
          total: baoCaoResponse.data.data.length,
        }));
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

  const getFilteredData = () => {
    let filteredData = [...baoCaolist];

    if (searchText) {
      filteredData = filteredData.filter(
        (project) =>
          project.MaCongTrinh.toLowerCase().includes(searchText.toLowerCase()) ||
          project.TenCongTrinh.toLowerCase().includes(searchText.toLowerCase()) ||
          project.DanhSachBaoCao.some(
            (baoCao) =>
              baoCao.CongViec.toLowerCase().includes(searchText.toLowerCase()) ||
              baoCao.NoiDungCongViec.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (project) => project.TrangThai === selectedStatus
      );
    }

    if (selectedConstruction !== "all") {
      filteredData = filteredData.filter(
        (project) => project.MaCongTrinh === selectedConstruction
      );
    }

    return filteredData;
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredData.slice(startIndex, endIndex);
  };

  const columns = [
    {
      title: "Công trình",
      dataIndex: "TenCongTrinh",
      key: "TenCongTrinh",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Công việc mới nhất",
      dataIndex: "DanhSachBaoCao",
      key: "CongViec",
      width: "20%",
      ellipsis: true,
      render: (danhSachBaoCao) => danhSachBaoCao[0]?.CongViec || "Chưa có báo cáo",
    },
    {
      title: "Ngày báo cáo mới nhất",
      dataIndex: "DanhSachBaoCao",
      key: "NgayBaoCao",
      width: "12%",
      align: "center",
      render: (danhSachBaoCao) => 
        danhSachBaoCao[0]?.NgayBaoCao 
          ? new Date(danhSachBaoCao[0].NgayBaoCao).toLocaleDateString("vi-VN")
          : "Chưa có",
    },
    {
      title: "Tiến độ",
      dataIndex: "TongTienDo",
      key: "TongTienDo",
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
        const status = convertStatus(text);
        return (
          <Tag color={statusColors[status]}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
          <Button
            icon={<InfoCircleOutlined />}
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          
        </div>
      ),
    },
  ];

  const showDetailModal = (record) => {
    setSelectedBaoCao(record);
    setDetailModalVisible(true);
  };

  const handleCreateBaoCao = async (values) => {
    try {
      setLoading(true);
      // Tạo mã báo cáo theo format: BC + YYYYMMDDHHmmss
      const baoCaoCode = "BC" + dayjs().format("YYYYMMDDHHmmss");
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
          withCredentials: true,
          headers: {
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
        const baoCaoCode = currentBaoCaoCode || "BC" + dayjs().format("YYYYMMDDHHmmss");
        // Upload từng file với tên là MaTienDo
        const uploadPromises = files.map((file) => {
          const ext = file.name.split('.').pop();
          const fileName = `${baoCaoCode}.${ext}`;
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

  const handleEditFileChange = async (info) => {
    // Xử lý xóa ảnh cũ
    const removedFiles = info.fileList.filter(file => file.status === 'removed');
    for (const file of removedFiles) {
      if (file.url) {
        try {
          // Lấy đường dẫn file từ URL
          const filePath = file.url.split('/o/')[1]?.split('?')[0];
          if (filePath) {
            const decodedPath = decodeURIComponent(filePath);
            const fileRef = ref(storage, decodedPath);
            await deleteObject(fileRef);
            console.log('Đã xóa ảnh cũ:', decodedPath);
          }
        } catch (error) {
          console.error('Lỗi khi xóa ảnh cũ:', error);
        }
      }
    }

    const files = info.fileList.map(f => f.originFileObj || f);
    if (files && files.length > 0) {
      setImageUploading(true);
      try {
        const baoCaoCode = selectedBaoCao?.MaTienDo;
        // Upload từng file với tên là MaTienDo
        const uploadPromises = files.map((file) => {
          const ext = file.name.split('.').pop();
          const fileName = `${baoCaoCode}.${ext}`;
          return uploadFileAndGetURL(file, "img", fileName);
        });
        const urls = await Promise.all(uploadPromises);
        editForm.setFieldsValue({ HinhAnhTienDo: urls }); // Lưu mảng link
        message.success("Tất cả ảnh đã được upload thành công");
      } catch (error) {
        message.error("Upload failed");
      } finally {
        setImageUploading(false);
      }
    } else {
      // Nếu không còn ảnh nào, set giá trị rỗng
      editForm.setFieldsValue({ HinhAnhTienDo: [] });
    }
  };

  const handleEdit = (record) => {
    // Sử dụng MaCongTrinh từ selectedBaoCao đang hiển thị
    setSelectedBaoCao(selectedBaoCao);
    let images = [];
    try {
      // Parse images from HinhAnhTienDo
      if (record.HinhAnhTienDo) {
        if (typeof record.HinhAnhTienDo === 'string') {
          if (record.HinhAnhTienDo.trim().startsWith("[")) {
            images = JSON.parse(record.HinhAnhTienDo);
          } else {
            images = [record.HinhAnhTienDo];
          }
        } else if (Array.isArray(record.HinhAnhTienDo)) {
          images = record.HinhAnhTienDo;
        }
      }
    } catch (error) {
      console.error("Error parsing images:", error);
      images = [record.HinhAnhTienDo];
    }

    // Convert images to fileList format for Upload component
    const fileList = images.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}`,
      status: 'done',
      url: url.startsWith('http') ? url : `${BASE_URL}img/${url}`,
      thumbUrl: url.startsWith('http') ? url : `${BASE_URL}img/${url}`,
    }));

    // Reset form trước khi set giá trị mới
    editForm.resetFields();
    
    // Set giá trị cho form
    editForm.setFieldsValue({
      MaTienDo: record.MaTienDo,
      MaCongTrinh: selectedBaoCao.MaCongTrinh, // Sử dụng MaCongTrinh từ selectedBaoCao
      CongViec: record.CongViec,
      NoiDungCongViec: record.NoiDungCongViec,
      NgayBaoCao: dayjs(record.NgayBaoCao),
      ThoiGianHoanThanhThucTe: record.ThoiGianHoanThanhThucTe
        ? dayjs(record.ThoiGianHoanThanhThucTe)
        : null,
      TrangThai: record.TrangThai,
      TiLeHoanThanh: record.TiLeHoanThanh,
      HinhAnhTienDo: fileList,
    });

    setEditModalVisible(true);
    setDetailModalVisible(false);
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

          // Tìm báo cáo trong selectedBaoCao.DanhSachBaoCao
          const baoCaoToDelete = selectedBaoCao?.DanhSachBaoCao?.find(
            (bc) => bc.MaTienDo === maTienDo
          );

          if (!baoCaoToDelete) {
            throw new Error("Không tìm thấy báo cáo tiến độ");
          }

          // Xóa hình ảnh nếu có
          if (baoCaoToDelete.HinhAnhTienDo) {
            try {
              let imageUrls = [];
              if (typeof baoCaoToDelete.HinhAnhTienDo === 'string') {
                if (baoCaoToDelete.HinhAnhTienDo.trim().startsWith('[')) {
                  imageUrls = JSON.parse(baoCaoToDelete.HinhAnhTienDo);
                } else {
                  imageUrls = [baoCaoToDelete.HinhAnhTienDo];
                }
              } else if (Array.isArray(baoCaoToDelete.HinhAnhTienDo)) {
                imageUrls = baoCaoToDelete.HinhAnhTienDo;
              }

              // Xóa từng hình ảnh
              for (const url of imageUrls) {
                const filePath = url.split('/o/')[1]?.split('?')[0];
                if (filePath) {
                  const decodedPath = decodeURIComponent(filePath);
                  const fileRef = ref(storage, decodedPath);
                  await deleteObject(fileRef);
                }
              }
            } catch (error) {
              console.error("Lỗi khi xóa hình ảnh:", error);
            }
          }

          const response = await axios.delete(
            `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=DELETE&id=${maTienDo}`,
            {
              withCredentials: true
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

      // Xử lý hình ảnh trước khi gửi
      let hinhAnhTienDo = values.HinhAnhTienDo;
      if (Array.isArray(hinhAnhTienDo)) {
        // Nếu là fileList từ Upload component
        hinhAnhTienDo = hinhAnhTienDo.map(file => {
          if (file.url) {
            return file.url;
          }
          return file;
        });
      }
      // Chuyển thành chuỗi JSON nếu là mảng
      if (Array.isArray(hinhAnhTienDo)) {
        hinhAnhTienDo = JSON.stringify(hinhAnhTienDo);
      }

      const formData = {
        MaTienDo: values.MaTienDo,
        MaCongTrinh: values.MaCongTrinh,
        CongViec: values.CongViec,
        NoiDungCongViec: values.NoiDungCongViec,
        NgayBaoCao: values.NgayBaoCao.format("YYYY-MM-DD"),
        ThoiGianHoanThanhThucTe: values.ThoiGianHoanThanhThucTe ? values.ThoiGianHoanThanhThucTe.format("YYYY-MM-DD") : null,
        TrangThai: values.TrangThai === 1 ? 1 : 0,
        TiLeHoanThanh: values.TiLeHoanThanh,
        HinhAnhTienDo: hinhAnhTienDo
      };

      const response = await axios.put(
        `${BASE_URL}TienDo_API/BaoCaoTienDo_API.php?action=PUT`,
        formData,
        {
          withCredentials: true,
          headers: {
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
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      message.error("Lỗi khi cập nhật báo cáo tiến độ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
          Quản lý báo cáo tiến độ
        </h1>

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm công trình hoặc báo cáo..."
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
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Đang thực hiện">Đang thực hiện</Option>
              <Option value="Chưa có báo cáo">Chưa có báo cáo</Option>
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
                <Option key={congTrinh.MaCongTrinh} value={congTrinh.MaCongTrinh}>
                  {congTrinh.TenCongTrinh}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
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
            columns={columns}
            rowKey="MaCongTrinh"
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
          </Button>
        ]}
        width={800}
      >
        {selectedBaoCao && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã công trình" span={2}>
              {selectedBaoCao.MaCongTrinh}
            </Descriptions.Item>
            <Descriptions.Item label="Tên công trình" span={2}>
              {selectedBaoCao.TenCongTrinh}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiến độ" span={2}>
              <Progress percent={selectedBaoCao.TongTienDo} />
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag color={selectedBaoCao.TrangThai === "Hoàn thành" ? "green" : "orange"}>
                {selectedBaoCao.TrangThai}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hoàn thành" span={2}>
              {selectedBaoCao.NgayHoanThanh
                ? new Date(selectedBaoCao.NgayHoanThanh).toLocaleDateString("vi-VN")
                : "Chưa hoàn thành"}
            </Descriptions.Item>
            <Descriptions.Item label="Danh sách báo cáo" span={2}>
              <Table
                dataSource={selectedBaoCao.DanhSachBaoCao}
                columns={[
                  {
                    title: "Ngày báo cáo",
                    dataIndex: "NgayBaoCao",
                    key: "NgayBaoCao",
                    render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                  },
                  {
                    title: "Công việc",
                    dataIndex: "CongViec",
                    key: "CongViec",
                  },
                  {
                    title: "Nội dung",
                    dataIndex: "NoiDungCongViec",
                    key: "NoiDungCongViec",
                    ellipsis: true,
                  },
                  {
                    title: "Tiến độ",
                    dataIndex: "TiLeHoanThanh",
                    key: "TiLeHoanThanh",
                    render: (text) => <Progress percent={text} size="small" />,
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "TrangThai",
                    key: "TrangThai",
                    render: (text) => {
                      const status = convertStatus(text);
                      return (
                        <Tag color={statusColors[status]}>
                          {status}
                        </Tag>
                      );
                    },
                  },
                  {
                    title: "Hình ảnh",
                    dataIndex: "HinhAnhTienDo",
                    key: "HinhAnhTienDo",
                    render: (images) => {
                      if (!images) return null;
                      let imageUrls = [];
                      try {
                        if (typeof images === 'string') {
                          if (images.trim().startsWith('[')) {
                            imageUrls = JSON.parse(images);
                          } else {
                            imageUrls = [images];
                          }
                        } else if (Array.isArray(images)) {
                          imageUrls = images;
                        }
                      } catch (error) {
                        imageUrls = [images];
                      }
                      return (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Hình ảnh ${index + 1}`}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                Modal.info({
                                  title: 'Hình ảnh chi tiết',
                                  content: (
                                    <img
                                      src={url}
                                      alt={`Hình ảnh ${index + 1}`}
                                      style={{ width: '100%' }}
                                    />
                                  ),
                                  width: '80%',
                                  centered: true
                                });
                              }}
                            />
                          ))}
                        </div>
                      );
                    }
                  },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: (_, record) => (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Button
                          icon={<EditOutlined />}
                          type="primary"
                          size="small"
                          onClick={() => {
                            handleEdit(record);
                            setDetailModalVisible(false);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          size="small"
                          onClick={() => handleDelete(record.MaTienDo)}
                        >
                          Xóa
                        </Button>
                      </div>
                    )
                  }
                ]}
                pagination={false}
                size="small"
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ padding: '16px' }}>
                      <p><strong>Nội dung chi tiết:</strong> {record.NoiDungCongViec}</p>
                      <p><strong>Thời gian hoàn thành thực tế:</strong> {record.ThoiGianHoanThanhThucTe ? new Date(record.ThoiGianHoanThanhThucTe).toLocaleDateString("vi-VN") : "Chưa có"}</p>
                    </div>
                  ),
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

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
              {Object.values(congTrinhList)
                .filter(congTrinh => {
                  // Lọc ra các công trình chưa hoàn thành 100%
                  const projectProgress = baoCaolist.find(p => p.MaCongTrinh === congTrinh.MaCongTrinh);
                  return !projectProgress || projectProgress.TongTienDo < 100;
                })
                .map((congTrinh) => (
                  <Option key={congTrinh.MaCongTrinh} value={congTrinh.MaCongTrinh}>
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
            <Select placeholder="Chọn công trình" loading={loading} disabled>
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
              onChange={handleEditFileChange}
              fileList={editForm.getFieldValue('HinhAnhTienDo')}
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
    </div>
  );
};

export default QuanLyTienDo;
