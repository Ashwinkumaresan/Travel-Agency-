import { motion } from 'motion/react';
import { Truck, Package, Boxes, MoveHorizontal, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    title: 'LOGISTIC SERVICES',
    desc: 'We are Headquartered in Mettur Dam and have access to business opportunities in all other major cities & metro townships.',
    icon: Boxes,
    color: 'bg-secondary',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'TRANSPORT SERVICES',
    desc: 'Thriving to be the leader in logistics, Mettur Transports pledges to find a way to transport anything.',
    icon: Truck,
    color: 'bg-blue-900',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8685084996?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'CONTRACT CARRIER',
    desc: 'Mettur Transports is one of popular Parcel Service Company in Chennai, providing reliable long-term shipping.',
    icon: MoveHorizontal,
    color: 'bg-red-800',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'PACKERS & MOVERS',
    desc: 'We provide door-to-door national Transport solutions for both individuals and corporates.',
    icon: Package,
    color: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dba246?auto=format&fit=crop&w=600&q=80'
  }
];

export default function OurServices() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            Expert Solutions
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary">Our Core Services</h2>
          <p className="text-text-muted leading-relaxed">
            Mettur Transports Services is considered to be most reliable transporter & parcel service in South India. 
            We provide our cargo facility for nearly all kinds of permissible products ranging from food, flowers, mail, couriers, 
            machinery parts, household items etc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row min-h-[400px] sm:h-[280px]"
            >
              {/* Image Side */}
              <div className="h-48 sm:h-full sm:w-1/3 relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Content Side */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={cn("inline-flex p-3 rounded-xl text-white", service.color)}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-secondary mb-2">{service.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed line-clamp-3 sm:line-clamp-2 md:line-clamp-3 italic">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider group-hover:gap-4 transition-all mt-4 sm:mt-0">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
