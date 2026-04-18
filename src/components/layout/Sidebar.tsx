import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Ticket, 
  User, 
  LogOut, 
  Compass,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Package,
  Truck,
  FileText,
  Calculator,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { motion } from 'motion/react';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const NAV_ITEMS = {
  customer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { label: 'My Bookings', icon: Briefcase, path: '/app/bookings' },
    { label: 'Book a Trip', icon: Compass, path: '/app/book' },
    { label: 'My Tickets', icon: Ticket, path: '/app/tickets' },
    { label: 'Profile', icon: User, path: '/app/profile' },
  ],
  staff: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
    { label: 'Book Courier', icon: Package, path: '/staff/book' },
    { label: 'Route Mapping', icon: Truck, path: '/staff/mapping' },
    { label: 'Daily Report', icon: FileText, path: '/staff/report' },
    { label: 'Manage Bookings', icon: Briefcase, path: '/staff/bookings' },
    { label: 'Accounts', icon: Calculator, path: '/staff/accounts' },
    { label: 'Tickets', icon: Ticket, path: '/staff/tickets' },
    { label: 'Customers', icon: Users, path: '/staff/customers' },
    { label: 'My Profile', icon: User, path: '/staff/profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Accounts & Staff', icon: Calculator, path: '/admin/accounts' },
    { label: 'Drivers', icon: User, path: '/admin/drivers' },
    { label: 'Vehicles', icon: Truck, path: '/admin/vehicles' },
    { label: 'Operational Reports', icon: FileText, path: '/admin/reports' },
    { label: 'Booking Overview', icon: Briefcase, path: '/admin/bookings' },
    { label: 'Packages', icon: Package, path: '/admin/packages' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ]
};

export default function Sidebar({ role, isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const items = NAV_ITEMS[role];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <>
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-xl lg:shadow-none transition-all duration-300 flex flex-col z-50",
          isCollapsed ? "w-20" : "w-[250px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary p-2 rounded-lg shrink-0">
              <Compass className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sidebar-logo font-display font-bold text-secondary tracking-tight whitespace-nowrap"
              >
                Voyage<span className="text-primary">Arc</span>
              </motion.span>
            )}
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-text-muted hover:bg-primary-light hover:text-primary"
                )}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "text-sidebar-menu whitespace-nowrap",
                      isActive ? "font-bold" : "font-medium"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-white rounded-r-sm"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-50 space-y-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-4 py-3 rounded-md text-text-muted hover:bg-primary-light hover:text-primary transition-all group"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sidebar-menu font-medium">Collapse Menu</span>
              </>
            )}
          </button>

          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100",
            isCollapsed ? "justify-center" : ""
          )}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
              JD
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-profile-name font-bold text-secondary truncate">John Doe</p>
                <p className="text-email text-text-muted truncate uppercase tracking-wider font-medium">{role}</p>
              </div>
            )}
          </div>

          <Link
            to="/login"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all group",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-sidebar-menu font-medium">Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

