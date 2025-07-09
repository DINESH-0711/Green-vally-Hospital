import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
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
          <Typography variant="h5" mb={3} align="center">
            Forgot Password
          </Typography>
          {submitted ? (
            <Typography align="center" color="green">
              Password reset instructions sent to your email.
            </Typography>
          ) : (
            <>
              <TextField
                fullWidth
                label="username"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Typography align="center" variant="body2">
                Back to <Link href="/login">Login</Link>
              </Typography>
            </>
          )}
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
