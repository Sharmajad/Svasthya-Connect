import { Link } from "react-router-dom"



export default Navbar


function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-teal-600">🩺 SvasthyaConnect</h1>
      <div className="flex gap-6 text-gray-700">
        <p>Find Doctors</p>
        <p>Video Consult</p>
        <p>Lab Tests</p>
        <p>Surgeries</p>
      </div>
      <button className="border border-teal-600 text-teal-600 px-4 py-1 rounded-lg">
        Login / Signup
      </button>
    </div>
  );
}