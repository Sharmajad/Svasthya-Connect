import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card p-3 text-center">

        <div className="w-24 h-24 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-3xl shadow-lg border-4 border-white mb-4">
          {doctor.name?.[0]}
        </div>

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