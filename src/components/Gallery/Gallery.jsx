import React, { useState } from 'react';
import './Gallery.css'; // Make sure the path is correct based on your file structure

const Gallery = ({ images, loading, deleteImage }) => {
  const [selectedImages, setSelectedImages] = useState(new Set());

  const toggleImageSelection = (key) => {
    const newSelectedImages = new Set(selectedImages);
    if (newSelectedImages.has(key)) {
      newSelectedImages.delete(key);
    } else {
      newSelectedImages.add(key);
    }
    setSelectedImages(newSelectedImages);
  };

  const handleDragStart = (e) => {
    const keys = Array.from(selectedImages);
    console.log("Dragging:", keys);
    e.dataTransfer.setData("text/plain", JSON.stringify(keys));

    var img = document.createElement('img'); // Using a placeholder image for the drag
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
      setSelectedImages(new Set()); // Clear selection after deleting
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
                 className={`image-container ${selectedImages.has(image.key) ? 'selected' : ''}`}
                 draggable={selectedImages.size > 0}
                 onDragStart={handleDragStart}
                 onClick={() => toggleImageSelection(image.key)}>
              <img src={image.url} alt={image.key} className="image" />
            </div>
          ))}
        </div>
      )}
      <div onDrop={handleDrop}
           onDragOver={(e) => e.preventDefault()}
           className="trash-bin">
        🗑️
      </div>
    </div>
  );
};

export default Gallery;
