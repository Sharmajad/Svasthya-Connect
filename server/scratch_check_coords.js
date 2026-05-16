import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const HospitalSchema = new mongoose.Schema({ name: String, lat: Number, lng: Number });
const DoctorSchema = new mongoose.Schema({ name: String, lat: Number, lng: Number });

const Hospital = mongoose.model('Hospital', HospitalSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);

async function checkCoords() {
    await mongoose.connect(process.env.MONGO_URI);
    const hospitals = await Hospital.find({ lat: { $exists: true } });
    const doctors = await Doctor.find({ lat: { $exists: true } });
    console.log(`Hospitals with coords: ${hospitals.length}`);
    console.log(`Doctors with coords: ${doctors.length}`);
    if (hospitals.length > 0) console.log('Sample hospital:', hospitals[0]);
    if (doctors.length > 0) console.log('Sample doctor:', doctors[0]);
    await mongoose.disconnect();
}

checkCoords();
