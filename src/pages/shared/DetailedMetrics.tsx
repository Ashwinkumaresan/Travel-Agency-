import PortalLayout from '@/components/layout/PortalLayout';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter, 
  Download,
  MapPin
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  isWithinInterval,
  parseISO,
  startOfToday,
  startOfYesterday,
  isBefore,
  isAfter,
  subWeeks
} from 'date-fns';

interface MetricItem {
  title: string;
  value: string | number;
}

const ALL_METRICS: MetricItem[] = [
  { title: 'Total In Place', value: 452 },
  { title: 'Total Shipped', value: 128 },
  { title: 'Total Sent', value: 89 },
  { title: 'Total Incoming', value: 64 },
  { title: 'Total Delivery', value: 245 },
  { title: 'Total Revenue', value: '$12,450' },
  { title: 'Total Spent', value: '$4,200' },
  { title: 'Total Profit', value: '$8,250' },
  { title: 'Total Kg', value: '1,240 kg' },
  { title: 'Total Cash Payment', value: '$3,420' },
  { title: 'Total Online Payment', value: '$9,030' },
  { title: 'Total Pre Payment', value: '$6,200' },
  { title: 'Total Post Payment', value: '$4,100' },
  { title: 'Total Half Payment', value: '$2,150' },
];

const LOCATIONS = ['All', 'Coimbatore', 'Salem', 'Chennai', 'Vellore'];

export default function DetailedMetrics() {
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Today');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [rangeStart, setRangeStart] = useState<Date>(startOfToday());
  const [rangeEnd, setRangeEnd] = useState<Date>(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [metrics, setMetrics] = useState(ALL_METRICS);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDateClick = (day: Date) => {
    // Prevent future date selection
    if (isAfter(day, startOfToday())) return;

    // If we transition to Custom or if a range is already set, treat click as a fresh start
    if (activeFilter !== 'Custom' || !isSameDay(rangeStart, rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(day);
      setActiveFilter('Custom');
      return;
    }

    // Expanding a single date selection into a range
    if (isBefore(day, rangeStart)) {
      setRangeEnd(rangeStart);
      setRangeStart(day);
    } else if (isAfter(day, rangeStart)) {
      setRangeEnd(day);
    }
  };

  // Simulate data fetching
  const fetchMetrics = () => {
    setLoading(true);
    setTimeout(() => {
      const newMetrics = ALL_METRICS.map(m => ({
        ...m,
        value: typeof m.value === 'number' 
          ? Math.floor(m.value * (0.8 + Math.random() * 0.4)) 
          : m.value
      }));
      setMetrics(newMetrics);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchMetrics();
  }, [rangeStart, rangeEnd, selectedLocation]);

  const handleQuickFilter = (filter: string) => {
    setActiveFilter(filter);
    const today = startOfToday();
    
    switch (filter) {
      case 'Today':
        setRangeStart(today);
        setRangeEnd(today);
        break;
      case 'Yesterday':
        setRangeStart(startOfYesterday());
        setRangeEnd(startOfYesterday());
        break;
      case 'This Week':
        setRangeStart(startOfWeek(today));
        setRangeEnd(today);
        break;
      case 'This Month':
        setRangeStart(startOfMonth(today));
        setRangeEnd(today);
        break;
    }
  };

  const role = window.location.pathname.includes('admin') ? 'admin' : 'staff';

  return (
    <PortalLayout role={role} title="Analytics Metrics">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Filter Panel */}
        <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Location Filter - Admin Only */}
            {role === 'admin' && (
              <div className="p-4 border-b border-gray-50 bg-gray-50/10">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Location</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={cn(
                        "py-1 px-3 text-[10px] font-bold rounded-full transition-all border",
                        selectedLocation === loc 
                          ? "bg-secondary border-secondary text-white shadow-sm" 
                          : "bg-white border-gray-100 text-text-muted hover:border-secondary/30"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Date Filters</h2>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {['Today', 'Yesterday', 'This Week', 'This Month'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleQuickFilter(filter)}
                    className={cn(
                      "py-1.5 px-3 text-[11px] font-bold rounded-full transition-all border",
                      activeFilter === filter 
                        ? "bg-primary border-primary text-white shadow-sm" 
                        : "bg-white border-gray-100 text-text-muted hover:border-primary/30"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Custom Modern Calendar */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-sm font-bold text-secondary">{format(currentMonth, 'MMMM yyyy')}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[10px] font-bold text-text-muted uppercase py-1">{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((day, idx) => {
                    const isInRange = isWithinInterval(day, { start: rangeStart, end: rangeEnd });
                    const isStart = isSameDay(day, rangeStart);
                    const isEnd = isSameDay(day, rangeEnd);
                    const isSelected = isStart || isEnd;
                    const isOtherMonth = !isSameMonth(day, currentMonth);
                    const isFuture = isAfter(day, startOfToday());

                    return (
                      <button
                        key={idx}
                        onClick={() => !isFuture && handleDateClick(day)}
                        className={cn(
                          "h-9 relative text-[11px] font-semibold flex items-center justify-center transition-all",
                          isOtherMonth ? "text-gray-300 pointer-events-none" : "text-secondary hover:bg-gray-50",
                          isFuture && "text-gray-300 cursor-not-allowed opacity-50",
                          !isInRange && !isFuture && !isOtherMonth && "hover:bg-primary/5 cursor-pointer",
                          isToday(day) && !isSelected && "border border-primary/30 rounded-lg",
                          isSelected ? "bg-primary text-white z-10 rounded-lg shadow-md" : (isInRange ? "bg-primary/10 text-primary" : "rounded-lg")
                        )}
                        disabled={isFuture}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Selection</span>
                  <span className="text-[11px] font-bold text-primary">
                    {isSameDay(rangeStart, rangeEnd) 
                      ? format(rangeStart, 'MMM dd, yyyy')
                      : `${format(rangeStart, 'MMM dd')} - ${format(rangeEnd, 'MMM dd, yyyy')}`}
                  </span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-[11px] font-bold text-text-muted hover:text-primary transition-colors py-2 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <Download className="h-3 w-3" /> Export Report
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
            <CalendarIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-text-muted">
              Data is updated in near real-time. Use the calendar above to select specific date ranges for deep analysis.
            </p>
          </div>
        </div>

        {/* Right Side: Metrics Display */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm animate-pulse h-20 md:h-24 flex flex-col justify-center">
                    <div className="h-2.5 bg-gray-50 w-16 md:w-24 mb-3 rounded" />
                    <div className="h-5 bg-gray-100 w-24 md:w-32 rounded" />
                  </div>
                ))
              ) : (
                metrics.map((metric, i) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center min-h-[80px] md:min-h-[100px] hover:border-primary/20 transition-colors"
                  >
                    <p className="text-[9px] md:text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 md:mb-2">{metric.title}</p>
                    <p className="text-lg md:text-2xl font-display font-bold text-secondary leading-tight truncate" title={metric.value.toString()}>{metric.value}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
