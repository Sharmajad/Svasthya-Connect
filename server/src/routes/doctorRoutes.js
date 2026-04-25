import express from "express";
import { addDoctor, getDoctors, getDoctorById } from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add doctor (admin only)
router.post("/", protect, authorize("admin"), addDoctor);

// Get all doctors
router.get("/", getDoctors);

// Get doctor by ID
router.get("/:id", getDoctorById);

export default router;