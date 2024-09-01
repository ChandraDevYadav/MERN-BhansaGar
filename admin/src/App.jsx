import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import OrderBarChart from './pages/OrderBarChart/OrderBarChart';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from './assets/assets';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken')); // Initialize based on token presence

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? (
      <div>
        <Navbar />
        <hr />
        <div className="app-content">
          <Sidebar />
          {children}
        </div>
      </div>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/login' element={<Login setToken={setToken} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/add' element={<ProtectedRoute><Add url={url} /></ProtectedRoute>} />
        <Route path='/list' element={<ProtectedRoute><List url={url} /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute><Orders url={url} /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard url={url} /></ProtectedRoute>} />
        <Route path='/order-bar-chart' element={<ProtectedRoute><OrderBarChart url={url} /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default App;
