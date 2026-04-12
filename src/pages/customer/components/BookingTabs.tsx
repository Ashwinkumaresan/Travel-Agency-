import React from 'react';
import { cn } from '@/lib/utils';

interface BookingTabsProps {
  activeTab: 'active' | 'past' | 'cancelled';
  setActiveTab: (tab: 'active' | 'past' | 'cancelled') => void;
}

export default function BookingTabs({ activeTab, setActiveTab }: BookingTabsProps) {
  const tabs = [
    { id: 'active', label: 'Active Bookings' },
    { id: 'past', label: 'Past Bookings' },
    { id: 'cancelled', label: 'Cancelled Bookings' },
  ] as const;

  return (
    <div className="flex p-1.5 bg-gray-100 rounded-md w-full sm:w-fit overflow-x-auto custom-scrollbar">
      <div className="flex gap-1 min-w-max sm:min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 text-sidebar-menu rounded-md transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                : "text-text-muted hover:bg-primary-light hover:text-primary font-medium"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
