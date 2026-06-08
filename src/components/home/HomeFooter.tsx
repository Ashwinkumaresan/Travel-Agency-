import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const BRANCHES = [
  {
    name: 'COIMBATORE OFF',
    address: '5/3, Nadar Street, Nayakkar Thottam, Coimbatore - 641001',
    phones: ['98527 07051', '93610 04578']
  },
  {
    name: 'SALEM OFF',
    address: '196/2, Ambalavan Swamy Koil St, Santhaipettai Main Rd, Shevapettai, Salem - 636002',
    phones: ['0427 4961944', '93845 10141']
  },
  {
    name: 'CHENNAI OFFICE',
    address: '2/29, Perumal Koil Garden St, First Ln, (Off Walltax Rd), Chennai - 600079',
    phones: ['044-42144944', '63811 90433']
  },
  {
    name: 'VELLORE OFFICE',
    address: '8, Old Bangalore Rd, Opp Govt School, Konavattam, Vellore - 632008',
    phones: ['89254 43953']
  }
];

export default function HomeFooter() {
  return (
    <footer className="bg-[#0f1424] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Sleek top border gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-[8px] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* About Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <span className="text-xl font-display font-semibold tracking-tight block">
                <span className="text-white">S A Salem Super </span>
                <span className="text-primary font-[Dancing_Script] px-0.5">Service</span>
              </span>
              <div className="h-0.5 bg-primary rounded-[8px] w-12" />
            </div>
            <p className="text-sm text-blue-100/60 leading-relaxed font-medium">
              Started in the year 2000 with a sole mission of catering effective Passenger and Parcels, 
              we have reached the pinnacle of being a truly professional and customer-focused Transport Company.
            </p>
          </div>

          {/* Branches / Get In Touch */}
          <div className="lg:col-span-6 space-y-6">
            <h4 className="text-lg font-display font-bold relative inline-block text-white">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary rounded-[8px]" />
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 pt-4">
              {BRANCHES.map((branch) => (
                <div key={branch.name} className="space-y-3 pl-4 border-l border-white/10 hover:border-primary/50 transition-colors duration-300 group/branch">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-[4px] bg-white/20 group-hover/branch:bg-primary transition-colors duration-300" />
                    <h5 className="text-[11px] font-bold text-white/90 uppercase tracking-widest">{branch.name}</h5>
                  </div>
                  <div className="space-y-2 text-xs text-blue-100/60 font-medium">
                    <p className="leading-relaxed hover:text-white transition-colors duration-200">{branch.address}</p>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-blue-100/40 font-bold text-[11px]">
                      {branch.phones.map((p, idx) => (
                        <span key={p} className="hover:text-primary transition-colors duration-200">
                          {p}{idx < branch.phones.length - 1 ? '  •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebrations Info */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6">
            <div className="relative p-6 border border-white/5 bg-white/[0.02] rounded-[8px] flex items-center justify-center w-32 h-32 hover:border-primary/20 transition-all duration-300 group/badge">
              <div className="absolute inset-2 border border-dashed border-primary/20 rounded-[8px] animate-[spin_40s_linear_infinite] group-hover/badge:border-primary/40 transition-colors" />
              <div className="text-center relative z-10">
                <span className="block text-3xl font-display font-black text-primary">25+</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-100/40">Years Trust</span>
              </div>
            </div>
            {/* <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: '#' }
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx}
                  href={href} 
                  className="w-8 h-8 rounded-[4px] bg-white/5 flex items-center justify-center hover:bg-primary text-blue-100/60 hover:text-white transition-all transform hover:-translate-y-0.5 duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div> */}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-100/20 font-medium">
            © {new Date().getFullYear()} S A Salem Super Service. All rights reserved.
          </p>
          <div className="flex items-center">
             <span className="text-[10px] text-blue-100/20 uppercase tracking-widest">Designed by</span>
             <div className="px-3 py-1">
               <span className="font-[Dancing_Script] text-md text-white/50">The Techys Studio</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
