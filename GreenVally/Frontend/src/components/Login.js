import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontect";
import "./Login.css"; // Ensure the CSS file exists and path is correct

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        login(data.user.username, data.user.role); // store user and role in context
        setError("");
        console.log("Current user:", data);
        navigate("/");
      }
    } catch (err) {
      setError("Server error");
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
            Login
          </Typography>

          {error && (
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ mb: 2 }}
            >
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
            label="Password"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2, mb: 1 }}
          >
            Login
          </Button>

          <Box display="flex" justifyContent="space-between">
            <Link href="/forgot-password" underline="hover" fontSize={14}>
              Forgot Password?
            </Link>
            <Link href="/signup" underline="hover" fontSize={14}>
              Sign Up
            </Link>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Login;
