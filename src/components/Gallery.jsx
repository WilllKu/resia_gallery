import React from 'react';

const Gallery = ({ images, loading, deleteImage }) => {
  return (
    <div>
      {loading ? <p>Loading images...</p> : images.map(image => (
        <div key={image.key}>
          <img src={image.url} alt={image.key} style={{ width: '100px', height: '100px' }} />
          <button onClick={() => deleteImage(image.key)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
