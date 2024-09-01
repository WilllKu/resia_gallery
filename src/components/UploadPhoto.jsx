import React, { useState } from 'react';
import { uploadData, getUrl } from '@aws-amplify/storage';

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
    <div 
      style={styles.container} 
      onDragOver={(e) => e.preventDefault()} 
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleChange}
        disabled={isLoading}
        style={styles.input}
      />
      <button
        onClick={uploadFile}
        disabled={isLoading || files.length === 0}
        style={styles.button}
      >
        {isLoading ? 'Uploading...' : 'Upload Images'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    minHeight: '100px',  // Ensure there's enough space to drop files
    justifyContent: 'center'  // Vertically center content
  },
  input: {
    margin: '5px'
  },
  button: {
    background: '#4CAF50',
    color: 'white',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '5px'
  }
};

export default UploadPhoto;
