import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-secondary py-24 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-display font-bold mb-6">Contact Us</h1>
            <p className="text-gray-400 text-lg">
              Have questions? We are here to help you plan your next dream vacation.
            </p>
          </div>
        </section>

        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-display font-bold text-secondary mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Full Name</label>
                    <input type="text" placeholder="John Doe" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="input-field" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Subject</label>
                  <select className="input-field">
                    <option>General Enquiry</option>
                    <option>Booking Issue</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Message</label>
                  <textarea rows={5} placeholder="How can we help you?" className="input-field resize-none"></textarea>
                </div>
                <button className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                  Send Message <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-display font-bold text-secondary mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-light p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">Office Address</h4>
                      <p className="text-text-muted text-sm">123 Adventure Lane, Travel City, TC 10101</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-light p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">Phone Number</h4>
                      <p className="text-text-muted text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-light p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">Email Address</h4>
                      <p className="text-text-muted text-sm">support@voyagearc.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary p-8 rounded-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-xl font-display font-bold mb-4">Live Support</h3>
                <p className="text-gray-400 text-sm mb-6">Our team is available 24/7 to assist you with your travel plans.</p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-bold flex items-center gap-2 transition-all">
                  <MessageSquare className="h-5 w-5" /> Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
