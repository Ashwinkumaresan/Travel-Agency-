import { Bell, Search, User, Menu } from 'lucide-react';

interface PortalHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export default function PortalHeader({ title, onMenuClick }: PortalHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 h-20 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-[1.6rem] md:text-h1 font-display font-bold text-secondary truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-gray-50 border-none rounded-sm pl-10 pr-4 py-2 text-input placeholder:text-placeholder w-64 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        
        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </button>
        
        <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-profile-name font-bold text-secondary">John Doe</p>
            <p className="text-email text-text-muted uppercase font-medium tracking-wider">Customer</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}

