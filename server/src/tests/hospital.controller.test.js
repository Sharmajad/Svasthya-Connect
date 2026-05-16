import { jest } from "@jest/globals"
import { getHospitals, getCities } from "../controllers/hospitalController.js"
import Hospital from "../models/Hospital.js"

// Mock Mongoose Model methods manually
Hospital.find = jest.fn()
Hospital.countDocuments = jest.fn()
Hospital.distinct = jest.fn()

describe("Hospital Controller Unit Tests", () => {
  let req, res

  beforeEach(() => {
    req = { query: {} }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    jest.clearAllMocks()
  })

  test("getHospitals should return paginated hospitals", async () => {
    const mockHospitals = [{ name: "H1" }]
    Hospital.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockHospitals)
    })
    Hospital.countDocuments.mockResolvedValue(1)

    await getHospitals(req, res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      hospitals: mockHospitals,
      total: 1
    }))
  })

  test("getCities should return list of cities", async () => {
    const mockCities = ["Ranchi", "Jamshedpur"]
    Hospital.distinct.mockResolvedValue(mockCities)

    await getCities(req, res)

    expect(res.json).toHaveBeenCalledWith(mockCities)
  })

  test("getHospitals should handle errors", async () => {
    Hospital.find.mockImplementation(() => {
      throw new Error("DB Error")
    })

    await getHospitals(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" })
  })
})
