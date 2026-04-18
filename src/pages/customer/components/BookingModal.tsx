import React from 'react';
import { Booking } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { X, Info, Calendar, Users, MapPin, CreditCard, MessageSquare, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onRaiseTicket: (bookingId: string) => void;
}

export default function BookingModal({ booking, onClose, onRaiseTicket }: BookingModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-[700px] h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-primary-light p-2.5 rounded-lg">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-h2 font-display font-bold text-secondary">Booking Details</h2>
              <p className="text-email text-text-muted font-mono tracking-tight">{booking.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-text-muted" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-grow overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar">
          {/* 1. Transport Info */}
          <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/30 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="input-label !mb-0">Transport</p>
                <h4 className="text-h3 font-bold text-secondary">{booking.packageName}</h4>
                <p className="text-card text-text-muted">{booking.destination}</p>
              </div>
              <span className={cn(
                "badge",
                booking.status === 'confirmed' || booking.status === 'received' ? "bg-green-100 text-green-700" :
                booking.status === 'pending' || booking.status === 'in-place' || booking.status === 'shipping' || booking.status === 'sent' || booking.status === 'incoming' ? "bg-orange-100 text-orange-700" :
                "bg-red-100 text-red-700"
              )}>
                {booking.status.replace('-', ' ')}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-card text-text-muted">Total Amount Paid</span>
              <span className="text-h3 font-bold text-primary">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* 2. Travel Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-100 flex items-center gap-4">
              <div className="bg-primary-light/50 p-2.5 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="input-label !mb-0">Travel Date</p>
                <p className="text-card font-bold text-secondary">{formatDate(booking.travelDate)}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-100 flex items-center gap-4">
              <div className="bg-primary-light/50 p-2.5 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="input-label !mb-0">Travellers</p>
                <p className="text-card font-bold text-secondary">{booking.travellersCount} Members</p>
              </div>
            </div>
          </div>

          {/* 3. Route Details */}
          <div className="space-y-3">
            <h4 className="input-label !mb-0 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Route Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50/40 p-4 rounded-lg border border-green-100/50">
                <p className="text-label uppercase font-bold text-green-600 mb-1.5">Pick up</p>
                <p className="text-card text-secondary leading-relaxed font-medium">{booking.pickupAddress || 'Address not specified'}</p>
              </div>
              <div className="bg-red-50/40 p-4 rounded-lg border border-red-100/50">
                <p className="text-label uppercase font-bold text-red-600 mb-1.5">Drop</p>
                <p className="text-card text-secondary leading-relaxed font-medium">{booking.dropAddress || 'Address not specified'}</p>
              </div>
            </div>
          </div>

          {/* 4. Payment Info */}
          <div className="space-y-3">
            <h4 className="input-label !mb-0 flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5" /> Payment Info
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-gray-100">
                <p className="text-label uppercase font-bold text-text-muted mb-1">Mode</p>
                <p className="text-card font-bold text-secondary capitalize">{booking.paymentMode}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100">
                <p className="text-label uppercase font-bold text-text-muted mb-1">Status</p>
                <p className="text-card font-bold text-secondary capitalize">{booking.paymentStatus}</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 col-span-2 sm:col-span-1">
                <p className="text-label uppercase font-bold text-text-muted mb-1">Deadline</p>
                <p className="text-card font-bold text-secondary">{booking.paymentDeadline ? formatDate(booking.paymentDeadline) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 md:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 mt-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => onRaiseTicket(booking.id)}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-primary text-primary rounded-md hover:bg-primary-light transition-all flex items-center justify-center gap-2 text-button-sm font-bold"
            >
              <MessageSquare className="h-4 w-4" /> Raise Ticket
            </button>
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-all flex items-center justify-center gap-2 text-button-sm font-bold">
              <Headphones className="h-4 w-4" /> Contact Us
            </button>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 font-bold text-text-muted hover:text-secondary transition-colors text-button"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
