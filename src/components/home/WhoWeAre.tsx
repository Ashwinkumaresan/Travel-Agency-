import { motion } from 'motion/react';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WhoWeAre() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Left decorative circle: linear gradient in circle shape from primary to white inside */}
      {/* <div className="absolute top-1/2 -left-24 md:-left-36 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-primary/15 to-white pointer-events-none z-0" /> */}

      {/* Right decorative circle: linear gradient in circle shape from primary to white inside */}
      {/* <div className="absolute top-1/2 -right-24 md:-right-36 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-l from-primary/15 to-white pointer-events-none z-0" /> */}

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Container
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8685084996?auto=format&fit=crop&w=1200&q=80" 
                alt="S A Salem Super Service Truck" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            Design accents
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full z-0 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/5 rounded-full z-0" />
          </motion.div>
          */}

          {/* Content Container */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-grow space-y-6"
          >
            <div className="inline-block">
              <h2 className="text-sm font-bold text-red-400 uppercase mb-1">Who We Are</h2>
              <div className="h-0.5 w-full bg-red-400 rounded-full" />
            </div>

            <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary leading-tight">
              A Legacy of Reliable Logistics <br />
              <span className="text-primary font-[Dancing_Script]">Since 2000.</span>
            </h3>

            <p className="text-lg text-text-main font-semibold leading-relaxed">
              S A Salem Super Service is one of the most popular Parcel and Cargo Service Companies in South India.
            </p>

            <p className="text-text-muted leading-relaxed">
              Our seamless and optimized services gives you enhanced productivity and efficiency through the Daily Regular Express.
              We have branches all over Salem, Coimbatore, Vellore, and Chennai.
              We owned warehouses in all District headquarters.
            </p>

            <div className="grid md:grid-cols-3 grid-cols-2 gap-4 pt-4">
              {[
                "Dedicated team", "Trained Drivers",
                "Agents Network", "Own Workshop",
                "Tracking System", "Computerized Ops"
              ].map((item) => (
                <div key={item} className="flex items-start justify-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-medium text-secondary">{item}</span>
                </div>
              ))}
            </div>

            {/* <div className="pt-6 flex justify-center">
              <button className="btn-primary flex items-center gap-2 group">
                Read More 
                <Truck className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
