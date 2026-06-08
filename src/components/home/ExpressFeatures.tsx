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
    desc: 'S A Salem Super Service is considered to be the most reliable in South India. We have branches all over Tamilnadu.',
    icon: Globe,
  },
  {
    title: '48 HOURS DELIVERY',
    desc: 'S A Salem Super Service gives you the possibility of guaranteed 48 hours delivery by a fixed time.',
    icon: Target,
  }
];

export default function ExpressFeatures() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#111728] via-secondary to-[#0a0f1c] py-28 border-y border-white/5">
      {/* Decorative Radial Glows */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logistic Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Decorative background truck with smooth masking */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.06] hidden xl:block select-none pointer-events-none">
         <img 
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1400&q=80" 
            alt="" 
            className="w-[750px] h-auto object-cover [mask-image:linear-gradient(to_left,black_20%,transparent_100%)]"
            referrerPolicy="no-referrer"
          />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Header Section */}
          <div className="lg:w-1/3 space-y-4">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              Express <br /> 
              <span className="text-primary font-[Dancing_Script]">Delivery.</span>
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
                    <div className="h-12 w-12 rounded-[4px] bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-colors duration-300">
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
