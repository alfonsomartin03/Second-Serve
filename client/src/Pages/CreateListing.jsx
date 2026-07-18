import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateListing.css";

export default function CreateListing() {
  const [pickupInstructions, setPickupInstructions] = useState("");
  const navigate = useNavigate();

  const [items, setItems] = useState([
    {
      name: "",
      quantity: "",
      units: "",
      expirationDate: "",
    },
  ]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: "",
        unit: "",
        expirationDate: "",
      },
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

   console.log("Submit button clicked!");

  try {
    const token = localStorage.getItem("token");

    const listingData = {
      pickupInstructions,
      items: items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity),
        unit: item.units, // <-- change here
        expirationDate: item.expirationDate,
      })),
    };

    const response = await fetch(
      "http://localhost:5001/api/listing",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(listingData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to create listing");
    }

    alert("Listing created!");

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div className="create-listing-page">

  <header className="create-header">
    <h1>Second Serve</h1>

    <button
      className="back-btn"
      onClick={() => navigate("/dashboard")}
    >
      ← Back to Dashboard
    </button>
  </header>

  <div className="create-listing-container">

        <h1>Create New Listing</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Pickup Instructions</label>

            <textarea
              value={pickupInstructions}
              onChange={(e) =>
                setPickupInstructions(e.target.value)
              }
              placeholder="Ex: Ring doorbell and use side entrance"
              rows="4"
            />
          </div>

          <h2>Food Items</h2>

          {items.map((item, index) => (
            <div key={index} className="item-card">

              <div className="item-header">
                <h3>Item {index + 1}</h3>

                {items.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "name",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Units (lbs, boxes, gallons...)"
                value={item.units}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "units",
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={item.expirationDate}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "expirationDate",
                    e.target.value
                  )
                }
              />
            </div>
          ))}

          <button
            type="button"
            className="add-item-btn"
            onClick={addItem}
          >
            + Add Another Item
          </button>

          <button
            type="submit"
            className="submit-btn"
          >
            Create Listing
          </button>

        </form>
      </div>
    </div>
  );
}