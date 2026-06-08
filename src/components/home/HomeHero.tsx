import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen lg:h-[90vh] flex items-start lg:items-center justify-center overflow-hidden pt-36 lg:pt-0 pb-16 lg:pb-0 bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <img
          src="Hero_Bg.png"
          alt="Logistics Illustration"
          className="w-full h-full object-cover opacity-[0.85] lg:opacity-100 mix-blend-luminosity select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        {/* White responsive gradient overlay to ensure dark text is 100% readable over the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85 lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 w-full">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          {/* Celebrating 30 Years of Excellence can go here */}

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.1] sm:leading-[1.05] lg:leading-[1] tracking-tight text-secondary"
            >
              Reliable Logistics<br className="hidden sm:block" />
              <span className="text-primary font-[Dancing_Script] block sm:inline sm:ml-2">At Scale</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-text-muted max-w-lg leading-relaxed font-medium"
            >
              Experience precision in motion. We blend 25+ years of heritage
              with cutting-edge technology to deliver your world, faster.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {/* CTA placeholders can be added here if needed */}
          </motion.div>

          {/* Quick Stats/Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8 md:pt-12 grid grid-cols-3 gap-2 sm:gap-8 border-t border-gray-100"
          >
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Clock className="h-3.5 md:h-4 w-3.5 md:w-4 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Efficiency</span>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-display font-bold text-secondary">48 Hours</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Truck className="h-3.5 md:h-4 w-3.5 md:w-4 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Branches</span>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-display font-bold text-secondary">4 Branches</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Shield className="h-3.5 md:h-4 w-3.5 md:w-4 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Trust</span>
              </div>
              <p className="text-sm sm:text-lg md:text-xl font-display font-bold text-secondary">100% Secure</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Visual background truck shadow */}
      <div className="absolute -bottom-20 -right-20 opacity-20 pointer-events-none grayscale scale-150 transform rotate-[-5deg] hidden lg:block">
        <Truck className="h-[600px] w-[600px] text-white" />
      </div>
    </section>
  );
}
