import { motion } from 'motion/react';
import { Gauge, Heart, Globe, Target } from 'lucide-react';

const FEATURES = [
  {
    title: 'DOOR TO DOOR DELIVERY',
    desc: 'We provide door-to-door delivery solutions for both individuals and corporates.',
    icon: Gauge,
  },
  {
    title: 'SPEED CARGO',
    desc: 'Customer care and satisfaction is our primary goal. We make it our top priority to deliver efficient.',
    icon: Heart,
  },
  {
    title: 'PARCEL SERVICES',
    desc: 'Mettur Parcel services is considered to be most reliable in South India. We have branches all over Tamilnadu.',
    icon: Globe,
  },
  {
    title: 'NEXT DAY DELIVERY',
    desc: 'Our Mettur Transports give you the possibility of guaranteed next-day delivery by a fixed time.',
    icon: Target,
  }
];

export default function ExpressFeatures() {
  return (
    <section className="relative overflow-hidden bg-secondary py-24">
      {/* Decorative background truck */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 hidden xl:block">
         <img 
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1400&q=80" 
            alt="" 
            className="w-[800px] h-auto object-cover"
            referrerPolicy="no-referrer"
          />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Header Section */}
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              Express <br /> 
              <span className="text-primary italic">Delivery.</span>
            </h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
            <p className="text-blue-100/60 leading-relaxed font-medium">
              Revolutionizing cargo with speed, precision, and unwavering reliability. Your urgent shipments are our top priority.
            </p>
          </div>

          {/* Features Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-colors duration-300">
                      <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-blue-100/40 leading-relaxed group-hover:text-blue-100/60 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
