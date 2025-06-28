import React from 'react'
import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'

export const Navbar = () => {
  return (
    <CNavbar className="bg-black text-white" style={{ borderBottom: "1px solid #333" }}
>
      <CContainer fluid>
        <CNavbarNav className="d-flex flex-row align-items-center gap-4">
          <CNavbarBrand  style={{
            color: '#00f0ff',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
          }}>Nuxe Aurea</CNavbarBrand>
          <CNavItem>
            <CNavLink href="/" className="text-white">Home</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/About" className="text-white">Features</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/Try" className="text-white">Generate Image for colourblindness</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/Results" className="text-white">Generated Results</CNavLink>
          </CNavItem>
        </CNavbarNav>
      </CContainer>
    </CNavbar>
  )
}

export default Navbar
