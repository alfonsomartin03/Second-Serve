import { useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [accountType] = useState(
    localStorage.getItem("accountType") || "donor"
  );
  const navigate = useNavigate();

  const listings = [
    {
      id: 1,
      organization: "UF Dining Hall",
      items: 12,
      pickup: "Loading Dock A",
      status: "Active",
    },
    {
      id: 2,
      organization: "Publix Archer Rd",
      items: 8,
      pickup: "Front Entrance",
      status: "Active",
    },
    {
      id: 3,
      organization: "Fresh Market",
      items: 15,
      pickup: "Back Door",
      status: "Pending",
    },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Second Serve</h1>

        <div className="header-right">
          <span>{accountType.toUpperCase()}</span>
          {accountType === "admin" && (
            <button
              className="admin-link-btn"
              onClick={() => navigate("/admin/accounts")}
            >
              Accounts
            </button>
          )}
          <button className="logout-btn">Logout</button>
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
              <h3>{listing.organization}</h3>

              <span className={`status ${listing.status.toLowerCase()}`}>
                {listing.status}
              </span>
            </div>

            <p>
              <strong>Items:</strong> {listing.items}
            </p>

            <p>
              <strong>Pickup:</strong> {listing.pickup}
            </p>

            <button className="view-btn">View Details</button>
          </div>
        ))}
      </div>

      {/* Donor Floating Button */}
      {accountType === "donor" && (
        <button
          className="floating-btn"
          onClick={() => navigate("/create-listing")}
        >
          +
        </button>
      )}
    </div>
  );
}