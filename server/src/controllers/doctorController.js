import Doctor from "../models/Doctor.js";

export const addDoctor = async (req, res) => {
  try {

    const doctor = new Doctor(req.body);

    const savedDoctor = await doctor.save();

    res.status(201).json(savedDoctor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find();

    res.json(doctors);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// // get all doctors
// exports.getDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// get single doctor


export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};