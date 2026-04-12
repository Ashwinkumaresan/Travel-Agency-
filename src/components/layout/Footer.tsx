import { Link } from 'react-router-dom';
import { Compass, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                Voyage<span className="text-primary">Arc</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for unforgettable travel experiences. We craft journeys that stay with you forever.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-primary text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary text-sm transition-colors">Contact</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-primary text-sm transition-colors">Login / Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-gray-400 hover:text-primary text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-primary text-sm transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
            <p className="text-gray-400 text-sm">Subscribe to our newsletter for deals.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} VoyageArc Travel Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
