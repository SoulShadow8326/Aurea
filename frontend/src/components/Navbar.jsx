import React from 'react';

const Navbar = () => {
  return (
    <div
  style={{
    position: 'fixed',
  
    top: '5%',
    left: '1%',
    width: '98vw',
    padding: '10px 20px',
    backgroundColor: 'rgba(20, 20, 45, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
   height: '8vh',

    
    
  }}
>
      <nav className="d-flex justify-content-between align-items-center">
        <a style={{
            color: '#00f0ff',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
            textDecoration:'none'
          }}
        >
          Nuxe Aurea
        </a>

        <div className="d-none d-sm-flex gap-3 align-items-center">
          <a href="/" className="text-white text-decoration-none">Home</a>
          <a href="/About" className="text-white text-decoration-none">Features</a>
          <a href="/Try" className="text-white text-decoration-none">Generate Image</a>
          <a href="/Results" className="text-white text-decoration-none">Results</a>
        </div>

        <a href="/login" className="d-sm-none text-white text-decoration-none">Login</a>
      </nav>
    </div>
  );
};

export default Navbar;
