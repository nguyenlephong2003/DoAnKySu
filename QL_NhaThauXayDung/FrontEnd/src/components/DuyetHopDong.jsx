import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Spin, message, Pagination, Modal, Form, Upload } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, FileAddOutlined, UploadOutlined, FileOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';
import DetailBaoGiaModal from './ChiTietBaoGia';
import { storage } from '../Config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { docx } from 'docx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { confirm } = Modal;

const DuyetHopDong = () => {
  const [bangBaoGiaList, setBangBaoGiaList] = useState([]);
  const [loaiBaoGiaList, setLoaiBaoGiaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentBaoGia, setCurrentBaoGia] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteForm] = Form.useForm();
  const [currentAction, setCurrentAction] = useState(null);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [contractForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [contractTemplate, setContractTemplate] = useState(null);

  const statusColors = {
    'Chờ duyệt': 'orange',
    'Đã duyệt': 'green',
    'Từ chối': 'red'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const baoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=GET`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (baoGiaResponse.data.status === 'success') {
        // Filter only approved quotes
        const approvedQuotes = baoGiaResponse.data.data.filter(item => item.TrangThai === 'Đã duyệt');
        setBangBaoGiaList(approvedQuotes);
        setPagination(prev => ({
          ...prev,
          total: approvedQuotes.length
        }));
      } else {
        message.error('Không thể lấy dữ liệu báo giá');
      }

      const loaiBaoGiaResponse = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getAllLoaiBaoGia`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (loaiBaoGiaResponse.data.status === 'success') {
        setLoaiBaoGiaList(loaiBaoGiaResponse.data.data);
      } else {
        message.error('Không thể lấy dữ liệu loại báo giá');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData = [...bangBaoGiaList];

    if (searchText) {
      filteredData = filteredData.filter(
        item => 
          item.MaBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TenBaoGia.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.TenLoaiBaoGia && item.TenLoaiBaoGia.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (selectedLoai !== 'all') {
      filteredData = filteredData.filter(item => item.MaLoai === selectedLoai);
    }

    filteredData.sort((a, b) => b.MaBaoGia.localeCompare(a.MaBaoGia));

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

  const handleDuyet = async (record) => {
    setCurrentBaoGia(record);
    setCurrentAction('duyet');
    setNoteModalVisible(true);
  };

  const handleTuChoi = async (record) => {
    setCurrentBaoGia(record);
    setCurrentAction('tuChoi');
    setNoteModalVisible(true);
  };

  const handleLapHopDong = async (record) => {
    setCurrentBaoGia(record);
    setContractModalVisible(true);
  };

  const handleNoteSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: 'PUT',
        url: `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=updateBangBaoGia`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          MaBaoGia: currentBaoGia.MaBaoGia,
          TenBaoGia: currentBaoGia.TenBaoGia,
          MaLoai: currentBaoGia.MaLoai,
          TrangThai: currentAction === 'duyet' ? 'Đã duyệt' : 'Từ chối',
          GhiChu: values.GhiChu,
          ChiTietLoaiBaoGia: currentBaoGia.ChiTietLoaiBaoGia || []
        }
      });

      if (response.data.status === 'success') {
        message.success(currentAction === 'duyet' ? 'Duyệt báo giá thành công' : 'Từ chối báo giá thành công');
        setNoteModalVisible(false);
        noteForm.resetFields();
        fetchData();
      } else {
        message.error(response.data.message || (currentAction === 'duyet' ? 'Duyệt báo giá thất bại' : 'Từ chối báo giá thất bại'));
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra loại file
  const beforeUpload = (file) => {
    const isWord = file.type === 'application/msword' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isWord) {
      message.error('Chỉ chấp nhận file Word (.doc, .docx)!');
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File không được vượt quá 10MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  // Hàm tạo hợp đồng từ template
  const generateContract = async (baoGiaData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Lấy thông tin chi tiết báo giá
      const response = await axios.get(
        `${BASE_URL}BaoGiaHopDong_API/BaoGia_LoaiBaoGia_API.php?action=getQuotationDetails&MaBaoGia=${baoGiaData.MaBaoGia}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        const chiTietBaoGia = response.data.data.chi_tiet_bao_gia || [];
        
        // Tạo document mới
        const doc = new docx.Document({
          sections: [{
            properties: {},
            children: [
              new docx.Paragraph({
                text: "HỢP ĐỒNG",
                heading: docx.HeadingLevel.HEADING_1,
                alignment: docx.AlignmentType.CENTER
              }),
              new docx.Paragraph({
                text: `Số hợp đồng: ${baoGiaData.MaBaoGia}`,
                spacing: { after: 200 }
              }),
              new docx.Paragraph({
                text: `Tên hợp đồng: ${baoGiaData.TenBaoGia}`,
                spacing: { after: 200 }
              }),
              new docx.Paragraph({
                text: "CHI TIẾT BÁO GIÁ:",
                heading: docx.HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              }),
              new docx.Table({
                width: {
                  size: 100,
                  type: docx.WidthType.PERCENTAGE,
                },
                rows: [
                  new docx.TableRow({
                    children: [
                      new docx.TableCell({
                        children: [new docx.Paragraph("STT")],
                        width: { size: 10, type: docx.WidthType.PERCENTAGE }
                      }),
                      new docx.TableCell({
                        children: [new docx.Paragraph("Nội dung")],
                        width: { size: 60, type: docx.WidthType.PERCENTAGE }
                      }),
                      new docx.TableCell({
                        children: [new docx.Paragraph("Giá")],
                        width: { size: 30, type: docx.WidthType.PERCENTAGE }
                      })
                    ]
                  }),
                  ...chiTietBaoGia.map((item, index) => 
                    new docx.TableRow({
                      children: [
                        new docx.TableCell({
                          children: [new docx.Paragraph((index + 1).toString())]
                        }),
                        new docx.TableCell({
                          children: [new docx.Paragraph(item.NoiDung)]
                        }),
                        new docx.TableCell({
                          children: [new docx.Paragraph(item.GiaBaoGia.toLocaleString('vi-VN') + ' VNĐ')]
                        })
                      ]
                    })
                  )
                ]
              })
            ]
          }]
        });

        // Tạo file và tải xuống
        const blob = await docx.Packer.toBlob(doc);
        const fileName = `HopDong_${baoGiaData.MaBaoGia}.docx`;
        saveAs(blob, fileName);

        // Upload file lên Firebase
        const storageRef = ref(storage, `hopdong/${baoGiaData.MaBaoGia}/${fileName}`);
        await uploadBytes(storageRef, blob);
        const fileUrl = await getDownloadURL(storageRef);

        return fileUrl;
      }
    } catch (error) {
      console.error('Lỗi khi tạo hợp đồng:', error);
      throw error;
    }
  };

  const handleContractSubmit = async (values) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      // Tạo và tải xuống file hợp đồng
      const fileUrl = await generateContract(currentBaoGia);

      // Gửi thông tin hợp đồng lên server
      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}BaoGiaHopDong_API/HopDong_API.php?action=createHopDong`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          MaBaoGia: currentBaoGia.MaBaoGia,
          TenHopDong: values.TenHopDong,
          NgayKy: values.NgayKy,
          FileHopDong: fileUrl,
          GhiChu: values.GhiChu
        }
      });

      if (response.data.status === 'success') {
        message.success('Lập hợp đồng thành công');
        setContractModalVisible(false);
        contractForm.resetFields();
        fetchData();
      } else {
        message.error(response.data.message || 'Lập hợp đồng thất bại');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const showDetailModal = (record) => {
    setCurrentBaoGia(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã báo giá',
      dataIndex: 'MaBaoGia',
      key: 'MaBaoGia',
    },
    {
      title: 'Tên báo giá',
      dataIndex: 'TenBaoGia',
      key: 'TenBaoGia',
    },
    {
      title: 'Loại báo giá',
      dataIndex: 'TenLoaiBaoGia',
      key: 'TenLoaiBaoGia',
      render: (text, record) => text || `Loại ${record.MaLoai}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      render: (text) => (
        <Tag color={statusColors[text] || 'default'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<InfoCircleOutlined />} 
            type="primary"
            onClick={() => showDetailModal(record)}
          >
            Chi tiết
          </Button>
          {record.TrangThai === 'Chờ duyệt' && (
            <>
              <Button 
                icon={<CheckCircleOutlined />} 
                type="primary"
                style={{ backgroundColor: '#52c41a' }}
                onClick={() => handleDuyet(record)}
              >
                Duyệt
              </Button>
              <Button 
                icon={<CloseCircleOutlined />} 
                danger
                onClick={() => handleTuChoi(record)}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.TrangThai === 'Đã duyệt' && (
            <Button
              icon={<FileAddOutlined />}
              type="primary"
              style={{ 
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                color: 'white',
                fontWeight: 'bold'
              }}
              onClick={() => handleLapHopDong(record)}
            >
              Lập hợp đồng
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'File hợp đồng',
      key: 'FileHopDong',
      render: (_, record) => (
        record.FileHopDong ? (
          <Button
            type="link"
            icon={<FileOutlined />}
            onClick={() => window.open(record.FileHopDong, '_blank')}
          >
            Xem file
          </Button>
        ) : (
          <span>Chưa có file</span>
        )
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 uppercase tracking-wide border-b-4 border-blue-500 pb-2 mb-6">
        Lập hợp đồng 
      </h1>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Tìm kiếm báo giá..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        
        <Select
          placeholder="Chọn loại báo giá"
          style={{ width: 200 }}
          value={selectedLoai}
          onChange={value => setSelectedLoai(value)}
        >
          <Option value="all">Tất cả loại</Option>
          {loaiBaoGiaList.map(loai => (
            <Option key={loai.MaLoai} value={loai.MaLoai}>
              {loai.TenLoai}
            </Option>
          ))}
        </Select>
      </div>
      
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
          onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
          style={{ marginTop: 16, textAlign: 'right' }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} mục`}
        />
      </Spin>
      
      <DetailBaoGiaModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        baoGia={currentBaoGia}
      />

      <Modal
        title={currentAction === 'duyet' ? "Duyệt báo giá" : "Từ chối báo giá"}
        open={noteModalVisible}
        onCancel={() => {
          setNoteModalVisible(false);
          noteForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={noteForm}
          onFinish={handleNoteSubmit}
          layout="vertical"
        >
          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea 
              rows={4} 
              placeholder={currentAction === 'duyet' ? "Nhập ghi chú khi duyệt báo giá (không bắt buộc)" : "Nhập lý do từ chối báo giá (không bắt buộc)"}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button 
                onClick={() => {
                  setNoteModalVisible(false);
                  noteForm.resetFields();
                }}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
              >
                {currentAction === 'duyet' ? 'Duyệt' : 'Từ chối'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lập hợp đồng"
        open={contractModalVisible}
        onCancel={() => {
          setContractModalVisible(false);
          contractForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={contractForm}
          onFinish={handleContractSubmit}
          layout="vertical"
        >
          <Form.Item
            name="TenHopDong"
            label="Tên hợp đồng"
            rules={[{ required: true, message: 'Vui lòng nhập tên hợp đồng' }]}
          >
            <Input placeholder="Nhập tên hợp đồng" />
          </Form.Item>

          <Form.Item
            name="NgayKy"
            label="Ngày ký"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ký' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => {
                  setContractModalVisible(false);
                  contractForm.resetFields();
                }}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={uploading}
              >
                Lập hợp đồng
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DuyetHopDong; 