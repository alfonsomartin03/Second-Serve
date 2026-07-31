import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [accountType, setAccountType] = useState(
    localStorage.getItem("accountType") || "donor"
  );
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [reserving, setReserving] = useState(false);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");

  //Search filter states
  const [foodName, setFoodName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const navigate = useNavigate();
  const unreadCount = notifications.filter((note) => !note.read).length;

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5001/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load notifications");
      }

      setNotifications(data);
    } catch (err) {
      setNotificationError(err.message);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch("http://localhost:5001/api/notifications/read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update notifications");
      }

      setNotifications(
        notifications.map((note) => ({
          ...note,
          read: true,
        }))
      );
    } catch (err) {
      setNotificationError(err.message);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete notification");
      }

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
      setNotifications(
        notifications.filter((note) => note._id !== notificationId)
      );
    } catch (err) {
      setNotificationError(err.message);
    }
  };

  const openNotifications = () => {
    const nextShowNotifications = !showNotifications;
    setShowNotifications(nextShowNotifications);

    if (nextShowNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      //Build query string dynamically based on non-empty values
      const queryParams = new URLSearchParams();
      if (foodName) queryParams.append("foodName", foodName);
      if (city) queryParams.append("city", city);
      if (state) queryParams.append("state", state);
      if (zipCode) queryParams.append("zipCode", zipCode);

      //Fetch from public/search route when searching, or dashboard route on load
      const url = queryParams.toString()
      ? `http://localhost:5001/api/listing?${queryParams.toString()}`
      : "http://localhost:5001/api/listing/dashboard";
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      console.log("Dashboard response:", data);
      console.log("Account type:", data.accountType);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.accountType) setAccountType(data.accountType);
      setListings(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    loadNotifications();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    fetchDashboard();
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const getUserId = (user) => {
    if (!user) return null;
    return typeof user === "string" ? user : user._id;
  };

  const canConfirmPickup =
    selectedListing &&
    selectedListing.status?.toLowerCase() === "reserved" &&
    (
      getUserId(selectedListing.donor) === currentUserId ||
      getUserId(selectedListing.reservedBy) === currentUserId ||
      getUserId(selectedListing.recipient) === currentUserId
    );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Second Serve</h1>

        <div className="header-right">
          <span>{accountType.toUpperCase()}</span>
          <button
            className="notification-btn"
            onClick={openNotifications}
          >
            Notifications ({unreadCount})
          </button>

          {accountType === "admin" && (
            <button
              className="admin-link-btn"
              onClick={() => navigate("/admin/accounts")}
            >
              Accounts
            </button>
          )}
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

      {showNotifications && (
        <section className="notification-panel">
          <div className="notification-header">
            <h2>Notifications</h2>
          </div>

          {notificationError && (
            <p className="notification-error">{notificationError}</p>
          )}

          {notifications.length === 0 && !notificationError && (
            <p>No notifications yet.</p>
          )}

          {notifications.map((note) => (
            <div
              key={note._id}
              className={note.read ? "notification-item" : "notification-item unread"}
            >
              <div>
                <strong>{note.donationName}</strong>
                <p>{note.message}</p>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>

              <button
                className="delete-notification-btn"
                onClick={() => deleteNotification(note._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      )}

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

      {/* Multi-field Search Form */}
      <form className="search-container" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Food item (e.g. Bread)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="search-bar"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Listings */}
      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing._id || listing.id} className="listing-card">
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

            <h3>Food Items</h3>

            {selectedListing.items.map((item, index) => (
              <div key={item._id || index}>
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
      {canConfirmPickup && (
        <button
          type="button"
          className="confirm-pickup-btn"
          onClick={() =>
            alert("Pickup confirmation functionality will be added soon.")
          }
        >
          Confirm Pickup
        </button>
      )}
    </div>
  </div>
)}
    </div>
  );
}