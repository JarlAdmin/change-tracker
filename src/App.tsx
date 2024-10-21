import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChangeTable from '././components/ChangeTable';
import AddChangeForm from '././components/AddChangeForm';

interface Change {
  id: number;
  description: string;
  date: string;
}

const App: React.FC = () => {
  const [changes, setChanges] = useState<Change[]>([]);

  useEffect(() => {
    fetchChanges();
  }, []);

  const fetchChanges = async () => {
    try {
      const response = await axios.get('/api/changes');
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  const addChange = async (description: string) => {
    try {
      const response = await axios.post('/api/changes', { description });
      setChanges([...changes, response.data]);
    } catch (error) {
      console.error('Error adding change:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Change Tracker</h1>
      <AddChangeForm onAddChange={addChange} />
      <ChangeTable changes={changes} />
    </div>
  );
};

export default App;
