import React, { useState } from 'react';
import { loginUser } from '../services/api';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser({ username, password });
      onLogin(response.token);  // Assuming `onLogin` sets the token in app state
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
      <h2>Login</h2>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
