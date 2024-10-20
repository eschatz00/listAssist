// InputBox.js hehehehehehe
import React, { useState } from 'react';

function InputBox({ onAddItem }) {
  // State to track the input text
  const [input, setInput] = useState(''); 

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (input.trim()) {
      onAddItem(input); // Pass input text to parent component
      setInput(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-box">
      <input
        type="text"
        placeholder=" what's on your mind, busy bee?"
        value={input}
        onChange={(e) => setInput(e.target.value)} // Update state on input change
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default InputBox;
