import React from 'react';
import { Booking } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { ChevronRight, Download, Calendar, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetails }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 md:p-6 rounded-lg border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1.5fr] gap-5 md:gap-6 items-center">
        {/* Booking Info */}
        <div className="space-y-1">
          <p className="input-label !mb-0">Booking ID</p>
          <h4 className="text-base font-bold text-secondary">{booking.id}</h4>
          <p className="text-card text-text-muted">{booking.packageName}</p>
        </div>

        {/* Travel Info */}
        <div className="space-y-3 md:space-y-1">
          <div className="flex items-center gap-2 md:block">
            <p className="input-label !mb-0 md:mb-1">Travel Dates</p>
            <div className="flex items-center gap-2 text-card font-medium text-secondary">
              <Calendar className="h-4 w-4 text-primary md:hidden" />
              {formatDate(booking.travelDate)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-helper text-text-muted">
            <Users className="h-3.5 w-3.5" />
            {booking.travellersCount} Travellers
          </div>
        </div>

        {/* Price + Status */}
        <div className="flex md:flex-col justify-between items-center md:items-start gap-2">
          <div className="space-y-0.5">
            <p className="text-base font-bold text-primary">{formatCurrency(booking.totalPrice)}</p>
            <p className="text-label text-text-muted uppercase font-bold">{booking.paymentMode}</p>
          </div>
          <span className={cn(
            "badge",
            booking.status === 'confirmed' ? "bg-green-100 text-green-700" :
            booking.status === 'pending' ? "bg-orange-100 text-orange-700" :
            "bg-red-100 text-red-700"
          )}>
            {booking.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full">
          <button 
            onClick={() => onViewDetails(booking)}
            className="w-full h-10 bg-primary text-white rounded-md text-button font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            View Details <ChevronRight className="h-4 w-4" />
          </button>
          <button className="w-full h-10 border border-primary text-primary bg-white rounded-md text-button font-bold hover:bg-primary-light transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <Download className="h-4 w-4" /> Itinerary
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
