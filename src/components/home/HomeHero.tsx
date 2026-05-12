import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen lg:h-[90vh] flex items-center justify-center overflow-hidden pt-24 lg:pt-0 pb-12 lg:pb-0">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 lg:via-[#0f172a]/40 to-transparent z-10" /> */}
        <img
          src="Hero_Bg.png"
          alt="Logistics Illustration"
          className="w-full h-full object-cover opacity-100 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 w-full">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          {/* <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Celebrating 30 Years of Excellence
          </motion.div> */}

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-black leading-[0.8] md:leading-[1] tracking-tight"
            >
              Reliable Logistics<br />
              <span className="text-primary font-[Dancing_Script]">At Scale</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-white-600 max-w-lg leading-relaxed font-medium"
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
            <Link to="/contact" className="btn-primary h-8 md:h-12 px-6 md:px-8 flex items-center justify-center gap-3 text-base md:text-lg">
              Book Parcel Now <ChevronRight className="h-5 w-5" />
            </Link>
            {/* <Link to="/contact" className="h-12 md:h-14 px-6 md:px-8 flex items-center justify-center gap-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-secondary transition-all font-bold text-sm md:text-base">
              Track Shipment
            </Link> */}
          </motion.div>

          {/* Quick Stats/Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8 md:pt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8"
          >
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-black">48 Hours</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Truck className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Branches</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-black">4 Branches</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Trust</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-black">100% Secure</p>
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
