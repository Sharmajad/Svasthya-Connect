import app from "./app.js"
import connectDB from "./config/db.js"

const startServer = async () => {
  await connectDB()
  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT)
  })
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") console.log("Port " + PORT + " busy. Kill it first.")
  })
}

startServer()
