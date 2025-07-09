import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontect"; // adjust path if needed
import "./Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // ✅ new state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
      } else {
        login(username, data.role); // Store in AuthContext
        setError("");
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" />
      <div className="login-right">
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Sign Up
          </Typography>

          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            onClick={handleSubmit}
          >
            Register
          </Button>

          <Typography align="center" variant="body2">
            Already have an account? <Link href="/login">Login</Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Signup;
