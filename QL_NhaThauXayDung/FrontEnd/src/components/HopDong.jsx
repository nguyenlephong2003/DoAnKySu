import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Spin, message, Pagination, Modal, Form, DatePicker, InputNumber, Select, Upload, Descriptions, Card, Typography, Divider } from 'antd';
import { SearchOutlined, FileOutlined, UserOutlined, PlusOutlined, UploadOutlined, EyeOutlined, InfoCircleOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import dayjs from 'dayjs';
import { uploadFileAndGetURL } from '../services/firebaseStorage';
import ChiTietHopDong from './ChiTietHopDong';
import { ref, deleteObject, getStorage } from 'firebase/storage';
import { app } from '../firebase/config';

const storage = getStorage(app);

const { Title, Text } = Typography;

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "green",
  "Từ chối": "red",
};

const contractTemplates = [
  { 
    value: 'Mau-hop-dong-xay-dung-nha-o',
    label: 'Nhà ở',
    options: [
      { value: 'Mau-hop-dong-xay-dung-nha-o.pdf', label: 'PDF' },
      { value: 'Mau-hop-dong-xay-dung-nha-o.docx', label: 'DOCX' }
    ]
  },
  { 
    value: 'Mau-hop-dong-xay-dung-nha-o-tron-goi',
    label: 'Nhà ở trọn gói',
    options: [
      { value: 'Mau-hop-dong-xay-dung-nha-o-tron-goi.pdf', label: 'PDF' },
      { value: 'Mau-hop-dong-xay-dung-nha-o-tron-goi.docx', label: 'DOCX' }
    ]
  },
  { 
    value: 'Mau-hop-dong-xay-dung-nha-o-phan-tho',
    label: 'Xây thô',
    options: [
      { value: 'Mau-hop-dong-xay-dung-nha-o-phan-tho.pdf', label: 'PDF' },
      { value: 'Mau-hop-dong-xay-dung-nha-o-phan-tho.docx', label: 'DOCX' }
    ]
  }
];

const HopDong = () => {
  const [hopDongList, setHopDongList] = useState([]);
  const [nhanVienList, setNhanVienList] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  }); 
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentContractCode, setCurrentContractCode] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setCurrentUser(userInfo);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch contracts
      const hopDongResponse = await axios.get(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=GET`,
        { withCredentials: true }
      );

      if (hopDongResponse.data.data) {
        setHopDongList(hopDongResponse.data.data);
        setPagination(prev => ({
          ...prev,
          total: hopDongResponse.data.data.length
        }));

        // Fetch employee information for each contract
        const nhanVienMap = {};
        for (const hopDong of hopDongResponse.data.data) {
          if (hopDong.MaNhanVien && !nhanVienMap[hopDong.MaNhanVien]) {
            try {
              const nhanVienResponse = await axios.get(
                `${BASE_URL}NguoiDung_API/NhanVien_API.php?action=getById&MaNhanVien=${hopDong.MaNhanVien}`,
                { withCredentials: true }
              );
              if (nhanVienResponse.data.data) {
                nhanVienMap[hopDong.MaNhanVien] = nhanVienResponse.data.data;
              }
            } catch (error) {
              console.error(`Error fetching employee info for ${hopDong.MaNhanVien}:`, error);
            }
          }
        }
        setNhanVienList(nhanVienMap);
      } else {
        message.error('Không thể lấy dữ liệu hợp đồng');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...hopDongList];

    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaHopDong.toLowerCase().includes(searchText.toLowerCase()) ||
          item.MoTa.toLowerCase().includes(searchText.toLowerCase()) ||
          (nhanVienList[item.MaNhanVien]?.TenNhanVien || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(item => item.TrangThai === selectedStatus);
    }

    filteredData.sort((a, b) => b.MaHopDong.localeCompare(a.MaHopDong));

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

  const handleCreateContract = async (values) => {
    try {
      setLoading(true);
      const contractCode = currentContractCode;
      const fileUrl = form.getFieldValue('FileHopDong');
      const contractData = {
        MaHopDong: contractCode,
        NgayKy: values.NgayKy.format('YYYY-MM-DD'),
        MoTa: values.MoTa,
        TongTien: values.TongTien,
        MaNhanVien: currentUser.MaNhanVien,
        TrangThai: values.TrangThai || 'Chờ duyệt',
        GhiChu: values.GhiChu || '',
        FileHopDong: fileUrl,
        LoaiHopDong: values.LoaiHopDong
      };

      const response = await axios.post(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=POST`,
        contractData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.message === "Tạo hợp đồng thành công.") {
        message.success('Tạo hợp đồng thành công');
        setModalVisible(false);
        form.resetFields();
        setUploadedFile(null);
        setSelectedTemplate(null);
        fetchData();
      } else {
        message.error(response.data.message || 'Tạo hợp đồng thất bại');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      message.error('Lỗi khi tạo hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      setUploadedFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleTemplateChange = async (value) => {
    try {
      setLoading(true);
      // Sinh mã hợp đồng
      const contractCode = 'HD' + dayjs().format('DDMMYYYYHHmmss');
      setCurrentContractCode(contractCode);
      
      // Lấy file mẫu tương ứng
      const response = await fetch(`/src/File/${value}`);
      const blob = await response.blob();
      
      // Xác định định dạng file từ tên file
      const fileExtension = value.split('.').pop().toLowerCase();
      
      // Đặt tên file là mã hợp đồng + định dạng tương ứng
      const file = new File([blob], `${contractCode}.${fileExtension}`, { 
        type: fileExtension === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      // Upload file lên Firebase
      const fileUrl = await uploadFileAndGetURL(file);
      
      // Cập nhật form với URL file
      form.setFieldsValue({
        FileHopDong: fileUrl,
        LoaiHopDong: value
      });
      
      setSelectedTemplate(value);
      message.success('Đã tải file mẫu thành công');
    } catch (error) {
      console.error('Error loading template:', error);
      message.error('Không thể tải file mẫu');
    } finally {
      setLoading(false);
    }
  };

  const showDetailModal = (record) => {
    setSelectedContract(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedContract(record);
    editForm.setFieldsValue({
      ...record,
      NgayKy: dayjs(record.NgayKy)
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (maHopDong) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa hợp đồng này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);

          // Tìm hợp đồng cần xóa để lấy URL file
          const contractToDelete = hopDongList.find(hd => hd.MaHopDong === maHopDong);
          if (!contractToDelete) {
            throw new Error('Không tìm thấy hợp đồng');
          }

          // Xóa file PDF từ Firebase
          if (contractToDelete.FileHopDong) {
            try {
              const fileRef = ref(storage, `contracts/${maHopDong}.pdf`);
              await deleteObject(fileRef);
              console.log('Đã xóa file PDF từ Firebase');
            } catch (error) {
              console.error('Lỗi khi xóa file PDF:', error);
            }
          }

          // Xóa hợp đồng từ database
          const response = await axios.delete(
            `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=DELETE&id=${maHopDong}`,
            { withCredentials: true }
          );

          if (response.data.message === "Xóa hợp đồng thành công.") {
            setDetailModalVisible(false);
            await fetchData();
            message.success({
              content: 'Xóa hợp đồng thành công',
              icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
              style: {
                marginTop: '20vh',
              },
            });
          } else {
            message.error({
              content: response.data.message || 'Xóa hợp đồng thất bại',
              icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
              style: {
                marginTop: '20vh',
              },
            });
          }
        } catch (error) {
          console.error('Error deleting contract:', error);
          message.error({
            content: 'Lỗi khi xóa hợp đồng',
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            style: {
              marginTop: '20vh',
            },
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${BASE_URL}QuanLyCongTrinh_API/HopDong_API.php?action=PUT`,
        {
          ...values,
          TrangThai: 'Chờ duyệt',
          NgayKy: values.NgayKy.format('YYYY-MM-DD')
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.message === "Cập nhật hợp đồng thành công.") {
        setEditModalVisible(false);
        setDetailModalVisible(false);
        editForm.resetFields();
        await fetchData();
        message.success({
          content: 'Cập nhật hợp đồng thành công',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          style: {
            marginTop: '20vh',
          },
        });
      } else {
        message.error({
          content: response.data.message || 'Cập nhật hợp đồng thất bại',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          style: {
            marginTop: '20vh',
          },
        });
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      message.error({
        content: 'Lỗi khi cập nhật hợp đồng',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        style: {
          marginTop: '20vh',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = (fileUrl) => {
    if (!fileUrl) return;
    
    // Sử dụng Google Docs Viewer để xem cả PDF và DOCX
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    
    Modal.info({
      title: 'Xem file hợp đồng',
      width: '80%',
      content: (
        <iframe
          src={googleDocsUrl}
          style={{ width: '100%', height: '80vh', border: 'none' }}
          title="File Viewer"
        />
      ),
      onOk() {},
    });
  };

  return (
    <div className="container mx-auto ">
      <div className="bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">Danh sách hợp đồng</h1>
        
        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Tìm kiếm hợp đồng..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Từ chối">Từ chối</Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Tạo hợp đồng mới
          </Button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table
            dataSource={getPaginatedData()}
            columns={[
              {
                title: 'Mã hợp đồng',
                dataIndex: 'MaHopDong',
                key: 'MaHopDong',
                width: '15%',
              },
              {
                title: 'Ngày ký',
                dataIndex: 'NgayKy',
                key: 'NgayKy',
                width: '10%',
                render: (text) => new Date(text).toLocaleDateString('vi-VN'),
              },
              {
                title: 'Mô tả',
                dataIndex: 'MoTa',
                key: 'MoTa',
                width: '20%',
                ellipsis: true,
              },
              {
                title: 'Tổng tiền',
                dataIndex: 'TongTien',
                key: 'TongTien',
                width: '12%',
                align: 'right',
                render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
              },
              {
                title: 'Trạng thái',
                dataIndex: 'TrangThai',
                key: 'TrangThai',
                width: '10%',
                align: 'center',
                render: (text) => (
                  <Tag color={statusColors[text] || 'default'}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: 'Thao tác',
                key: 'action',
                width: '33%',
                align: 'center',
                render: (_, record) => (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
                    <Button
                      icon={<InfoCircleOutlined />}
                      type="primary"
                      onClick={() => showDetailModal(record)}
                    >
                      Chi tiết
                    </Button>
                    {record.TrangThai !== "Đã duyệt" && (
                      <div style={{ display: "flex", gap: "8px" }}>
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
                          onClick={() => handleDelete(record.MaHopDong)}
                        >
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            rowKey="MaHopDong"
            pagination={false}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: 1000 }}
          />
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={getFilteredData().length}
            onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} mục`}
            showQuickJumper
          />
        </div>
      </div>

      {/* Detail Modal */}
      <ChiTietHopDong
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        contract={selectedContract}
        loading={loading}
        onEdit={(contract) => {
          editForm.setFieldsValue({
            ...contract,
            NgayKy: dayjs(contract.NgayKy)
          });
          setEditModalVisible(true);
          setDetailModalVisible(false);
        }}
        onDelete={handleDelete}
      />

      <Modal
        title="Tạo hợp đồng mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setUploadedFile(null);
          setSelectedTemplate(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateContract}
        >

          <Form.Item
            name="FileHopDong"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="NgayKy"
            label="Ngày ký"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ký' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="MoTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả hợp đồng"
            />
          </Form.Item>

          <Form.Item
            name="TongTien"
            label="Tổng tiền"
            rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập tổng tiền"
            />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            initialValue="Chờ duyệt"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
            />
            
          </Form.Item>
          <Form.Item
            name="LoaiHopDong"
            label="Chọn mẫu hợp đồng"
            rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng' }]}
          >
            <Select
              placeholder="Chọn loại hợp đồng"
              onChange={handleTemplateChange}
              loading={loading}
            >
              {contractTemplates.map(template => (
                <Select.OptGroup key={template.value} label={template.label}>
                  {template.options.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setUploadedFile(null);
                setSelectedTemplate(null);
              }}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Tạo hợp đồng
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa hợp đồng"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="MaHopDong"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="MaNhanVien"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="TrangThai"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="NgayKy"
            label="Ngày ký"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ký' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="MoTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả hợp đồng"
            />
          </Form.Item>

          <Form.Item
            name="TongTien"
            label="Tổng tiền"
            rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập tổng tiền"
            />
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
            />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HopDong; 