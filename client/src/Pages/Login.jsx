import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, Leaf } from "lucide-react";
import "../styles/Login.css";

export default function Login() {
  // Stores the user's email, password, and any login error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Runs when the user submits the login form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError(""); // Clears any previous error messages

    try {
      // Sends the user's login credentials to the backend API
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Converts the server response into JSON format
      const data = await response.json();

      // Checks if the login request failed
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Stores the authentication token and user ID in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Temporary success notification
    } catch (err) {
      // Displays any network or authentication errors to the user
      setError(err.message);
    }
  };

  // Renders the login page UI and connects it to the authentication logic
  return (
    <div className="login-page">
      <div className="login-card">
        {/* Application logo and page heading */}
        <div className="login-header">
          <Leaf size={40} />
          <h1>Second Serve</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Displays an error message if login fails */}
        {error && <p className="login-error">{error}</p>}

        {/* Login form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          {/* Submits the login request */}
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        {/* Link to the registration page */}
        <p className="register-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        {/* Returns the user to the homepage */}
        <Link className="home-link" to="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}