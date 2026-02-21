import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Shirt, Navigation, ArrowLeft, Clock, Ticket,
  Compass, Globe, User, X, Landmark, Sparkles, Menu, Home, Plane, Search 
} from 'lucide-react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const festivalData = [
  { 
    id: 1, 
    name: { en: "Vaigasi Visakam", ta: "வைகாசி விசாகம்" },
    location: { en: "Tiruchengode Temple", ta: "திருச்செங்கோடு கோவில்" },
    type: "Festival",
    details: {
      time: { en: "6:00 AM - 10:00 PM", ta: "காலை 6:00 - இரவு 10:00" },
      cost: { en: "Free / Chariot Donation", ta: "இலவசம் / தேர்காணிக்கை" },
      clothes: { en: "Traditional Dhoti / Silk Saree", ta: "வேஷ்டி / பட்டு சேலை" },
      gear: { en: "Sunscreen, Traditional footwear", ta: "வெயில் பாதுகாப்பு, பாரம்பரிய காலணி" },
      desc: { 
        en: "Grand car festival of Lord Ardhanareeswarar. Chariots move through the four major streets.", 
        ta: "அர்த்தநாரீஸ்வரர் சுவாமிக்கான பிரம்மாண்ட தேர் திருவிழா. நான்கு ரத வீதிகளிலும் தேரோட்டம் நடைபெறும்."
      }
    },
    date: "May - June"
  },
  { 
    id: 2, 
    name: { en: "Hanuman Jayanthi", ta: "ஆஞ்சநேயர் ஜெயந்தி" },
    location: { en: "Namakkal Anjaneyar", ta: "நாமக்கல் ஆஞ்சநேயர்" },
    type: "Festival",
    details: {
      time: { en: "4:00 AM - 11:00 PM", ta: "அதிகாலை 4:00 - இரவு 11:00" },
      cost: { en: "Free", ta: "இலவசம்" },
      clothes: { en: "Ethnic Wear", ta: "பாரம்பரிய உடை" },
      gear: { en: "Vada Malai Tokens", ta: "வடை மாலை டோக்கன்கள்" },
      desc: { 
        en: "Celebration where the 18ft statue is decorated with 1,00,008 Vadais and butter.", 
        ta: "18 அடி உயர சிலைக்கு 1,00,008 வடைகள் மற்றும் வெண்ணெய் காப்பு சாற்றும் திருவிழா."
      }
    },
    date: "Dec - Jan"
  },
  { 
    id: 3, 
    name: { en: "Valvil Ori Festival", ta: "வல்வில் ஓரி விழா" },
    location: { en: "Kolli Hills", ta: "கொல்லி மலை" },
    type: "Cultural",
    details: {
      time: { en: "10:00 AM - 6:00 PM", ta: "காலை 10:00 - மாலை 6:00" },
      cost: { en: "₹50 for Entry", ta: "₹50 நுழைவு கட்டணம்" },
      clothes: { en: "Casual Comfort Wear", ta: "சாதாரண வசதியான உடைகள்" },
      gear: { en: "Sweater, Camera", ta: "கம்பளி ஆடை, கேமரா" },
      desc: { 
        en: "Annual festival celebrating the archer king of the Sangam era with archery shows.", 
        ta: "சங்க கால வில்வித்தை மன்னன் ஓரியைக் கொண்டாடும் வருடாந்திர விழா."
      }
    },
    date: "August 17-18"
  }
];

const FestivalFinder = () => {
  const [lang, setLang] = useState('en');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [userData, setUserData] = useState({ name: "Guest", email: "No Email" });
  const [selectedFestival, setSelectedFestival] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({ name: user.displayName || user.email.split('@')[0], email: user.email });
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
      header: "Heritage Events", sub: "Explore spiritual & cultural gatherings", btn: "Find Events", 
      id: "Account", nav: ["Home", "Trip Planner", "Place Finder"], menu: "Navigation",
      logout: "Sign Out", timing: "Timing", entry: "Entry", protocol: "Attire", gears: "Essentials",
      userLabel: "Username", emailLabel: "Email"
    },
    ta: { 
      header: "திருவிழாக்கள்", sub: "ஆன்மீகம் மற்றும் பண்பாட்டு நிகழ்வுகள்", btn: "கண்டறியவும்", 
      id: "அடையாளம்", nav: ["முகப்பு", "திட்டம்", "இடங்கள்"], menu: "வழிசெலுத்தல்",
      logout: "வெளியேறு", timing: "நேரம்", entry: "கட்டணம்", protocol: "வருகை உடை", gears: "தேவையானவை",
      userLabel: "பயனர் பெயர்", emailLabel: "மின்னஞ்சல்"
    }
  }[lang];

  const paths = ["/home", "/planner", "/finder"];
  const navIcons = [<Home size={18}/>, <Plane size={18}/>, <Search size={18}/>];

  const handleSearch = () => {
    setLoading(true);
    setShowEvents(false);
    setTimeout(() => {
      setLoading(false);
      setShowEvents(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #8b5cf6 50%, #38bdf8 100%)' }}>
      
      {/* 1. NAVBAR */}
      <nav className="fixed w-full h-20 z-50 bg-black/10 backdrop-blur-2xl border-b border-white/10 flex justify-center px-4">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white">
              <Menu size={22}/>
            </button>
            <span className="text-xl font-black italic tracking-widest uppercase cursor-pointer" onClick={() => navigate("/home")}>TN FLOW</span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {content.nav.map((item, i) => (
              <Link key={i} to={paths[i]} className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 hover:opacity-100">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="text-white/60 hover:text-white transition-all">
              <Globe size={18}/>
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all shadow-xl">
              <User size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE MENU SIDEBAR (Fixed Functionality) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-blue-900/60 z-[80] backdrop-blur-xl" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-full max-w-xs bg-indigo-950/60 backdrop-blur-3xl border-r border-white/10 z-[90] p-10 flex flex-col">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-xl font-black uppercase tracking-widest italic text-blue-300">{content.menu}</h2>
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

      {/* 3. PROFILE SIDEBAR (Fixed Labels) */}
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

              <button onClick={handleLogout} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all mt-auto">
                {content.logout}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. MAIN INTERFACE */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {!selectedFestival ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center">
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none">{content.header}</h1>
            <p className="opacity-40 font-bold uppercase tracking-[0.4em] text-[10px] mb-12">{content.sub}</p>
            
            <button onClick={handleSearch} className="mb-16 px-10 py-5 bg-white/10 rounded-full border border-white/20 flex items-center gap-3 mx-auto shadow-2xl hover:scale-105 transition-all">
              <Compass size={20} className={loading ? "animate-spin text-blue-400" : "text-white"}/>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{loading ? "Mapping..." : content.btn}</span>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {showEvents && festivalData.map((fest) => (
                  <motion.div key={fest.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileHover={{ y: -8 }} onClick={() => setSelectedFestival(fest)} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-8 text-left cursor-pointer group shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-10 w-10 bg-blue-400/20 rounded-xl flex items-center justify-center text-blue-300 group-hover:bg-white group-hover:text-blue-600 transition-all"><Calendar size={20}/></div>
                      <span className="text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full">{fest.date}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-1 italic uppercase">{fest.name[lang]}</h3>
                    <p className="opacity-40 text-[9px] uppercase font-black tracking-widest flex items-center gap-1"><MapPin size={12}/> {fest.location[lang]}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-indigo-950/40 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl w-full max-w-5xl text-left">
            <button onClick={() => setSelectedFestival(null)} className="mb-10 flex items-center gap-2 text-white/40 hover:text-white uppercase text-[10px] font-black transition-colors"><ArrowLeft size={16}/> Back</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-7xl font-black italic uppercase text-blue-50 leading-none break-words">{selectedFestival.name[lang]}</h2>
                <p className="text-blue-100/70 leading-relaxed font-light text-lg">{selectedFestival.details.desc[lang]}</p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4">
                  <Shirt className="text-blue-300 flex-shrink-0" size={24}/>
                  <div><p className="text-[9px] font-black text-blue-300 uppercase">{content.protocol}</p><p className="font-bold text-sm">{selectedFestival.details.clothes[lang]}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
                     <div className="text-blue-300 text-[9px] font-black uppercase mb-1 flex items-center gap-2 leading-none"><Clock size={14}/> {content.timing}</div>
                     <p className="text-xs font-bold leading-tight">{selectedFestival.details.time[lang]}</p>
                   </div>
                   <div className="p-5 bg-white/5 border border-white/10 rounded-3xl">
                     <div className="text-blue-300 text-[9px] font-black uppercase mb-1 flex items-center gap-2 leading-none"><Ticket size={14}/> {content.entry}</div>
                     <p className="text-xs font-bold leading-tight">{selectedFestival.details.cost[lang]}</p>
                   </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                  <p className="text-blue-300 text-[9px] font-black uppercase mb-1">{content.gears}</p>
                  <p className="text-sm font-medium opacity-80 leading-snug break-words">{selectedFestival.details.gear[lang]}</p>
                </div>
                <button className="w-full py-5 bg-white text-blue-800 font-black rounded-full shadow-2xl uppercase tracking-widest text-[10px] hover:scale-105 transition-all">START NAVIGATION</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FestivalFinder;