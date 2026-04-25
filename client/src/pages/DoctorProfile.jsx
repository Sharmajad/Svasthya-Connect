import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DoctorProfile = () => {

  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/doctors/${id}`)
      .then((res) => {
        setDoctor(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [id]);


  const bookAppointment = async () => {

    try {

      const appointmentData = {
        doctor: id,
        date: "2026-03-20",
        time: "10:00 AM"
      };

      await axios.post(
        "http://localhost:5000/api/appointments",
        appointmentData
      );

      alert("Appointment booked successfully");

    } catch (error) {
      console.log(error);
      alert("Error booking appointment");
    }

  };


  if (!doctor) return <h2>Loading...</h2>;

  return (
    <div className="container mt-4">

      <h2>{doctor.name}</h2>

      <p><strong>Specialization:</strong> {doctor.specialization}</p>

      <p><strong>Experience:</strong> {doctor.experience} years</p>

      <p><strong>Fees:</strong> ₹{doctor.fees}</p>

      <p><strong>Available Days:</strong> {doctor.availableDays.join(", ")}</p>

      <button
        className="btn btn-primary"
        onClick={bookAppointment}
      >
        Book Appointment
      </button>

    </div>
  );
};

export default DoctorProfile;