import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { styled } from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #000; /* Example dark background */
  color: #fff; /* Example text color */
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding: 20px;
  flex-grow: 1; /* Ensure main content takes remaining vertical space */
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  display: none; /* Hidden by default on larger screens */

  @media (max-width: 768px) {
    display: block; /* Visible on smaller screens */
  }
`;

const SidebarMobile = styled(Sidebar)`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #111;
  z-index: 10; /* Ensure it's above other content */
  transform: translateX(-100%); /* Initially hidden */
  transition: transform 0.3s ease-in-out;

  &.open {
    transform: translateX(0);
  }

  @media (min-width: 769px) {
    position: static;
    transform: translateX(0);
    display: flex; /* Ensure it's visible on larger screens */
    flex-direction: column; /* Inherit flex-direction from Sidebar */
    width: auto; /* Adjust width as needed */
    height: auto; /* Adjust height as needed */
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9; /* Below the sidebar */
  display: none;

  &.open {
    display: block;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <HamburgerButton onClick={toggleSidebar}>☰</HamburgerButton>
      <SidebarMobile className={isSidebarOpen ? 'open' : ''} />
      <Overlay className={isSidebarOpen ? 'open' : ''} onClick={toggleSidebar} />
      <ContentWrapper>
        <Header onToggleSidebar={toggleSidebar} />
        <MainContent>{children}</MainContent>
      </ContentWrapper>
    </LayoutContainer>
  );
}

export default Layout;