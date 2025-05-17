import React, { useState } from 'react';
import { uploadMultipleFiles } from '../services/firebaseStorage';

const ContractUpload = () => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Upload files và lấy URLs
      const downloadUrls = await uploadMultipleFiles(files);
      setUrls(downloadUrls);
      
      console.log('Uploaded URLs:', downloadUrls);
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Mẫu Hợp Đồng</h2>
      
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept=".doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={files.length === 0 || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Đang upload...' : 'Upload Files'}
      </button>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}

      {urls.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Download Links:</h3>
          <ul className="list-disc pl-5">
            {urls.map((url, index) => (
              <li key={index}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {files[index]?.name || `File ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContractUpload; 