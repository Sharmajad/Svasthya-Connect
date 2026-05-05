import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
  AlertCircle,
  Loader2,
  Calendar,
  Lock
} from "lucide-react"

const API = "http://localhost:5000/api"
const SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
const todayStr = () => new Date().toISOString().split("T")[0]

export default function Appointment() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Selections
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [consultType, setConsultType] = useState("") // 'inperson', 'video', 'whatsapp'
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/appointment" } })
    }
  }, [token, navigate])

  useEffect(() => {
    if (location.state?.doctor) {
      setSelectedDoctor(location.state.doctor)
    } else {
      // If no doctor passed, go back or show selection (user said skip doctor selection if from AI)
      // For now, let's assume they MUST come from AI or I'll redirect them to Home
      if (currentStep === 1 && !selectedDoctor) {
        navigate("/")
      }
    }
  }, [location.state, navigate])

  const handleNext = () => {
    setValidationError("")
    if (currentStep === 1) {
      if (!consultType) return setValidationError("Please select a mode of visit")
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!date) return setValidationError("Please select a date")
      if (!time) return setValidationError("Please choose a time slot")
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleBooking = async () => {
    setLoading(true)
    setError("")
    try {
      await axios.post(
        API + "/appointments",
        {
          patientName: user.name,
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
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <CheckCircle2 className="text-green-600 w-12 h-12" />
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
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{selectedDoctor?.speciality}</p>
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
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* STEPPER HEADER */}
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured Booking Flow</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Complete Your Booking</h1>
          
          <div className="relative pt-8">
            <div className="absolute top-[52px] left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div 
              className="absolute top-[52px] left-0 h-1 bg-blue-600 rounded-full z-0 transition-all duration-700"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
            <div className="relative z-10 flex justify-between">
              {[
                { step: 1, icon: Activity, label: "Mode" },
                { step: 2, icon: Clock, label: "Schedule" },
                { step: 3, icon: CreditCard, label: "Review" }
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 ${
                    currentStep >= s.step ? "bg-blue-600 border-white text-white shadow-xl shadow-blue-100" : "bg-white border-gray-100 text-gray-300"
                  }`}>
                    {currentStep > s.step ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= s.step ? "text-blue-600" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden min-h-[500px] flex flex-col">
              
              <div className="p-10 flex-1 flex flex-col">
                
                {/* STEP 1: MODE OF VISIT */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">How would you like to consult?</h2>
                      <p className="text-gray-400 font-medium">Select your preferred mode of consultation with the doctor.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { id: "inperson", icon: Building2, label: "Hospital Visit", desc: "Physical checkup at clinic" },
                        { id: "video", icon: Video, label: "Video Call", desc: "Consult from home via video" },
                        { id: "whatsapp", icon: PhoneCall, label: "Voice/Chat", desc: "Quick consult via phone" }
                      ].map(m => (
                        <button 
                          key={m.id}
                          onClick={() => { setConsultType(m.id); setValidationError(""); }}
                          className={`flex flex-col items-center text-center p-8 rounded-[32px] border-4 transition-all group ${
                            consultType === m.id ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-100" : "bg-gray-50 border-transparent hover:border-blue-200"
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${
                            consultType === m.id ? "bg-white/20 text-white" : "bg-white text-blue-600 shadow-sm group-hover:scale-110"
                          }`}>
                            <m.icon size={32} />
                          </div>
                          <span className="text-sm font-black uppercase tracking-widest mb-2">{m.label}</span>
                          <span className={`text-[10px] font-medium leading-relaxed ${consultType === m.id ? "text-blue-100" : "text-gray-400"}`}>
                            {m.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: SCHEDULE */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">When are you available?</h2>
                      <p className="text-gray-400 font-medium">Choose a convenient date and time slot for your appointment.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Date</label>
                        <div className="relative group">
                          <input 
                            type="date"
                            min={todayStr()}
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setValidationError(""); }}
                            className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
                          />
                          <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-blue-600" size={20} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Time Slot</label>
                        <div className="grid grid-cols-2 gap-3">
                          {SLOTS.map(s => (
                            <button 
                              key={s}
                              onClick={() => { setTime(s); setValidationError(""); }}
                              className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-tight border-2 transition-all ${
                                time === s ? "bg-gray-900 text-white border-gray-900 shadow-lg" : "bg-white border-gray-100 text-gray-500 hover:border-blue-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW & PAYMENT */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900">Final Review</h2>
                      <p className="text-gray-400 font-medium">Review your details and proceed to secure payment.</p>
                    </div>

                    <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 space-y-6">
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <User size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Patient</span>
                        </div>
                        <span className="font-bold text-gray-900">{user.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <MapPin size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Consult Mode</span>
                        </div>
                        <span className="font-bold text-gray-900 capitalize">{consultType}</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <CalendarCheck2 size={20} />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</span>
                        </div>
                        <span className="font-bold text-gray-900">{date} at {time}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4">
                      <Lock className="text-blue-600 shrink-0" size={24} />
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed">
                        Your payment is secured with end-to-end encryption and verified by top medical associations.
                      </p>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="pt-10 mt-auto flex gap-4">
                  {currentStep > 1 && (
                    <button 
                      onClick={handleBack}
                      className="flex-1 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button 
                      onClick={handleNext}
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleBooking}
                      disabled={loading}
                      className="flex-[2] bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                      {loading ? "Processing..." : "Confirm & Pay Booking"}
                    </button>
                  )}
                </div>

                {validationError && (
                  <div className="mt-6 flex justify-center animate-in bounce-in">
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                      <AlertCircle size={14} /> {validationError}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-12">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 space-y-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking Summary</h3>
              
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  {selectedDoctor?.image ? (
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-black text-xl bg-blue-50">
                      {selectedDoctor?.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-gray-900">{selectedDoctor?.name || "Dr. Loading..."}</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{selectedDoctor?.speciality}</p>
                  <div className="flex items-center gap-1 text-[10px] text-orange-400 font-black mt-1">
                    <Star size={10} fill="currentColor" /> {selectedDoctor?.rating || "4.9"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Hospital</span>
                  <span className="text-xs font-black text-gray-900 text-right">{selectedDoctor?.hospital || "Select Facility"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Consult Fee</span>
                  <span className="text-xs font-black text-gray-900">₹{selectedDoctor?.fee || "0"}</span>
                </div>
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    <span className="text-sm font-black text-gray-900">Total</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">₹{selectedDoctor?.fee || "0"}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[40px] text-white relative overflow-hidden shadow-xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Patient Support</p>
              <p className="text-sm font-bold leading-relaxed mb-6">Need help with your booking? Our medical team is online 24/7 to assist you.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <PhoneCall size={16} /> Contact Support
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
