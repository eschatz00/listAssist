import React, { useState } from 'react';

function ListView({ listName, items, onRemoveItem, onMoveItem, allLists }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleList = () => setIsExpanded(!isExpanded);

  const handleMove = (targetList) => {
    if (selectedItem && targetList) {
      onMoveItem(listName, selectedItem, targetList);
      setSelectedItem(null);
    }
  };

  return (
    <div className="list-view">
      <h2 className="list-name" onClick={toggleList}>
        {listName}
      </h2>

      {isExpanded && (
        <ul className="list-items">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="list-item">
                <div className="item-content">
                  <span
                    className="item-text"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => onRemoveItem(listName, item)}
                  >
                    🗑️
                  </button>
                </div>
                {selectedItem === item && (
                  <select
                    onChange={(e) => handleMove(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Move to...
                    </option>
                    {allLists
                      .filter((list) => list !== listName)
                      .map((list) => (
                        <option key={list} value={list}>
                          {list}
                        </option>
                      ))}
                  </select>
                )}
              </li>
            ))
          ) : (
            <li>No items yet!</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default ListView;