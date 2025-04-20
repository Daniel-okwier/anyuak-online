import React from 'react';
import { styled } from 'styled-components';
import { NavLink } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 200px;
  background-color: #222; /* Sidebar background */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    width: 250px; /* Wider on mobile */
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 10; /* Ensure it's above other content */
    transform: translateX(-100%); /* Initially hidden */
    transition: transform 0.3s ease-in-out;

    &.open {
      transform: translateX(0);
    }
  }

  @media (min-width: 769px) {
    position: static;
    transform: translateX(0);
  }
`;

const NavItem = styled(NavLink)`
  color: #ddd;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #333; /* Hover effect */
    color: #eee;
  }

  &.active {
    background-color: #444; /* Active link style */
    color: #fff;
  }
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <NavItem to="/">Home</NavItem>
      <NavItem to="/profile">Profile</NavItem>
      <NavItem to="/achievements">Achievements</NavItem>
      <NavItem to="/leaderboard">Leaderboard</NavItem>
      <NavItem to="/settings">Settings</NavItem>
      <NavItem to="/ai-tools">AI Tools</NavItem>
      <NavItem to="/logout">Logout</NavItem>
    </SidebarContainer>
  );
}

export default Sidebar;