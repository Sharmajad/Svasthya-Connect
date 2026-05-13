import mongoose from "mongoose"
import Hospital from "./server/src/models/Hospital.js"

const MONGO_URI = "mongodb://localhost:27017/e_healthcare" // Adjust if needed

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI)
    const count = await Hospital.countDocuments()
    console.log(`Total Hospitals: ${count}`)
    const cities = await Hospital.distinct("city")
    console.log(`Cities: ${cities.join(", ")}`)
    const sample = await Hospital.findOne()
    console.log(`Sample Hospital: ${JSON.stringify(sample)}`)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

checkData()
