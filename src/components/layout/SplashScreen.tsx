import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass } from 'lucide-react';

interface SplashScreenProps {
  isTransitioning: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isTransitioning }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  
  const companyName = "Mettur Transports";

  useEffect(() => {
    // Stage 1: Logo Entry (0s)
    setShowLogo(true);
    
    // Stage 2: Brand Name Typing (0.6s)
    const textTimer = setTimeout(() => setShowText(true), 600);
    
    return () => clearTimeout(textTimer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <AnimatePresence>
          {!isTransitioning && showLogo && (
            <motion.div 
              layoutId="brand-identity"
              className="flex items-center gap-4 md:gap-5"
              transition={{ 
                layout: { 
                  type: "spring", 
                  stiffness: 120, 
                  damping: 20 
                } 
              }}
            >
              {/* Logo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-primary p-3.5 md:p-4 rounded-xl md:rounded-2xl shadow-xl shadow-primary/20"
              >
                <Compass className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </motion.div>

              {/* Typing Brand Name */}
              <div className="flex">
                {companyName.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={showText ? { opacity: 1 } : {}}
                    transition={{ 
                      duration: 0.1, 
                      delay: 0.6 + (index * 0.05) 
                    }}
                    className={`text-3xl md:text-5xl font-display font-bold whitespace-pre ${
                      char === " " ? "mr-2 md:mr-3" : ""
                    } ${
                      index >= 7 ? "text-primary italic" : "text-secondary"
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
