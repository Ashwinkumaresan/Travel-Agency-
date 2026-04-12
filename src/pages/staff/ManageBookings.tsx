import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, Eye, CheckCircle, XCircle, X, User, Phone, MapPin, Calendar, Users, CreditCard, Info, Calculator } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function ManageBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const navigate = useNavigate();

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' ? true : b.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'completed', label: 'Completed' },
  ] as const;

  return (
    <PortalLayout role="staff" title="Manage Bookings">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md pb-4 pt-2">
          {/* Tabs on the left */}
          <div className="flex p-1 bg-gray-100 rounded-md w-full md:w-fit overflow-x-auto custom-scrollbar">
            <div className="flex gap-1 min-w-max md:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-1.5 text-sidebar-menu rounded-md transition-all duration-200 whitespace-nowrap",
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

          {/* Search and Filter on the right */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
                className="input-field pl-10 h-10 text-sm w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-md text-text-muted hover:text-primary transition-colors shrink-0">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Transport</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Travel Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-secondary">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
                        {booking.customerName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-secondary">{booking.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{booking.packageName}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{formatDate(booking.travelDate)}</td>
                  <td className="px-6 py-4">
                    <span className={cn("badge", `badge-${booking.status}`)}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate('/staff/accounts')}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors" 
                        title="Accounts"
                      >
                        <Calculator className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Confirm">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-light p-3 rounded-lg">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-secondary">Booking Details</h2>
                    <p className="text-xs text-text-muted font-mono">{selectedBooking.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-text-muted" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {/* Status & Transport */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Transport & Status</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-secondary">{selectedBooking.packageName}</p>
                        <p className="text-sm text-text-muted">{selectedBooking.destination}</p>
                      </div>
                      <span className={cn("badge", `badge-${selectedBooking.status}`)}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between text-sm">
                      <span className="text-text-muted">Total Price:</span>
                      <span className="font-bold text-primary">{formatCurrency(selectedBooking.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Travel Schedule</h4>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-secondary">{formatDate(selectedBooking.travelDate)}</p>
                        <p className="text-xs text-text-muted">Start Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-secondary">{selectedBooking.totalMembers} Members</p>
                        <p className="text-xs text-text-muted">{selectedBooking.totalMales} Males, {selectedBooking.totalFemales} Females</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <User className="h-4 w-4" /> Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-gray-100 p-6 rounded-lg">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Name</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Gender / Age</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.gender} / {selectedBooking.age} Years</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Email</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">WhatsApp (Phone 1)</p>
                      <p className="text-sm font-bold text-secondary flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {selectedBooking.phone1}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Secondary (Phone 2)</p>
                      <p className="text-sm font-bold text-secondary flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {selectedBooking.phone2 || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Route Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50/50 p-6 rounded-lg border border-green-100">
                      <p className="text-[10px] uppercase font-bold text-green-600 mb-2">Pick up Address</p>
                      <p className="text-sm text-secondary leading-relaxed">{selectedBooking.pickupAddress}</p>
                    </div>
                    <div className="bg-red-50/50 p-6 rounded-lg border border-red-100">
                      <p className="text-[10px] uppercase font-bold text-red-600 mb-2">Drop Address</p>
                      <p className="text-sm text-secondary leading-relaxed">{selectedBooking.dropAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Deadlines */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payment Deadlines
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-gray-100 bg-white">
                      <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Pre Payment</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.prePaymentDeadline ? formatDate(selectedBooking.prePaymentDeadline) : 'Not Set'}</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-100 bg-white">
                      <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Post Payment</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.postPaymentDeadline ? formatDate(selectedBooking.postPaymentDeadline) : 'Not Set'}</p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-100 bg-white">
                      <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Half Payment</p>
                      <p className="text-sm font-bold text-secondary">{selectedBooking.halfPaymentDeadline ? formatDate(selectedBooking.halfPaymentDeadline) : 'Not Set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2.5 rounded-md font-bold text-text-muted hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button className="btn-primary px-8">
                  Update Status
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PortalLayout>
  );
}
