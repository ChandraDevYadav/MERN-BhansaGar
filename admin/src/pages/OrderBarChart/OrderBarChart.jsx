import React, { useEffect, useState } from 'react';
import './OrderBarChart.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/list');
        if (response.data.success) {
          const orders = response.data.data;

          // Sort orders by createdAt in descending order
          const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setOrders(sortedOrders);

          // Process data to get the count of orders by status
          const orderStatuses = sortedOrders.map(order => order.status);
          const statusCount = orderStatuses.reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          setChartData({
            labels: Object.keys(statusCount),
            datasets: [{
              label: 'Order Status Count',
              data: Object.values(statusCount),
              backgroundColor: 'rgba(255, 128, 128, 1)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="chart-column first-column">
        <h2>Order Status Distribution</h2>
        {chartData.labels ? (
          <Bar data={chartData} options={{ responsive: true }} />
        ) : (
          <p>No data available to display.</p>
        )}
      </div>
      <div className="order-list-column second-column">
        <h2>Order List</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map(order => (
              <li key={order._id}>
                <p>Order ID: {order._id}</p>
                <p>Status: {order.status}</p>
                <p>Amount: {order.amount}</p>
                <p>Items:</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <p>Item Name: {item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {item.price}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderBarChart;
