import React from 'react';

const Navbar = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1%',
        left: '1%',
        right: '1%',
        backgroundColor: 'rgba(20, 20, 45, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        padding: '10px 20px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        height: 'auto',
        minHeight: '8vh',
      }}
    >
      <nav className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <a
            style={{
              color: '#00f0ff',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
              textDecoration: 'none',
              marginRight: '10vw',
              whiteSpace: 'nowrap',
            }}
            href="/"
          >
            Nuxe Aurea
          </a>
        </div>

        <div className="d-flex gap-4 align-items-center">
          <a href="/" className="text-white text-decoration-none">Home</a>
          <a href="/About" className="text-white text-decoration-none">Features</a>
          <a href="/Try" className="text-white text-decoration-none">Generate Content</a>
          <a href="/Results" className="text-white text-decoration-none">Results</a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
