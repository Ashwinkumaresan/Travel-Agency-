import { motion } from 'motion/react';
import { Truck, Package, Boxes, MoveHorizontal, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    title: 'LOGISTIC SERVICES',
    desc: 'We are Headquartered in Salem, Coimbatore, Vellore, and Chennai and we have access to business opportunities in all other major cities & townships.',
    icon: Boxes,
    bgColor: 'bg-[#f0f4f8]',
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary',
    watermarkColor: 'text-secondary/5',
  },
  {
    title: 'TRANSPORT SERVICES',
    desc: 'Thriving to be the leader in logistics, S A Salem Super Service pledges to find a way to transport anything.',
    icon: Truck,
    bgColor: 'bg-[#fdecea]',
    iconColor: 'text-primary',
    iconBg: 'bg-primary',
    watermarkColor: 'text-primary/5',
  },
  {
    title: 'CONTRACT CARRIER',
    desc: 'S A Salem Super Service is one of the popular Parcel Service Companies in Chennai, providing reliable long-term shipping.',
    icon: MoveHorizontal,
    bgColor: 'bg-[#e6f4ea]',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-600',
    watermarkColor: 'text-emerald-600/5',
  },
  {
    title: 'WAREHOUSING RENTALS',
    desc: 'Coming Soon - We provide door-to-door national Transport solutions for both individuals and corporates.',
    icon: Package,
    bgColor: 'bg-[#fef7e0]',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-600',
    watermarkColor: 'text-amber-600/5',
  }
];

export default function OurServices() {
  return (
    <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title, Subtitle, Description and CTA Button */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-block">
              <h2 className="text-sm font-bold text-red-400 uppercase mb-1">Expert Solutions</h2>
              <div className="h-0.5 bg-red-400 rounded-full" />
            </div>

            <h3 className="text-4xl md:text-5xl font-display font-bold text-secondary leading-tight tracking-tight">
              Services That <br />
              <span className="text-primary font-[Dancing_Script]">Speak Before</span> <br />
              We Do.
            </h3>

            <p className="text-text-muted leading-relaxed text-base">
              S A Salem Super Service is considered to be the most reliable transporter & parcel service in South India. 
              We provide our cargo facility for nearly all kinds of permissible products ranging from food, flowers, mail, couriers, 
              machinery parts, household items etc.
            </p>

            {/* <div className="pt-4">
              <button className="inline-flex items-center gap-4 bg-secondary hover:bg-primary text-white pl-6 pr-2.5 py-2.5 rounded-full font-bold tracking-wide uppercase text-sm transition-all duration-300 active:scale-95 group shadow-lg shadow-secondary/20 hover:shadow-primary/20">
                Explore Services
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-secondary group-hover:text-primary transition-colors transform group-hover:rotate-45 duration-300">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </button>
            </div> */}
          </motion.div>

          {/* Right Column: 4 Services in an Asymmetrical Mosaic Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-5 gap-4">
            {SERVICES.map((service, i) => {
              // Asymmetrical grid spans mapping: 3/5 + 2/5 on first row, 2/5 + 3/5 on second row
              const gridSpans = [
                'md:col-span-3', // Service 1: Logistic Services
                'md:col-span-2', // Service 2: Transport Services
                'md:col-span-2', // Service 3: Contract Carrier
                'md:col-span-3'  // Service 4: Warehousing Rentals
              ];

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={cn(
                    "group relative overflow-hidden rounded-[8px] p-8 min-h-[250px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-xl",
                    service.bgColor,
                    gridSpans[i]
                  )}
                >
                  {/* Overlay blur and Upcoming badge for Warehousing Rentals */}
                  {service.title === 'WAREHOUSING RENTALS' && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-white/40">
                      <div className="bg-amber-600 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-[4px] shadow-lg shadow-amber-600/30 transform transition-transform duration-300 group-hover:scale-105">
                        Upcoming
                      </div>
                    </div>
                  )}

                  {/* Huge Watermark Icon in background */}
                  <service.icon 
                    className={cn(
                      "absolute -bottom-10 -right-10 h-44 w-44 pointer-events-none transform -rotate-12 transition-all duration-700 group-hover:scale-110 group-hover:rotate-0",
                      service.watermarkColor
                    )} 
                  />

                  <div className="relative z-10 space-y-4">
                    {/* Icon Container */}
                    <div className={cn("inline-flex p-3.5 rounded-[4px] text-white shadow-md shadow-black/5", service.iconBg)}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    
                    {/* Service Title */}
                    <h4 className="text-xl font-display font-bold text-secondary tracking-tight">
                      {service.title}
                    </h4>
                    
                    {/* Service Description */}
                    <p className="text-sm text-text-muted leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </div>

                  {/* <div className="relative z-10 pt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary group-hover:text-primary transition-colors mt-auto">
                    Learn More 
                    <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div> */}
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
