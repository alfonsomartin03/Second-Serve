import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  
  const [accountType, setAccountType] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [reserving, setReserving] = useState(false);
  const navigate = useNavigate();

const fetchDashboard = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5001/api/listing/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        setAccountType(data.accountType);
        setListings(data.data);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchDashboard();
}, []);

const reserveListing = async () => {
    console.log("Reserve endpoint hit");


    if (!pickupDate || !pickupTime) {
        alert("Please select a pickup date and time.");
        return;
    }

    try {
        setReserving(true);

        const token = localStorage.getItem("token");

        const pickupDateTime = `${pickupDate}T${pickupTime}`;

        const response = await fetch(
            `http://localhost:5001/api/listing/${selectedListing._id}/reserve`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pickupDateTime,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert("Reservation successful!");

        setSelectedListing(null);
        setPickupDate("");
        setPickupTime("");

        fetchDashboard();

    } catch (err) {
        alert(err.message);
    } finally {
        setReserving(false);
    }
};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Second Serve</h1>

        <div className="header-right">
          <span>{accountType.toUpperCase()}</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Welcome */}
      <section className="welcome-section">
        <h2>
          {accountType === "recipient"
            ? "Available Food Listings"
            : "My Listings"}
        </h2>

        <p>
          {accountType === "recipient"
            ? "Browse available food donations."
            : "Manage your active donations."}
        </p>
      </section>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search listings..."
          className="search-bar"
        />
      </div>

      {/* Listings */}
      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing.id} className="listing-card">
            <div className="listing-header">
              <h3>{listing.donor.organizationName}</h3>

              <span className={`status ${listing.status.toLowerCase()}`}>
                {listing.status}
              </span>
            </div>

            <p>
              <strong>Items:</strong> {listing.items.length}
            </p>

            <p>
              <strong>Pickup:</strong> {listing.pickupInstructions}
            </p>
            
            <p>
              <strong>Created:</strong>{" "}
              {new Date(listing.createdAt).toLocaleDateString()}
            </p>

            <button
              className="view-btn"
              onClick={() => setSelectedListing(listing)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Donor Floating Button */}
      {accountType === "donor" && (
        <button
          className="floating-btn"
          onClick={() => navigate("/create-listing")}
          >+
          </button>
      )}

      {selectedListing && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedListing(null)}
  >
    <div
      className="listing-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setSelectedListing(null)}
      >
        ✕
      </button>

      <h2>{selectedListing.donor.organizationName}</h2>

      <hr />

      <div className="detail-row">
        <strong>Status</strong>
        <span>{selectedListing.status}</span>
      </div>

      <div className="detail-row">
        <strong>Pickup</strong>
        <span>{selectedListing.pickupInstructions}</span>
      </div>

      <div className="detail-row">
        <strong>Created</strong>
        <span>
          {new Date(selectedListing.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p>
        <strong>Pickup:</strong>{" "}
        {selectedListing.pickupInstructions}
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(selectedListing.createdAt).toLocaleDateString()}
      </p>

      <h3>Food Items</h3>

      {selectedListing.items.map((item, index) => (
        <div key={index}>
          <p>
            <strong>{item.name}</strong>
          </p>

          <p>
            {item.quantity} {item.unit}
          </p>

          <p>
            Expires:{" "}
            {new Date(item.expirationDate).toLocaleDateString()}
          </p>

          <hr />
        </div>
      ))}
      {accountType === "recipient" &&
        selectedListing.status === "available" && (
          <>
            <h3>Reserve this Donation</h3>

            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="reservation-input"
            />

            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="reservation-input"
            />

            <button
              className="reserve-btn"
              onClick={reserveListing}
              disabled={reserving}
            >
              {reserving ? "Reserving..." : "Reserve Listing"}
            </button>
          </>
      )}
    </div>
  </div>
)}
    </div>
  );
}