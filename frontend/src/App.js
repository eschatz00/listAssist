// Import React and two hooks: useEffect and useState
// useEffect runs code when the component loads
// useState stores and updates values in the component
import React, { useEffect, useState } from 'react';

// Import Axios to make requests to the backend
import axios from 'axios';

import InputBox from './components/InputBox'; // Import InputBox js page
import ListView from './components/ListView'; // Import ListView js page
import './App.css'; // Import CSS

function App() {

  const [message, setMessage] = useState('listAssist');
  const [lists, setLists] = useState({
    'Groceries': { label: 'food', items: [] },
    'To-Do': { label: 'reminders', items: [] }
  });
  const [newListName, setNewListName] = useState('');
  const [newListLabel, setNewListLabel] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Function to add a new item via the backend API
  const addItem = (newItem) => {
    axios
      .post('http://127.0.0.1:5000/api/add-item', { item: newItem }) // Send item to backend
      .then((response) => {
        const { item, listName } = response.data;
        setLists(prevLists => ({
          ...prevLists,
          [listName]: {
            ...prevLists[listName],
            items: [...prevLists[listName].items, item]
          }
        }));
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  // Fetch existing items from the backend when the app loads
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/items') // Fetch all items from backend
      .then(response => setLists(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const handleAddList = () => {

    if (newListName.trim()) {
  
      axios
        .post('http://127.0.0.1:5000/api/add-list', {
          name: newListName,
          label: newListName.toLowerCase(),
        })
        .then(() => {
          setLists((prevLists) => ({
            ...prevLists,
            [newListName]: { label: newListName.toLowerCase(), items: [] },
          }));

          setNewListName('');
          setShowInput(false);
        })
        .catch((error) => console.error('Error adding list:', error)); // Error handling
    } else {
    }
  };

  // Render UI
  return (
    <div className="App">
      <h1 className ="app-title">{message}</h1>

      {/* Input box for adding new list items */}
      <InputBox onAddItem={addItem} />  {/* Use InputBox and pass addItem */}

       {/* Container for all the lists */}
      <div className="lists-container">
        {Object.keys(lists).map((listName) => (
        <ListView 
        key={listName} 
        listName={listName} 
        items={lists[listName]?.items || []} // Ensure `items` is always an array
      />
        ))}
      </div>

      {/* Add List Button */}
      <div className="add-list-button">
        <p
          className="add-list-text"
          onClick={() => setShowInput(true)}
        >
          add list+
        </p>
        {showInput && (
          <div className="new-list-input">
            <input
              type="text"
              placeholder="Enter new list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button onClick={handleAddList}>Add</button>
          </div>
        )}
      </div>
      
    </div>
  );
}

// Allow this component to be used in other files
export default App;
