import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TotalCards.css'; // Optional: for custom styling

const TotalCards = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:4000/api/order/total-users');
        const ordersResponse = await axios.get('http://localhost:4000/api/order/total-orders');
        const itemsResponse = await axios.get('http://localhost:4000/api/order/total-items');
        const notificationsResponse = await axios.get('http://localhost:4000/api/order/new-order-notifications');
        
        console.log('Notification Response:', notificationsResponse.data); // Log notification response
  
        if (usersResponse.data.success && ordersResponse.data.success && itemsResponse.data.success && notificationsResponse.data.success) {
          setTotalUsers(usersResponse.data.totalUsers);
          setTotalOrders(ordersResponse.data.totalOrders);
          setTotalItems(itemsResponse.data.totalItems);
          setNotificationMessage(notificationsResponse.data.notificationMessage); // Set notification message
        } else {
          console.error('Failed to fetch totals');
        }
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };
  
    fetchTotals();
  }, []);

  return (
    <div className="cards-container">
      <div className="card">
        <img src={'./teamwork.png'} alt=""/>
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>
      <div className="card">
      <img src={'./cargo.png'} alt=""/>
        <h3>Total Orders</h3>
        <p>{totalOrders}</p>
      </div>
      <div className="card">
      <img src={'./procurement.png'} alt=""/>
        <h3>Total Items</h3>
        <p>{totalItems}</p>
      </div>
    </div>
  );
};

export default TotalCards;
