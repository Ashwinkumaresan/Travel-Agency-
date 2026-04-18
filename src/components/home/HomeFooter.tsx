import { MapPin, Phone, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BRANCHES = [
  {
    name: 'METTUR H.O',
    address: 'No:160, East Main Road, Mettur Dam - 636401',
    phones: ['04298-297784', '9443312370']
  },
  {
    name: 'CHENNAI MAIN OFFICE',
    address: '#1169, P.H Road, Near Rohini Theater Signal, Koyambedu, Chennai - 600107',
    phones: ['9443312306']
  },
  {
    name: 'BANGLORE HUB',
    address: '297, Sultan Road, Rayan Circle, Chamrajpet, Bangalore',
    phones: ['9345911011']
  },
  {
    name: 'HYDERABAD HUB',
    address: '4-10-134/1, Plot:3, Block:40, Auto Nager, Hyderabad',
    phones: ['6380754808']
  }
];

export default function HomeFooter() {
  return (
    <footer className="bg-secondary text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* About Column */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xl font-display font-bold relative inline-block">
              About Us
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <p className="text-sm text-blue-100/60 leading-relaxed font-medium">
              Started in the year 1993 with a sole mission of catering effective written Passenger and Parcels, 
              "Mettur Transports" have reached the pinnacle of being a truly professional Transport Company.
            </p>
            <Link to="/staff/book" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold">
              Parcel Booking Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xl font-display font-bold relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'T&C', 'Careers', 'Feedback', 'Contact', 'Network'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-sm text-blue-100/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches / Get In Touch */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-xl font-display font-bold relative inline-block">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {BRANCHES.map((branch) => (
                <div key={branch.name} className="space-y-3">
                  <h5 className="text-xs font-bold text-primary tracking-widest">{branch.name}</h5>
                  <div className="flex gap-2 text-xs text-blue-100/60 leading-relaxed">
                    <MapPin className="h-4 w-4 shrink-0 text-primary/40" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-blue-100/60 font-bold">
                    <Phone className="h-4 w-4 shrink-0 text-primary/40" />
                    <div className="flex flex-col">
                      {branch.phones.map(p => <span key={p}>{p}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebrations Info */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-4">
            <div className="relative p-4 border-2 border-primary/20 rounded-2xl">
              <div className="text-center">
                <span className="block text-4xl font-display font-black text-primary">30+</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100/40">Years Success</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer group">
                <Facebook className="h-4 w-4 text-blue-100/60 group-hover:text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer group">
                <Twitter className="h-4 w-4 text-blue-100/60 group-hover:text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer group">
                <Instagram className="h-4 w-4 text-blue-100/60 group-hover:text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer group">
                <Youtube className="h-4 w-4 text-blue-100/60 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-blue-100/20 font-medium">
            CopyRights (C) 2016 | All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-blue-100/20 uppercase tracking-widest">Designed by</span>
             <div className="px-3 py-1 bg-white rounded-md">
               <span className="text-secondary font-black italic text-xs">CRB</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
