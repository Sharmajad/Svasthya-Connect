import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {

    const { doctorId, date, time } = req.body;

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Doctor already booked for this time slot"
      });
    }

    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time
    });

    const savedAppointment = await appointment.save();

    res.status(201).json(savedAppointment);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("doctorId")
      .populate("patientId");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      patientId: req.user.id
    })
      .populate("doctorId")
      .populate("patientId");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to cancel this appointment"
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};