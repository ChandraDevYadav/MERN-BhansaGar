import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './User.css';

const User = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);      // State to manage error state

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found');
  
          const response = await axios.get('http://localhost:4000/api/user/me', {
              headers: { 'Authorization': `Bearer ${token}` },
          });
          setUserData(response.data);
      } catch (error) {
          setError('Failed to fetch user data');
      } finally {
          setLoading(false);
      }
  };
  

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div className='user-profile'>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Address:</strong> {userData.address?.street}, {userData.address?.city}, {userData.address?.state}, {userData.address?.zipcode}, {userData.address?.country}</p>
      {/* Adjust the above fields according to your user model */}
    </div>
  );
};

export default User;
