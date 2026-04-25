import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card p-3 text-center">

        <img
          src="https://via.placeholder.com/150"
          alt="doctor"
          className="card-img-top"
        />

        <h5 className="mt-3">{doctor.name}</h5>
        <p>{doctor.specialization}</p>
        <p>Experience: {doctor.experience} years</p>
        <p>Fees: ₹{doctor.fees}</p>

        <Link to={`/doctor/${doctor._id}`} className="btn btn-primary">
          View Profile
        </Link>

      </div>
    </div>
  );
};

export default DoctorCard;