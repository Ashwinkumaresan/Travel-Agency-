import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Briefcase, Star, ShieldCheck, Headphones, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80'
];

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img 
                src={HERO_IMAGES[currentHero]} 
                alt="Travel" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[2.5rem] md:text-h1 font-display font-bold text-white mb-6 tracking-tight leading-[1.1]"
            >
              Your Next Adventure <br /> <span className="text-primary">Starts Here</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl leading-relaxed"
            >
              Reliable and comfortable transport services for all your travel needs. 
              From luxury cars to spacious vans, we've got you covered.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-4"
            >
              <Link to="/login" className="btn-primary px-8 py-4">Book Your Ride</Link>
              <Link to="/about" className="bg-white hover:bg-gray-100 text-secondary px-8 py-4 rounded-md font-medium transition-all text-button">Learn More</Link>
            </motion.div>

            {/* Search Bar Overlay */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 hidden lg:block">
              <div className="bg-white p-6 rounded-lg shadow-2xl grid grid-cols-5 gap-4 items-end border border-gray-100">
                <div className="space-y-2">
                  <label className="input-label flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Destination
                  </label>
                  <input type="text" placeholder="Where to?" className="input-field py-2" />
                </div>
                <div className="space-y-2">
                  <label className="input-label flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Dates
                  </label>
                  <input type="date" className="input-field py-2" />
                </div>
                <div className="space-y-2">
                  <label className="input-label flex items-center gap-1">
                    <Users className="h-3 w-3" /> Travellers
                  </label>
                  <input type="number" min="1" placeholder="1" className="input-field py-2" />
                </div>
                <div className="space-y-2">
                  <label className="input-label flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Trip Type
                  </label>
                  <select className="input-field py-2">
                    <option>Leisure</option>
                    <option>Business</option>
                    <option>Honeymoon</option>
                    <option>Adventure</option>
                  </select>
                </div>
                <button className="btn-primary h-[42px] flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" /> Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Transport Section */}
        <section className="py-32 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[1.3rem] md:text-h2 font-display font-bold text-secondary mb-4">Our Transport Fleet</h2>
              <p className="text-text-muted text-card max-w-xl mx-auto">Choose from our wide range of well-maintained vehicles for a safe and comfortable journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'car-2', name: 'Car 2 Seater', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', capacity: 2 },
                { id: 'car-4', name: 'Car 4 Seater', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', capacity: 4 },
                { id: 'omni', name: 'Omni', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80', capacity: 8 },
                { id: 'traveler-van', name: 'Traveler Van', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=800&q=80', capacity: 12 },
              ].map((vehicle) => (
                <motion.div 
                  key={vehicle.id}
                  whileHover={{ y: -10 }}
                  className="card group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-sm font-bold text-xs">
                      {vehicle.capacity} Seater
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-h3 font-display font-bold text-secondary mb-4">{vehicle.name}</h3>
                    <Link to="/login" className="w-full btn-primary py-2 text-button-sm text-center block">Book Now</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[1.3rem] md:text-h2 font-display font-bold text-secondary mb-4">Why Choose VoyageArc?</h2>
              <p className="text-text-muted text-card">We provide the best travel services in the industry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: 'Expert Guides', desc: 'Professional guides for every trip.' },
                { icon: Tag, title: 'Best Price', desc: 'Guaranteed best rates for all packages.' },
                { icon: Headphones, title: '24/7 Support', desc: 'We are here for you anytime, anywhere.' },
                { icon: Calendar, title: 'Flexible Payment', desc: 'Pay in installments or after confirmation.' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-lg text-center border border-gray-100 shadow-sm">
                  <div className="bg-primary-light w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-secondary mb-2">{item.title}</h4>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[1.3rem] md:text-h2 font-display font-bold text-secondary mb-4">What Our Clients Say</h2>
              <p className="text-text-muted text-card">Real stories from real travellers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Adventure Seeker', text: 'VoyageArc made our honeymoon absolutely magical. Every detail was handled with perfection.' },
                { name: 'Michael Chen', role: 'Business Traveller', text: 'The staff portal is so efficient. I never have to worry about my bookings being delayed.' },
                { name: 'Emma Williams', role: 'Family Vacationer', text: 'Best travel agency I have ever used. The flexible payment options are a lifesaver.' }
              ].map((t, i) => (
                <div key={i} className="card p-8 relative">
                  <div className="flex gap-1 text-orange-500 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-text-main italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div>
                      <h5 className="font-bold text-secondary">{t.name}</h5>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
