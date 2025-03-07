import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssignUserForm from './AssignUserForm';
import ChangeRoleForm from './ChangeRoleForm';

const UserManager = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [organizationalUnits, setOrganizationalUnits] = useState([]);
  const [selectedOU, setSelectedOU] = useState(""); // Track selected OU
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Users fetched:', userResponse.data);

        setUsers(userResponse.data.users || []);

        const ouResponse = await axios.get('http://localhost:5000/api/ous', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrganizationalUnits(ouResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token]);

  // Fetch divisions when selectedOU changes
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!selectedOU) {
        setDivisions([]); // Clear divisions if no OU selected
        return;
      }

      try {
        const divResponse = await axios.get(`http://localhost:5000/api/divisions?ou=${selectedOU}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Divisions fetched:', divResponse.data);

        setDivisions(divResponse.data.divisions || []);
      } catch (error) {
        console.error('Failed to fetch divisions:', error);
        setDivisions([]);
      }
    };

    fetchDivisions();
  }, [selectedOU, token]);

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
      <h2>User Management</h2>
      {users.length > 0 ? (
        <>
          <AssignUserForm
            users={users}
            divisions={divisions}
            organizationalUnits={organizationalUnits}
            setSelectedOU={setSelectedOU} // Pass down state setter
          />
          <ChangeRoleForm users={users} />
        </>
      ) : (
        <p>Loading users or no users found.</p>
      )}
    </div>
  );
};

export default UserManager;
