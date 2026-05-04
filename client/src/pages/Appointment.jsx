import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
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
  AlertCircle
} from "lucide-react"

const API = "http://localhost:5000/api"

const slots = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"]
const todayStr = () => new Date().toISOString().split("T")[0]

export default function Appointment() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const [step, setStep] = useState(1)
  const [cities, setCities] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])

  const [city, setCity] = useState("")
  const [hospital, setHospital] = useState(null)
  const [speciality, setSpeciality] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [consultType, setConsultType] = useState("inperson")

  const [bookingErrors, setBookingErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    axios.get(API + "/hospitals/cities")
      .then((res) => setCities(res.data))
      .catch(() => setCities(["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]))
  }, [])

  useEffect(() => {
    if (!city) return
    setFetching(true)
    setHospital(null)
    setSpeciality("")
    axios.get(`${API}/hospitals?city=${city}&limit=10`)
      .then((res) => setHospitals(res.data.hospitals || res.data))
      .catch(() => setHospitals([]))
      .finally(() => setFetching(false))
  }, [city])

  useEffect(() => {
    if (!hospital) return
    setDepartments(hospital.departments || [])
    setSpeciality("")
  }, [hospital])

  useEffect(() => {
    if (!hospital || !speciality) return
    setFetching(true)
    axios.get(`${API}/doctors?hospital=${encodeURIComponent(hospital.name)}&speciality=${encodeURIComponent(speciality)}&limit=8`)
      .then((res) => {
        const docs = res.data.doctors || res.data
        console.log("Appointment Doctors fetched:", docs)
        setDoctors(docs)
      })
      .catch(() => setDoctors([]))
      .finally(() => setFetching(false))
  }, [hospital, speciality])

  const validateBooking = () => {
    const errs = {}
    if (!date) {
      errs.date = "Please select a date"
    } else if (date < todayStr()) {
      errs.date = "Date cannot be in the past"
    }
    if (!time) errs.time = "Please select a time slot"
    return errs
  }

  const handleSubmit = async () => {
    const errs = validateBooking()
    if (Object.keys(errs).length) {
      setBookingErrors(errs)
      return
    }
    setBookingErrors({})
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        API + "/appointments",
        {
          patientName: user.name,
          city,
          hospital: hospital.name,
          speciality,
          doctorName: selectedDoctor.name,
          date, time, consultType,
          fee: selectedDoctor.fee,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="text-teal-600 w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8">Your appointment has been successfully scheduled.</p>
          
          <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold">
                {selectedDoctor?.name[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{selectedDoctor?.name}</p>
                <p className="text-teal-600 text-xs font-bold uppercase tracking-wider">{speciality}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="text-gray-400 w-4 h-4 mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Hospital</p>
                  <p className="text-sm font-medium text-gray-700">{hospital?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarCheck2 className="text-gray-400 w-4 h-4 mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Schedule</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(date).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })} at {time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Consultation Fee</span>
              <span className="text-xl font-black text-teal-600">₹{selectedDoctor?.fee}</span>
            </div>
          </div>

          <button onClick={() => navigate("/dashboard")} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Book Appointment</h1>
            <p className="text-gray-400 font-medium mt-1">Experience premium healthcare at your fingertips.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100">
            <ShieldCheck className="text-teal-600 w-5 h-5" />
            <span className="text-teal-700 text-xs font-black uppercase tracking-wider">Secured Booking</span>
          </div>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="relative mb-16 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 flex justify-between">
            {[
              { icon: Building2, label: "Facility" },
              { icon: Stethoscope, label: "Specialist" },
              { icon: CalendarCheck2, label: "Confirm" }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  step > i + 1 ? "bg-teal-600 border-white text-white shadow-lg shadow-teal-100" :
                  step === i + 1 ? "bg-white border-teal-600 text-teal-600 shadow-xl" :
                  "bg-white border-gray-100 text-gray-300"
                }`}>
                  {step > i + 1 ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? "text-teal-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 1: FACILITY ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="md:col-span-4 space-y-6">
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-4">Location</h3>
                <div className="space-y-4">
                  {cities.map((c) => (
                    <button 
                      key={c} 
                      onClick={() => setCity(c)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all ${
                        city === c ? "bg-white text-teal-600 shadow-lg border border-teal-50" : "text-gray-400 hover:text-gray-600 hover:bg-white"
                      }`}
                    >
                      {c}
                      {city === c && <div className="w-2 h-2 bg-teal-500 rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-8">
              {!city ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-100 rounded-[40px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 text-gray-300">
                    <MapPin size={32} />
                  </div>
                  <p className="text-gray-400 font-bold">Select a city to explore top hospitals</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Activity className="text-teal-600" size={24} /> Available Hospitals
                  </h2>
                  <div className="grid gap-4">
                    {fetching ? (
                      [1,2,3].map(i => <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>)
                    ) : (
                      hospitals.map((h) => (
                        <div 
                          key={h._id} 
                          onClick={() => setHospital(h)}
                          className={`group p-4 rounded-3xl cursor-pointer border-2 transition-all duration-300 ${
                            hospital?._id === h._id ? "bg-teal-50 border-teal-600 shadow-lg shadow-teal-50" : "bg-white border-gray-50 hover:border-teal-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                {h.image ? (
                                  <img 
                                    src={h.image} 
                                    alt={h.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400"; }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50">
                                    <Building2 size={28} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-gray-900 text-sm">{h.name}</h4>
                                  {h.popularity >= 90 && (
                                    <span className="flex items-center gap-0.5 bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                                      <Star size={8} fill="currentColor" /> Top Rated
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{h.address}</p>
                              </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                              <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                                h.type === "Government" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                              }`}>{h.type}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {hospital && (
                    <div className="pt-6 animate-in fade-in slide-in-from-top-4">
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-4">Select Specialty</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {departments.map((dept) => (
                          <button 
                            key={dept} 
                            onClick={() => setSpeciality(dept)}
                            className={`p-3 rounded-2xl text-[11px] font-black uppercase tracking-tight text-center border-2 transition-all ${
                              speciality === dept ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-100 text-gray-500 hover:border-teal-400"
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setStep(2)} 
                    disabled={!city || !hospital || !speciality}
                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-20 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2 mt-4"
                  >
                    Find Specialists <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: DOCTORS ── */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm transition-all">
                <ArrowLeft size={18} /> Back to Search
              </button>
              <div className="text-right">
                <p className="text-teal-600 text-xs font-black uppercase tracking-widest">{speciality}</p>
                <p className="text-gray-900 font-bold text-sm">{hospital?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fetching ? (
                [1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-50 rounded-[32px] animate-pulse"></div>)
              ) : doctors.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400 font-bold">No specialists found in this department.</p>
                </div>
              ) : (
                doctors.map((doc) => (
                  <div 
                    key={doc._id} 
                    onClick={() => setSelectedDoctor(doc)}
                    className={`relative p-6 rounded-[32px] cursor-pointer border-2 transition-all duration-300 ${
                      selectedDoctor?._id === doc._id ? "bg-white border-teal-600 shadow-2xl shadow-teal-50" : "bg-white border-gray-50 hover:border-teal-200"
                    }`}
                  >
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-teal-50 shrink-0 border border-teal-100">
                        {doc.image ? (
                          <img 
                            src={doc.image} 
                            alt={doc.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-teal-600 font-black text-xl">
                            {doc.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{doc.name}</h4>
                        <div className="flex items-center gap-1 text-teal-600 text-[10px] font-black uppercase mt-1">
                          <ShieldCheck size={12} /> {doc.experience} Years Exp
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex text-orange-400"><Star size={12} fill="currentColor" /></div>
                          <span className="text-[11px] font-bold text-gray-600">{doc.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 font-medium leading-relaxed">{doc.about}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consult Fee</p>
                        <p className="text-lg font-black text-gray-900">₹{doc.fee}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        doc.available ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
                      }`}>
                        {doc.available ? "Available" : "Busy"}
                      </div>
                    </div>
                    {selectedDoctor?._id === doc._id && (
                      <div className="absolute -top-2 -right-2 bg-teal-600 text-white p-1.5 rounded-full shadow-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setStep(3)} 
              disabled={!selectedDoctor}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black disabled:opacity-20 transition-all shadow-xl shadow-gray-200 mt-12 flex items-center justify-center gap-2"
            >
              Continue to Details <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm mb-8 transition-all">
              <ArrowLeft size={18} /> Choose Another Doctor
            </button>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
              <div className="p-8 md:p-10 space-y-8">
                
                {/* Consult Type */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Consultation Mode</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "inperson", icon: Building2, label: "Visit" },
                      { id: "video", icon: Video, label: "Video" },
                      { id: "whatsapp", icon: PhoneCall, label: "Voice" }
                    ].map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setConsultType(t.id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${
                          consultType === t.id ? "bg-teal-50 border-teal-600 text-teal-600 shadow-lg shadow-teal-50" : "bg-white border-gray-50 text-gray-400 hover:border-teal-200"
                        }`}
                      >
                        <t.icon size={24} />
                        <span className="text-[10px] font-black uppercase">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Select Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={date}
                        min={todayStr()}
                        onChange={(e) => { setDate(e.target.value); setBookingErrors({}); }}
                        className={`w-full bg-gray-50 border-2 px-4 py-3.5 rounded-2xl font-bold text-sm focus:outline-none transition-all ${
                          bookingErrors.date ? "border-red-400" : "border-gray-50 focus:border-teal-600"
                        }`}
                      />
                      <CalendarCheck2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    {bookingErrors.date && <p className="text-red-500 text-[10px] font-bold px-1">{bookingErrors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Select Time</label>
                    <div className="relative">
                      <select 
                        value={time} 
                        onChange={(e) => { setTime(e.target.value); setBookingErrors({}); }}
                        className={`w-full bg-gray-50 border-2 px-4 py-3.5 rounded-2xl font-bold text-sm focus:outline-none appearance-none transition-all ${
                          bookingErrors.time ? "border-red-400" : "border-gray-50 focus:border-teal-600"
                        }`}
                      >
                        <option value="">Choose Slot</option>
                        {slots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    {bookingErrors.time && <p className="text-red-500 text-[10px] font-bold px-1">{bookingErrors.time}</p>}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-900 rounded-[32px] p-8 text-white">
                  <h3 className="text-[10px] font-black uppercase tracking-[2px] opacity-40 mb-6">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold">Patient Name</span>
                      <span className="text-sm font-bold">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold">Facility</span>
                      <span className="text-sm font-bold">{hospital?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-teal-400" size={18} />
                        <span className="text-sm font-bold">Total Payable</span>
                      </div>
                      <span className="text-2xl font-black text-teal-400">₹{selectedDoctor?.fee}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-teal-700 disabled:opacity-50 transition-all shadow-2xl shadow-teal-100 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : "Pay & Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
