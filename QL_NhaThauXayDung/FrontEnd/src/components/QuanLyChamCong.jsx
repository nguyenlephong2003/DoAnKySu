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
  const [phanCongModalVisible, setPhanCongModalVisible] = useState(false);
  const [selectedPhanCong, setSelectedPhanCong] = useState([]);
  const [selectedTenCongTrinh, setSelectedTenCongTrinh] = useState("");
  const [selectedNhanVienChamCong, setSelectedNhanVienChamCong] = useState([]);
  const [loaiNgayChamCong, setLoaiNgayChamCong] = useState({});

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
        const constructionData = response.data.data.map(item => ({
          ...item.CongTrinh,
          PhanCong: item.CongTrinh.DanhSachNhanVien.map(nv => ({
            MaBangPhanCong: parseInt(nv.MaBangPhanCong),
            MaNhanVien: nv.MaNhanVien,
            TenNhanVien: nv.TenNhanVien,
            LoaiNhanVien: nv.LoaiNhanVien,
            NgayThamGia: nv.NgayThamGia,
            NgayKetThuc: nv.NgayKetThuc,
            SoNgayThamGia: parseInt(nv.SoNgayThamGia) || 0
          }))
        }));

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
        `${BASE_URL}ChamCong_API/ChamCong.php?action=GET_NHAN_VIEN_THEO_LOAI`,
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
        NgayThamGia: new Date().toISOString().split('T')[0], // Lấy ngày hiện tại
        NgayKetThuc: null,
        SoNgayThamGia: null
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

      if (response.data.status === "success") {
        message.success("Thêm nhân viên thành công");
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(response.data.message || "Thêm nhân viên thất bại");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      message.error("Lỗi khi thêm nhân viên");
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

  const handleChamCong = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Log thông tin phân công được chọn
      console.log('Selected PhanCong:', selectedPhanCong);
      console.log('Selected NhanVienChamCong:', selectedNhanVienChamCong);
      
      // Tạo mảng dữ liệu chấm công cho từng nhân viên được chọn
      const chamCongData = selectedNhanVienChamCong.map((maBangPhanCong) => {
        const phanCong = selectedPhanCong.find(pc => pc.MaBangPhanCong === maBangPhanCong);
        console.log('Found PhanCong for', maBangPhanCong, ':', phanCong);
        
        if (!phanCong || !phanCong.MaBangPhanCong) {
          throw new Error(`Không tìm thấy thông tin phân công cho MaBangPhanCong: ${maBangPhanCong}`);
        }

        // Tăng SoNgayThamGia lên 1
        const newSoNgayThamGia = (parseInt(phanCong.SoNgayThamGia) || 0) + 1;

        // Đảm bảo định dạng ngày tháng đúng
        const ngayThamGia = phanCong.NgayThamGia ? new Date(phanCong.NgayThamGia).toISOString().split('T')[0] : null;
        const ngayKetThuc = phanCong.NgayKetThuc ? new Date(phanCong.NgayKetThuc).toISOString().split('T')[0] : null;

        const data = {
          MaBangPhanCong: parseInt(phanCong.MaBangPhanCong),
          NgayThamGia: ngayThamGia,
          NgayKetThuc: ngayKetThuc,
          SoNgayThamGia: newSoNgayThamGia
        };

        console.log('Created ChamCong data:', data);
        return data;
      });

      // Thêm validation
      if (!chamCongData.length) {
        message.error("Vui lòng chọn ít nhất một nhân viên!");
        return;
      }

      // Kiểm tra dữ liệu trước khi gửi
      console.log('Final ChamCong data to be sent:', chamCongData);

      // Gửi request PUT cho từng nhân viên
      const promises = chamCongData.map(data => {
        if (!data.MaBangPhanCong) {
          throw new Error('MaBangPhanCong không được để trống');
        }
        return axios.put(
          `${BASE_URL}ChamCong_API/ChamCong.php?action=PUT`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      });

      // Đợi tất cả các request hoàn thành
      const results = await Promise.all(promises);
      
      // Log response chi tiết
      results.forEach((result, index) => {
        console.log(`Response ${index + 1}:`, {
          status: result.status,
          data: result.data,
          message: result.data.message
        });
      });

      // Kiểm tra kết quả chi tiết hơn
      const success = results.every(result => {
        return result.status === 200 && 
               (result.data.status === "success" || 
                (result.data.message && result.data.message.includes("thành công")));
      });
      
      if (success) {
        message.success(`Đã chấm công thành công cho ${chamCongData.length} nhân viên!`);
        setPhanCongModalVisible(false);
        setSelectedNhanVienChamCong([]);
        setLoaiNgayChamCong({});
        fetchData(); // Refresh lại dữ liệu
      } else {
        // Log chi tiết lỗi
        console.error('Chấm công thất bại:', results.map(r => r.data));
        message.error("Có lỗi xảy ra khi chấm công! Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      // Log chi tiết lỗi
      console.error("Error updating attendance:", error.response?.data || error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        selectedPhanCong,
        selectedNhanVienChamCong
      });
      message.error(error.response?.data?.message || error.message || "Lỗi khi chấm công!");
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
                width: 90,
                ellipsis: true,
              },
              {
                title: "Tên công trình",
                dataIndex: "TenCongTrinh",
                key: "TenCongTrinh",
                width: 220,
                ellipsis: true,
              },
              {
                title: "Số nhân viên",
                key: "SoNhanVien",
                width: 90,
                align: "center",
                render: (_, record) => record.SoNhanVienPhanCong,
              },
              {
                title: "Tiến độ",
                key: "TienDo",
                width: 90,
                align: "center",
                render: (_, record) => `${record.TongTienDo}%`,
              },
              {
                title: "Thao tác",
                key: "action",
                width: 130,
                align: "center",
                render: (_, record) => (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      gap: 8,
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
                    {record.TongTienDo < 100 && (
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
                          setSelectedPhanCong(record.PhanCong);
                          setSelectedTenCongTrinh(record.TenCongTrinh);
                          setPhanCongModalVisible(true);
                        }}
                      >
                        Chấm công
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
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
          </Button>,
          selectedChamCong && selectedChamCong.TongTienDo < 100 && (
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalVisible(true);
                form.setFieldsValue({
                  MaCongTrinh: selectedChamCong.MaCongTrinh
                });
                setDetailModalVisible(false);
              }}
            >
              Thêm nhân viên
            </Button>
          ),
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
              <Descriptions.Item label="Diện tích">
                {selectedChamCong.Dientich} m²
              </Descriptions.Item>
              <Descriptions.Item label="Loại công trình">
                {selectedChamCong.TenLoaiCongTrinh}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày dự kiến hoàn thành">
                {new Date(selectedChamCong.NgayDuKienHoanThanh).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ">
                {selectedChamCong.TongTienDo}%
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={2}>
                {selectedChamCong.KhachHang.TenKhachHang} - {selectedChamCong.KhachHang.SoDT}
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
                  width: "30%",
                  ellipsis: true,
                },
                {
                  title: "Loại nhân viên",
                  dataIndex: "LoaiNhanVien",
                  key: "LoaiNhanVien",
                  width: "15%",
                  align: "center",
                },
                {
                  title: "Ngày tham gia",
                  dataIndex: "NgayThamGia",
                  key: "NgayThamGia",
                  width: "15%",
                  align: "center",
                  render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Ngày kết thúc",
                  dataIndex: "NgayKetThuc",
                  key: "NgayKetThuc",
                  width: "15%",
                  align: "center",
                  render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "-",
                },
                {
                  title: "Số ngày tham gia",
                  dataIndex: "SoNgayThamGia",
                  key: "SoNgayThamGia",
                  width: "15%",
                  align: "center",
                },
              ]}
              rowKey="MaNhanVien"
              pagination={false}
              bordered
              size="small"
            />

            <Divider orientation="left">Báo cáo tiến độ</Divider>
            
            <Table
              dataSource={selectedChamCong.DanhSachBaoCaoTienDo}
              columns={[
                {
                  title: "Công việc",
                  dataIndex: "CongViec",
                  key: "CongViec",
                  width: "20%",
                },
                {
                  title: "Nội dung",
                  dataIndex: "NoiDungCongViec",
                  key: "NoiDungCongViec",
                  width: "40%",
                },
                {
                  title: "Ngày báo cáo",
                  dataIndex: "NgayBaoCao",
                  key: "NgayBaoCao",
                  width: "20%",
                  render: (text) => new Date(text).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Tiến độ",
                  dataIndex: "TiLeHoanThanh",
                  key: "TiLeHoanThanh",
                  width: "20%",
                  render: (text) => `${text}%`,
                },
              ]}
              rowKey="MaTienDo"
              pagination={false}
              bordered
              size="small"
            />
          </>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Thêm nhân viên vào công trình"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateChamCong}>
          <Form.Item
            name="MaCongTrinh"
            label="Công trình"
            rules={[{ required: true, message: "Vui lòng chọn công trình" }]}
          >
            <Input disabled />
          </Form.Item>

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
              {nhanVienList
                .filter(nv => !selectedChamCong?.PhanCong?.some(pc => pc.MaNhanVien === nv.MaNhanVien))
                .map((nv) => (
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
              Thêm nhân viên
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

      {/* Modal danh sách phân công */}
      <Modal
        title={`Chấm công - ${selectedTenCongTrinh}`}
        open={phanCongModalVisible}
        onCancel={() => {
          setPhanCongModalVisible(false);
          setSelectedNhanVienChamCong([]);
          setLoaiNgayChamCong({});
        }}
        footer={[
          <Button key="close" onClick={() => setPhanCongModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="chamcong"
            type="primary"
            loading={loading}
            disabled={selectedNhanVienChamCong.length === 0}
            onClick={handleChamCong}
          >
            Chấm công
          </Button>,
        ]}
        width={600}
      >
        <Table
          dataSource={selectedPhanCong}
          columns={[
            {
              title: "Nhân viên",
              dataIndex: "TenNhanVien",
              key: "TenNhanVien",
              width: "35%",
              ellipsis: true,
            },
            {
              title: "Loại nhân viên",
              dataIndex: "MaLoaiNhanVien",
              key: "MaLoaiNhanVien",
              width: "20%",
              align: "center",
              render: (text) => text === 6 ? "Thợ chính" : "Thợ phụ",
            },
            {
              title: "Loại ngày",
              key: "LoaiNgay",
              width: "30%",
              align: "center",
              render: (_, record) => (
                <Select
                  value={loaiNgayChamCong[record.MaBangPhanCong] || "ngay_thuong"}
                  style={{ width: 120 }}
                  onChange={(value) => setLoaiNgayChamCong((prev) => ({ ...prev, [record.MaBangPhanCong]: value }))}
                  disabled={!selectedNhanVienChamCong.includes(record.MaBangPhanCong)}
                >
                  <Option value="ngay_thuong">Ngày thường</Option>
                  <Option value="cuoi_tuan">Cuối tuần</Option>
                  <Option value="le_tet">Ngày lễ/tết</Option>
                </Select>
              ),
            },
          ]}
          rowKey="MaBangPhanCong"
          pagination={false}
          bordered
          size="small"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedNhanVienChamCong,
            onChange: (selectedRowKeys) => setSelectedNhanVienChamCong(selectedRowKeys),
          }}
        />
      </Modal>
    </div>
  );
};

export default QuanLyChamCong; 