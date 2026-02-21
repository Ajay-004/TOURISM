import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, Search, X, Globe, User,
  Calendar, ChevronRight, Menu, Plane 
} from 'lucide-react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText(""); 
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else { clearInterval(timer); }
    }, 30);
    return () => clearInterval(timer);
  }, [text]);
  return <span className="text-white/70">{displayedText}</span>;
};

const Home = () => {
  const [lang, setLang] = useState('en'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({
          name: user.displayName || user.email.split('@')[0],
          email: user.email
        });
      } else {
        setUserData({ name: "Guest", email: "Not Signed In" });
      }
    });
    return () => unsubscribe();
  }, []);

  const content = {
    en: {
      brand: "TN Flow", nav: ["Trip Planner", "Place Finder", "Festival Finder"], id: "Identity",
      menu: "Navigation",
      userLabel: "Username", emailLabel: "Email Address", logout: "SIGN OUT",
      btn: "Initiate Exploration",
      features: [
        { title: "Trip Planner", tagline: "AI-POWERED ITINERARY", desc: "Let AI design your perfect Tamil Nadu journey, optimized for time and local charm." },
        { title: "Place Finder", tagline: "DESTINATION DISCOVERY", desc: "From the mist-covered peaks of Ooty to the sapphire waves of Dhanushkodi, find your next sanctuary." },
        { title: "Festival Finder", tagline: "CULTURAL CALENDAR", desc: "Live updates on temple festivals, cultural events, and local celebrations within your radius." }
      ]
    },
    ta: {
      brand: "டிஎன் ஃபுளோ", nav: ["திட்டம்", "இடங்கள்", "திருவிழாக்கள்"], id: "அடையாளம்",
      menu: "வழிசெலுத்தல்",
      userLabel: "பயனர் பெயர்", emailLabel: "மின்னஞ்சல் முகவரி", logout: "வெளியேறு",
      btn: "ஆராய்ந்து பாருங்கள்",
      features: [
        { title: "பயணத் திட்டம்", tagline: "AI-பவர் வழிகாட்டி", desc: "செயற்கை நுண்ணறிவு உங்கள் பயணத்தை வடிவமைக்கட்டும், நேரம் மற்றும் அழகிற்காக மேம்படுத்தப்பட்டது." },
        { title: "இடங்கள்", tagline: "இலக்கு கண்டுபிடிப்பு", desc: "ஊட்டியின் பனி மூடிய சிகரங்கள் முதல் தனுஷ்கோடியின் நீல அலைகள் வரை உங்கள் அடுத்த புகலிடத்தைக் கண்டறியவும்." },
        { title: "திருவிழாக்கள்", tagline: "கலாச்சார நாட்காட்டி", desc: "கோவில் திருவிழாக்கள் மற்றும் கலாச்சார நிகழ்வுகளின் நேரலை தகவல்களை உங்கள் அருகிலேயே பெறுங்கள்." }
      ]
    }
  }[lang];

  // FIX: Icons array must match the number of features (3)
  const icons = [<Compass size={56} />, <Search size={56} />, <Calendar size={56} />];
  const navIcons = [<Plane size={18}/>, <Search size={18}/>, <Calendar size={18}/>];
  const paths = ["/planner", "/finder", "/festivals"];

  useEffect(() => {
    // FIX: Changed % 4 to % 3 to prevent index out-of-bounds error
    const timer = setInterval(() => {
      setActiveIndex(p => (p + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsProfileOpen(false);
      navigate("/");
    });
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden text-white font-sans"
      style={{ background: 'linear-gradient(135deg, #8b5cf6 50%, #38bdf8 100%)' }}
    >
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-black/10 backdrop-blur-2xl border-b border-white/10 flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white lg:hidden">
              <Menu size={24} />
            </button>
            <span className="text-lg md:text-xl font-black italic tracking-widest uppercase cursor-pointer" onClick={() => navigate("/home")}>
              {content.brand}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {content.nav.map((item, i) => (
              <Link key={i} to={paths[i]} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="text-white/60 hover:text-white transition-all cursor-pointer">
              <Globe size={18}/> <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{lang === 'en' ? "தமிழ்" : "English"}</span>
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer shadow-xl">
              <User size={16} className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-xl" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 h-full w-full max-w-xs bg-indigo-950/40 backdrop-blur-3xl border-r border-white/10 z-[90] p-10 flex flex-col">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-xl font-black uppercase tracking-widest italic text-white">{content.menu}</h2>
                <X size={24} className="cursor-pointer text-white/40 hover:text-white" onClick={() => setIsMenuOpen(false)} />
              </div>
              <div className="space-y-10">
                {content.nav.map((item, i) => (
                  <Link key={i} to={paths[i]} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-5 text-lg font-bold uppercase tracking-tighter hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-all text-white">{navIcons[i]}</div>
                    <span className="text-white">{item}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. IDENTITY SIDEBAR */}
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

      {/* 4. HERO SECTION */}
      <main className="min-h-screen pt-24 md:pt-32 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          
          <div className="relative flex justify-center items-center h-[250px] md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }} className="absolute">
                <div className="absolute inset-0 -z-10 bg-white/10 rounded-full blur-[100px] scale-150 animate-pulse" />
                <div className="w-40 h-40 md:w-72 md:h-72 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/10 backdrop-blur-md border-2 border-white flex items-center justify-center text-white shadow-2xl">
                  {icons[activeIndex]}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 md:bottom-4 flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i === activeIndex ? 'w-12 bg-white' : 'w-4 bg-white/20'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 pl-0 md:pl-10 lg:border-l-2 border-white/20">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                <span className="text-[10px] md:text-xs font-black text-white/60 tracking-[0.5em] uppercase block mb-4">
                  {content.features[activeIndex].tagline}
                </span>
                <h1 className={`font-black italic tracking-tighter uppercase mb-6 leading-[0.9] break-words ${
                  lang === 'ta' ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-5xl md:text-8xl'
                }`}>
                  {content.features[activeIndex].title}
                </h1>
                <div className="min-h-[120px] md:min-h-[160px]">
                  <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed mb-10 max-w-lg">
                    <Typewriter key={activeIndex} text={content.features[activeIndex].desc} />
                  </p>
                </div>
                <motion.button onClick={() => navigate(paths[activeIndex])} whileHover={{ x: 10 }} className="group flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </span>
                  {content.btn}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;