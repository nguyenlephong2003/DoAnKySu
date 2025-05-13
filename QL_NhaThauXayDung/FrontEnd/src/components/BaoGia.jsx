import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Spin,
  message,
  Pagination,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config"; // Đường dẫn đến file config của bạn
import AddBaoGiaForm from "./AddBaoGia"; // Import component form thêm mới
import DetailBaoGiaModal from "./ChiTietBaoGia"; // Import component modal chi tiết

const { Option } = Select;
const { confirm } = Modal;

const BaoGia = () => {
  const [bangBaoGiaList, setBangBaoGiaList] = useState([]);
  const [loaiBaoGiaList, setLoaiBaoGiaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLoai, setSelectedLoai] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [addModalVisible, setAddModalVisible] = useState(false); // State cho modal thêm mới
  const [detailModalVisible, setDetailModalVisible] = useState(false); // State cho modal chi tiết
  const [currentBaoGia, setCurrentBaoGia] = useState(null); // Báo giá đang được xem chi tiết
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [baoGiaToDelete, setBaoGiaToDelete] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [chiTietBaoGia, setChiTietBaoGia] = useState([]);

  const statusColors = {
    "Chờ duyệt": "orange",
    "Đã duyệt": "green",
    "Từ chối": "red",
  };

  // Lấy danh sách báo giá và loại báo giá
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Lấy tất cả báo giá
      const baoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=GET`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (baoGiaResponse.data.status === "success") {
        setBangBaoGiaList(baoGiaResponse.data.data);
        setPagination((prev) => ({
          ...prev,
          total: baoGiaResponse.data.data.length,
        }));
      } else {
        message.error("Không thể lấy dữ liệu báo giá");
      }

      // Lấy tất cả loại báo giá
      const loaiBaoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getAllLoaiBaoGia`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (loaiBaoGiaResponse.data.status === "success") {
        setLoaiBaoGiaList(loaiBaoGiaResponse.data.data);
      } else {
        message.error("Không thể lấy dữ liệu loại báo giá");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Lỗi khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên tìm kiếm và loại báo giá
  const getFilteredData = () => {
    let filteredData = [...bangBaoGiaList];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.MaBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TrangThai.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.TenLoaiBaoGia &&
            item.TenLoaiBaoGia.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Lọc theo loại báo giá
    if (selectedLoai !== "all") {
      filteredData = filteredData.filter(
        (item) => item.MaLoai === selectedLoai
      );
    }

    // Lọc theo trạng thái
    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => item.TrangThai === selectedStatus
      );
    }

    // Sắp xếp theo mã báo giá giảm dần (mới nhất lên đầu)
    filteredData.sort((a, b) => b.MaBaoGia.localeCompare(a.MaBaoGia));

    return filteredData;
  };

  // Xử lý phân trang
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Hiển thị dữ liệu phân trang
  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    const { current, pageSize } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredData.slice(startIndex, endIndex);
  };

  // Hàm xử lý xóa
  const handleDelete = (record) => {
    console.log("Bắt đầu xóa báo giá:", record);
    setBaoGiaToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!baoGiaToDelete) return;

    console.log("Người dùng xác nhận xóa");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Gửi request xóa đến API...");

      const response = await axios({
        method: "DELETE",
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=DELETE`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          MaBaoGia: baoGiaToDelete.MaBaoGia,
        },
      });
      console.log("Phản hồi từ API:", response.data);

      if (response.data.status === "success") {
        message.success("Xóa báo giá thành công");
        fetchData(); // Tải lại dữ liệu
      } else {
        message.error(response.data.message || "Xóa báo giá thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      message.error(
        "Lỗi khi xóa báo giá: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setBaoGiaToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    console.log("Người dùng hủy xóa");
    setDeleteModalVisible(false);
    setBaoGiaToDelete(null);
  };

  // Columns của bảng
  const columns = [
    {
      title: "Mã báo giá",
      dataIndex: "MaBaoGia",
      key: "MaBaoGia",
    },
    {
      title: "Tên báo giá",
      dataIndex: "TenBaoGia",
      key: "TenBaoGia",
    },
    {
      title: "Loại báo giá",
      dataIndex: "TenLoaiBaoGia",
      key: "TenLoaiBaoGia",
      render: (text, record) => text || `Loại ${record.MaLoai}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (text) => (
        <Tag color={statusColors[text] || "default"}>{text}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<InfoCircleOutlined />}
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          {record.TrangThai !== "Đã duyệt" && (
            <>
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
                onClick={() => {
                  console.log("Nút xóa được nhấn");
                  handleDelete(record);
                }}
              >
                Xóa
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Hiển thị modal chi tiết
  const showDetailModal = (record) => {
    setCurrentBaoGia(record);
    setDetailModalVisible(true);
  };

  // Hàm xử lý sửa
  const handleEdit = (record) => {
    console.log("Bắt đầu sửa báo giá:", record);
    setCurrentBaoGia(record);
    form.setFieldsValue({
      TenBaoGia: record.TenBaoGia,
      MaLoai: record.MaLoai,
      TrangThai: record.TrangThai,
    });
    setEditModalVisible(true);

    // Lấy chi tiết báo giá
    const fetchChiTietBaoGia = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getQuotationDetails&MaBaoGia=${record.MaBaoGia}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setChiTietBaoGia(response.data.data.chi_tiet_bao_gia || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết báo giá:", error);
        message.error("Không thể lấy chi tiết báo giá");
      }
    };

    fetchChiTietBaoGia();
  };

  // Hàm xử lý khi submit form sửa
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị form sửa:", values);

      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios({
        method: "PUT",
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=updateBangBaoGia`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          MaBaoGia: currentBaoGia.MaBaoGia,
          TenBaoGia: values.TenBaoGia,
          MaLoai: values.MaLoai,
          TrangThai: values.TrangThai,
          GhiChu: values.GhiChu,
          ChiTietLoaiBaoGia: chiTietBaoGia,
        },
      });

      console.log("Phản hồi từ API:", response.data);

      if (response.data.status === "success") {
        message.success("Cập nhật báo giá thành công");
        fetchData(); // Tải lại dữ liệu
        setEditModalVisible(false);
        form.resetFields();
        setChiTietBaoGia([]);
      } else {
        message.error(response.data.message || "Cập nhật báo giá thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      message.error(
        "Lỗi khi cập nhật báo giá: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm báo giá mới - mở modal thêm mới
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // Hàm xử lý sau khi thêm thành công
  const handleAddSuccess = () => {
    fetchData(); // Tải lại dữ liệu
  };

  // Hàm thêm chi tiết báo giá mới
  const handleAddChiTiet = () => {
    setChiTietBaoGia([...chiTietBaoGia, { NoiDung: "", GiaBaoGia: 0 }]);
  };

  // Hàm xóa chi tiết báo giá
  const handleRemoveChiTiet = (index) => {
    const newChiTiet = [...chiTietBaoGia];
    newChiTiet.splice(index, 1);
    setChiTietBaoGia(newChiTiet);
  };

  // Hàm cập nhật chi tiết báo giá
  const handleUpdateChiTiet = (index, field, value) => {
    const newChiTiet = [...chiTietBaoGia];
    newChiTiet[index] = {
      ...newChiTiet[index],
      [field]: value,
    };
    setChiTietBaoGia(newChiTiet);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Quản lý báo giá
      </h1>
      {/* Thanh tìm kiếm và lọc */}
      <div style={{ marginBottom: 16, display: "flex", gap: "16px" }}>
        <Input
          placeholder="Tìm kiếm báo giá..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Chọn loại báo giá"
          style={{ width: 200 }}
          value={selectedLoai}
          onChange={(value) => setSelectedLoai(value)}
        >
          <Option value="all">Tất cả loại</Option>
          {loaiBaoGiaList.map((loai) => (
            <Option key={loai.MaLoai} value={loai.MaLoai}>
              {loai.TenLoai}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Đã duyệt">Đã duyệt</Option>
          <Option value="Từ chối">Từ chối</Option>
        </Select>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm báo giá
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <Spin spinning={loading}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table
            columns={columns}
            dataSource={getPaginatedData()}
            rowKey="MaBaoGia"
            pagination={false}
            onChange={handleTableChange}
            className="rounded-lg"
            style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}
          />
        </div>

        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={getFilteredData().length}
          onChange={(page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize })
          }
          style={{ marginTop: 16, textAlign: "right" }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} mục`}
        />
      </Spin>

      {/* Form thêm mới báo giá */}
      <AddBaoGiaForm
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={handleAddSuccess}
        loaiBaoGiaList={loaiBaoGiaList}
      />

      {/* Modal chi tiết báo giá */}
      <DetailBaoGiaModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        baoGia={currentBaoGia}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        {baoGiaToDelete && (
          <p>
            Bạn có chắc chắn muốn xóa báo giá "{baoGiaToDelete.TenBaoGia}"
            không?
          </p>
        )}
      </Modal>

      {/* Modal sửa báo giá */}
      <Modal
        title="Sửa báo giá"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setChiTietBaoGia([]);
        }}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            TenBaoGia: currentBaoGia?.TenBaoGia,
            MaLoai: currentBaoGia?.MaLoai,
            TrangThai: currentBaoGia?.TrangThai,
          }}
        >
          <Form.Item
            name="TenBaoGia"
            label="Tên báo giá"
            rules={[{ required: true, message: "Vui lòng nhập tên báo giá" }]}
          >
            <Input placeholder="Nhập tên báo giá" />
          </Form.Item>

          <Form.Item
            name="MaLoai"
            label="Loại báo giá"
            rules={[{ required: true, message: "Vui lòng chọn loại báo giá" }]}
          >
            <Select placeholder="Chọn loại báo giá">
              {loaiBaoGiaList.map((loai) => (
                <Option key={loai.MaLoai} value={loai.MaLoai}>
                  {loai.TenLoai}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái" disabled>
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Từ chối">Từ chối</Option>
            </Select>
          </Form.Item>

          <Form.Item name="GhiChu" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              onClick={handleAddChiTiet}
              block
              icon={<PlusOutlined />}
            >
              Thêm chi tiết báo giá
            </Button>
          </div>

          {chiTietBaoGia.map((chiTiet, index) => (
            <div
              key={index}
              style={{
                marginBottom: 16,
                padding: 16,
                border: "1px solid #d9d9d9",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h4>Chi tiết {index + 1}</h4>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveChiTiet(index)}
                />
              </div>
              <Form.Item label="Nội dung" required>
                <Input
                  value={chiTiet.NoiDung}
                  onChange={(e) =>
                    handleUpdateChiTiet(index, "NoiDung", e.target.value)
                  }
                  placeholder="Nhập nội dung"
                />
              </Form.Item>
              <Form.Item label="Giá báo giá" required>
                <Input
                  type="number"
                  value={chiTiet.GiaBaoGia}
                  onChange={(e) =>
                    handleUpdateChiTiet(
                      index,
                      "GiaBaoGia",
                      parseFloat(e.target.value)
                    )
                  }
                  placeholder="Nhập giá"
                />
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
    </div>
  );
};

export default BaoGia;
