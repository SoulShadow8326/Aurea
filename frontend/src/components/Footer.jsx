import React from 'react';
import { CFooter, CLink } from '@coreui/react';

const Footer = () => {
  return (
    <CFooter
      className="text-white justify-content-between px-4 py-4 border-top border-secondary"
      style={{
        background:"#FEAD13",
            height: '8vh',
    display: 'flex',
    alignItems: 'center',

      }}
    >
      <div>
        <CLink
          className="text-decoration-none"
          style={{
            color: '#00f0ff',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
          }}
        >
          &copy; 2025  Nuxe Aurea
        </CLink>
      </div>
      <div>
        <span >Powered by </span>
        <CLink
          
          className="text-decoration-none"
          style={{
            color: '#00f0ff',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
          }}
        >
          Exun Clan
        </CLink>
      </div>
    </CFooter>
  );
};

export default Footer;
