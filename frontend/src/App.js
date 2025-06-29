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
  const [result, setResult] = useState(null);
  const [simulateType, setSimulateType] = useState('');
  const [showUpload, setShowUpload] = useState(true);
  const [pendingSimType, setPendingSimType] = useState('');

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
        {showUpload ? (
          <>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 16}}>
              <select value={simulateType} onChange={e => setSimulateType(e.target.value)} className="simulate-select">
                <option value="">No Colorblind Simulation</option>
                <option value="protanopia">Protanopia</option>
                <option value="deuteranopia">Deuteranopia</option>
                <option value="tritanopia">Tritanopia</option>
                <option value="achromatopsia">Achromatopsia</option>
              </select>
            </div>
            <form onSubmit={handleUpload} className="upload-zone" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
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
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 16}}>
              <select value={simulateType} onChange={e => setSimulateType(e.target.value)} className="simulate-select">
                <option value="">No Colorblind Simulation</option>
                <option value="protanopia">Protanopia</option>
                <option value="deuteranopia">Deuteranopia</option>
                <option value="tritanopia">Tritanopia</option>
                <option value="achromatopsia">Achromatopsia</option>
              </select>
            </div>
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
          <div style={{marginTop: 32, width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 32, color: '#fff', boxShadow: '0 4px 24px rgba(42,119,245,0.08)', display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'flex-start'}}>
            <div style={{flex: 1, minWidth: 260, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontWeight: 700, marginBottom: 12, fontSize: 20, textAlign: 'center'}}>Palette <span style={{color:'#ff8b00', fontWeight:900, fontSize:22, marginLeft:6}}>*</span></div>
              <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 10, marginBottom: 8}}>
                {result.palette && result.palette.map((c, i) => (
                  <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 48}}>
                    <div style={{width: 38, height: 38, borderRadius: 10, background: c, border: '2px solid #222', position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title={c}></div>
                    <span style={{marginTop: 6, fontSize: 14, color: '#fff', letterSpacing: 0.5, textAlign: 'center', fontWeight: 700}}>{c}</span>
                  </div>
                ))}
              </div>
              <div style={{fontWeight: 700, marginBottom: 8, fontSize: 18, textAlign: 'center'}}>Original <span style={{color:'#ff8b00', fontWeight:900, fontSize:20, marginLeft:4}}>*</span></div>
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                <img src={result.originalImage} alt="original" style={{maxWidth: 220, borderRadius: 12, boxShadow: '0 2px 8px #2977F533', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
              </div>
              {result.simulatedImage && (
                <>
                  <div style={{fontWeight: 700, marginBottom: 8, fontSize: 18, textAlign: 'center'}}>Simulated <span style={{color:'#ff8b00', fontWeight:900, fontSize:20, marginLeft:4}}>*</span></div>
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <img src={result.simulatedImage} alt="simulated" style={{maxWidth: 220, borderRadius: 12, boxShadow: '0 2px 8px #ff8b0033', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
                  </div>
                </>
              )}
            </div>
            <div style={{flex: 2, minWidth: 320, maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {result.geminiFeedback && (
                <>
                  <div style={{fontWeight: 700, marginBottom: 12, fontSize: 20, textAlign: 'center'}}>Gemini Feedback <span style={{color:'#ff8b00', fontWeight:900, fontSize:22, marginLeft:6}}>*</span></div>
                  <div style={{background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: 24, color: '#fff', fontSize: 16, marginBottom: 0, lineHeight: 1.7, whiteSpace: 'pre-line', textAlign: 'left', width: '100%'}}>
                    {result.geminiFeedback}
                  </div>
                </>
              )}
            </div>
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
