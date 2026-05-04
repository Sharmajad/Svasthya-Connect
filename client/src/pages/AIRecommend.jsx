import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Upload, 
  User, 
  MapPin, 
  ChevronRight, 
  Plus, 
  X, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  Shield,
  Zap,
  ArrowLeft,
  CalendarCheck
} from "lucide-react"

export default function AIRecommend() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [view, setView] = useState("input") // 'input' or 'results'

  const handleAddSymptom = (e) => {
    e.preventDefault()
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom("")
    }
  }

  const removeSymptom = (s) => {
    setSymptoms(symptoms.filter((item) => item !== s))
  }

  const getAIRecommendation = async () => {
    if (symptoms.length === 0) return
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/api/ai/recommend", { symptoms })
      setRecommendation(res.data)
      setView("results")
    } catch (err) {
      console.error("AI Analysis failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 px-6 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        
        {view === "input" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT: INPUT AREA */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] mb-8 shadow-sm border border-teal-100">
                <Bot size={14} className="animate-pulse" /> AI Medical Intelligence
              </div>
              
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                Understand Your <span className="text-teal-600">Health</span> Better.
              </h1>
              
              <p className="text-gray-400 font-medium text-lg mb-12">
                Describe your symptoms in plain language. Our neural network will analyze patterns and suggest the most relevant specialists in Jharkhand.
              </p>

              <div className="space-y-10">
                <form onSubmit={handleAddSymptom} className="relative group">
                  <input 
                    type="text"
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    placeholder="E.g., Chronic headache, mild fever..."
                    className="w-full bg-gray-50 border-2 border-transparent px-8 py-6 rounded-[32px] font-bold text-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-all pl-16 shadow-xl shadow-gray-50"
                  />
                  <Plus className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={24} />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    Add Tag
                  </button>
                </form>

                <div className="flex flex-wrap gap-3">
                  {symptoms.length === 0 && (
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-2">No symptoms tagged yet</p>
                  )}
                  {symptoms.map((s) => (
                    <div key={s} className="bg-white border-2 border-gray-100 px-5 py-3 rounded-2xl flex items-center gap-3 animate-in zoom-in-50 duration-300 group hover:border-red-200 transition-all">
                      <span className="font-bold text-gray-700">{s}</span>
                      <button onClick={() => removeSymptom(s)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={getAIRecommendation}
                  disabled={symptoms.length === 0 || loading}
                  className="w-full bg-teal-600 text-white py-6 rounded-[32px] font-black text-[13px] uppercase tracking-[3px] shadow-2xl shadow-teal-100 hover:bg-teal-700 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Bio-data...
                    </>
                  ) : (
                    <>
                      Begin Neural Analysis <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: INFO/CARDS */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full"></div>
                <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[2px] mb-8">How it works</h3>
                <div className="space-y-8">
                  {[
                    { icon: MessageSquare, title: "Input Data", desc: "Share symptoms or reports" },
                    { icon: Zap, title: "AI Analysis", desc: "Machine learning diagnosis" },
                    { icon: CalendarCheck, title: "Get Help", desc: "Instant booking access" }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <step.icon size={22} className="text-teal-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-white/40 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 rounded-[40px] p-10 border border-teal-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="font-black text-gray-900 mb-2">Medical Reports</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                  Have a blood report or MRI scan? Upload it for a deeper contextual analysis by our AI engine.
                </p>
                <button 
                  onClick={() => navigate("/upload-report")}
                  className="flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                >
                  <Upload size={14} /> Upload Report <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* RESULTS VIEW */}
            <button 
              onClick={() => setView("input")}
              className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-12 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Input
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              <div className="lg:col-span-8 space-y-12">
                <div>
                  <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-[3px] mb-4">Neural Diagnosis</h2>
                  <h1 className="text-4xl font-black text-gray-900 leading-tight mb-8">
                    {recommendation.possible_conditions?.join(' or ') || "Clinical Insight"}
                  </h1>
                  
                  <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-gray-50">
                    <p className="text-gray-600 font-medium text-lg leading-relaxed">
                      {recommendation.recommendation}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Stethoscope className="text-teal-600" /> Recommended Specialists
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendation.suggested_specialists?.map((spec, i) => (
                      <div key={i} className="bg-white border-2 border-gray-50 p-8 rounded-[32px] hover:border-teal-600 hover:shadow-2xl transition-all group">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
                          <User size={24} />
                        </div>
                        <h4 className="font-black text-lg text-gray-900 mb-1">{spec}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Expertise Verified</p>
                        <button 
                          onClick={() => navigate("/appointment")}
                          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-100"
                        >
                          Find Doctors
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white border-2 border-gray-50 rounded-[40px] p-10 sticky top-32">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-8">Summary Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {symptoms.map(s => (
                      <span key={s} className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-tight">{s}</span>
                    ))}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Coverage</p>
                        <p className="text-xs font-black text-gray-900">All Jharkhand Centers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Analysis Confidence</p>
                        <p className="text-xs font-black text-gray-900">High Resolution</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-orange-500 mb-4">
                      <AlertCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Medical Disclaimer</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase">
                      This analysis is AI-generated and should not replace clinical professional advice.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* BOTTOM PROTOCOLS */}
        <div className="mt-20 pt-20 border-t border-gray-50">
          <div className="bg-gray-50 rounded-[48px] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-4">
                  <Activity className="text-teal-600" /> System Protocols
                </h2>
                <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
                  Our Health AI utilizes localized medical data from Ranchi, Jamshedpur, and Dhanbad to provide the most relevant specialist recommendations based on local availability.
                </p>
              </div>
              <div className="md:col-span-4">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                      <Shield size={24} />
                    </div>
                    <h3 className="font-black text-sm">Privacy Level 4</h3>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-teal-600 w-[95%]"></div>
                  </div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Encrypted Transmission Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}