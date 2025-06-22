import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, NavLink } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      navigate("/"); // Redirect to home after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 15, padding: 10, fontSize: 16, borderRadius: 6, border: "1.5px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 15, padding: 10, fontSize: 16, borderRadius: 6, border: "1.5px solid #ccc" }}
        />
        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}
        <button type="submit" style={{ padding: "10px", fontSize: "16px", borderRadius: "6px", cursor: "pointer" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Don't have an account? <NavLink to="/signup" style={{ color: "#007acc" }}>Sign Up</NavLink>
      </p>
    </div>
  );
}

export default Login;
