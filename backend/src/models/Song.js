import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    duration: { type: Number }, // seconds
    audioUrl: { type: String, required: true },
    coverUrl: { type: String },
    genre: { type: String },
    popularity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
