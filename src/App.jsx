import { useState, useEffect } from 'react'
import './App.css'

import UploadPhoto from './components/UploadPhoto/UploadPhoto';
import Gallery from './components/Gallery/Gallery';
import { copy, getUrl, list, remove } from '@aws-amplify/storage';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await list({ path: 'photos/' });
      if (response && response.items) {
        const imageUrls = await Promise.all(
          response.items.map(async item => {
            const signedUrl = await getUrl( { path: item.path } );
            return { key: item.path, url: signedUrl.url };
          })
        );
        setImages(imageUrls);
        console.log("Image URLs set:", imageUrls);
      } else {
        console.log("No items found in response");
      }
    } catch (error) {
      console.error('Error retrieving images:', error);
    }
    setLoading(false);
  };

  const deleteImage = async (key) => {
    try {
      await remove( { path: key } );
      setImages(prevImages => prevImages.filter(image => image.key !== key));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const renameImage = async (oldKey, newKey) => {
    try {
      await copy({
        source: {
          path: oldKey,
        },
        destination: {
          path: newKey,
        },
      });
      await remove({ path: oldKey });
      const signedUrl = await getUrl({ path: newKey });
      setImages(prevImages =>
        prevImages.map(image =>
          image.key === oldKey ? { key: newKey, url: signedUrl.url } : image
        )
      );
      return true;
    } catch (error) {
      console.error('Error renaming image:', error);
      return false;
    }
  };

  const addImage = (newImage) => {
    setImages(prevImages => [...prevImages, newImage]);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <UploadPhoto addImage={addImage}/>
      <Gallery loading={loading} images={images} deleteImage={deleteImage} renameImage={renameImage}/>
    </div>
  )
}

export default App
