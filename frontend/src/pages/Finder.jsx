import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Globe, User, X, LogOut, MapPin } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Finder = () => {
  const [lang, setLang] = useState('en');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Trip Planner", path: "/planner" },
    { name: "Place Finder", path: "/finder" },
    { name: "Festivals", path: "/festivals" },
  ].filter(link => link.name !== "Place Finder");

  const places = [
    { name: "Meenakshi Amman Temple", city: "Madurai", rating: 4.9, img: "https://images.unsplash.com/photo-1621255407066-5f5086588267?q=80&w=400" },
    { name: "Ooty Hill Station", city: "The Nilgiris", rating: 4.8, img: "https://images.unsplash.com/photo-1590490359854-dfba19688d70?q=80&w=400" },
    { name: "Dhanushkodi", city: "Rameshwaram", rating: 4.7, img: "https://images.unsplash.com/photo-1582234052328-912803b30d88?q=80&w=400" },
  ];

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
          <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="text-white/70 hover:text-cyan-400 cursor-pointer">
            <Globe size={22}/>
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)} 
            className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all"
          >
            <User size={20} className="text-cyan-400" /> 
            <span className="font-bold text-xs uppercase hidden sm:inline">Profile</span>
          </button>
        </div>
      </nav>

      {/* 2. PROFILE SIDEBAR - RESTORED FIX */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsProfileOpen(false)} 
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" 
            />
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
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Traveler User</h3>
                  <p className="text-white/40 text-xs mt-1">user.tnflow@example.com</p>
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

      {/* 3. CONTENT */}
      <main className="pt-44 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-white">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Place Finder</h1>
            <p className="opacity-60 font-medium">Explore the soul of Tamil Nadu.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
            <input type="text" placeholder="Search destinations..." className="auth-input-pill pl-12 mt-0 bg-white/10 text-white w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {places.map((place, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass overflow-hidden border-white/10 group shadow-lg"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 glass px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400"/> {place.rating}
                </div>
              </div>
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-1">{place.name}</h3>
                <p className="opacity-50 text-sm mb-4 flex items-center gap-1 font-medium"><MapPin size={14}/> {place.city}</p>
                <button className="text-cyan-400 font-black uppercase text-[10px] tracking-[0.2em] hover:underline">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Finder;