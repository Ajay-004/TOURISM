import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Send, MapPin, Clock, Globe, User, X, LogOut, Sparkles } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Planner = () => {
  const [lang, setLang] = useState('en');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Trip Planner", path: "/planner" },
    { name: "Place Finder", path: "/finder" },
    { name: "Festivals", path: "/festivals" },
  ].filter(link => link.name !== "Trip Planner");

  const handleGenerate = () => {
    setItinerary("Day 1: Arrival in Chennai, visit Marina Beach and Kapaleeshwarar Temple. Enjoy local Sundal...\n\nDay 2: Drive to Mahabalipuram, explore the Shore Temple and Five Rathas...");
  };

  return (
    <div className="min-h-screen">
      {/* 1. TOP NAVBAR */}
      <nav className="fixed w-[94%] left-[3%] top-6 z-50 glass px-8 py-4 flex justify-between items-center border-white/10 shadow-xl">
        <div className="flex items-center gap-2">
          <motion.img whileHover={{ rotate: 180 }} src="https://img.icons8.com/color/48/lotus.png" className="w-8 h-8" alt="logo" />
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">TN Flow</span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-cyan-400 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="text-white/70 hover:text-cyan-400 cursor-pointer transition-colors">
            <Globe size={22}/>
          </button>
          {/* FIXED BUTTON: Added hover and better contrast */}
          <button 
            onClick={() => setIsProfileOpen(true)} 
            className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-all active:scale-95"
          >
            <User size={20} className="text-cyan-400" /> 
            <span className="font-bold text-xs uppercase hidden sm:inline text-white">Profile</span>
          </button>
        </div>
      </nav>

      {/* 2. PROFILE SIDEBAR - RESTORED AND FIXED */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsProfileOpen(false)} 
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" 
            />
            {/* Sidebar Panel */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 glass z-[70] p-10 flex flex-col border-l border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black uppercase tracking-widest text-white">Account</h2>
                <button 
                  onClick={() => setIsProfileOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white/20 mb-4">
                    <User size={40} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Traveler Explorer</h3>
                  <p className="text-white/40 text-xs mt-1 lowercase">user.tnflow@example.com</p>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-4">Current Language</p>
                   <div className="bg-white/5 p-4 rounded-xl text-white font-bold flex justify-between">
                      <span>{lang === 'en' ? 'English' : 'Tamil'}</span>
                      <Globe size={18} className="opacity-40" />
                   </div>
                </div>
              </div>

              <button 
                onClick={() => signOut(auth).then(() => navigate("/"))} 
                className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <LogOut size={16}/> End Session
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. PLANNER CONTENT */}
      <main className="pt-40 pb-20 px-10 relative z-10">
        <div className={`grid gap-10 transition-all duration-700 ease-in-out ${itinerary ? 'grid-cols-1 lg:grid-cols-2' : 'max-w-4xl mx-auto grid-cols-1'}`}>
          
          {/* LEFT SIDE: GENERATED TEXT */}
          <AnimatePresence>
            {itinerary && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="glass p-10 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden h-fit"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="text-cyan-400" size={24} />
                  <h2 className="text-2xl font-black uppercase italic text-white">Your Itinerary</h2>
                </div>
                <div className="text-white/80 leading-relaxed whitespace-pre-line space-y-4">
                  {itinerary}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT SIDE: FILLING PART */}
          <motion.div layout className="glass p-10 border-white/10 h-fit shadow-2xl">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">AI Trip Planner</h1>
            <p className="text-white/60 mb-8 font-medium">Refine your details to update the plan.</p>

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black ml-2">Starting Point</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:scale-110 transition-transform" size={18} />
                    <input type="text" placeholder="e.g. Chennai" className="auth-input-pill pl-12 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black ml-2">Duration (Days)</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:scale-110 transition-transform" size={18} />
                    <input type="number" placeholder="e.g. 3" className="auth-input-pill pl-12 w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cyan-400 font-black ml-2">Travel Style / Preferences</label>
                <textarea 
                  placeholder="e.g. I love ancient temples and spicy food..." 
                  className="auth-input-pill rounded-3xl h-32 resize-none p-6 w-full"
                />
              </div>

              <button 
                onClick={handleGenerate}
                className="btn-pill flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all w-full"
              >
                <Send size={20} className="rotate-45" /> 
                <span className="uppercase tracking-[0.2em] font-black text-xs">
                  {itinerary ? 'Re-Generate Plan' : 'Build Itinerary'}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Planner;