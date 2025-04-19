import { NavLink } from "react-router-dom";
import { useState } from "react";
import './Header.css';
import { FaGraduationCap } from "react-icons/fa";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav>
        <h1 className="logo-text">
          <FaGraduationCap /> Anyuak E-learning
        </h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? "✖" : "☰"}
        </button>
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink exact to="/" activeClassName="active" onClick={handleLinkClick}>Home</NavLink>
          <NavLink to="/dashboard" activeClassName="active" onClick={handleLinkClick}>Dashboard</NavLink>
          <NavLink to="/auth/login" activeClassName="active" onClick={handleLinkClick}>Login</NavLink>
          <NavLink to="/auth/register" activeClassName="active" onClick={handleLinkClick}>Register</NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;