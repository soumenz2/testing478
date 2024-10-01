import React, { useState } from "react";
import "./modalstyle.css";
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../redux/userslice';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';  // No need for destructuring
import API_BASE_URL from '../../config/config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginModal = ({ isOpen, onClose,toggleMenu }) => {
  const [showPassword, setShowPassword] = useState(false);

  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginSchema = Yup.object({
    username: Yup.string().required("Enter Username "),
    password: Yup.string()
      .required("Enter Your Password")
      .min(6, "Password must be at least 6 characters long")
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, values);
        const { token } = response.data;

        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;

        localStorage.setItem('user', userId);
        dispatch(setUserId(userId));
        toast.success("Login Successfully !!!");
        // Close modal and navigate to dashboard or home after successful login
      setTimeout(()=>{
        onClose();
      },2000)
          
        toggleMenu();
 
         
        
        // navigate('/dashboard');  // Adjust route as needed

      } catch (err) {
        console.error('Login failed', err);
      
        toast.error("Incorrect Username or Password");
      }
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
       <ToastContainer autoClose={3000}/>
      <div className="modal1">
        <button className="close-btn" onClick={onClose}>
          &#10006;
        </button>
        <h2 className="modal-title">Login</h2>
        <form onSubmit={formik.handleSubmit} method="POST">
          <div className="form-group">
            <label>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              className="input"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          
          </div>
          {formik.errors.username && formik.touched.username && (
              <div className="error">{formik.errors.username}</div>
            )}
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          
          </div>
          {formik.touched.password && formik.errors.password && (
          <div className="error-message">{formik.errors.password}</div>
        )}
          <button type="submit" className="register-btn">
            Login
          </button>
        </form>
       
       
      </div>
    </div>
  );
};

export default LoginModal;
