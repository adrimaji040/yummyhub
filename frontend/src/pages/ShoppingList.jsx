import { useState } from "react";
import Header from "../components/Header.jsx";

function ShoppingList() {
  const [items, setItems] = useState([]); // State for the list of items
  const [newItem, setNewItem] = useState(""); // State for the input field

  // Function to add a new item
  const addItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, newItem]);
      setNewItem(""); // Clear the input field
    }
  };

  // Function to remove an item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <div style={{ padding: "20px", textAlign: "center", marginTop: "20px" }}>
        <h1>Shopping List</h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a new item"
            style={{ padding: "10px", width: "300px" }}
          />
          <button
            onClick={addItem}
            style={{
              backgroundColor: "dodgerblue",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              //width: "150px",
            }}
          >
            Add
          </button>
        </div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item} <button onClick={() => removeItem(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ShoppingList;