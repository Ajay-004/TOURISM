import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Star, Globe, User, X, MapPin, 
  Menu, Home, Plane, Calendar, Clock, Ticket, Briefcase, ArrowLeft 
} from 'lucide-react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// --- IMPORT EXTERNAL MASTER DATA ---
// Make sure you create this file in your data folder
import { districtsData } from '../data/districtsData';

const Finder = () => {
  const [lang, setLang] = useState('en');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  // Monitor Authentication State
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

  // --- METHOD 2 DYNAMIC LOOKUP LOGIC ---
  const filteredPlaces = districtsData[searchQuery.toLowerCase().trim().replace(/\s/g, "")] || [];

  const content = {
    en: { 
      brand: "TN Flow", nav: ["Home", "Trip Planner", "Festival Finder"], 
      header: "Tourist Place Discovery", sub: "Enter a district to reveal local gems",
      searchPlaceholder: "Search district...", id: "Identity", back: "Back to Search" 
    },
    ta: { 
      brand: "டிஎன் ஃபுளோ", nav: ["முகப்பு", "திட்டம்", "திருவிழாக்கள்"], 
      header: "சுற்றுலாத் தலம் தேடல்", sub: "மாவட்டத்தின் பெயரை உள்ளிடவும்",
      searchPlaceholder: "மாவட்டம்...", id: "அடையாளம்", back: "திரும்பிச் செல்" 
    }
  }[lang];

  const navPaths = ["/home", "/planner", "/festivals"];
  const navIcons = [<Home size={18}/>, <Plane size={18}/>, <Calendar size={18}/>];

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #8b5cf6 50%, #38bdf8 100%)' }}>
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed w-full h-16 sm:h-20 z-50 bg-black/10 backdrop-blur-2xl border-b border-white/10 flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"><Menu size={24}/></button>
            <span className="text-base sm:text-xl font-black italic tracking-widest uppercase cursor-pointer" onClick={() => navigate("/home")}>{content.brand}</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {content.nav.map((label, i) => (
              <Link key={i} to={navPaths[i]} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all">{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"><Globe size={18}/></button>
            <button onClick={() => setIsProfileOpen(true)} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"><User size={16}/></button>
          </div>
        </div>
      </nav>

      {/* 2. SIDEBARS (Mobile Menu & Profile) */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-md" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-sm bg-blue-900/20 backdrop-blur-3xl border-l border-white/10 z-[110] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6"><h2 className="text-xl font-black uppercase italic">{content.id}</h2><X size={24} className="cursor-pointer text-white/40" onClick={() => setIsProfileOpen(false)} /></div>
              <div className="flex-1 space-y-6">
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg"><p className="text-[10px] font-black text-white/40 uppercase mb-2">Username</p><p className="text-lg font-bold italic text-white break-words">{userData.name}</p></div>
                 <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg"><p className="text-[10px] font-black text-white/40 uppercase mb-2">Email</p><p className="text-sm font-medium text-white/70 break-all">{userData.email}</p></div>
              </div>
              <button onClick={() => signOut(auth).then(() => navigate("/"))} className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase text-[10px] mt-auto hover:bg-red-500 hover:text-white transition-all">Sign Out</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN INTERFACE */}
      <main className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!selectedPlace ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full text-center">
              <h1 className="text-3xl sm:text-7xl font-black uppercase italic tracking-tighter drop-shadow-2xl mb-4 break-words leading-tight">{content.header}</h1>
              <p className="opacity-40 font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] mb-8">{content.sub}</p>
              
              <div className="relative w-full max-w-2xl mx-auto mb-16">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={content.searchPlaceholder} 
                  className="w-full py-4 sm:py-6 pl-16 pr-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder:text-white/20 focus:outline-none shadow-2xl text-base sm:text-xl transition-all" 
                />
              </div>

              {/* DYNAMIC CARD GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredPlaces.map((place, i) => (
                  <motion.div key={i} whileHover={{ y: -8 }} onClick={() => setSelectedPlace(place)} className="bg-white/5 backdrop-blur-lg overflow-hidden border border-white/10 rounded-[2.5rem] shadow-xl cursor-pointer text-left flex flex-col h-full">
                    <div className="h-48 sm:h-56 relative overflow-hidden flex-shrink-0"><img src={place.img} className="w-full h-full object-cover" alt={place.name[lang]} /><div className="absolute top-4 right-4 bg-black/40 px-3 py-1 rounded-full text-[10px]"><Star size={10} className="inline mr-1 text-yellow-400"/> {place.rating}</div></div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <h3 className="text-xl font-bold leading-tight break-words">{place.name[lang]}</h3>
                      <p className="opacity-40 text-[9px] uppercase font-bold tracking-widest mt-2 flex items-center gap-1"><MapPin size={12}/>{place.city[lang]}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* 4. DETAIL PANEL */
            <motion.div key="details" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-blue-950/40 backdrop-blur-3xl p-6 sm:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl w-full max-w-6xl text-left">
              <button onClick={() => setSelectedPlace(null)} className="mb-10 text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-2 text-white/40 hover:text-white transition-colors"><ArrowLeft size={16}/> {content.back}</button>
              <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
                <div className="w-full lg:w-1/2 h-64 sm:h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"><img src={selectedPlace.img} className="w-full h-full object-cover" alt={selectedPlace.name[lang]}/></div>
                <div className="w-full lg:w-1/2 space-y-8">
                  <h2 className="text-3xl sm:text-5xl font-black italic uppercase text-blue-50 leading-tight break-words leading-none">{selectedPlace.name[lang]}</h2>
                  <p className="text-blue-100/70 leading-relaxed font-light text-base sm:text-lg">{selectedPlace.details.desc[lang]}</p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl"><div className="text-blue-300 text-[10px] font-black uppercase mb-1 flex items-center gap-2"><Clock size={16}/> TIMING</div><p className="text-xs font-bold">{selectedPlace.details.open[lang]}</p></div>
                    <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl"><div className="text-blue-300 text-[10px] font-black uppercase mb-1 flex items-center gap-2"><Ticket size={16}/> COST</div><p className="text-xs font-bold">{selectedPlace.details.cost[lang]}</p></div>
                    <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl col-span-2"><div className="text-blue-300 text-[10px] font-black uppercase mb-1 flex items-center gap-2"><Briefcase size={16}/> ESSENTIALS</div><p className="text-sm font-medium opacity-80 break-words leading-tight">{selectedPlace.details.essentials[lang]}</p></div>
                  </div>
                  <button className="w-full py-5 bg-white text-blue-800 font-black rounded-full hover:scale-105 transition-transform shadow-2xl uppercase tracking-widest text-xs">EXPLORE ROUTE</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};


export default Finder;
