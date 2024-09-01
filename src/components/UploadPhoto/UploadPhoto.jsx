import React, { useState } from 'react';
import { uploadData, getUrl } from '@aws-amplify/storage';
import './UploadPhoto.css'; // Import the CSS file

const UploadPhoto = ({ addImage }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    } else {
      console.error('No files selected');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      uploadFile();
    }
  };

  const uploadFile = async () => {
    if (files.length === 0) {
      alert('No files selected');
      return;
    }

    try {
      setIsLoading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadConfig = {
          path: `photos/${file.name}`,
          data: file,
        };

        await uploadData(uploadConfig);
        const signedUrl = await getUrl({ path: uploadConfig.path });
        return { key: uploadConfig.path, url: signedUrl.url };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      uploadedImages.forEach(image => addImage(image));

      alert('Files uploaded successfully');
      setFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`Error uploading files: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <input type="file" multiple onChange={handleChange} disabled={isLoading} className="input" />
      <button onClick={uploadFile} disabled={isLoading || files.length === 0} className="button">
        {isLoading ? 'Uploading...' : 'Upload Images'}
      </button>
    </div>
  );
};

export default UploadPhoto;
