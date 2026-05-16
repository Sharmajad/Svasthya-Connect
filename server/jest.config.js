process.env.NODE_ENV = "test"
export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["dotenv/config"],
  testTimeout: 30000,
}
