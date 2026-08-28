import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Types.ObjectId, ref: "Tour", required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    guestSize: { type: Number, required: true, min: 1 },
    bookAt: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
