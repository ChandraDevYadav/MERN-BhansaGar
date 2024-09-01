import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem('adminToken');
    
    // Redirect to login page
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='navbar'>
      <Link to='/orderbarchart'>
        <img className='logo' src={assets.logo} alt="Logo" />
      </Link>
      <div className='profile-container'>
        <img
          className='profile'
          src={assets.profile_image}
          alt="Profile"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className='dropdown-menu'>
            <button className='dropdown-item' onClick={handleLogout}><img src={'/logout.png'} alt="" style={{width:'25px', height:'25px'}} />Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
