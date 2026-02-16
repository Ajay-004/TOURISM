import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Globe } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig"; 
import LoadingAnimation from "../components/LoadingAnimation"; 

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");

  const navigate = useNavigate();

  const t = {
    en: { welcome: "Welcome Back", email: "username", pass: "Password", login: "Login", google: "Continue with Google", or: "OR", noAcc: "New traveler?", signup: "Create Account", tag: "Explore South India", err: "Invalid Credentials" },
    ta: { welcome: "நல்வரவு", email: "மின்னஞ்சல்", pass: "கடவுச்சொல்", login: "உள்நுழை", google: "கூகுள் மூலம் தொடரவும்", or: "அல்லது", noAcc: "புதிய பயணியா?", signup: "பதிவு செய்க", tag: "தென்னிந்தியாவை ஆராயுங்கள்", err: "தவறான விவரங்கள்" }
  }[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setLoading(false);
      setError(t.err);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setLoading(false);
      setError("Google Sign-In failed.");
    }
  };

  return (
    // min-h-screen and flex-col for proper scrolling on mobile
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      
      <AnimatePresence>{loading && <LoadingAnimation />}</AnimatePresence>

      {/* FIXED Language Toggle: Added responsive positioning */}
      <div className="w-full max-w-[400px] flex justify-end mb-4 sm:absolute sm:top-8 sm:right-8 sm:mb-0">
        <button 
          onClick={() => setLang(lang === "en" ? "ta" : "en")} 
          className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-white tracking-widest uppercase border border-white/20 shadow-sm z-50 hover:bg-white/30 transition-all flex items-center gap-2"
        >
          <Globe size={14} /> {lang === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-[400px] p-8 md:p-10 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md">TN Flow</h1>
          <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{t.tag}</p>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 text-center">{t.welcome}</h2>

        {error && (
          <div className="mb-4 text-white text-[11px] font-bold text-center bg-red-500/20 backdrop-blur-md p-2 rounded-full border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="auth-label">{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Username or Email" className="auth-input-pill" />
          </div>

          <div className="relative">
            <label className="auth-label">{t.pass}</label>
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="auth-input-pill" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-[38px] text-white/40 hover:text-white">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <button type="submit" className="btn-pill">
            {t.login}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-white/20"></div>
          <span className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.or}</span>
          <div className="flex-1 h-[1px] bg-white/20"></div>
        </div>

        <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center bg-white/10 border border-white/20 py-3 rounded-full text-white font-bold text-sm hover:bg-white/20 transition-all active:scale-95">
          <GoogleIcon /> {t.google}
        </button>

        <p className="mt-8 text-center text-xs text-white/60 font-medium">
          {t.noAcc} <Link to="/signup" className="text-cyan-300 font-bold hover:underline underline-offset-4 decoration-2">{t.signup}</Link>
        </p>
      </motion.div>
    </div>
  );
}