// Navbar.js
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn] = useState(false); // Simulate logged-in state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Conditionally render the navbar options */}
      <div className={`navbar-options ${isMenuOpen ? 'active' : ''}`}>
        {isLoggedIn ? (
          <>
            <button className="btn-bookmarks">Bookmarks</button>
            <button className="btn-add-story">Add story</button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="User Profile" />
            </div>
          </>
        ) : (
          <>
            <button className="btn-register">Register Now</button>
            <button className="btn-signin">Sign In</button>
          </>
        )}
      </div>

      {/* Hamburger Menu for mobile view - placed after the options to align right */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span> {/* Hamburger icon */}
      </div>
    </nav>
  );
};

export default Navbar;
