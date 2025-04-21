import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #333;
  color: #fff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Branding = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #444;
  border-radius: 5px;
  padding: 5px 10px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: #ddd;
  padding: 8px;
  width: 200px; /* Initial width */

  &:focus {
    outline: none;
  }

  @media (max-width: 600px) {
    width: 100%; /* Full width on smaller screens */
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: #ddd;
  cursor: pointer;
  padding: 8px;

  &:hover {
    color: #eee;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #555; /* Placeholder */
`;

const WelcomeText = styled.span`
  font-size: 1rem;
`;

const Username = styled.span`
  font-weight: bold;
  margin-left: 5px;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
`;

const NotificationIcon = styled.div`
  cursor: pointer;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ddd;
  cursor: pointer;

  &:hover {
    color: #eee;
  }
`;

const SignupLink = styled(Link)`
  color: #ddd;
  text-decoration: none;

  &:hover {
    color: #eee;
  }
`;

const LoginLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  margin-left: 10px;

  &:hover {
    color: #eee;
  }
`;

const HamburgerButtonHeader = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  display: block; /* Visible on smaller screens */

  @media (min-width: 769px) {
    display: none; /* Hidden on larger screens */
  }
`;

function Header({ onToggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const platformName = 'Cosmic Learn';
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(user);
        setUsername(parsedUser?.name || 'User');
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/'); // Redirect to home or login page
  };

  return (
    <HeaderContainer>
      <HamburgerButtonHeader onClick={onToggleSidebar}>☰</HamburgerButtonHeader>
      <Branding>{platformName}</Branding>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search Courses..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchButton onClick={handleSearchSubmit}>Search</SearchButton>
      </SearchBar>
      {isLoggedIn ? (
        <UserInfo>
          <Avatar />
          <WelcomeText>Welcome,</WelcomeText>
          <Username>{username}!</Username>
        </UserInfo>
      ) : null}
      <Actions>
        <NotificationIcon>
          {' '}
          {/* Placeholder for notification icon */} 🔔{' '}
        </NotificationIcon>
        {isLoggedIn ? (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        ) : (
          <>
            <SignupLink to="/signup">Sign Up</SignupLink>
            <LoginLink to="/login">Login</LoginLink>
          </>
        )}
      </Actions>
    </HeaderContainer>
  );
}

export default Header;

