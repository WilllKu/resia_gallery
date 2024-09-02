import React, { useState } from 'react';
import './Gallery.css';

const Gallery = ({ images, loading, deleteImage, renameImage }) => {
  const [renameData, setRenameData] = useState({ key: '', newName: '', isRenaming: false });
  const [selectedImages, setSelectedImages] = useState(new Set());

  const toggleImageSelection = (key) => {
    if (renameData.isRenaming) return;

    const newSelectedImages = new Set(selectedImages);
    if (newSelectedImages.has(key)) {
      newSelectedImages.delete(key);
    } else {
      newSelectedImages.add(key);
    }
    setSelectedImages(newSelectedImages);
  };

  const handleDoubleClick = (image) => {
    if (renameData.isRenaming && renameData.key === image.key) {
      setRenameData({ key: '', newName: '', isRenaming: false });
    } else {
      setRenameData({ key: image.key, newName: '', isRenaming: true });
    }
  };

  const handleNameChange = (event) => {
    setRenameData(prev => ({ ...prev, newName: event.target.value }));
  };

  const submitRename = async () => {
    if (renameData.newName && renameData.key) {
      const newKey = `photos/${renameData.newName}`;
      const success = await renameImage(renameData.key, newKey);
      if (success) {
        alert('Image renamed successfully');
        setRenameData({ key: '', newName: '', isRenaming: false });
        setSelectedImages(prev => {
          const updated = new Set(prev);
          updated.delete(renameData.key);
          return updated;
        });
      } else {
        alert('Failed to rename image');
      }
    } else {
      alert('Please enter a valid name');
    }
  };

  const handleDragStart = (e) => {
    if (renameData.isRenaming) return;

    const keys = Array.from(selectedImages);
    console.log("Dragging:", keys);
    e.dataTransfer.setData("text/plain", JSON.stringify(keys));

    var img = document.createElement('img');
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const keys = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("Dropped:", keys);
    try {
      for (const key of keys) {
        await deleteImage(key);
      }
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error removing images:', error);
    }
  };

  return (
    <div>
      {loading ? <p>Loading images...</p> : (
        <div className="gallery-container">
          {images.map(image => (
            <div key={image.key}
                 className={`image-container ${selectedImages.has(image.key) ? 'selected' : ''} ${renameData.key === image.key && renameData.isRenaming ? 'renaming' : ''}`}
                 draggable={selectedImages.size > 0 && !renameData.isRenaming}
                 onDragStart={handleDragStart}
                 onDoubleClick={() => handleDoubleClick(image)}
                 onClick={() => toggleImageSelection(image.key)}>
              <img src={image.url} alt={image.key} className="image" />
              {renameData.key === image.key && renameData.isRenaming && (
                <div className="rename-overlay">
                  <input type="text" value={renameData.newName} onChange={handleNameChange} placeholder="Enter new name" className="rename-input"/>
                  <button onClick={submitRename} className="rename-button">Rename</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="trash-bin">
        🗑️
      </div>
    </div>
  );
};

export default Gallery;
