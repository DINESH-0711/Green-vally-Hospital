// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const validator = require("validator");
const router = express.Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Username or Password" });

    res.json({
      message: "Login successful",
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({
      message: "Username or Email already exists",
    });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, role: newUser.role },
      username: newUser.username,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

// GET /auth/users (for testing only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
