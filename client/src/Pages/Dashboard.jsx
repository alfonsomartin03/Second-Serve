import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [accountType] = useState(
    localStorage.getItem("accountType") || "donor"
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const navigate = useNavigate();
  const unreadCount = notifications.filter((note) => !note.read).length;

  useEffect(() => {
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

    loadNotifications();
  }, []);

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
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
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
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {showNotifications && (
        <section className="notification-panel">
          <div className="notification-header">
            <h2>Notifications</h2>

            <button onClick={markNotificationsRead}>
              Mark all read
            </button>
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
              <strong>{note.donationName}</strong>
              <p>{note.message}</p>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
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