import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  availableDays: {
    type: [String],
    default: []
  }
},
{ timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);