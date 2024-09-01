import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [theme, setTheme] = useState("light"); // Theme state management
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleSearch = (query) => {
    // Implement your search logic here
    console.log('Searching for:', query);
  };


  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
          style={{ display: "flex", gap: "10px" }}
        >
          <img
            src={"./house.png"}
            alt=""
            style={{ width: "25px", height: "25px" }}
          />{" "}
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
          style={{ display: "flex", gap: "10px" }}
        >
          <img
            src={"./menu.png"}
            alt=""
            style={{ width: "25px", height: "25px" }}
          />{" "}
          Menu
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
          style={{ display: "flex", gap: "10px" }}
        >
          <img
            src={"./agenda.png"}
            alt=""
            style={{ width: "25px", height: "25px" }}
          />{" "}
          Contact us
        </a>
      </ul>
      <div className="navbar-right">
       {/* <SearchBar onSearch={handleSearch} /> */}
        <button
          onClick={toggleTheme}
          className={`theme-toggle ${
            theme === "light" ? "light-mode" : "dark-mode"
          }`}
        >
          <span className="moon-icon">🌙</span>
          <span className="sun-icon">☀️</span>
        </button>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img
              src={assets.basket_icon}
              alt=""
              style={{ width: "45px", height: "45px" }}
            />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Signin</button>
        ) : (
          <div className="navbar-profile">
            <img
              src={assets.profile_icon}
              alt=""
              style={{ width: "45px", height: "45px" }}
            />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={"./basket_icon.png"} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={"./logout.png"} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
