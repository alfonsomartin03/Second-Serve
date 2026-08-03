import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Leaf } from "lucide-react";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
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

      //Quick sanitizer helper: keeps only safe characters (alphanumeric, hyphens, underscores, dots, @)
      const clean = (val) => (typeof val === "string" ? val.replace(/[^a-zA-Z0-9_\-@.]/g, "") : "");

      //Sanitize string fields before saving
      const safeToken = typeof data.token === "string" && data.token ? data.token : "";
      const safeUserId = clean(data.userId);
      const safeOrgName = clean(data.organizationName);

      //Validate against an explicit list for known enums
      const ALLOWED_ACCOUNT_TYPES = ["donor", "recipient", "admin"];
      const safeAccountType = ALLOWED_ACCOUNT_TYPES.includes(data.accountType) ? data.accountType : "";

      // Store validated values
      if (safeToken) localStorage.setItem("token", safeToken);
      if (safeUserId) localStorage.setItem("userId", safeUserId);
      if (safeAccountType) localStorage.setItem("accountType", safeAccountType);
      if (safeOrgName) localStorage.setItem("organizationName", safeOrgName);

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

        {successMessage && (
          <div
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {successMessage}
          </div>
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