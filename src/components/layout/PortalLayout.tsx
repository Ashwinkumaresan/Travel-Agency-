import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { UserRole } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

interface PortalLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
}

export default function PortalLayout({ children, role, title }: PortalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.pathname]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar 
        role={role} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        <PortalHeader 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-grow p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
