import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-[#006064]"
        />
        
        {/* Inner Pulsing Circle */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute h-10 w-10 rounded-full bg-gradient-to-tr from-[#006064] to-[#046A38] opacity-80"
        />
      </div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex flex-col items-center"
      >
        <span className="text-sm font-black tracking-[0.3em] uppercase text-[#006064] animate-pulse">
          TNFlow
        </span>
        <span className="text-[10px] font-medium text-slate-400 mt-1">
          Preparing your journey...
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LoadingAnimation;