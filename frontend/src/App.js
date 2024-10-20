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

  const [message, setMessage] = useState('listAssist'); // Display app name
  const [items, setItems] = useState([]);  // All list items
  const [groceryItems, setGroceryItems] = useState([]); // Example: Grocery list
  const [todoItems, setTodoItems] = useState([]); // Example: To-Do list

  // Run this code once when the component loads (because the [] is empty)
  useEffect(() => {
    // Make a GET request to the backend API.
    axios.get('http://127.0.0.1:5000/api/data')  // Change the URL if needed ? perhaps?
      .then(response => {
        // If the request works, save the message from the response
        setMessage(response.data.message);
      })
      .catch(error => {
        // If the request fails, print the error in the console
        console.error(error);
      });
  }, []);  

  // Function to add a new item to the list
  const addItem = (newItem) => {
    setItems([...items, newItem]);  // Add the new item to the state array
    // Example: Categorize new items (adjust logic as needed)
    if (newItem.toLowerCase().includes('buy')) {
      setGroceryItems([...groceryItems, newItem]);
    } else {
      setTodoItems([...todoItems, newItem]);
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
        <ListView listName="Grocery List" items={groceryItems} />
        <ListView listName="To-Do List" items={todoItems} />
      </div>
    </div>
  );
}

// Allow this component to be used in other files
export default App;
