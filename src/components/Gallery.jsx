import React from 'react';

const Gallery = ({ images, loading, deleteImage }) => {
  const handleDragStart = (e, image) => {
    console.log("Dragging:", image.key);  // Debug: Check what key is being dragged
    e.dataTransfer.setData("text/plain", image.key); // Change to "text/plain" for broader compatibility

    // Create an image and canvas to set a custom drag image
    var img = new Image();
    img.src = image.url;
    img.onload = () => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      // Set canvas size to a scaled-down version of the image
      canvas.width = img.width * 0.5; // Scaling down to 50%
      canvas.height = img.height * 0.5;

      // Draw the scaled image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set the drag image from the canvas
      e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
    };
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const key = e.dataTransfer.getData("text/plain"); // Change to match "text/plain"
    console.log("Dropped:", key); // Debug: See what is dropped
    try {
      await deleteImage(key);  // Simulating the remove function from a storage API
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div>
      {loading ? <p>Loading images...</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {images.map(image => (
            <div key={image.key}
                 draggable
                 onDragStart={(e) => handleDragStart(e, image)}
                 style={{ width: '100px', height: '100px', cursor: 'grab' }}>
              <img src={image.url} alt={image.key} style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>
      )}
      <div onDrop={handleDrop}
           onDragOver={(e) => e.preventDefault()}
           style={{
             position: 'fixed',
             bottom: '20px',
             right: '20px',
             width: '50px',
             height: '50px',
             backgroundColor: '#ccc',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             border: '2px dashed black'
           }}>
        🗑️
      </div>
    </div>
  );
};

export default Gallery;
