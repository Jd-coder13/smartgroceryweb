import React, { useState } from "react";

export default function GroceryList({ groceryList, setGroceryList }) {
  const [newItem, setNewItem] = useState("");

  const addItemToGroceryList = () => {
    if (!newItem.trim()) return;
    if (!groceryList.includes(newItem.trim())) {
      setGroceryList((prev) => [...prev, newItem.trim()]);
    }
    setNewItem("");
  };

  const removeItemFromGroceryList = (item) => {
    setGroceryList((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Grocery List</h2>
      <input
        type="text"
        placeholder="Add grocery item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        style={{ padding: 8, width: "70%", fontSize: 16 }}
      />
      <button
        onClick={addItemToGroceryList}
        style={{ padding: "8px 15px", marginLeft: 10, fontSize: 16 }}
      >
        Add
      </button>

      <ul>
        {groceryList.map((item, idx) => (
          <li key={idx} style={{ marginTop: 8 }}>
            {item}{" "}
            <button
              onClick={() => removeItemFromGroceryList(item)}
              style={{ marginLeft: 10 }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
