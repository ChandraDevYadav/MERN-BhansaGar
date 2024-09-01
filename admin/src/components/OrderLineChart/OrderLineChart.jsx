import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import './OrderLineChart.css';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrderLineChart = () => {
  const [chartData, setChartData] = useState({});
  const [dailyTotals, setDailyTotals] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/list');
        if (response.data.success) {
          const orders = response.data.data;

          // Aggregate daily totals
          const { labels, data } = aggregateDailyTotals(orders);
          setDailyTotals(labels.map((label, index) => ({ date: label, amount: data[index] })));

          // Prepare chart data
          setChartData({
            labels: labels,
            datasets: [{
              label: 'Total Order Amount',
              data: data,
              borderColor: 'rgba(255, 128, 128, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
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
      
      <div className="order-list-column">
        <h2>Daily Total Order Amounts</h2>
        {dailyTotals.length > 0 ? (
          <ul>
            {dailyTotals.map((total, index) => (
              <li key={index}>
                <p>Date: {total.date}</p>
                <p>Total Amount: {total.amount}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <div className="chart-column">
        <h2>Daily Total Order Amounts Line Chart</h2>
        {chartData.labels ? (
          <Line data={chartData} options={{ responsive: true }} />
        ) : (
          <p>No data available to display.</p>
        )}
      </div>
    </div>
  );
};

// Helper function to aggregate daily totals
const aggregateDailyTotals = (orders) => {
  const dailyTotals = {};

  orders.forEach(order => {
    const date = new Date(order.date).toISOString().split('T')[0];
    if (!dailyTotals[date]) {
      dailyTotals[date] = 0;
    }
    dailyTotals[date] += order.amount;
  });

  return {
    labels: Object.keys(dailyTotals),
    data: Object.values(dailyTotals)
  };
};

export default OrderLineChart;
