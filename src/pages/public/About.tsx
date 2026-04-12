import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'motion/react';
import { Users, Globe, Heart, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-secondary py-24 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-display font-bold mb-6"
            >
              Our Story
            </motion.h1>
            <p className="text-gray-400 text-lg">
              Founded in 2010, VoyageArc has been at the forefront of luxury travel, 
              creating unforgettable memories for thousands of explorers.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-secondary mb-6">Our Mission</h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                At VoyageArc, we believe that travel is not just about visiting new places, but about experiencing them. 
                Our mission is to provide personalized, high-quality travel experiences that inspire and enrich the lives of our clients.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">15+</h4>
                  <p className="text-sm text-text-muted">Years of Excellence</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-primary mb-1">50k+</h4>
                  <p className="text-sm text-text-muted">Happy Travellers</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-secondary mb-4">Our Core Values</h2>
              <p className="text-text-muted">What drives us every single day.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: 'Passion', desc: 'We love what we do and it shows in every trip we plan.' },
                { icon: Globe, title: 'Diversity', desc: 'We celebrate the diversity of cultures and landscapes.' },
                { icon: Award, title: 'Quality', desc: 'We never compromise on the quality of your experience.' },
                { icon: Users, title: 'Community', desc: 'We support local communities in every destination.' }
              ].map((v, i) => (
                <div key={i} className="bg-white p-8 rounded-lg border border-gray-100 text-center">
                  <div className="bg-primary-light w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <v.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-secondary mb-2">{v.title}</h4>
                  <p className="text-sm text-text-muted">{v.desc}</p>
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
