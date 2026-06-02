import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const genToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ email, password, displayName });
    const token = genToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, displayName: user.displayName }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = genToken(user._id);
    res.json({
      token,
      user: { id: user._Id, email: user.email, displayName: user.displayName }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
