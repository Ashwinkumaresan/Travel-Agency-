import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  value: string;
  onSelect: (id: string) => void;
  options: { id: string; label: string; sublabel?: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
}

export default function SearchableSelect({ 
  value, 
  onSelect, 
  options, 
  placeholder = 'Select option', 
  icon,
  className,
  searchPlaceholder = 'Search...',
  noResultsText = 'No results found'
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const portalContent = document.getElementById('searchable-select-portal');
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
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 256)
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
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className="flex items-center justify-between w-full px-3 h-11 text-sm font-medium text-secondary bg-white border border-gray-200 rounded-md hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && createPortal(
        <div 
          id="searchable-select-portal"
          className="fixed z-[9999] bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left"
          style={{ 
            top: coords.top + 4, 
            left: coords.left,
            width: coords.width
          }}
        >
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-md focus:outline-none focus:border-primary bg-gray-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-text-muted italic text-center">
                {noResultsText}
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelect(opt.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs text-left hover:bg-primary-light transition-colors",
                    value === opt.id ? "bg-primary-light/50 text-primary font-bold" : "text-secondary"
                  )}
                >
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.sublabel && <span className="text-[10px] text-text-muted">{opt.sublabel}</span>}
                  </div>
                  {value === opt.id && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
