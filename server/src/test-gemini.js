import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function testGemini3() {
  const modelName = "gemini-3-flash"
  try {
    console.log(`Testing model: ${modelName}...`)
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent("Hi")
    console.log(`✅ Success with ${modelName}:`, result.response.text())
  } catch (err) {
    console.error(`❌ Failed with ${modelName}:`, err.message)
    
    // Try 3.1 if 3 fails
    const modelName2 = "gemini-3.1-flash"
    try {
        console.log(`Testing model: ${modelName2}...`)
        const model2 = genAI.getGenerativeModel({ model: modelName2 })
        const result2 = await model2.generateContent("Hi")
        console.log(`✅ Success with ${modelName2}:`, result2.response.text())
    } catch (err2) {
        console.error(`❌ Failed with ${modelName2}:`, err2.message)
    }
  }
}

testGemini3()
