import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Leaf } from "lucide-react";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      if (data.accountType) {
        localStorage.setItem("accountType", data.accountType);
      }

      if (data.organizationName) {
        localStorage.setItem(
          "organizationName",
          data.organizationName
        );
      }

      alert("Logged in successfully!");

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <Leaf size={40} />
          <h1>Second Serve</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <div className="input-group">
              <Mail size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="login-btn"
          >
            Log In
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>

        <Link
          className="home-link"
          to="/"
        >
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}