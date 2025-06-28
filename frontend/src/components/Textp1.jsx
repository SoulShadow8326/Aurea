import React from 'react';

const Textp1 = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
    
    <div className="container text-white text-center py-5" >

<h1
  className="fw-bold text-center mb-4"
  style={{
    fontSize: '6rem',
    background: 'linear-gradient(to right, #00f0ff, #00bfff, #1e90ff)',
    WebkitBackgroundClip: 'text',
    textShadow: '0 0 25px rgba(0, 255, 255, 0.5)'
  }}
>
  Nuxe Aurea
</h1>     <p className="lead text-light mb-4">
        An Ai-Image helping tool for colourblind Artists
      </p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <a href="/Try" className="btn btn-outline-light btn-lg px-4">Try it free</a>
        <a href="/About" className="btn btn-outline-light btn-lg px-4">Learn more</a>
      </div>
    </div>
    </div>
  );
};

export default Textp1;
