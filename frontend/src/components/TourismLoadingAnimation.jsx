import React from "react";
import { motion } from "framer-motion";

const TourismLoadingAnimation = () => {
  // Logic for the text fading in the center remains exactly the same
  const titleVariants = {
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0.95, 1, 1, 0.95],
      transition: {
        duration: 8,
        times: [0.3, 0.4, 0.7, 0.85],
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Logic for the driving word remains exactly the same
  const drivingWordVariants = {
    animate: {
      x: ["110vw", "0vw", "0vw", "-110vw"],
      transition: {
        duration: 8, 
        times: [0, 0.35, 0.75, 1], 
        repeat: Infinity, 
        ease: "linear", 
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      /* UPDATED: Glass Effect Styles applied to the full-screen background */
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)", // bg-white/5
        backdropFilter: "blur(40px) saturate(180%)",   // backdrop-blur-3xl + saturation
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <div className="relative w-full flex flex-col items-center">
        

        {/* The Driving Word Animation */}
        <div className="relative w-full flex justify-center items-end h-32">
          
          <motion.div
            variants={drivingWordVariants}
            animate="animate"
            className="z-10"
          >
            <motion.div
              animate={{ 
                y: [0, -1.5, 0, -1, 0], 
                skewX: [0, 1, 0, -1, 0] 
              }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black italic text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              TN <span className="text-white/90">Flow</span>
            </motion.div>
          </motion.div>

          {/* Road Surface */}
          <div className="absolute bottom-0 w-full h-[1px] bg-white/20" />
          
          {/* Parallax Road Markers */}
          <motion.div 
            animate={{ x: ["0%", "30%"] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bottom-[-20px] w-[200%] flex justify-around opacity-10"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-20 h-[1px] bg-white" />
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-12 text-[9px] font-bold text-white/40 uppercase tracking-[2em]"
      >
        Initializing
      </motion.div>
    </motion.div>
  );
};

export default TourismLoadingAnimation;