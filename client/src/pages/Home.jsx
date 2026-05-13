import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Footer from "../components/Footer"
import { isAuthenticated, setRedirectPath } from "../utils/auth"
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Users, 
  Award, 
  Sparkles,
  Smartphone,
  Video,
  Clipboard,
  Ambulance as AmbulanceIcon,
  Pill,
  Clock,
  Heart,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0fdfa] relative selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      <BackgroundDecor />
      <Hero />
      <Features />
      <ConsultSection />
      <Specialities />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  )
}

// ── BACKGROUND DECOR ──────────────────────────────────────────────────────────
function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden">
       {/* Premium Grain Texture */}
       <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
       </div>

       {/* Deep Mesh Gradients */}
       <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-teal-300/30 rounded-full blur-[160px] animate-pulse"></div>
       <div className="absolute top-[10%] right-[-15%] w-[800px] h-[800px] bg-emerald-200/40 rounded-full blur-[140px]"></div>
       <div className="absolute bottom-[-20%] left-[10%] w-[1200px] h-[1200px] bg-teal-200/40 rounded-full blur-[180px] animate-float-slow"></div>
       <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px]"></div>
       
       {/* Sophisticated Animated Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948810_1px,transparent_1px),linear-gradient(to_bottom,#0d948810_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
       
       {/* Floating Geometric Ornaments */}
       <div className="absolute top-[20%] left-[15%] w-64 h-64 border-2 border-teal-500/5 rounded-full animate-spin-slow"></div>
       <div className="absolute bottom-[30%] right-[5%] w-96 h-96 border-2 border-blue-500/5 rounded-[80px] animate-float-slow"></div>
    </div>
  )
}

// ── HERO SECTION ──────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate()
  const [city, setCity] = useState("")
  const [search, setSearch] = useState("")
  const cities = ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka"]

  return (
    <div className="relative pt-8 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-full border border-teal-100 shadow-xl shadow-teal-900/5 mb-10 animate-slide-down group hover:scale-105 transition-transform cursor-default">
           <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
           </div>
           <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] group-hover:text-teal-600 transition-colors">Serving 8 Cities in Jharkhand</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8 animate-slide-up">
          Healthcare, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">Redefined for You.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-500 font-medium text-base md:text-lg leading-relaxed mb-12 animate-fade-in delay-200">
          Book top specialists, consult online, and get AI-powered insights. All on Jharkhand's most advanced digital health network.
        </p>

        {/* PREMIUM SEARCH BOX */}
        <div className="max-w-4xl mx-auto animate-slide-up delay-500">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-4 md:p-6 border border-white/50 shadow-[0_32px_64px_-16px_rgba(13,148,136,0.12)]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3 relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600">
                  <MapPin size={20} />
                </div>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent px-8 py-5 pl-14 rounded-3xl font-bold text-gray-700 focus:outline-none focus:border-teal-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="flex-1 relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search Doctors, Specialties or Symptoms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent px-6 py-5 pl-12 rounded-3xl font-medium text-gray-700 focus:outline-none focus:border-teal-500/20 transition-all placeholder:text-gray-400"
                />
              </div>

              <button 
                onClick={() => navigate("/appointment")}
                className="bg-gray-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 group/btn"
              >
                Find Care <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* INTEGRATED TRUST STATS */}
        <div className="mt-12 pt-8 border-t border-teal-100/50 flex flex-wrap justify-center gap-10 animate-fade-in delay-700">
           {[
             { label: "Doctors", value: "500+", icon: <Users size={16} /> },
             { label: "Hospitals", value: "80+", icon: <Building2 size={16} /> },
             { label: "Patients", value: "50k+", icon: <Heart size={16} /> }
           ].map((s, i) => (
             <div key={i} className="flex items-center gap-3">
                <div className="text-teal-600 opacity-60">{s.icon}</div>
                <div>
                   <div className="text-xl font-black text-gray-900">{s.value}</div>
                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}

// ── FEATURES SECTION ──────────────────────────────────────────────────────────
function Features() {
  const navigate = useNavigate()
  const features = [
    { 
      icon: <Calendar size={24} />, 
      title: "Book Appointment", 
      desc: "Instant slots at top hospitals.", 
      path: "/appointment", 
      color: "text-teal-600",
      bg: "bg-teal-50/50",
      border: "hover:border-teal-200"
    },
    { 
      icon: <Video size={24} />, 
      title: "Video Consult", 
      desc: "Connect with doctors from home.", 
      path: "/video-consult", 
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "hover:border-blue-200"
    },
    { 
      icon: <Sparkles size={24} />, 
      title: "AI Analysis", 
      desc: "Upload reports for smart insights.", 
      path: "/ai-recommend", 
      color: "text-purple-600",
      bg: "bg-purple-50/50",
      border: "hover:border-purple-200"
    },
    { 
      icon: <MapPin size={24} />, 
      title: "Nearby Services", 
      desc: "Find care closest to you.", 
      path: "/nearby", 
      color: "text-orange-600",
      bg: "bg-orange-50/50",
      border: "hover:border-orange-200"
    },
    { 
      icon: <AmbulanceIcon size={24} />, 
      title: "Emergency", 
      desc: "One-tap ambulance dispatch.", 
      path: "/ambulance", 
      color: "text-red-600",
      bg: "bg-red-50/50",
      border: "hover:border-red-200"
    },
    { 
      icon: <Pill size={24} />, 
      title: "Order Medicines", 
      desc: "Express delivery anywhere.", 
      path: "/medicines", 
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "hover:border-emerald-200"
    },
  ]

  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
           <div className="max-w-xl">
              <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Complete Network</h2>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Everything for <span className="text-gray-400">Better Health.</span></h3>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, idx) => (
            <div 
              key={f.title} 
              onClick={() => {
                if (f.path === "/appointment" && !isAuthenticated()) {
                  setRedirectPath("/appointment")
                  navigate("/login", { state: { message: "Please login to continue booking" } })
                } else {
                  navigate(f.path)
                }
              }}
              className={`group relative p-6 rounded-[32px] border border-gray-100 bg-white/90 backdrop-blur-md transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 ${f.border}`}
            >
              <div className="flex flex-col items-start">
                <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-base font-black text-gray-900 mb-1">{f.title}</h4>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{f.desc}</p>
                <div className={`mt-4 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center ${f.color} group-hover:bg-gray-50 transition-colors`}>
                   <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── CONSULT SECTION ───────────────────────────────────────────────────────────
function ConsultSection() {
  const navigate = useNavigate()
  const items = [
    { label: "Heart & BP", icon: "❤️", color: "text-red-600", bg: "bg-red-50" },
    { label: "Skin Issues", icon: "🧴", color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Child Care", icon: "👶", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Cold & Fever", icon: "🤒", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Mental Health", icon: "🧠", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Women's Health", icon: "👩‍⚕️", color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Bone & Joint", icon: "🦴", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Eye Problems", icon: "👁️", color: "text-indigo-600", bg: "bg-indigo-50" },
  ]
  return (
    <div className="py-14 px-6 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-[64px] mx-4 md:mx-10 relative overflow-hidden border border-teal-100/50">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Virtual Care</h2>
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Consult Top Doctors Online</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div 
              key={item.label} 
              onClick={() => navigate("/video-consult")}
              className="group bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-white hover:border-teal-200 transition-all duration-500 cursor-pointer shadow-lg shadow-gray-200/30 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="font-black text-gray-900 text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SPECIALITIES ──────────────────────────────────────────────────────────────
function Specialities() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const specs = [
    { name: "Cardiologist", icon: "🫀", hospitals: "RIMS, Medanta Ranchi", color: "from-red-50 to-white" },
    { name: "Neurologist", icon: "🧠", hospitals: "TMH Jamshedpur, AIIMS", color: "from-purple-50 to-white" },
    { name: "Gynecologist", icon: "👩‍⚕️", hospitals: "MGM Jamshedpur, RIMS", color: "from-pink-50 to-white" },
    { name: "Pediatrician", icon: "👶", hospitals: "Bokaro General, RIMS", color: "from-blue-50 to-white" },
    { name: "Orthopedist", icon: "🦴", hospitals: "TMH, Medanta Ranchi", color: "from-yellow-50 to-white" },
    { name: "Dermatologist", icon: "🧴", hospitals: "Orchid Medical, RIMS", color: "from-green-50 to-white" },
    { name: "Dentist", icon: "🦷", hospitals: "Dental Care, RIMS", color: "from-teal-50 to-white" },
    { name: "Ophthalmologist", icon: "👁️", hospitals: "Eye Care, Medanta", color: "from-indigo-50 to-white" },
  ]

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="py-12 px-6 relative overflow-hidden group">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-end mb-8 px-4">
          <div className="text-left">
            <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Jharkhand's Best</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Book by Speciality</h3>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => scroll('left')}
               className="w-14 h-14 rounded-2xl border-2 border-white flex items-center justify-center text-gray-400 hover:border-teal-600 hover:text-teal-600 transition-all bg-white shadow-sm active:scale-95"
             >
               <ChevronLeft size={24} />
             </button>
             <button 
               onClick={() => scroll('right')}
               className="w-14 h-14 rounded-2xl border-2 border-white flex items-center justify-center text-gray-400 hover:border-teal-600 hover:text-teal-600 transition-all bg-white shadow-sm active:scale-95"
             >
               <ChevronRight size={24} />
             </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-12 snap-x no-scrollbar px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {specs.map((s) => (
            <div 
              key={s.name} 
              onClick={() => {
                if (isAuthenticated()) {
                  navigate("/appointment")
                } else {
                  setRedirectPath("/appointment")
                  navigate("/login", { state: { message: "Please login to continue booking" } })
                }
              }}
              className={"card-hover min-w-[240px] rounded-[32px] shadow-xl shadow-teal-900/5 cursor-pointer overflow-hidden snap-start border border-white bg-gradient-to-b flex flex-col group/card transition-all duration-500 " + s.color}
            >
              <div className="h-32 flex items-center justify-center text-6xl transition-transform duration-700 group-hover/card:scale-110">
                {s.icon}
              </div>
              <div className="bg-white/80 p-6 flex-1 flex flex-col">
                <h3 className="font-black text-gray-900 text-base mb-1">{s.name}</h3>
                <p className="text-gray-400 text-[10px] font-medium leading-relaxed">{s.hospitals}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                   <p className="text-teal-600 text-[9px] font-black uppercase tracking-widest">Book Now</p>
                   <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover/card:translate-x-1 transition-transform">
                      <ArrowRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: "01", title: "Create Profile", desc: "Build your health record.", icon: <Users size={24} />, color: "bg-teal-600" },
    { step: "02", title: "Find Care", desc: "Search city or hospital.", icon: <Search size={24} />, color: "bg-blue-600" },
    { step: "03", title: "Book Instant", desc: "Book clinic or video call.", icon: <Calendar size={24} />, color: "bg-purple-600" },
    { step: "04", title: "AI Analysis", desc: "Get smart health insights.", icon: <Activity size={24} />, color: "bg-orange-600" },
  ]
  return (
    <div className="py-16 px-6 bg-gray-900 rounded-[80px] mx-4 md:mx-10 relative overflow-hidden text-white shadow-2xl shadow-teal-900/40">
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <h2 className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em] mb-4">The Process</h2>
        <h3 className="text-3xl md:text-4xl font-black mb-12">How it Works</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-white/5 -z-0"></div>
          {steps.map((s, i) => (
            <div key={s.step} className="text-center group relative z-10">
              <div className={`w-20 h-20 rounded-[28px] ${s.color} flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-gray-950/50 group-hover:scale-110 transition-all duration-500 border-4 border-gray-900`}>
                {s.icon}
              </div>
              <h3 className="font-black text-xl mb-2">{s.title}</h3>
              <p className="text-gray-400 font-medium text-xs leading-relaxed px-4">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
   const navigate = useNavigate()
   return (
     <div className="py-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-10">Ready for <br /> <span className="text-teal-600">Better Care?</span></h2>
           <p className="text-gray-500 font-medium text-lg mb-16 leading-relaxed">
              Join thousands of residents in Jharkhand who trust Svasthya Connect for their daily healthcare needs.
           </p>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate("/register")}
                className="w-full md:w-auto bg-gray-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200"
              >
                 Get Started Free
              </button>
              <button 
                onClick={() => navigate("/nearby")}
                className="w-full md:w-auto bg-white text-gray-900 border-2 border-gray-100 px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:border-teal-600 transition-all"
              >
                 Explore Network
              </button>
           </div>
        </div>
     </div>
   )
}
