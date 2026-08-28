import express from "express";
import Tour from "../models/Tour.js";
import { demoTours } from "../data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { city, featured, search } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { city: new RegExp(search, "i") }
      ];
    }

    if (Tour.db.readyState !== 1) return res.json(demoTours);
    const tours = await Tour.find(filter).sort({ createdAt: -1 });
    res.json(tours.length ? tours : demoTours);
  } catch {
    res.json(demoTours);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (Tour.db.readyState === 1) {
      const tour = await Tour.findById(req.params.id);
      if (tour) return res.json(tour);
    }
    const fallback = demoTours.find(t => t.title.toLowerCase().replaceAll(" ", "-") === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: "Tour not found" });
  } catch {
    res.status(400).json({ message: "Invalid tour id" });
  }
});

export default router;
