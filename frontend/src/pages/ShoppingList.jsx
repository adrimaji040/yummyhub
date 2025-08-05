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
              width: "150px",
            }}
          >
            Add
          </button>
        </div>
        <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "10px" }}>Item</th>
              <th style={{ border: "1px solid black", padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "10px" }}>{item}</td>
                <td style={{ border: "1px solid black", padding: "10px" }}>
                  <button
                    onClick={() => removeItem(index)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ShoppingList;