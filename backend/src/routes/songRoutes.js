import express from "express";
import { Song } from "../models/Song.js";

const router = express.Router();

// GET /api/songs?search=...
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { artist: new RegExp(search, "i") },
            { album: new RegExp(search, "i") }
          ]
        }
      : {};
    const songs = await Song.find(query).sort({ popularity: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
