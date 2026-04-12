import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_CUSTOMERS, MOCK_BOOKINGS } from '@/constants';
import { cn, formatDate } from '@/lib/utils';
import { Search, Mail, Phone, Calendar, User, MapPin, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '@/types';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(null);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const getCustomerBookings = () => {
    return MOCK_BOOKINGS.filter(b => b.customerEmail === selectedCustomer?.email);
  };

  return (
    <PortalLayout role="staff" title="Customer Management">
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md pb-4 pt-2">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Total Bookings</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=C0392B&color=fff`} 
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-sm font-bold text-secondary">{customer.name}</p>
                          <p className="text-xs text-text-muted">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Phone className="h-3 w-3" /> {customer.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
                        {MOCK_BOOKINGS.filter(b => b.customerEmail === customer.email).length} Trips
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 hover:bg-gray-100 rounded-md text-text-muted hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-display font-bold text-secondary">Customer Profile</h2>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-text-muted" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Profile Info */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="text-center space-y-4">
                      <img 
                        src={selectedCustomer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=C0392B&color=fff`} 
                        alt={selectedCustomer.name}
                        className="w-32 h-32 rounded-lg object-cover mx-auto border-4 border-white shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-secondary">{selectedCustomer.name}</h3>
                        <p className="text-sm text-text-muted uppercase tracking-widest font-bold">Customer since 2024</p>
                      </div>
                    </div>

                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-text-muted uppercase">Email Address</p>
                          <p className="text-sm font-medium text-secondary truncate">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase">Phone Number</p>
                          <p className="text-sm font-medium text-secondary">{selectedCustomer.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Booking History */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-secondary flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" /> Booking History
                      </h4>
                      <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                        {getCustomerBookings().length} Total Trips
                      </span>
                    </div>

                    <div className="space-y-4">
                      {getCustomerBookings().map((booking) => (
                        <div key={booking.id} className="p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-secondary group-hover:text-primary transition-colors">{booking.packageName}</p>
                              <p className="text-xs text-text-muted">ID: {booking.id} • {formatDate(booking.travelDate)}</p>
                            </div>
                            <span className={cn("badge", `badge-${booking.status}`)}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase">
                              <MapPin className="h-3 w-3" /> {booking.destination}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase">
                              <User className="h-3 w-3" /> {booking.travellersCount} Travellers
                            </div>
                          </div>
                        </div>
                      ))}
                      {getCustomerBookings().length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <p className="text-text-muted italic">No booking history found for this customer.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PortalLayout>
  );
}
