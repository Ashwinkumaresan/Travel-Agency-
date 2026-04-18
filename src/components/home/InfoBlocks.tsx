import { motion } from 'motion/react';
import { ShieldAlert, Info, Smartphone, CheckCircle2 } from 'lucide-react';

export default function InfoBlocks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Taxes Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col bg-pink-600 text-white rounded-3xl p-8 shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Taxes And Condition</h3>
            <div className="space-y-4 text-pink-100 text-sm leading-relaxed">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-200" />
                <p>GST is charged at 5% of the total freight for all the LRs.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-200" />
                <p>GST will not be charged to those consignors or consignees who fall under the Reg Company category & who book fruits, vegetables, fish and milk.</p>
              </div>
            </div>
          </motion.div>

          {/* Prohibited Items Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col bg-orange-500 text-white rounded-3xl p-8 shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Prohibited Items</h3>
            <p className="text-orange-100 text-sm leading-relaxed italic">
              Rationed goods, Gas cylinders, Liquor, Spirit, Petrol, Diesel, Kerosene, Oil, Acids, Wood, Forest produce, Bones / Horns, Crackers/ Explosives, Weapons, Bullets, Batteries(with Acid), Currency Notes, Gold, Silver, Diamond and any valuable jewelry.
            </p>
          </motion.div>

          {/* SMS Alert Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-md items-center text-center"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-2">Get Instant SMS Alert</h3>
            <p className="text-text-muted text-sm mb-8">Stay updated with your cargo's position and delivery status in real-time.</p>
            
            <div className="relative w-full max-w-[200px]">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80" 
                alt="SMS Tracking" 
                className="relative z-10 w-full h-auto rounded-xl shadow-lg border-4 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
