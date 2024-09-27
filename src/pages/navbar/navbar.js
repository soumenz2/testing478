import React, { useState } from 'react';
import './Navbar.css';
import RegisterModal from '../modalPage/registration';
import LoginModal from '../modalPage/login';
import CreateStoryModal from '../modalPage/createStoryModal';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserId } from '../../redux/userslice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const[iscreateSoryOpen,setIsCreateStoryOpen]=useState(false)
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);
  const openCreateSoryModal=()=>setIsCreateStoryOpen(true)
  const closeCreateSoryModal=()=>setIsCreateStoryOpen(false)


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(clearUserId());
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="navbar">
      {/* Hamburger Menu for mobile view */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span> {/* Hamburger icon */}
      </div>

      {/* Conditionally render the navbar options */}
      <div className={`navbar-options ${isMenuOpen ? 'active' : ''}`}>
        {userIDfromREdux ? (
          <>
            <div className="user-profile">
              <img
                src="https://via.placeholder.com/40"
                alt="User Profile"
                onError={(e) => (e.target.src = 'default-profile-pic.png')} // Fallback image
              />
              <div className="profile-info">
                <p>{userIDfromREdux}</p> {/* Display username */}
              </div>
            </div>
            <Link to="/bookmarks">
            <button className="btn-bookmarks">Bookmarks</button>
          </Link>
            <button className="btn-add-story" onClick={openCreateSoryModal}>Add story</button>
            <div className="profile-dropdown">
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="btn-register" onClick={openRegisterModal}>Register Now</button>
            <button className="btn-signin" onClick={openLoginModal} >Sign In</button>
          </>
        )}
      </div>

      {/* Modals */}
      {isRegisterOpen && <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} />}
      {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} toggleMenu={toggleMenu}/>}
      {iscreateSoryOpen && <CreateStoryModal isOpen={iscreateSoryOpen} onClose={closeCreateSoryModal}/>}
    </nav>
  );
};

export default Navbar;
