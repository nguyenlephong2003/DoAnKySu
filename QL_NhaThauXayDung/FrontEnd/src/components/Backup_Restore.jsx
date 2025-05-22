import React, { useState } from 'react';
import { Button, Upload, message, Spin, Typography, Card, Alert, Divider } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const { Title, Text, Paragraph } = Typography;

const Backup_Restore = () => {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      console.log('Calling backup API...');
      const response = await axios.get(`${BASE_URL}SaoLuu_PhucHoi_API/Backup_Api.php`, {
        responseType: 'blob',
      });
      console.log('Backup response:', response);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Tạo tên file với timestamp
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fileName = `backup_${timestamp}.sql`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Sao lưu thành công!');
    } catch (error) {
      console.error('Backup error:', error);
      const errorMsg = error.response?.data?.message || 'Sao lưu thất bại!';
      message.error(errorMsg);
    }
    setLoading(false);
  };

  const handleRestore = async (file) => {
    // Validate file
    if (!file.name.toLowerCase().endsWith('.sql')) {
      message.error('Vui lòng chọn file có định dạng .sql');
      return false;
    }

    if (file.size === 0) {
      message.error('File không được rỗng');
      return false;
    }

    // Show file info
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    message.info(`Đang tải file: ${file.name} (${fileSizeMB} MB)`);

    const formData = new FormData();
    formData.append('sql_file', file);
    
    setLoading(true);
    try {
      console.log('Calling restore API with uploaded file...');
      console.log('File info:', { name: file.name, size: file.size, type: file.type });
      
      const response = await axios.post(`${BASE_URL}SaoLuu_PhucHoi_API/Restore_API.php`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        timeout: 300000 // 5 minutes timeout for large files
      });
      
      console.log('Restore response:', response);
      
      if (response.data.status === 'success') {
        message.success(response.data.message || 'Phục hồi database thành công!');
      } else {
        throw new Error(response.data.message || 'Phục hồi thất bại');
      }
      
    } catch (error) {
      console.error('Restore error:', error);
      
      let errorMsg = 'Phục hồi thất bại!';
      
      if (error.response) {
        // Server responded with error status
        errorMsg = error.response.data?.message || 
                  `Lỗi server: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMsg = 'Quá trình phục hồi mất quá nhiều thời gian. File có thể quá lớn.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      message.error(errorMsg);
    }
    
    setLoading(false);
    return false; // Ngăn Upload tự động tải lại
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>
        Sao lưu và Phục hồi Database
      </Title>
      
      <Spin spinning={loading} tip={loading ? "Đang xử lý..." : ""}>
        {/* Backup Section */}
        <div style={{ marginBottom: 30 }}>
          <Title level={4}>📥 Sao lưu Database</Title>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleBackup}
            loading={loading}
            size="large"
            style={{ marginBottom: 10 }}
          >
            Tải xuống file sao lưu
          </Button>
          <div>
            <Text type="secondary">
              File backup sẽ được tải xuống với tên có định dạng: backup_YYYY-MM-DD_HH-MM-SS.sql
            </Text>
          </div>
        </div>

        <Divider />

        {/* Restore Section */}
        <div style={{ marginBottom: 30 }}>
          <Title level={4}>📤 Phục hồi Database</Title>
          
          <Upload
            beforeUpload={handleRestore}
            accept=".sql"
            showUploadList={false}
            disabled={loading}
          >
            <Button 
              icon={<UploadOutlined />} 
              size="large"
              disabled={loading}
              loading={loading}
            >
              Chọn file SQL để phục hồi
            </Button>
          </Upload>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              Chỉ chấp nhận file .sql và file không được rỗng
            </Text>
          </div>
        </div>

        <Divider />
      </Spin>
    </Card>
  );
};

export default Backup_Restore;