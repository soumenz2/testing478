import React, { useState } from "react";
import "./modalstyle.css"; // Import the CSS file

const RegisterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          &#10006;
        </button>
        <h2 className="modal-title">Register</h2>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" className="input" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type="password"
                placeholder="Enter password"
                className="input"
              />
              <span className="password-toggle">&#128065;</span>
            </div>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};


export default RegisterModal;
