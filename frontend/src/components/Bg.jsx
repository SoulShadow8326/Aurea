import React from 'react';
import { useLocation } from 'react-router-dom';

const Bg = ({ children }) => {
  const location = useLocation();

  const getBackground = () => {
    switch (location.pathname) {
      case '/':
        return 'radial-gradient(ellipse at top, #FEAD13 20%, #14142D 60%, #ffffff 100%)';
      case '/About':
        return 'radial-gradient(ellipse at top, #FEAD13 20%, #14142D 60%, #ffffff 100%)';
      case '/Try':
        return 'linear-gradient(to bottom, #ff5f6d, #ffc371)';
      case '/Results':
        return 'linear-gradient(to bottom, #ff5f6d, #ffc371)';
      default:
        return '#14142D';
    }
  };

  return (
    <section
      style={{
        background: getBackground(),
        minHeight: '100vh',
        width: '100vw',
        color: 'white',
        margin: 0,
        padding: 0,
        position: 'relative',
        overflowX: 'hidden',
        transition: 'background 0.5s ease-in-out',
      }}
    >
      {children}
    </section>
  );
};

export default Bg;
