import { useState } from "react";

function Login() {
  // Sets up local component state to track input values and handle any error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Triggers when the user clicks the "Log In" button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Submitting login for:", { email });
  
    // Attempts to send the email and password to the backend server
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Checks if the server returned a bad status code
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Saves the returned JWT token and user details into the browser's localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      console.log("Login successful! Token saved.");
      alert("Logged in successfully!");
      
    // Catches network failures or explicit errors thrown from the response validation
    } catch (err) {
      setError(err.message);
    }
  };

  // Renders the placeholder structure, error display, and form inputs
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
      <p>This is a placeholder login page for Second Serve.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <br />
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;