// Navbar.js
import React, { useState } from 'react';
import './Navbar.css';
import RegisterModal from '../modalPage/registration';
import LoginModal from '../modalPage/login';

const Navbar = () => {
  const [isLoggedIn] = useState(false); // Simulate logged-in state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

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
            <button className="btn-register" onClick={openRegisterModal}>Register Now</button>
            <button className="btn-signin" onClick={openLoginModal}>Sign In</button>
          </>
        )}
      </div>

      {/* Hamburger Menu for mobile view - placed after the options to align right */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span> {/* Hamburger icon */}
      </div>
      {
      isRegisterOpen && <RegisterModal isOpen={openRegisterModal} onClose={closeRegisterModal}/>
    }
    {
      isLoginOpen && <LoginModal  isOpen={openLoginModal} onClose={closeLoginModal}/>
    }
    </nav>
  
  );
};

export default Navbar;
