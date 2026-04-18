import { motion } from 'motion/react';
import { Quote, Send, User, Mail, Smartphone, Hash, MessageSquare } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { toast } from 'sonner';

export default function FeedbackSection() {
  const [feedbackType, setFeedbackType] = useState('Enquiry');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your feedback! We will get back to you soon.');
  };

  return (
    <section className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] -ml-48 -mb-48 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Testimonial Column */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Testimonials</h2>
              <div className="h-1.5 w-12 bg-primary rounded-full" />
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl"
            >
              <Quote className="absolute top-6 right-6 h-12 w-12 text-white/5" />
              <div className="space-y-6">
                <p className="text-xl md:text-2xl font-serif italic text-blue-100 leading-relaxed">
                  "Fantastic service. Good service and on time delivery. Best part is update thru SMS at every stage of parcel. Will use again and recommend to all."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-2 border-primary overflow-hidden">
                    <img 
                      src="https://picsum.photos/seed/marimuthu/100/100" 
                      alt="Marimuthu" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Marimuthu</h4>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">Happy Customer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feedback Form Column */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-secondary"
            >
              <h3 className="text-3xl font-display font-bold mb-8">Customer Feedback</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" className="input-field pl-10 h-12 bg-gray-50 border-gray-100" placeholder="Your Name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="email" className="input-field pl-10 h-12 bg-gray-50 border-gray-100" placeholder="your@email.com" required />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="tel" className="input-field pl-10 h-12 bg-gray-50 border-gray-100" placeholder="+91" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">GC / LLR Number</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" className="input-field pl-10 h-12 bg-gray-50 border-gray-100" placeholder="Reference No." />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">Feedback Type</label>
                  <div className="flex flex-wrap gap-4">
                    {['Suggestions', 'Complaints', 'Enquiry', 'Compliments'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="radio" 
                            name="feedbackType" 
                            className="w-5 h-5 border-2 border-gray-200 text-primary focus:ring-primary focus:ring-offset-0" 
                            checked={feedbackType === type}
                            onChange={() => setFeedbackType(type)}
                          />
                        </div>
                        <span className={`text-sm font-medium transition-colors ${feedbackType === type ? 'text-primary' : 'text-text-muted'}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Your Comments</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <textarea 
                      className="input-field pl-10 py-3 min-h-[120px] bg-gray-50 border-gray-100" 
                      placeholder="Tell us what you think..." 
                      required
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full h-14 flex items-center justify-center gap-2 group text-lg">
                  Send Your Feedback
                  <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
