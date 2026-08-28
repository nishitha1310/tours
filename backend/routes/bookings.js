import express from "express";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { tourId, fullName, phone, guestSize, bookAt, totalPrice } = req.body;
    if (!tourId || !fullName || !phone || !guestSize || !bookAt) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    if (Booking.db.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB is not connected. Start MongoDB and try the booking again."
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    if (Number(guestSize) > tour.maxGroupSize) {
      return res.status(400).json({ message: `Maximum group size is ${tour.maxGroupSize}` });
    }

    const booking = await Booking.create({
      user: req.user.id,
      tour: tour._id,
      fullName,
      phone,
      guestSize: Number(guestSize),
      bookAt: new Date(bookAt),
      totalPrice: Number(totalPrice || tour.price * Number(guestSize))
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    if (Booking.db.readyState !== 1) return res.json([]);
    const bookings = await Booking.find({ user: req.user.id })
      .populate("tour", "title city price photo")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
