import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Compass, Search, User, LogOut, Menu, X, Globe } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Navbar = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <motion.img 
              whileHover={{ rotate: 15 }}
              src="https://img.icons8.com/color/48/lotus.png" 
              alt="Logo" className="w-10 h-10" 
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">
              TN Flow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/finder" icon={<Search size={18}/>} label={lang === 'en' ? 'Place Finder' : 'இடங்கள்'} />
            <NavLink to="/map" icon={<Map size={18}/>} label={lang === 'en' ? 'Live Map' : 'வரைபடம்'} />
            <NavLink to="/planner" icon={<Compass size={18}/>} label={lang === 'en' ? 'AI Planner' : 'திட்டமிடுபவர்'} />
            
            <button 
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="p-2 hover:bg-orange-50 rounded-full text-orange-600 transition-colors"
            >
              <Globe size={20} />
            </button>

            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-red-500 font-semibold transition-colors">
              <LogOut size={18}/> {lang === 'en' ? 'Logout' : 'வெளியேறு'}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-orange-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-semibold transition-all hover:scale-105">
    {icon} <span>{label}</span>
  </Link>
);

export default Navbar;