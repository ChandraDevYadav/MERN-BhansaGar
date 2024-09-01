import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/admin/register', { name, email, password });
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
      
      <div className="register-form">
              <form onSubmit={handleRegister} className="register-container">
                  <div className="register-title">
                  <h2>Register</h2>
                  {error && <p>{error}</p>}
                  </div>
                  <div className="register-inputs">
                  <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required />
                  <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required />
                  <div className="password-input-container">
                  <input
                      placeholder="Password"
                      value={password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      required />
                      <span className='password-toggle-icon' onClick={()=> setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                      </span>
                  </div>
                  </div>
                  <button type="submit">Register</button>
                  <div className="register-condition">
                      <input type="checkbox" required />
                      <p>By continuing, i agree to the terms of use & privacy policy.</p>
                  </div>
                  <p>
                      Don't have an account? <a href="/login">Login here</a>
                  </p>
              </form>
          </div>
  );
};

export default Register;
