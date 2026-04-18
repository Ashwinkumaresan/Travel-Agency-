import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  className?: string;
}

export default function ActionMenu({ items, className }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Check if the click was on the portal content
        const portalContent = document.getElementById('action-menu-portal');
        if (portalContent && portalContent.contains(event.target as Node)) return;
        
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 160, // Align to right of button, width is 160px
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) updateCoords();
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className="p-1.5 text-text-muted hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && createPortal(
        <div 
          id="action-menu-portal"
          className="fixed z-[9999] w-40 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right"
          style={{ 
            top: coords.top + 4, 
            left: coords.left
          }}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-left transition-colors",
                  item.disabled ? "opacity-50 cursor-not-allowed text-gray-400" : "hover:bg-gray-50",
                  item.variant === 'danger' && !item.disabled && "text-red-600 hover:bg-red-50",
                  item.variant === 'success' && !item.disabled && "text-green-600 hover:bg-green-50",
                  (!item.variant || item.variant === 'default') && !item.disabled ? "text-secondary" : ""
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
