import React from 'react';
import { Link } from 'react-router-dom';

import '../App.css'

const Dashboard = ({ handleLogout }) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <Link to="/manage-users">
          <button>Manage Users</button>
        </Link>
      </div>
      <div>
        <Link to="/credentials">
          <button>Manage Credentials</button>
        </Link>
      </div>
      <div>
        <button onClick={handleLogout}>Log Out</button> {/* Log Out Button */}
      </div>
    </div>
  );
};

export default Dashboard;
