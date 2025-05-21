import React, { useState } from 'react';
import { Button, Upload, message, Spin, Typography, Card } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import BASE_URL from '../Config';

const { Title } = Typography;

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
      link.setAttribute('download', 'backup.sql');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('Sao lưu thành công!');
    } catch (error) {
      console.error('Backup error:', error);
      message.error(error.response?.data?.message || 'Sao lưu thất bại!');
    }
    setLoading(false);
  };

  const handleRestore = async (file) => {
    const formData = new FormData();
    formData.append('sql_file', file);
    setLoading(true);
    try {
      console.log('Calling restore API...');
      const response = await axios.post(`${BASE_URL}SaoLuu_PhucHoi_API/Restore_API.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Restore response:', response);
      message.success(response.data.message);
    } catch (error) {
      console.error('Restore error:', error);
      message.error(error.response?.data?.message || 'Phục hồi thất bại!');
    }
    setLoading(false);
    return false; // Ngăn Upload tự động tải lại
  };

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <Title level={3}>Sao lưu và Phục hồi</Title>
      <Spin spinning={loading}>
        <div style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleBackup}
            loading={loading}
          >
            Sao lưu
          </Button>
        </div>
        <Upload
          beforeUpload={handleRestore}
          accept=".sql"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Tải lên file SQL để phục hồi</Button>
        </Upload>
      </Spin>
    </Card>
  );
};

export default Backup_Restore;
