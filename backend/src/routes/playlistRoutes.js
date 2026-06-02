import express from "express";
import { Playlist } from "../models/Playlist.js";
import { Song } from "../models/Song.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// create playlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      owner: req.userId,
      songs: []
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// get user playlists
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.userId }).populate("songs");
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// add song to playlist
router.post("/:id/songs", authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.userId });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
