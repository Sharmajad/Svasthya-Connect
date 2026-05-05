import https from "https"
import dotenv from "dotenv"

dotenv.config()

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  
  https.get(url, (res) => {
    let data = ""
    res.on("data", (chunk) => { data += chunk })
    res.on("end", () => {
      try {
        const parsed = JSON.parse(data)
        if (parsed.error) {
          console.error("API Error:", parsed.error.message)
          return
        }
        console.log("Available Models:")
        parsed.models.forEach(m => {
          if (m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`- ${m.name} (${m.displayName})`)
          }
        })
      } catch (e) {
        console.error("Parse Error:", e.message)
        console.log("Raw Response:", data)
      }
    })
  }).on("error", (err) => {
    console.error("Request Error:", err.message)
  })
}

listModels()
