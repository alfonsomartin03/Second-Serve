import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminAccounts.css";

const API_URL = "http://localhost:5001/api/admin/users";

export default function AdminAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const accountType = localStorage.getItem("accountType");

  useEffect(() => {
    // Only admins should call the admin-only user list route.
    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load users");
        }

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accountType === "admin") {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [accountType, token]);

  const updateUserStatus = async (userId, action) => {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${userId}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: "Changed from admin accounts page",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update account");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? { ...user, accountStatus: data.accountStatus }
            : user
        )
      );

      setMessage("Account updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (accountType !== "admin") {
    return (
      <main className="admin-accounts-page">
        <section className="admin-empty">
          <h1>Admin Accounts</h1>
          <p>You need an admin account to view this page.</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-accounts-page">
      <header className="admin-accounts-header">
        <div>
          <h1>Accounts</h1>
          <p>View users and suspend or reactivate accounts.</p>
        </div>

        <Link to="/dashboard" className="dashboard-link">
          Back to dashboard
        </Link>
      </header>

      {message && <p className="admin-message">{message}</p>}
      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-loading">Loading accounts...</p>
      ) : (
        <section className="accounts-table-wrap">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.organizationName}</td>
                  <td>{user.contactName}</td>
                  <td>{user.email}</td>
                  <td>{user.accountType}</td>
                  <td>
                    <span className={`account-status ${user.accountStatus}`}>
                      {user.accountStatus}
                    </span>
                  </td>
                  <td>
                    {user.accountStatus === "suspended" ? (
                      <button
                        className="account-action reactivate"
                        onClick={() => updateUserStatus(user._id, "reactivate")}
                      >
                        Reactivate
                      </button>
                    ) : (
                      <button
                        className="account-action suspend"
                        onClick={() => updateUserStatus(user._id, "suspend")}
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
