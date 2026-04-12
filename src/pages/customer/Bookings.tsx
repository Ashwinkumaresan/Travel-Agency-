import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS } from '@/constants';
import { cn } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Booking } from '@/types';

// New Modular Components
import BookingTabs from './components/BookingTabs';
import BookingCard from './components/BookingCard';
import BookingModal from './components/BookingModal';
import TicketModal from './components/TicketModal';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'cancelled'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [ticketBookingId, setTicketBookingId] = useState<string | null>(null);

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isPast = new Date(b.travelDate) < new Date();
    const matchesTab = 
      activeTab === 'active' ? (b.status !== 'cancelled' && !isPast) :
      activeTab === 'past' ? (b.status !== 'cancelled' && isPast) :
      activeTab === 'cancelled' ? b.status === 'cancelled' : true;

    return matchesSearch && matchesTab;
  });

  const handleTicketSubmit = async (bookingId: string, subject: string, message: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(`Ticket raised successfully for Booking ${bookingId}!\nSubject: ${subject}`);
        resolve();
      }, 1000);
    });
  };

  return (
    <PortalLayout role="customer" title="My Bookings">
      <div className="max-w-[1200px] mx-auto w-full space-y-6 md:space-y-8">
        {/* Header Actions: Tabs + Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md pb-4 pt-2">
          <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full lg:w-72 h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all shrink-0">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onViewDetails={(b) => setSelectedBooking(b)} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="max-w-xs mx-auto space-y-2">
                <p className="text-secondary font-bold">No bookings found</p>
                <p className="text-sm text-text-muted italic">We couldn't find any {activeTab} bookings matching your search.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedBooking && (
          <BookingModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
            onRaiseTicket={(id) => {
              setTicketBookingId(id);
              setSelectedBooking(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ticketBookingId && (
          <TicketModal 
            bookingId={ticketBookingId} 
            onClose={() => setTicketBookingId(null)} 
            onSubmit={handleTicketSubmit}
          />
        )}
      </AnimatePresence>
    </PortalLayout>
  );
}
