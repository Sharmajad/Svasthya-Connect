import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import HospitalCard from "../components/HospitalCard"
import {
  Building2,
  Stethoscope,
  CalendarCheck2,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  Video,
  PhoneCall,
  User,
  Star,
  Activity,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  Sparkles,
  Search,
  ChevronLeft
} from "lucide-react"

const API = "http://localhost:5000/api"
const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
const todayStr = () => new Date().toISOString().split("T")[0]

export default function Appointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const [fromAI, setFromAI] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  // Data Lists & Pagination
  const [cities, setCities] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [hPage, setHPage] = useState(1)
  const [hPages, setHPages] = useState(1)
  const [hospitalsLoading, setHospitalsLoading] = useState(false)

  const [doctorsList, setDoctorsList] = useState([])
  const [dPage, setDPage] = useState(1)
  const [dPages, setDPages] = useState(1)
  const [doctorsLoading, setDoctorsLoading] = useState(false)

  // Selections
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [consultType, setConsultType] = useState("inperson")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  // Patient Details
  const [patientData, setPatientData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    age: "",
    gender: "male"
  })

  const [validationError, setValidationError] = useState("")

  // PERSISTENCE LOGIC
  useEffect(() => {
    const saved = localStorage.getItem("pendingBooking")
    if (saved) {
      const data = JSON.parse(saved)
      if (data.fromAI) setFromAI(true)
      if (data.selectedCity) setSelectedCity(data.selectedCity)
      if (data.selectedHospital) setSelectedHospital(data.selectedHospital)
      if (data.selectedDoctor) setSelectedDoctor(data.selectedDoctor)
      if (data.consultType) setConsultType(data.consultType)
      if (data.date) setDate(data.date)
      if (data.time) setTime(data.time)
      if (data.patientData) setPatientData(data.patientData)
      if (data.currentStep) setCurrentStep(data.currentStep)
    }
  }, [])

  useEffect(() => {
    const bookingContext = {
      fromAI,
      selectedCity,
      selectedHospital,
      selectedDoctor,
      consultType,
      date,
      time,
      patientData,
      currentStep
    }
    localStorage.setItem("pendingBooking", JSON.stringify(bookingContext))
  }, [fromAI, selectedCity, selectedHospital, selectedDoctor, consultType, date, time, patientData, currentStep])

  // Only jump to step 3 if we JUST arrived from AI Recommendation
  useEffect(() => {
    if (location.state?.fromAI) {
      setFromAI(true)
      setSelectedDoctor(location.state.doctor)
      setSelectedCity(location.state.city)
      setSelectedHospital(location.state.hospital)
      setCurrentStep(3)
      // We don't clear state immediately to allow one refresh, 
      // but we'll let the user exit manually if they want.
    } else if (location.state === null && !localStorage.getItem("pendingBooking")) {
      // If we arrived here fresh (no state, no saved data), ensure AI mode is off
      setFromAI(false)
    }
  }, [location.state])



  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API}/hospitals/cities`)
      setCities(res.data)
    } catch (err) { console.error("Error fetching cities", err) }
  }

  const fetchHospitals = async (page = 1) => {
    if (!selectedCity) return
    setHospitalsLoading(true)
    try {
      const res = await axios.get(`${API}/hospitals?city=${selectedCity}&page=${page}&limit=10`)
      setHospitals(res.data.hospitals || [])
      setHPages(res.data.pages || 1)
      setHPage(page)
    } catch (err) { 
      console.error("Error fetching hospitals", err)
      setHospitals([])
    }
    finally { setHospitalsLoading(false) }
  }

  const fetchDoctors = async (page = 1) => {
    if (!selectedHospital) return
    setDoctorsLoading(true)
    try {
      const res = await axios.get(`${API}/doctors?hospital=${selectedHospital}&page=${page}&limit=10`)
      setDoctorsList(res.data.doctors || [])
      setDPages(res.data.pages || 1)
      setDPage(page)
    } catch (err) { 
      console.error("Error fetching doctors", err)
      setDoctorsList([])
    }
    finally { setDoctorsLoading(false) }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      fetchHospitals(1)
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedHospital) {
      fetchDoctors(1)
    }
  }, [selectedHospital])

  const handleNext = () => {
    setValidationError("")

    if (currentStep === 4 && !token) {
      alert("Please login first to continue booking")
      localStorage.setItem("redirectAfterLogin", "/appointment")
      navigate("/login")
      return
    }

    if (currentStep === 1) {
      if (!selectedCity) return setValidationError("Please select a city")
      if (!selectedHospital) return setValidationError("Please select a hospital")
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!selectedDoctor) return setValidationError("Please select a doctor")
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (!date) return setValidationError("Please select a date")
      if (!time) return setValidationError("Please choose a time slot")
      if (!consultType) return setValidationError("Please select a mode of visit")
      setCurrentStep(4)
    } else if (currentStep === 4) {
      if (!patientData.name || !patientData.phone) return setValidationError("Please fill all patient details")
      setCurrentStep(5)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleBooking = async () => {
    if (!token) {
      setValidationError("Please login to complete your booking.")
      localStorage.setItem("redirectAfterLogin", "/appointment")
      setTimeout(() => navigate("/login", { state: { from: "/appointment" } }), 1500)
      return
    }

    setLoading(true)
    setError("")
    try {
      await axios.post(
        API + "/appointments",
        {
          patientName: patientData.name,
          patientPhone: patientData.phone,
          patientAge: patientData.age,
          patientGender: patientData.gender,
          city: selectedDoctor.city,
          hospital: selectedDoctor.hospital,
          speciality: selectedDoctor.speciality,
          doctorName: selectedDoctor.name,
          date,
          time,
          consultType,
          fee: selectedDoctor.fee,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      localStorage.removeItem("pendingBooking")
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <CheckCircle2 className="text-teal-600 w-12 h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Success!</h2>
            <p className="text-gray-500 font-medium">Your appointment with Dr. {selectedDoctor?.name} is confirmed.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 text-left border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold uppercase">
                {selectedDoctor?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-gray-900">{selectedDoctor?.name}</p>
                <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest">{selectedDoctor?.speciality}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                <p className="text-sm font-bold text-gray-700">{date}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                <p className="text-sm font-bold text-gray-700">{time}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-2xl shadow-teal-100"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const STEPS = [
    { step: 1, icon: MapPin, label: fromAI ? "AI Facility" : "Facility" },
    { step: 2, icon: Stethoscope, label: fromAI ? "AI Doctor" : "Doctor" },
    { step: 3, icon: Clock, label: "Schedule" },
    { step: 4, icon: User, label: "Patient" },
    { step: 5, icon: CreditCard, label: "Review" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/50 to-transparent -z-10"></div>
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-teal-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-[-10%] w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* MINIMAL STEPPER */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white shadow-xl shadow-gray-200/20">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
                {STEPS.map((s, idx) => (
                  <div key={s.step} className="flex flex-col items-center gap-3 bg-transparent relative z-10 px-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                      currentStep >= s.step 
                        ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100" 
                        : "bg-white border-gray-200 text-gray-300"
                    }`}>
                      {currentStep > s.step ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${currentStep >= s.step ? "text-teal-600" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTENT CARD */}
            <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-teal-900/5 overflow-hidden transition-all duration-500 min-h-[600px] flex flex-col group">
              
              <div className="p-10 flex-1 flex flex-col relative">
                
                {/* AI BADGE OVERLAY */}
                {fromAI && (
                  <div className="absolute top-8 right-10 flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-right-4">
                    <Sparkles size={14} className="text-purple-600" />
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">AI Assisted</span>
                  </div>
                )}

                {/* STEP 1: CITY & HOSPITAL */}
                {currentStep === 1 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 flex-1">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Where should we look?</h2>
                      <div className="flex flex-wrap gap-3">
                        {cities.length > 0 ? cities.map(c => (
                          <button 
                            key={c}
                            onClick={() => { setSelectedCity(c); setSelectedHospital(""); setSelectedDoctor(null); }}
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                              selectedCity === c 
                                ? "bg-teal-600 text-white shadow-lg shadow-teal-100" 
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent hover:border-teal-200"
                            }`}
                          >
                            {c}
                          </button>
                        )) : (
                          <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-24 h-10 bg-gray-50 rounded-2xl animate-pulse"></div>)}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedCity && (
                      <div className="space-y-6 pt-6 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Available Facilities</h3>
                          <div className="flex gap-2">
                             <button disabled={hPage === 1} onClick={() => fetchHospitals(hPage - 1)} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-20"><ChevronLeft size={16}/></button>
                             <button disabled={hPage === hPages} onClick={() => fetchHospitals(hPage + 1)} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-20"><ChevronRight size={16}/></button>
                          </div>
                        </div>

                        {hospitalsLoading ? (
                          <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-teal-600" size={32} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Network...</p>
                          </div>
                        ) : hospitals.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {hospitals.map(h => (
                              <div 
                                key={h._id} 
                                onClick={() => { setSelectedHospital(h.name); setCurrentStep(2); }}
                                className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer group/h ${
                                  selectedHospital === h.name ? "border-teal-600 bg-teal-50/30 shadow-xl" : "border-gray-50 bg-gray-50/50 hover:border-teal-200 hover:bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-gray-100">
                                    <Building2 size={24} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-black text-gray-900 group-hover/h:text-teal-600 transition-colors">{h.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{h.type}</p>
                                  </div>
                                  <ChevronRight size={18} className="text-gray-300 group-hover/h:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                            <Activity className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 font-bold">No hospitals found in this city.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: DOCTOR SELECTION */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Choose your Specialist</h2>
                      <p className="text-gray-400 font-medium">Available experts at {selectedHospital}.</p>
                    </div>

                    {doctorsLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-teal-600" size={32} />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {doctorsList.length > 0 ? doctorsList.map(doc => (
                          <button
                            key={doc._id}
                            onClick={() => { setSelectedDoctor(doc); setCurrentStep(3); }}
                            className={`flex flex-col gap-5 p-6 rounded-[40px] border-2 transition-all text-left relative overflow-hidden group/d ${
                              selectedDoctor?._id === doc._id ? "bg-gray-900 text-white border-gray-900 shadow-2xl" : "bg-white border-gray-50 text-gray-700 hover:border-teal-200 hover:shadow-xl"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-3xl overflow-hidden bg-teal-50 flex items-center justify-center text-teal-600 font-black text-2xl border border-teal-100 group-hover/d:scale-105 transition-transform">
                                {doc.name[0]}
                              </div>
                              <div className="flex-1">
                                <p className="font-black text-lg mb-0.5">{doc.name}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${selectedDoctor?._id === doc._id ? "text-teal-400" : "text-teal-600"}`}>{doc.speciality}</p>
                              </div>
                            </div>
                            
                            <div className={`flex items-center justify-between p-4 rounded-3xl ${selectedDoctor?._id === doc._id ? "bg-white/10" : "bg-gray-50"}`}>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Consult Fee</span>
                                <span className="text-sm font-black">₹{doc.fee}</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-400/10 rounded-full">
                                <Star size={12} className="text-orange-400 fill-current" />
                                <span className="text-[10px] font-black text-orange-400">{doc.rating || "4.9"}</span>
                              </div>
                            </div>
                          </button>
                        )) : (
                          <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                            <Stethoscope className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 font-bold">No specialists found at this location.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: SCHEDULE */}
                {currentStep === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pick a Date</h2>
                          <div className="relative group">
                            <input
                              type="date"
                              min={todayStr()}
                              value={date}
                              onChange={(e) => { setDate(e.target.value); setValidationError(""); }}
                              className="w-full bg-gray-50 border-2 border-transparent px-8 py-6 rounded-[32px] font-black text-lg text-gray-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                            />
                            <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-teal-600 transition-colors" size={24} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Consultation Mode</label>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { id: "inperson", icon: Building2, label: "In-Person Visit", desc: "Visit the hospital physically" },
                              { id: "video", icon: Video, label: "Video Consult", desc: "Safe consultation from home" },
                              { id: "whatsapp", icon: PhoneCall, label: "Audio Consult", desc: "Voice call with the specialist" }
                            ].map(m => (
                              <button
                                key={m.id}
                                onClick={() => setConsultType(m.id)}
                                className={`flex items-center gap-5 p-5 rounded-[24px] border-2 transition-all text-left group/m ${
                                  consultType === m.id 
                                    ? "bg-teal-600 border-teal-600 text-white shadow-xl shadow-teal-100" 
                                    : "bg-white border-gray-50 text-gray-500 hover:border-teal-100"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${consultType === m.id ? "bg-white/20" : "bg-gray-50 group-hover/m:bg-teal-50"}`}>
                                  <m.icon size={20} className={consultType === m.id ? "text-white" : "text-teal-600"} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-black uppercase tracking-widest">{m.label}</p>
                                  <p className={`text-[10px] ${consultType === m.id ? "text-white/70" : "text-gray-400"}`}>{m.desc}</p>
                                </div>
                                {consultType === m.id && <CheckCircle2 size={16} className="ml-auto" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <h2 className="text-3xl font-black text-gray-900 tracking-tight">Time Slot</h2>
                        <div className="grid grid-cols-2 gap-4">
                          {SLOTS.map(s => (
                            <button
                              key={s}
                              onClick={() => { setTime(s); setValidationError(""); }}
                              className={`py-6 rounded-[28px] text-[12px] font-black uppercase tracking-tight border-2 transition-all ${
                                time === s 
                                  ? "bg-gray-900 text-white border-gray-900 shadow-2xl scale-[1.02]" 
                                  : "bg-white border-gray-50 text-gray-400 hover:border-teal-200 hover:text-teal-600"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div className="mt-8 p-6 bg-teal-50 rounded-[32px] border border-teal-100 flex items-start gap-4">
                          <Clock className="text-teal-600 shrink-0" size={20} />
                          <p className="text-[10px] font-bold text-teal-700 leading-relaxed uppercase tracking-wider">
                            Appointments are subject to doctor availability and may vary by 15-20 minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PATIENT INFO */}
                {currentStep === 4 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 flex-1">
                    <div className="space-y-2 text-center max-w-lg mx-auto">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Who is visiting?</h2>
                      <p className="text-gray-400 font-medium text-sm">Please provide the patient details for the hospital record.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      <div className="space-y-4 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Patient Full Name</label>
                        <div className="relative">
                           <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-600" size={20} />
                           <input
                            type="text"
                            value={patientData.name}
                            onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                            placeholder="Full Legal Name"
                            className="w-full bg-gray-50 border-2 border-transparent pl-14 pr-8 py-6 rounded-[32px] font-black text-gray-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-4 group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                        <div className="relative">
                          <PhoneCall className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-teal-600" size={20} />
                          <input
                            type="tel"
                            value={patientData.phone}
                            onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                            placeholder="+91 XXX XXX XXXX"
                            className="w-full bg-gray-50 border-2 border-transparent pl-14 pr-8 py-6 rounded-[32px] font-black text-gray-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Patient Age</label>
                        <input
                          type="number"
                          value={patientData.age}
                          onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                          placeholder="Age in Years"
                          className="w-full bg-gray-50 border-2 border-transparent px-8 py-6 rounded-[32px] font-black text-gray-800 focus:outline-none focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Gender</label>
                        <div className="flex gap-3 bg-gray-50 p-2 rounded-[28px] border-2 border-transparent shadow-sm">
                          {["male", "female", "other"].map(g => (
                            <button
                              key={g}
                              onClick={() => setPatientData({ ...patientData, gender: g })}
                              className={`flex-1 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${
                                patientData.gender === g 
                                  ? "bg-white text-teal-600 shadow-md" 
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW */}
                {currentStep === 5 && (
                  <div className="space-y-8 animate-in fade-in zoom-in duration-700 flex-1">
                    <div className="text-center max-w-lg mx-auto mb-10">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Final Confirmation</h2>
                      <p className="text-gray-400 font-medium text-sm">One last check before we secure your appointment.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 space-y-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scheduled Date</span>
                          <p className="text-xl font-black text-gray-900 flex items-center gap-2"><Calendar size={20} className="text-teal-600" /> {date}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Time Slot</span>
                          <p className="text-xl font-black text-gray-900 flex items-center gap-2"><Clock size={20} className="text-teal-600" /> {time}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultation Mode</span>
                          <p className="text-xl font-black text-gray-900 capitalize flex items-center gap-2">
                             {consultType === 'video' ? <Video size={20} className="text-teal-600"/> : consultType === 'whatsapp' ? <PhoneCall size={20} className="text-teal-600"/> : <Building2 size={20} className="text-teal-600"/>}
                             {consultType} Visit
                          </p>
                        </div>
                      </div>

                      <div className="bg-teal-900 rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-teal-900/20">
                         <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Patient Record</span>
                          <p className="text-xl font-black">{patientData.name}</p>
                          <p className="text-xs font-bold text-white/70">{patientData.age} Years • {patientData.gender}</p>
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                           <div>
                             <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Total Amount</span>
                             <p className="text-3xl font-black">₹{selectedDoctor?.fee}</p>
                           </div>
                           <div className="bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                              <ShieldCheck size={14} className="text-teal-400" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Secured</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-dashed border-gray-100 p-8 rounded-[40px] flex items-center gap-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-teal-600 shrink-0">
                         <Lock size={32} />
                      </div>
                      <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                         By clicking confirm, you agree to our terms of service and hospital policies. A confirmation SMS will be sent to <span className="text-gray-900">{patientData.phone}</span>.
                      </p>
                    </div>
                  </div>
                )}

                {/* BOTTOM ACTION BAR */}
                <div className="pt-12 mt-auto flex flex-col gap-6">
                  <div className="flex gap-4">
                    {currentStep > (fromAI ? 3 : 1) && (
                      <button
                        onClick={handleBack}
                        className="flex-1 py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all flex items-center justify-center gap-2 bg-white"
                      >
                        <ChevronLeft size={18} /> Back
                      </button>
                    )}
                    {currentStep < 5 ? (
                      <button
                        onClick={handleNext}
                        className="flex-[2] bg-teal-600 text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-teal-700 transition-all shadow-2xl shadow-teal-100 flex items-center justify-center gap-2"
                      >
                        Continue <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handleBooking}
                        disabled={loading}
                        className="flex-[2] bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                        {loading ? "Authorizing..." : "Confirm & Pay Booking"}
                      </button>
                    )}
                  </div>

                  {validationError && (
                    <div className="flex justify-center animate-in bounce-in">
                      <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100 shadow-sm">
                        <AlertCircle size={16} /> {validationError}
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                      <AlertCircle size={20} /> {error}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY (Floating Receipts Style) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-12">
            
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 space-y-8 relative overflow-hidden group/s">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 -mr-16 -mt-16 rounded-full group-hover/s:scale-110 transition-transform duration-700"></div>
              
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] relative z-10">Booking Details</h3>

              <div className="flex gap-5 items-start relative z-10">
                <div className="w-16 h-16 bg-gray-900 rounded-[24px] overflow-hidden shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {selectedDoctor?.name?.[0] || "?"}
                </div>
                <div className="pt-1">
                  <h4 className="font-black text-gray-900 text-lg leading-tight">{selectedDoctor?.name || "Select Specialist"}</h4>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">{selectedDoctor?.speciality || "Consultation"}</p>
                  <div className="flex items-center gap-1 text-[10px] text-orange-400 font-black mt-2">
                    <Star size={10} fill="currentColor" /> {selectedDoctor?.rating || "4.9"}
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-gray-50 relative z-10">
                <div className="flex justify-between items-center group/item">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                  <span className="text-xs font-black text-gray-900 group-hover/item:text-teal-600 transition-colors">{selectedCity || "—"}</span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facility</span>
                  <span className="text-xs font-black text-gray-900 text-right group-hover/item:text-teal-600 transition-colors">{selectedHospital || "—"}</span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee</span>
                  <span className="text-xs font-black text-gray-900">₹{selectedDoctor?.fee || "0"}</span>
                </div>
                
                {fromAI && (
                  <button 
                    onClick={() => {
                      setFromAI(false);
                      setCurrentStep(1);
                      setSelectedDoctor(null);
                      localStorage.removeItem("pendingBooking");
                    }}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-100 text-[9px] font-black text-purple-600 uppercase tracking-widest hover:bg-purple-50 transition-all mt-4"
                  >
                    Exit AI Mode & Start New
                  </button>
                )}
                
                <div className="flex justify-between items-center pt-8 mt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-teal-600" />
                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Grand Total</span>
                  </div>
                  <span className="text-3xl font-black text-teal-600 tracking-tight">₹{selectedDoctor?.fee || "0"}</span>
                </div>
              </div>

              {/* TICKET MASH EFFECT */}
              <div className="absolute bottom-[-10px] left-0 w-full h-2 flex gap-2 px-4 overflow-hidden">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className="w-4 h-4 bg-gray-50 rounded-full shrink-0"></div>)}
              </div>
            </div>

            {/* TRUST BADGE CARD */}
            <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200/50 group/t">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 -mr-24 -mt-24 rounded-full group-hover/t:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} className="text-teal-400" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Booking</p>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/80">Your booking is protected by <span className="text-white font-bold underline decoration-teal-400 underline-offset-4">Svasthya Shield</span>, ensuring zero cancellation fees for the next 2 hours.</p>
                <div className="pt-2 flex items-center gap-2 text-teal-400 text-[10px] font-black uppercase tracking-widest">
                   <PhoneCall size={14} /> 24/7 Priority Support
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
