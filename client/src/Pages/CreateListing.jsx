import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateListing.css";

export default function CreateListing() {
  const [pickupInstructions, setPickupInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [reserving, setReserving] = useState(false);

  const [items, setItems] = useState([
    {
      name: "",
      quantity: "",
      unit: "",
      expirationDate: "",
    },
  ]);

  const handleItemChange = (index, field, value) => {
  setItems((prevItems) =>
    prevItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
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
  setLoading(true);

   console.log("Submit button clicked!");

  try {
    const token = localStorage.getItem("token");

    const listingData = {
     pickupInstructions,
     items: items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
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
  } finally {
    setLoading(false);
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
                required
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
                required
                min="1"
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

              <select
                required
                value={item.unit}
                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
              >
                <option value="" disabled hidden>
                  Select Unit
                </option>
                <option value="lbs">lbs</option>
                <option value="oz">oz</option>
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="boxes">boxes</option>
                <option value="items">items</option>
                <option value="servings">servings</option>
                <option value="bags">bags</option>
                </select>

              <input
                required
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
            disabled={loading}
          >
            {loading ? "Creating Listing..." : "Create Listing"}
          </button>

        </form>
      </div>
    </div>
  );
}