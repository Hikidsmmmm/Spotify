import express from "express";
import { LikedSong } from "../models/LikedSong.js";
import { Song } from "../models/Song.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// like a song
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const liked = await LikedSong.findOneAndUpdate(
      { user: req.userId, song: songId },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(liked);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// get liked songs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const liked = await LikedSong.find({ user: req.userId }).populate("song");
    res.json(liked.map((l) => l.song));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
