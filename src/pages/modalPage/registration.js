import React, { useState } from "react";
import "./modalstyle.css";
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import  jwtDecode  from 'jwt-decode';  // No need for destructuring
import API_BASE_URL from '../../config/config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const registrationSchema = Yup.object({
    username: Yup.string().required("Enter User Name"),
    password: Yup.string()
      .required("Enter Your Password")
      .min(6, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "At least one Upper case character needed")
      .matches(/[a-z]/, "At least one lower case character needed")
      .matches(/[0-9]/, "One numeric value needed")
      .matches(
        /[~!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\-`]/,
        "One special Character needed"
      ),
    
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      try {
        await axios
          .post(`${API_BASE_URL}/signup`, values)
          .then((res) => {
            console.log("entered sucess part");
            toast.success(res.data.message);
            onClose();
          
           
            console.log(res.data.message);
          })
       
         
      } catch (err) {
        console.error(err);
        
        toast.error("Registration failed");
      }
    },
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <ToastContainer />
      <div className="modal1">
        <button className="close-btn" onClick={onClose}>
          &#10006;
        </button>
        <h2 className="modal-title">Register</h2>
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
              <div className="error-message">{formik.errors.username}</div>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};


export default RegisterModal;
