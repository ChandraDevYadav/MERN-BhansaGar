import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const { token } = useParams();
  
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = `${url}/api/user`;
    if (currState === "Login") {
      newUrl += "/login";
    } else if (currState === "Sign Up") {
      newUrl += "/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, { email: data.email });
      if (response.data.success) {
        alert("Password reset email sent. Please check your email for further instructions.");
        setCurrState("Login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const onResetPassword = async (event) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.patch(`${url}/api/user/reset-password/${token}`, {
        password: data.password
      });
      if (response.data.success) {
        alert("Password has been successfully reset.");
        setCurrState("Login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={
          currState === "Forgot Password"
            ? onForgotPassword
            : currState === "Reset Password"
            ? onResetPassword
            : onLogin
        }
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
            </>
          )}
          {(currState === "Login" || currState === "Forgot Password") && (
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Your email"
              required
            />
          )}
          {currState !== "Forgot Password" && currState !== "Reset Password" && (
            <div className="password-input-container">
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}
          {currState === "Reset Password" && (
            <>
              <div className="password-input-container">
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <input
                name="confirmPassword"
                onChange={onChangeHandler}
                value={data.confirmPassword}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                required
              />
            </>
          )}
        </div>

        <button type="submit">
          {currState === "Sign Up"
            ? "Create account"
            : currState === "Forgot Password"
            ? "Send Reset Link"
            : currState === "Reset Password"
            ? "Reset Password"
            : "Login"}
        </button>

        {currState === "Login" && (
          <>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>Click here</span>
            </p>
            <p>
              Forgot your password?{" "}
              <span onClick={() => setCurrState("Forgot Password")}>
                Reset here
              </span>
            </p>
          </>
        )}

        {currState === "Sign Up" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}

        {currState === "Forgot Password" && (
          <p>
            Remembered your password?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}

        {currState === "Reset Password" && (
          <p>
            Remembered your password?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
