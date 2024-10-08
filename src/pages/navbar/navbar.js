import React, { useState,useEffect } from "react";
import "./Navbar.css";
import RegisterModal from "../modalPage/registration";
import LoginModal from "../modalPage/login";
import CreateStoryModal from "../modalPage/createStoryModal";
import { useSelector, useDispatch } from "react-redux";
import { clearUserId } from "../../redux/userslice";
import { Link } from "react-router-dom";

import { CiBookmark } from "react-icons/ci";
import { FaRegBookmark } from "react-icons/fa6";
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [iscreateSoryOpen, setIsCreateStoryOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);
  const openCreateSoryModal = () => setIsCreateStoryOpen(true);
  const closeCreateSoryModal = () => setIsCreateStoryOpen(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const syncUsernameFromSession = () => {
    setUsername(sessionStorage.getItem("username"));
  };
  useEffect(() => {
    // Sync username on mount
    syncUsernameFromSession();

    // Listen for sessionStorage changes (e.g., on login)
    const handleStorageChange = () => {
      syncUsernameFromSession();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userIDfromREdux]);
  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("user");
    dispatch(clearUserId());
    setUsername(null);
    setIsMenuOpen(false); // Close menu on logout
  };

  const handleUserProfileClick = () => {
    const usernameBox = document.querySelector(".username-box");
    if (usernameBox.classList.contains("show")) {
      usernameBox.classList.remove("show");
    } else {
      usernameBox.classList.add("show");
    }
  };

  return (
    <nav className="navbar">
     
      {/* Hamburger Menu for mobile view */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span> {/* Hamburger icon */}
      </div>

      {/* Conditionally render the navbar options */}
      <div className={`navbar-options ${isMenuOpen ? "active" : ""}`}>
        {username ? (
          <>
            <div className="user-profile" id="p1">
              <img
                src="https://via.placeholder.com/40"
                alt="User Profile"
                onError={(e) => (e.target.src = "default-profile-pic.png")} // Fallback image
              />
              <span className="profile-info">
                {username}
              </span>
            </div>

            <button className="btn-bookmarks">
              <Link to="/bookmarks"> <FaRegBookmark/> Bookmarks</Link>
            </button>

            <button className="btn-add-story" onClick={openCreateSoryModal}>
              Add story
            </button>
            <div className="profile-dropdown" id="logoutHide">
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="user-profile" id="p2">
              <img
                src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_960_720.png"
                alt="User Profile"
                
                onClick={handleUserProfileClick}
              />
              <div className="profile-info">
                {/* <p>{userIDfromREdux}</p> */}
              </div>
            </div>

            <div className="username-box">
              <p>{username}</p>
              <div className="profile-dropdown">
                <button className="btn-logout logout2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`menu-icon-cross ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
            >
              <span>&#10006;</span> {/* Hamburger icon */}
            </div>

            <button className="btn-register" onClick={openRegisterModal}>
              Register Now
            </button>
            <button className="btn-signin" onClick={openLoginModal}>
              Sign In
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {isRegisterOpen && (
        <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} />
      )}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLoginModal}
          toggleMenu={toggleMenu}
        />
      )}
      {iscreateSoryOpen && (
        <CreateStoryModal
          isOpen={iscreateSoryOpen}
          onClose={closeCreateSoryModal}
        />
      )}
    </nav>
  );
};

export default Navbar;
