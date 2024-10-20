// Import React and two hooks: useEffect and useState
import React, { useEffect, useState } from 'react';
// Import Axios to make requests to the backend
import axios from 'axios';

import InputBox from './components/InputBox'; // Import InputBox component
import ListView from './components/ListView'; // Import ListView component
import './App.css'; // Import CSS

function App() {
  const [message, setMessage] = useState('listAssist'); // App title state
  const [lists, setLists] = useState({
    'Groceries': { label: 'food', items: [] },
    'To-Do': { label: 'reminders', items: [] }
  });
  const [newListName, setNewListName] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Function to add a new item via the backend API
  const addItem = (newItem) => {
    axios
      .post('http://127.0.0.1:5000/api/add-item', { item: newItem })
      .then((response) => {
        const { item, listName } = response.data;
        setLists((prevLists) => ({
          ...prevLists,
          [listName]: {
            ...prevLists[listName],
            items: [...prevLists[listName].items, item],
          },
        }));
      })
      .catch((error) => console.error('Error adding item:', error));
  };

  // Function to move an item between lists
  const moveItem = (fromList, item, toList) => {
    axios
      .post('http://127.0.0.1:5000/api/move-item', {
        fromList,
        toList,
        item,
      })
      .then(() => {
        setLists((prevLists) => ({
          ...prevLists,
          [fromList]: {
            ...prevLists[fromList],
            items: prevLists[fromList].items.filter((i) => i !== item),
          },
          [toList]: {
            ...prevLists[toList],
            items: [...prevLists[toList].items, item],
          },
        }));
      })
      .catch((error) => console.error('Error moving item:', error));
  };

  // Fetch existing items from the backend when the app loads
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/items')
      .then((response) => setLists(response.data))
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
        .catch((error) => console.error('Error adding list:', error));
    }
  };

  const removeItem = (listName, item) => {
    axios
      .delete('http://127.0.0.1:5000/api/remove-item', {
        data: { listName, item },
      })
      .then(() => {
        setLists((prevLists) => ({
          ...prevLists,
          [listName]: {
            ...prevLists[listName],
            items: prevLists[listName].items.filter((i) => i !== item),
          },
        }));
      })
      .catch((error) => console.error('Error removing item:', error));
  };

  // Render UI
  return (
    <div className="App">
      <h1 className="app-title">{message}</h1>

      {/* Input box for adding new list items */}
      <InputBox onAddItem={addItem} />

      {/* Container for all the lists */}
      <div className="lists-container">
        {Object.keys(lists).map((listName) => (
          <ListView
            key={listName}
            listName={listName}
            items={lists[listName]?.items || []}
            onRemoveItem={removeItem}
            onMoveItem={moveItem} // Pass the moveItem function
            allLists={Object.keys(lists)} // Pass all list names for dropdown
          />
        ))}
      </div>

      {/* Add List Button */}
      <div className="add-list-button">
        <p className="add-list-text" onClick={() => setShowInput(true)}>
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

export default App;
