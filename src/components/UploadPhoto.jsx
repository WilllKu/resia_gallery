import React, { useState } from 'react';
import { uploadData, getUrl } from '@aws-amplify/storage';

const UploadPhoto = ({ addImage }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setFile(file);
    } else {
        console.error('No file selected or file selection was cancelled');
    }
  };

  const uploadFile = async () => {
    if (!file) {
        alert('No file selected');
        return;
    }

    if (!(file instanceof File)) {
        alert('The selected item is not a file');
        return;
    }

    try {
        setIsLoading(true);
        const uploadConfig = {
            path: `photos/${file.name}`,
            data: file,
        };
        await uploadData(uploadConfig);
        const signedUrl = await getUrl({ path: uploadConfig.path });

        const newImage = { key: uploadConfig.path, url: signedUrl.url };
        addImage(newImage);
        alert('File uploaded successfully');
        setFile(null);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading file: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} disabled={isLoading} />
      <button onClick={uploadFile} disabled={isLoading || !file}>
        {isLoading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default UploadPhoto;