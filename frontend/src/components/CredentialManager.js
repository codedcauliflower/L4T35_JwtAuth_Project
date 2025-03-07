import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CredentialForm from './CredentialForm';
import CredentialTable from './CredentialTable';

const CredentialManager = ({handleLogout}) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedOU, setSelectedOU] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [organizationalUnits, setOrganizationalUnits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCredentialId, setCurrentCredentialId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchCredentials = async () => {
    try {
      const credResponse = await axios.get('http://localhost:5000/api/credentials', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCredentials(credResponse.data.credentials);
    } catch (error) {
      setError('Failed to fetch credentials');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ouResponse = await axios.get('http://localhost:5000/api/ous', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOrganizationalUnits(ouResponse.data);

        if (selectedOU) {
          const divResponse = await axios.get(`http://localhost:5000/api/divisions?ou=${selectedOU}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setDivisions(divResponse.data.divisions);
        } else {
          setDivisions([]);
        }

        // Fetch credentials when the component mounts
        fetchCredentials();
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      }
    };

    fetchData();
  }, [token, selectedOU]);

  const handleEditCredential = (credential) => {
    setIsEditing(true);
    setCurrentCredentialId(credential._id);
    setTitle(credential.title);
    setUsername(credential.username);
    setPassword(credential.password);
    setSelectedDivision(credential.division);
    setSelectedOU(credential.ou);
  };

  const handleSubmitCredential = async () => {
    if (!title || !username || !password || !selectedDivision || !selectedOU) {
      alert("All fields are required");
      return;
    }
    if (selectedOU === selectedDivision) {
      alert("OU and Division cannot be the same.");
      return;
    }

    const newCredential = { title, username, password, division: selectedDivision, ou: selectedOU };

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/credentials/${currentCredentialId}`, newCredential, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        response = await axios.post('http://localhost:5000/api/credentials', newCredential, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        // Refetch credentials to refresh the table
        fetchCredentials();
      }

      setIsEditing(false);
      setTitle('');
      setUsername('');
      setPassword('');
      setSelectedDivision('');
      setSelectedOU('');
    } catch (error) {
      console.error('Error handling credential submission:', error);
      setError('Failed to save credential');
    }
  };

  return (
    
    <div>
      <button onClick={handleLogout}>Log Out</button>
      <h2>Manage Credentials</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CredentialForm
        title={title}
        username={username}
        password={password}
        selectedOU={selectedOU}
        selectedDivision={selectedDivision}
        organizationalUnits={organizationalUnits}
        divisions={divisions}
        setTitle={setTitle}
        setUsername={setUsername}
        setPassword={setPassword}
        setSelectedOU={setSelectedOU}
        setSelectedDivision={setSelectedDivision}
        handleSubmitCredential={handleSubmitCredential}
        isEditing={isEditing}
      />

      <h3>Existing Credentials</h3>
      <CredentialTable
        credentials={credentials}
        handleEditCredential={handleEditCredential}
      />
    </div>
  );
};

export default CredentialManager;
