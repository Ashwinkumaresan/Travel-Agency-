import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Truck, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeHero() {
  return (
    <section className="relative min-h-screen lg:h-[90vh] flex items-center overflow-hidden bg-secondary pt-24 lg:pt-0 pb-12 lg:pb-0">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 lg:via-[#0f172a]/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80" 
          alt="Logistics Illustration" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 w-full">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Celebrating 30 Years of Excellence
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white leading-[0.95] md:leading-[0.9] tracking-tight"
            >
              Reliable <br />
              <span className="text-primary italic">Logistics</span> <br />
              At Scale.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-blue-100/60 max-w-lg leading-relaxed font-medium"
            >
              From Mettur Dam to every corner of South India, we deliver with precision, 
              speed, and the trust earned over three decades of service.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/login" className="btn-primary h-12 md:h-14 px-6 md:px-8 flex items-center justify-center gap-3 text-base md:text-lg">
              Book Parcel Now <ChevronRight className="h-5 w-5" />
            </Link>
            <Link to="/contact" className="h-12 md:h-14 px-6 md:px-8 flex items-center justify-center gap-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-secondary transition-all font-bold text-sm md:text-base">
              Track Shipment
            </Link>
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
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Efficiency</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-white">Next Day</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Truck className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Fleet</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-white">500+ Trucks</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-3 md:h-4 w-3 md:w-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Trust</span>
              </div>
              <p className="text-lg md:text-xl font-display font-bold text-white">100% Secure</p>
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
