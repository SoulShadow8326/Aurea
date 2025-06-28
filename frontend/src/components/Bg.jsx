import React from 'react';

const Bg = ({ children }) => {
  return (
    <section
      style={{
        backgroundImage: 'radial-gradient(125% 125% at 50% 0%, #000 30%, #6b21a8)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      {children}
    </section>
  );
};

export default Bg;
