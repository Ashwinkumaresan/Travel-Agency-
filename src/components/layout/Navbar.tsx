import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Identity (Left aligned) */}
          <div className="flex items-center">
            <motion.div 
              layoutId="brand-identity"
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 20
              }}
            >
              <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="bg-primary p-2 rounded-lg md:rounded-xl shadow-md shadow-primary/10">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-display font-bold whitespace-nowrap">
                  <span className="text-secondary">Mettur</span>
                  <span className="text-primary italic px-0.5">Transports</span>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Actions & Navigation (Right aligned) */}
          <div className="flex items-center gap-x-4 md:gap-x-8">
            {/* Desktop Navigation Links */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="hidden lg:flex items-center gap-8"
            >
              <Link to="/" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Home</Link>
              <Link to="/about" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">About</Link>
              <Link to="/contact" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Contact</Link>
            </motion.div>

            {/* CTA & Toggle Group */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Link 
                  to="/login" 
                  className="btn-primary px-4 md:px-6 py-2 text-[12px] md:text-sm whitespace-nowrap shadow-md shadow-primary/10 rounded-lg"
                >
                  Book Now
                </Link>
              </motion.div>

              {/* Mobile Toggle Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="lg:hidden text-secondary p-2 transition-colors hover:bg-gray-100 rounded-xl"
                  aria-label="Toggle menu"
                >
                  <div className="relative w-6 h-6">
                    <Menu className={cn(
                      "absolute inset-0 h-6 w-6 transition-all duration-300",
                      isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                    )} />
                    <X className={cn(
                      "absolute inset-0 h-6 w-6 transition-all duration-300",
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                    )} />
                  </div>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      <div 
        className={cn(
          "lg:hidden bg-white border-b border-gray-100 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[300px] border-t" : "max-h-0 border-t-0"
        )}
      >
        <div className="px-4 py-4 space-y-3">
          <Link to="/" className="flex items-center px-4 py-3 text-base font-semibold text-secondary hover:bg-gray-50 rounded-xl transition-colors">Home</Link>
          <Link to="/about" className="flex items-center px-4 py-3 text-base font-semibold text-secondary hover:bg-gray-50 rounded-xl transition-colors">About</Link>
          <Link to="/contact" className="flex items-center px-4 py-3 text-base font-semibold text-secondary hover:bg-gray-50 rounded-xl transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
