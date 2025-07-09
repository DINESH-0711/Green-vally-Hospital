import React from "react";
import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";
import bgImage from "../assests/HomeBackground.jpg";
import "./Home.css";

const HeroSection = () => {
  return (
    <Box
      className="hero-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImage})`,
      }}
    >
      {/* Social Icons */}
      <Stack className="hero-social-icons">
        <IconButton sx={{ color: "#fff" }}>
          <Facebook />
        </IconButton>
        <IconButton sx={{ color: "#fff" }}>
          <Instagram />
        </IconButton>
        <IconButton sx={{ color: "#fff" }}>
          <Twitter />
        </IconButton>
        <IconButton sx={{ color: "#fff" }}>
          <LinkedIn />
        </IconButton>
      </Stack>

      {/* Center Content */}
      <Box className="hero-content">
        <Box className="hero-tagline">Quality Care Made Easy</Box>

        <Typography variant="h1" className="hero-title">
          Discover The Benefits Of <br />
          Outpatient Sedation
        </Typography>

        <Button variant="contained" className="hero-button">
          Contact Us Now
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
