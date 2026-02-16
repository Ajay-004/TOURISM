import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Globe, MapPin, User, Mail, Phone, Calendar, Landmark } from 'lucide-react';
import { auth, db } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import LoadingAnimation from "../components/LoadingAnimation";

const translations = {
  en: {
    title: "TN Flow",
    createAccount: "Join the Journey",
    loginLink: "Already have an account? Login",
    signup: "Sign Up",
    fields: { username: "Username", email: "Email ID", password: "Password", confirm: "Confirm Password", phone: "Phone Number", state: "State", dob: "Date of Birth" },
    placeholders: { username: "Enter your name", email: "you@example.com", phone: "10-digit mobile number", state: "Select your state" },
    errors: {
      match: "Passwords do not match!",
      email: "Please enter a valid email address.",
      phone: "Phone number must be exactly 10 digits.",
      generic: "Registration failed. Please try again."
    }
  },
  ta: {
    title: "TN Flow",
    createAccount: "பயணத்தில் சேருங்கள்",
    loginLink: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    signup: "பதிவு செய்க",
    fields: { username: "பயனர் பெயர்", email: "மின்னஞ்சல் ஐடி", password: "கடவுச்சொல்", confirm: "கடவுச்சொல்லை உறுதிப்படுத்தவும்", phone: "தொலைபேசி எண்", state: "மாநிலம்", dob: "பிறந்த தேதி" },
    placeholders: { username: "உங்கள் பெயரை உள்ளிடவும்", email: "you@example.com", phone: "10-இலக்க எண்", state: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்" },
    errors: {
      match: "கடவுச்சொற்கள் பொருந்தவில்லை!",
      email: "செல்லுபடியாகும் மின்னஞ்சலை உள்ளிடவும்.",
      phone: "தொலைபேசி எண் 10 இலக்கங்களாக இருக்க வேண்டும்.",
      generic: "பதிவு தோல்வியுற்றது."
    }
  }
};

const Signup = () => {
  const [lang, setLang] = useState('en');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false); // New state for second eye
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirm: '', phone: '', state: '', dob: ''
  });
  
  const navigate = useNavigate();
  const t = translations[lang];

  // Validation Logic
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return t.errors.email;
    if (formData.phone.length !== 10) return t.errors.phone;
    if (formData.password !== formData.confirm) return t.errors.match;
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        phone: formData.phone,
        state: formData.state,
        dob: formData.dob,
        email: formData.email,
        createdAt: new Date()
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-8 relative overflow-y-auto">
      <AnimatePresence>{loading && <LoadingAnimation />}</AnimatePresence>

      <div className="w-full max-w-2xl flex justify-end mb-4 sm:absolute sm:top-6 sm:right-6 sm:mb-0">
        <button 
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="bg-white/20 backdrop-blur-lg border border-white/40 px-4 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/30 transition-all z-50"
        >
          <Globe size={14} /> {lang === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-2xl p-6 md:p-12 z-10"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1 text-white font-bold text-2xl md:text-3xl times new roman drop-shadow-md">
           {t.title}
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">{t.createAccount}</h2>
        </div>

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Username */}
          <div className="flex flex-col">
            <label className="auth-label"><User size={12} className="inline mr-1"/> {t.fields.username}</label>
            <input type="text" required className="auth-input-pill" placeholder={t.placeholders.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="auth-label"><Mail size={12} className="inline mr-1"/> {t.fields.email}</label>
            <input type="email" required className="auth-input-pill" placeholder={t.placeholders.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="auth-label">{t.fields.password}</label>
            <input type={showPass ? "text" : "password"} required className="auth-input-pill" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[34px] text-white/40 hover:text-white">
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label className="auth-label">{t.fields.confirm}</label>
            <input type={showConfirmPass ? "text" : "password"} required className="auth-input-pill" onChange={(e) => setFormData({...formData, confirm: e.target.value})} />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-[34px] text-white/40 hover:text-white">
              {showConfirmPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>

          {/* Phone (Now Required) */}
          <div className="flex flex-col">
            <label className="auth-label"><Phone size={12} className="inline mr-1"/> {t.fields.phone}</label>
            <input 
                type="number" 
                required 
                className="auth-input-pill [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                placeholder={t.placeholders.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="auth-label"><Landmark size={12} className="inline mr-1"/> {t.fields.state}</label>
            <select required className="auth-input-pill appearance-none" onChange={(e) => setFormData({...formData, state: e.target.value})}>
              <option value="" className="text-slate-900">{t.placeholders.state}</option>
              <option value="Tamil Nadu" className="text-slate-900">Tamil Nadu</option>
              
            </select>
          </div>

          {/* Date of Birth */}
         

          <button type="submit" className="btn-pill md:col-span-2 mt-2">
            {t.signup}
          </button>
        </form>

        <p className="text-center mt-6 text-white/60 text-xs">
          <Link to="/login" className="font-bold text-cyan-300 hover:underline">{t.loginLink}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;