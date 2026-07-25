import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  
  const [accountType, setAccountType] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

        console.log("Dashboard response:", data);
        console.log("Account type:", data.accountType);

        if (!response.ok) {
          throw new Error(data.message);
        }

        setAccountType(data.accountType);
        setListings(data.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

            <button className="view-btn">View Details</button>
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
    </div>
  );
}