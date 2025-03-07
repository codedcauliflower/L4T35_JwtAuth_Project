import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import CredentialManager from './components/CredentialManager';
import Dashboard from './components/Dashboard';
import UserManager from './components/UserManager';

import './App.css'

const App = () => {
  // Store token from localStorage and track its expiration status
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Effect to check if the token is expired on each render
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);  // Decode token to get expiration time
      const expirationTime = decodedToken.exp * 1000;  // Convert expiration time to milliseconds
      if (Date.now() > expirationTime) {
        setIsTokenExpired(true);  // Mark token as expired
        localStorage.removeItem('token');  // Clear expired token from localStorage
        setToken(null);  // Set token to null to trigger redirect
      }
    }
  }, [token]);

  // Handle login and store token in state and localStorage
  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);  // Persist token in localStorage
  };

  // Handle register and store token in state and localStorage
  const handleRegister = (token) => {
    setToken(token);
    localStorage.setItem('token', token);  // Persist token in localStorage
  };

  // Handle logout, clear token from state and localStorage
  const handleLogout = () => {
    setToken(null); // Clear token in state
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">CoolTech CredVault</h1>
        <Routes>
          {/* Route for login and registration */}
          <Route path="/" element={
            isTokenExpired || !token ? (
              <div className="flex flex-col items-center space-y-6">
                <LoginForm onLogin={handleLogin} />
                <RegisterForm onRegister={handleRegister} />
              </div>
            ) : (
              <Navigate to="/dashboard" />
            )
          } />

          {/* Route for Dashboard (Manage Users & Credentials) */}
          <Route path="/dashboard" element={token && !isTokenExpired ? (
            <Dashboard handleLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )} />

          {/* Route for Manage Credentials */}
          <Route path="/credentials" element={token && !isTokenExpired ? (
            <CredentialManager token={token} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )} />

          {/* Route for Manage Users */}
          <Route path="/manage-users" element={token && !isTokenExpired ? (
            <UserManager handleLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
