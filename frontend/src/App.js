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
  const [foodItems, setFoodItems] = useState([]); // Example: Grocery list
  const [remindersItems, setRemindersItems] = useState([]); // Example: To-Do list

  // Function to add a new item via the backend API
  const addItem = (newItem) => {
    axios
      .post('http://127.0.0.1:5000/api/add-item', { item: newItem }) // Send item to backend
      .then((response) => {
        const { item, category } = response.data;

        if (category === 'food') {
          setFoodItems((prevItems) => [...prevItems, item]);
        } else if (category === 'reminders') {
          setRemindersItems((prevItems) => [...prevItems, item]);
        }
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  // Optional: Fetch existing items from the backend when the app loads
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/items') // Fetch all items from backend
      .then((response) => {
        const { food, reminders } = response.data;
        // Update the corresponding list based on the category
        setFoodItems(food); // Set grocery items
        setRemindersItems(reminders); // Set todo items
      })
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  // Render UI
  return (
    <div className="App">
      <h1 className ="app-title">{message}</h1>

      {/* Input box for adding new list items */}
      <InputBox onAddItem={addItem} />  {/* Use InputBox and pass addItem */}

       {/* Container for all the lists */}
      <div className="lists-container">
        <ListView listName="Grocery List" items={foodItems} />
        <ListView listName="To-Do List" items={remindersItems} />
      </div>
    </div>
  );
}

// Allow this component to be used in other files
export default App;
