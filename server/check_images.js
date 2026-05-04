import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import Hospital from "./src/models/Hospital.js"

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const hospitals = await Hospital.find({}).limit(5)
    console.log("Checking first 5 hospitals for images:")
    hospitals.forEach(h => {
      console.log(`- ${h.name}: ${h.image || "NO IMAGE"}`)
    })
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
checkDB()
