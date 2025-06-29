import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import './App.css';
import AppRoutes from './components';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="brand-title">Aurea</h1>
          <p className="hero-description">Your personal palette accessibility tool</p>
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
              About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TryPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files.slice(0, 1));
  };

  const removeFile = () => {
    setSelectedFiles([]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        showNotification('Analysis complete', 'success');
      } else {
        showNotification('Analysis failed');
      }
    } catch (error) {
      showNotification('Network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page upload-page">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      <div className="upload-container">
        <div className="page-header">
          <h2 style={{ color: '#2977F5' }}>Analyze Image</h2>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
        </div>
        <form onSubmit={handleUpload} className="upload-zone" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          {selectedFiles.length > 0 ? (
            <div className="files-preview">
              <div className="files-list">
                <div className="file-item">
                  <img src={URL.createObjectURL(selectedFiles[0])} alt="Preview" className="file-thumbnail" />
                  <div className="file-info">
                    <p className="file-name">{selectedFiles[0].name}</p>
                    <p className="file-size">{(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button className="remove-file-btn" onClick={removeFile}>×</button>
                </div>
              </div>
              <div className="upload-actions">
                <button className="upload-btn" type="submit" disabled={uploading}>
                  {uploading ? 'Analyzing...' : 'Analyze'}
                </button>
                <button className="cancel-btn" type="button" onClick={removeFile}>
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">+</div>
              <h3>Drop your image here</h3>
              <p>or click to browse</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page gallery-page">
      <div className="gallery-container">
        <div className="page-header">
          <h2 style={{fontWeight: 900, fontSize: "2.1rem", letterSpacing: "0.04em", color: "#ff8b00", marginBottom: "1.5rem", textAlign: "center", textShadow: "0 2px 8px rgba(254,173,19,0.18)"}}>About Aurea</h2>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
        </div>
        <div className="empty-gallery" style={{textAlign: "center"}}>
          <h3 style={{fontWeight: 700, fontSize: "1.35rem", color: "#ffffff88", marginBottom: 12, textShadow: "0 1px 4px rgba(254,173,19,0.13)"}}>What is Aurea?</h3>
          <p style={{fontSize: "1.18rem", lineHeight: 1.7, color: "#ffffff88", maxWidth: 540, margin: "0 auto", fontWeight: 500, textShadow: "0 1px 4px rgba(254,173,19,0.10)"}}>
            Aurea is a tool that helps you analyze image palettes for accessibility and color harmony. Upload an image to see the extracted palette and how it appears to users with different types of color vision. Powered by AI, Aurea provides palette analysis, accessibility checks, and artistic descriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export { HomePage, TryPage, AboutPage };
export default App;
