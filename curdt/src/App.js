import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:5000/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function createData(newData) {
    try {
      const response = await fetch('http://localhost:5000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      const createdData = await response.json();
      setData([...data, createdData]);
    } catch (error) {
      console.error('Error creating data:', error);
    }
  }

  async function updateData(updatedData) {
    try {
      const response = await fetch(
        `http://localhost:5000/data/${updatedData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
      const updatedItem = await response.json();
      const updatedIndex = data.findIndex((item) => item.id === updatedItem.id);
      const updatedDataArray = [...data];
      updatedDataArray[updatedIndex] = updatedItem;
      setData(updatedDataArray);
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async function deleteData(idToDelete) {
    try {
      await fetch(`http://localhost:5000/data/${idToDelete}`, {
        method: 'DELETE',
      });
      setData(data.filter((item) => item.id !== idToDelete));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  function handleEditClick(id, value) {
    setEditingId(id);
    setEditValue(value);
  }

  return (
    <div className="App">
      <h1>JSON Data CRUD Example</h1>
      <div className="data-list">
        {data.map((item) => (
          <div key={item.id} className="data-item">
            {editingId === item.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <p>{item.name}</p>
            )}
            <div className="button-group">
              {editingId === item.id ? (
                <button
                  onClick={() =>
                    updateData({ ...item, name: editValue })
                  }
                >
                  Save
                </button>
              ) : (
                <button onClick={() => handleEditClick(item.id, item.name)}>
                  Edit
                </button>
              )}
              <button onClick={() => deleteData(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="create-form">
        <h2>Create New Data</h2>
        <input
          type="text"
          placeholder="Enter data"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <button onClick={() => createData({ name: editValue })}>Create</button>
      </div>
    </div>
  );
}

export default App;