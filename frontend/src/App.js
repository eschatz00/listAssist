// Import React and two hooks: useEffect and useState
// useEffect runs code when the component loads
// useState stores and updates values in the component
import React, { useEffect, useState } from 'react';

// Import Axios to make requests to the backend
import axios from 'axios';

import InputBox from './components/InputBox'; // Import InputBox js page
import './App.css'; // Import CSS

function App() {
  // Create a state variable called `message` and a function to update it
  // Display app name
  const [message, setMessage] = useState('listAssist');

  // Create a new state to store the list items added by the user
  const [items, setItems] = useState([]);  // <- New state for list items

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
  };

  // Render UI
  return (
    <div className="App">
      <h1 className ="app-title">{message}</h1>

      {/* Input box for adding new list items */}
      <InputBox onAddItem={addItem} />  {/* Use InputBox and pass addItem */}

      {/* Display the list of items */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li> // Render each item
        ))}
        
      </ul>

    </div>
  );
}

// Allow this component to be used in other files
export default App;
