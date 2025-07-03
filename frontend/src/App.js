import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = 'http://localhost:5000'; // Change if backend is hosted elsewhere

function App() {
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Fetch gallery images
  useEffect(() => {
    fetch(`${BACKEND_URL}/photos`)
      .then(res => res.json())
      .then(data => setGallery(data.reverse()))
      .catch(() => setError('Could not load gallery.'));
  }, []);

  // Handle photo upload
  const handlePhoto = async (e) => {
    setError('');
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const newPhoto = await res.json();
      setGallery([newPhoto, ...gallery]);
    } catch {
      setError('Upload failed.');
    }
    setUploading(false);
  };

  // Open camera
  const openCamera = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="wedding-app">
      <header>
        <h1>Nemer & Thouraya</h1>
        <h2>Wedding Gallery</h2>
        <p className="subtitle">Share your moments! Take a photo and it will appear here for everyone to see.</p>
      </header>
      <div className="camera-section">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handlePhoto}
        />
        <button
          className="camera-btn"
          onClick={() => {
            fileInputRef.current.setAttribute('capture', 'environment');
            openCamera();
          }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Take a Photo'}
        </button>
        <button
          className="camera-btn"
          style={{ background: 'linear-gradient(90deg, #e6c9a8 0%, #a67c52 100%)', color: '#3a2c1a', marginTop: 8 }}
          onClick={() => {
            fileInputRef.current.removeAttribute('capture');
            openCamera();
          }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload from Gallery'}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="gallery-section">
        <h3>Live Gallery</h3>
        <div className="gallery-grid">
          {gallery.length === 0 && <p>No photos yet. Be the first to share!</p>}
          {gallery.map((img, idx) => (
            <div className="gallery-item" key={img.filename || idx}>
              <img src={`${BACKEND_URL}/uploads/${img.filename}`} alt="Wedding moment" />
              <a href={`${BACKEND_URL}/uploads/${img.filename}`} download className="download-link">Download</a>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <p>With love, Nemer & Thouraya &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
