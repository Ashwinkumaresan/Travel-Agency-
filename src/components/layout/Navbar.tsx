import { Link } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-md">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-sidebar-logo font-display font-bold text-secondary tracking-tight">
                Voyage<span className="text-primary">Arc</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sidebar-menu font-medium text-text-muted hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sidebar-menu font-medium text-text-muted hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-sidebar-menu font-medium text-text-muted hover:text-primary transition-colors">Contact</Link>
            <Link to="/login" className="btn-primary">Book Now</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-muted p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden bg-white border-b border-gray-100", isOpen ? "block" : "hidden")}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link to="/" className="block px-3 py-2 text-base font-medium text-text-muted hover:text-primary">Home</Link>
          <Link to="/about" className="block px-3 py-2 text-base font-medium text-text-muted hover:text-primary">About</Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-medium text-text-muted hover:text-primary">Contact</Link>
          <Link to="/login" className="block w-full text-center btn-primary mt-4">Book Now</Link>
        </div>
      </div>
    </nav>
  );
}
