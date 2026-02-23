import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Send, MapPin, Globe, User, X, Sparkles, IndianRupee, 
  Menu, Home, Search, Calendar, ArrowLeft, Loader2 
} from 'lucide-react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// --- Sub-Component: Word-by-Word Typewriter ---
const WordTypewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    const words = text.split(" ");
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayedText((prev) => prev + (i === 0 ? "" : " ") + words[i]);
        i++;
      } else { clearInterval(timer); }
    }, 30);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayedText}</span>;
};

const Planner = () => {
  const [lang, setLang] = useState('en');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState({ place: '', days: '', amount: '' });
  const [userData, setUserData] = useState({ name: "Guest", email: "Not Signed In" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({
          name: user.displayName || user.email.split('@')[0],
          email: user.email
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const content = {
    en: {
      brand: "TN Flow", nav: ["Home", "Place Finder", "Festival Finder"], menu: "Navigation",
      header: "AI Trip Planner", sub: "Instant budget-based routes.",
      labelStart: "Location", labelDays: "Days", labelAmount: "Budget",
      btnBuild: "Generate Plan", btnRe: "Refresh Plan",
      itineraryTitle: "Your Route", welcome: "Enter details to start your journey",
      loadingText: "Analyzing...", id: "Identity", logout: "Sign Out",
      userLabel: "Username", emailLabel: "Email"
    },
    ta: {
      brand: "டிஎன் ஃபுளோ", nav: ["முகப்பு", "இடங்கள்", "திருவிழாக்கள்"], menu: "வழிசெலுத்தல்",
      header: "AI பயணத் திட்டம்", sub: "உடனடி வரவுசெலவுத் திட்டமிடல்.",
      labelStart: "இடம்", labelDays: "நாட்கள்", labelAmount: "தொகை",
      btnBuild: "உருவாக்கு", btnRe: "மீண்டும் உருவாக்கு",
      itineraryTitle: "உங்கள் பாதை", welcome: "தொடங்க விவரங்களை உள்ளிடவும்",
      loadingText: "கணக்கிடுகிறது...", id: "அடையாளம்", logout: "வெளியேறு",
      userLabel: "பயனர் பெயர்", emailLabel: "மின்னஞ்சல்"
    }
  }[lang];

  const paths = ["/home", "/finder", "/festivals"];
  const navIcons = [<Home size={18}/>, <Search size={18}/>, <Calendar size={18}/>];

  const handleGenerate = async () => {
    if (!formData.place || !formData.days || !formData.amount) return alert("Please fill all fields");
    setLoading(true);
    setItinerary(null);
    try {
      const response = await fetch('https://tourism-o7fr.onrender.com/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });
      const data = await response.json();
      if (data.success) {
        setItinerary(data.itinerary.replace(/[*#]/g, '').trim());
      }
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #8b5cf6 50%, #38bdf8 100%)' }}>
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex justify-center px-4">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white">
              <Menu size={24} />
            </button>
            <span className="text-xl font-black tracking-widest uppercase italic cursor-pointer" onClick={() => navigate("/home")}>{content.brand}</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {content.nav.map((item, i) => (
              <Link key={i} to={paths[i]} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-cyan-400 transition-all">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-all cursor-pointer">
              <Globe size={18}/> <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{lang === 'en' ? "தமிழ்" : "English"}</span>
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-cyan-400 shadow-xl transition-all">
              <User size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-blue-900/60 z-[100] backdrop-blur-xl" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-full max-w-xs bg-indigo-950/80 backdrop-blur-3xl border-r border-white/10 z-[110] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-16 text-blue-300 italic font-black uppercase tracking-widest text-xl">
                {content.menu}
                <X size={24} className="cursor-pointer text-white/40 hover:text-white" onClick={() => setIsMenuOpen(false)} />
              </div>
              <div className="space-y-10">
                {content.nav.map((item, i) => (
                  <Link key={i} to={paths[i]} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-5 text-lg font-bold uppercase tracking-tighter hover:text-blue-300 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-400 transition-all">{navIcons[i]}</div>
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. UPDATED PROFILE SIDEBAR */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-md" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-sm bg-blue-900/20 backdrop-blur-3xl border-l border-white/10 z-[70] p-10 md:p-12 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white italic">{content.id}</h2>
                <X size={24} className="cursor-pointer text-white/40 hover:text-white" onClick={() => setIsProfileOpen(false)} />
              </div>

              <div className="flex-1 space-y-6">
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{content.userLabel}</p>
                    <p className="text-lg font-bold italic tracking-tight text-white">{userData.name}</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{content.emailLabel}</p>
                    <p className="text-sm font-medium text-white/70 break-all">{userData.email}</p>
                 </div>
              </div>

              <button onClick={handleLogout} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all mt-auto shadow-xl">
                {content.logout}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. MAIN INTERFACE */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-7/12 order-2 lg:order-1 lg:h-[650px]">
            <div className="bg-white/5 backdrop-blur-3xl border-l-4 border-l-cyan-400 h-full flex flex-col overflow-hidden shadow-2xl relative rounded-r-[2rem]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-24 h-24 border-2 border-dashed border-cyan-400/30 rounded-full flex items-center justify-center">
                       <span className="text-xs font-black italic">TN FLOW</span>
                    </motion.div>
                    <p className="mt-6 text-[10px] uppercase tracking-[1em] text-white/40 animate-pulse">{content.loadingText}</p>
                  </div>
                ) : itinerary ? (
                  <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-white/10 bg-white/5 flex items-center gap-3">
                      <Sparkles className="text-cyan-400" size={20} />
                      <h2 className="text-xl font-black italic uppercase tracking-widest">{content.itineraryTitle}</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                      {itinerary.split('\n\n').map((dayBlock, idx) => (
                        <div key={idx} className="pb-6 border-b border-white/5 last:border-0 text-left">
                          <h3 className="text-white font-black text-lg mb-4 uppercase tracking-tight">{dayBlock.split('\n')[0]}</h3>
                          <div className="space-y-3 pl-4 border-l-2 border-cyan-400/20 text-white/80 font-light text-base">
                            {dayBlock.split('\n').slice(1).map((line, lIdx) => (
                              <p key={lIdx}><WordTypewriter text={line}/></p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
                    <h2 className="text-4xl font-black italic tracking-widest uppercase italic">AI Planner</h2>
                    <p className="text-sm mt-4 font-bold tracking-widest">{content.welcome}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div layout className="w-full lg:w-5/12 bg-white/10 backdrop-blur-xl p-10 border border-white/10 shadow-2xl h-fit order-1 lg:order-2 rounded-[2.5rem]">
            <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter leading-none">{content.header}</h1>
            <p className="text-white/40 mb-10 text-[10px] uppercase tracking-widest font-bold">{content.sub}</p>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-400 ml-4">{content.labelStart}</label>
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} /><input type="text" placeholder="Salem" className="w-full py-4 pl-12 pr-6 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-cyan-400 transition-all text-white placeholder:text-white/20" onChange={(e) => setFormData({...formData, place: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-cyan-400 ml-4">{content.labelDays}</label><input type="number" placeholder="4" className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-cyan-400 transition-all text-white" onChange={(e) => setFormData({...formData, days: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-cyan-400 ml-4">{content.labelAmount}</label><div className="relative"><IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={14} /><input type="number" placeholder="Budget" className="w-full py-4 pl-10 pr-6 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-cyan-400 transition-all text-white" onChange={(e) => setFormData({...formData, amount: e.target.value})} /></div></div>
              </div>
              <button onClick={handleGenerate} disabled={loading} className="w-full py-5 bg-white text-blue-800 rounded-full flex justify-center items-center gap-3 font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl mt-4">
                <Send size={18} className="rotate-45" />
                {itinerary ? content.btnRe : content.btnBuild}
              </button>
            </div>
          </motion.div>
      </main>
    </div>
  );
};


export default Planner;
