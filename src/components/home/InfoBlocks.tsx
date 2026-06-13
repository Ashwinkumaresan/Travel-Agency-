import { motion } from 'motion/react';
import { ShieldAlert, Info, Smartphone, CheckCircle2 } from 'lucide-react';

export default function InfoBlocks() {
  return (
    <section className="py-28 bg-gray-50/60 border-b border-gray-100 relative overflow-hidden">
      {/* Decorative ambient bubbles */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-[8px] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-[8px] blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-block">
            <h2 className="text-sm font-bold text-primary uppercase mb-1 tracking-wider">Important Guidelines</h2>
            <div className="h-0.5 bg-primary rounded-[8px] w-full" />
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-secondary leading-tight">
            Terms, Restrictions & Alerts
          </h3>
          <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto font-medium">
            Please review our shipping policies, taxation structures, and prohibited cargo list to ensure smooth and hassle-free transit of your goods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Taxes Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[8px] p-8 shadow-sm"
          >
            <div className="h-12 w-12 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100">
              <Info className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-display font-bold text-secondary mb-4">Taxes & Conditions</h4>
            <div className="space-y-4 text-text-muted text-sm leading-relaxed font-medium">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p>GST is charged at <strong className="text-secondary">5%</strong> of the total freight for all the LRs.</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <p>GST will not be charged to consignors or consignees who fall under the Reg Company category & who book fruits, vegetables, fish, and milk.</p>
              </div>
            </div>
          </motion.div>

          {/* Prohibited Items Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-col bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[8px] p-8 shadow-sm"
          >
            <div className="h-12 w-12 rounded-[8px] bg-red-50 text-red-600 flex items-center justify-center mb-6 border border-red-100">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-display font-bold text-secondary mb-4">Prohibited Items</h4>
            <p className="text-sm text-text-muted leading-relaxed mb-6 font-medium">
              To ensure safety and compliance, the transport of the following items is strictly prohibited:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Explosives', 'Liquor/Spirits', 'Acids/Chemicals', 'Gas Cylinders', 'Valuables/Gold', 'Currency Notes', 'Forest Produce', 'Weapons/Bullets', 'Batteries (with Acid)'].map((item) => (
                <span key={item} className="bg-red-50 text-red-600 border border-red-100/50 px-2.5 py-1 rounded-[4px] text-[10px] font-bold tracking-wider uppercase">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* SMS Alert Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col justify-center items-center bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[8px] p-8 shadow-sm items-center text-center"
          >
            <div className="h-12 w-12 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100">
              <Smartphone className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-display font-bold text-secondary mb-2">Get Instant SMS Alert</h4>
            <p className="text-text-muted text-sm mb-6 font-medium">Stay updated with your cargo's position and delivery status in real-time.</p>
            
            {/* <div className="relative w-full max-w-[140px] group">
              <div className="absolute inset-0 bg-primary/5 blur-xl rounded-[8px] transition-all duration-500 group-hover:bg-primary/10" />
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" 
                alt="SMS Tracking" 
                className="relative z-10 w-full h-auto rounded-[8px] shadow-md border-2 border-gray-100 transform transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
