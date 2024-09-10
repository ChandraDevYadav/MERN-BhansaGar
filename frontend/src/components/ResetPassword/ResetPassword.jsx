import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // State for email
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:4000/api/user/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
  
      if (response.data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect to login page after 3 seconds
      }
    } catch (error) {
      setMessage("Error resetting password");
    }
  };
  

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email" // Optional email field for better accessibility
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password" // Corrected attribute name
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
