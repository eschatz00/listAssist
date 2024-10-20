// ListView.js
import React, { useState } from 'react';

function ListView({ listName, items }) {
  // State to keep track of whether the list is expanded or hidden
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle function to expand or hide the list contents
  const toggleList = () => {
    setIsExpanded(!isExpanded); // Toggle between true and false
  };

  return (
    <div className="list-view">
      {/* Clickable list name */}
      <h2 className="list-name" onClick={toggleList}>
        {listName}
      </h2>

      {/* Show items only if isExpanded is true */}
      {isExpanded && (
        <ul className="list-items">
          {items.length > 0 ? (
            items.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>No items yet!</li> // Placeholder if list is empty
          )}
        </ul>
      )}
    </div>
  );
}

export default ListView;
