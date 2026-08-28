import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import bookingRoutes from "./routes/bookings.js";
import Tour from "./models/Tour.js";
import { demoTours } from "./data.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TourVista backend is running", health: "/api/health" });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);

async function seedTours() {
  if (mongoose.connection.readyState !== 1) return;
  const count = await Tour.countDocuments();
  if (count === 0) await Tour.insertMany(demoTours);
}

async function start() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
      await seedTours();
    } else {
      console.log("MONGO_URI is not set. Tour browsing will use demo data.");
    }
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    console.log("The server will still run; tour browsing uses demo data.");
  }

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

start();
