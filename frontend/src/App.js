import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="brand-title">Aurea</h1>
          <p className="hero-description">Analyze image palettes for accessibility and color harmony</p>
          <div className="action-buttons">
            <button 
              className="primary-btn" 
              onClick={() => navigate('/try')}
            >
              Try Aurea
            </button>
            <button 
              className="secondary-btn" 
              onClick={() => navigate('/about')}
            >
              About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} is too large (>5MB)`);
        return false;
      }
      return true;
    });
    setSelectedFiles(validFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} is too large (>5MB)`);
        return false;
      }
      return true;
    });
    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedFiles([]);
        showNotification(result.message, 'success');
        if (result.skipped_files && result.skipped_files.length > 0) {
          setTimeout(() => {
            showNotification(`${result.skipped_files.length} files were skipped`, 'error');
          }, 2000);
        }
        navigate('/try');
      } else {
        const error = await response.json();
        showNotification(error.message || 'Upload failed');
      }
    } catch (error) {
      showNotification('Network error - please check your connection');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page upload-page">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            className="notification-close" 
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}
      <div className="upload-container">
        <div className="page-header">
          <h2>Upload Photos</h2>
          <button className="back-btn" onClick={() => navigate('/')}>
            Back
          </button>
        </div>
        
        <div 
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          {selectedFiles.length > 0 ? (
            <div className="files-preview">
              <div className="files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="file-thumbnail"
                    />
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="upload-actions">
                <button 
                  className="upload-btn" 
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}`}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => setSelectedFiles([])}
                >
                  Clear All
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">+</div>
              <h3>Drop your photos here</h3>
              <p>or click to browse (multiple files supported)</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/photos');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const performSyncIfNeeded = async () => {
    try {
      const statusResponse = await fetch('http://localhost:5001/api/sync/status');
      const statusData = await statusResponse.json();
      
      if (statusData.needs_sync && statusData.missing_files > 0) {
        const syncResponse = await fetch('http://localhost:5001/api/sync', {
          method: 'POST'
        });
        
        if (syncResponse.ok) {
          await fetchPhotos();
        }
      }
    } catch (error) {
      console.error('Error during sync:', error);
    }
  };

  const handleVote = async (photoId, voteType) => {
    try {
      const response = await fetch(`http://localhost:5001/api/photos/${photoId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: voteType }),
      });
      
      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    fetchPhotos();
    performSyncIfNeeded();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        performSyncIfNeeded();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="page gallery-page">
      {selectedPhoto && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img
              src={`http://localhost:5001${selectedPhoto.filename}`}
              alt={selectedPhoto.original_name}
              className="modal-image"
            />
            <div className="modal-info">
              <h3>{selectedPhoto.original_name}</h3>
              <div className="modal-actions">
                <button 
                  className={`vote-btn up ${selectedPhoto.user_vote === 'up' ? 'active' : ''}`}
                  onClick={() => handleVote(selectedPhoto.id, 'up')}
                >
                  ↑ {selectedPhoto.likes}
                </button>
                <button 
                  className={`vote-btn down ${selectedPhoto.user_vote === 'down' ? 'active' : ''}`}
                  onClick={() => handleVote(selectedPhoto.id, 'down')}
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="gallery-container">
        <div className="page-header">
          <h2>Gallery</h2>
          <div className="header-actions">
            <button className="add-btn" onClick={() => navigate('/upload')}>
              + Add Photos
            </button>
            <button className="back-btn" onClick={() => navigate('/')}>
              Back
            </button>
          </div>
        </div>
        
        <div className="gallery-grid">
          {photos.length === 0 ? (
            <div className="empty-gallery">
              <div className="empty-icon">No Photos</div>
              <h3>No photos yet</h3>
              <p>Start building your gallery</p>
              <button 
                className="primary-btn" 
                onClick={() => navigate('/upload')}
              >
                Upload First Photo
              </button>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="photo-card">
                <img
                  src={`http://localhost:5001${photo.filename}`}
                  alt={photo.original_name}
                  loading="lazy"
                  onClick={() => openModal(photo)}
                  className="photo-thumbnail"
                />
                <div className="photo-actions">
                  <button 
                    className={`vote-btn up ${photo.user_vote === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote(photo.id, 'up')}
                  >
                    ↑ {photo.likes}
                  </button>
                  <button 
                    className={`vote-btn down ${photo.user_vote === 'down' ? 'active' : ''}`}
                    onClick={() => handleVote(photo.id, 'down')}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/try" element={<GalleryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
