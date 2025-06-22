import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, NavLink } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20 }}>
      <h2>Sign Up</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: 15, padding: 10, fontSize: 16, borderRadius: 6, border: "1.5px solid #ccc" }}
        />
        {error && <div style={{ color: "red", marginBottom: 15 }}>{error}</div>}
        <button type="submit" style={{ padding: "10px", fontSize: "16px", borderRadius: "6px", cursor: "pointer" }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Already have an account? <NavLink to="/login" style={{ color: "#007acc" }}>Login</NavLink>
      </p>
    </div>
  );
}

export default Signup;
