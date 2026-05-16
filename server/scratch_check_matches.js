import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const HospitalSchema = new mongoose.Schema({ name: String, lat: Number, lng: Number });
const DoctorSchema = new mongoose.Schema({ name: String, hospital: String });

const Hospital = mongoose.model('Hospital', HospitalSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);

async function checkMatches() {
    await mongoose.connect(process.env.MONGO_URI);
    const doctors = await Doctor.find().limit(10);
    for (const d of doctors) {
        const h = await Hospital.findOne({ name: d.hospital });
        console.log(`Doctor: ${d.name}, Hospital: ${d.hospital}, Match found: ${!!h}`);
    }
    await mongoose.disconnect();
}

checkMatches();
