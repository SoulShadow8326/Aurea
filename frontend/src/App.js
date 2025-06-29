import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import './palette.css';
import AppRoutes from './components';

const AskAureaBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="ask-aurea-banner" onClick={() => navigate('/chat')} tabIndex={0} role="button" aria-label="Ask Aurea: Open chat">
      <span className="banner-text">Ask Aurea</span>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="brand-title">Aurea</h1>
          <p className="hero-description">Your personal palette accessibility tool</p>
          <div className="action-buttons" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16}}>
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
          <button 
            className="secondary-btn" 
            style={{marginTop: 18, background: "rgb(255, 255, 255)", color: "#222", fontWeight: 700, border: "none", boxShadow: "none"}}
            onClick={() => navigate('/queries')}
          >
            FAQ
          </button>
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
  const [result, setResult] = useState(null);
  const [simulateType, setSimulateType] = useState('');
  const [showUpload, setShowUpload] = useState(true);
  const [pendingSimType, setPendingSimType] = useState('');
  const [modalImg, setModalImg] = useState(null);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files.slice(0, 1));
    setShowUpload(false);
  };

  const removeFile = () => {
    setSelectedFiles([]);
    setResult(null);
    setShowUpload(true);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    if (simulateType) formData.append('simulateType', simulateType);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
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
    <div className="page upload-page" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      <div className="upload-container" style={{maxWidth: 480, width: '100%', margin: '32px auto 0 auto'}}>
        <div className="page-header" style={{marginBottom: 24, justifyContent: 'flex-start', gap: 16}}>
          <h2 style={{ color: '#2977F5', fontSize: '1.6rem', marginRight: 16, marginBottom: 0 }}>Analyze Image</h2>
          <button className="back-btn" style={{height: 36, padding: '0 18px'}} onClick={() => navigate('/')}>Back</button>
        </div>
        {showUpload ? (
          <>
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 18, gap: 12}}>
              <select value={simulateType} onChange={e => setSimulateType(e.target.value)} className="simulate-select" style={{minWidth: 220, maxWidth: 260, background: 'transparent', color: '#ff8b00', border: '2px solid #ff8b00', fontWeight: 700}}>
                <option value="" style={{color: '#ff8b00', fontWeight: 700}}>No Colorblind Simulation</option>
                <option value="protanopia">Protanopia</option>
                <option value="deuteranopia">Deuteranopia</option>
                <option value="tritanopia">Tritanopia</option>
                <option value="achromatopsia">Achromatopsia</option>
              </select>
            </div>
            <form onSubmit={handleUpload} className="upload-zone" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 320, maxWidth: 420, margin: '0 auto'}}>
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
            </form>
          </>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 18, gap: 12}}>
              <select value={simulateType} onChange={e => setSimulateType(e.target.value)} className="simulate-select" style={{minWidth: 220, maxWidth: 260, background: 'transparent', color: '#ff8b00', border: '2px solid #ff8b00', fontWeight: 700}}>
                <option value="" style={{color: '#ff8b00', fontWeight: 700}}>No Colorblind Simulation</option>
                <option value="protanopia">Protanopia</option>
                <option value="deuteranopia">Deuteranopia</option>
                <option value="tritanopia">Tritanopia</option>
                <option value="achromatopsia">Achromatopsia</option>
              </select>
            </div>
            <div className="files-preview" style={{width: '100%'}}>
              <div className="files-list" style={{maxWidth: 420, margin: '0 auto'}}>
                <div className="file-item">
                  <img src={URL.createObjectURL(selectedFiles[0])} alt="Preview" className="file-thumbnail" />
                  <div className="file-info">
                    <p className="file-name">{selectedFiles[0].name}</p>
                    <p className="file-size">{(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button className="remove-file-btn" onClick={removeFile}>×</button>
                </div>
              </div>
              <div className="upload-actions" style={{justifyContent: 'flex-start'}}>
                <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Analyzing...' : 'Analyze'}
                </button>
                <button className="cancel-btn" type="button" onClick={removeFile}>
                  Select Another Image
                </button>
              </div>
            </div>
          </>
        )}
        {result && !showUpload && (
          <div className="palette-section" style={{width: 'calc(100vw - 48px)', maxWidth: 'calc(100vw - 48px)', marginLeft: 'calc(-50vw + 50% + 24px)', background: 'rgba(24,28,36,0.45)', borderRadius: 32, boxShadow: '0 16px 64px 0 rgba(42,119,245,0.22)', padding: '32px 0', display: 'flex', justifyContent: 'center', alignItems: 'stretch', border: '1.5px solid #23283a'}}>
            <div className="palette-col">
              <div className="palette-label">Original</div>
              <div className="palette-img-row">
                <img src={result.originalImage} alt="original" className="palette-img" onClick={() => setModalImg(result.originalImage)} />
              </div>
            </div>
            <div className="palette-col">
              {result.simulatedImage && (
                <>
                  <div className="palette-label">Simulated</div>
                  <div className="palette-img-row">
                    <img src={result.simulatedImage} alt="simulated" className="palette-img" onClick={() => setModalImg(result.simulatedImage)} />
                  </div>
                </>
              )}
            </div>
            <div className="palette-col">
              <div className="palette-label">Palette</div>
              <div className="palette-row" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                {result.palette && result.palette.map((c, i) => (
                  <div key={i} className="palette-swatch-col" style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
                    <div className="palette-swatch" style={{background: c, width: 32, height: 32, marginRight: 8}} title={c}></div>
                    <span className="palette-swatch-label">{c}</span>
                  </div>
                ))}
              </div>
              {result.geminiFeedback && (
                <>
                  <div className="palette-label" style={{marginTop: 16}}>Gemini Feedback</div>
                  <div className="palette-feedback">{result.geminiFeedback}</div>
                </>
              )}
            </div>
            {modalImg && (
              <div className="palette-img-modal-bg" onClick={() => setModalImg(null)}>
                <img src={modalImg} alt="preview" className="palette-img-modal-img" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page gallery-page">
      <div className="gallery-container">
        <div className="page-header" style={{justifyContent: 'center'}}>
          <h2 style={{
            fontWeight: 900,
            fontSize: "2.1rem",
            letterSpacing: "0.04em",
            marginBottom: "1.5rem",
            textAlign: "center",
            textShadow: "0 2px 8px rgba(254,173,19,0.18)",
            width: '100%',
            background: 'linear-gradient(135deg, #2a77f5 0%, #ff8b00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            About Aurea
          </h2>
        </div>
        <div className="empty-gallery" style={{textAlign: "center"}}>
          <h3 style={{fontWeight: 700, fontSize: "1.35rem", color: "#ffffff88", marginBottom: 12, textShadow: "0 1px 4px rgba(254,173,19,0.13)"}}>What is Aurea?</h3>
          <p style={{fontSize: "1.18rem", lineHeight: 1.7, color: "#ffffff88", maxWidth: 540, margin: "0 auto", fontWeight: 500, textShadow: "0 1px 4px rgba(254,173,19,0.10)"}}>
            Aurea is a tool that helps you analyze image palettes for accessibility and color harmony. Upload an image to see the extracted palette and how it appears to users with different types of color vision. Powered by AI, Aurea provides palette analysis, accessibility checks, and artistic descriptions.
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto'}}>
            <button className="primary-btn" style={{fontSize: '1.1rem', fontWeight: 700, padding: '0.9rem 2.5rem', flex: 1, minWidth: 160}} onClick={() => navigate('/try')}>Try Aurea</button>
            <button className="secondary-btn" style={{fontSize: '1.1rem', fontWeight: 700, padding: '0.9rem 2.5rem', flex: 1, minWidth: 160}} onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <AppRoutes />
      {(location.pathname === "/try" || location.pathname === "/about" || location.pathname === "/queries") && <AskAureaBanner />}
    </div>
  );
}

export { HomePage, TryPage, AboutPage };
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
