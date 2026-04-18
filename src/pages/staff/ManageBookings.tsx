import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS, MOCK_ROUTE_MAPPINGS, MOCK_VEHICLES } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, Eye, CheckCircle, XCircle, X, User, Phone, MapPin, Calendar, Users, CreditCard, Info, Calculator, Truck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import SearchableSelect from '@/components/staff/SearchableSelect';
import ActionMenu from '@/components/staff/ActionMenu';

export default function ManageBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in-place' | 'shipping' | 'sent' | 'incoming' | 'received'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS.map(b => {
    const pickup = b.pickupLocation || 'Chennai';
    const delivery = b.deliveryLocation || 'Salem';
    const mapping = MOCK_ROUTE_MAPPINGS.find(m => m.from === pickup && m.to === delivery);
    
    return {
      ...b,
      status: b.status === 'confirmed' ? 'in-place' : b.status as any,
      pickupLocation: pickup,
      deliveryLocation: delivery,
      vehicleNo: b.vehicleNo || (mapping ? mapping.vehicleNumber : 'Not Assigned')
    };
  }));
  
  const navigate = useNavigate();
  
  // Mocking the current staff's location (e.g., Chennai)
  const currentStaffLocation = 'Chennai';

  const handleStatusUpdate = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (b.status === 'in-place') {
          toast.success(`Booking ${bookingId} is now Shipping`);
          // Simulate auto transition from Shipping to Sent
          setTimeout(() => {
            setBookings(current => current.map(currB => 
              currB.id === bookingId ? { ...currB, status: 'sent' } : currB
            ));
            toast.info(`Booking ${bookingId} has been Sent`);
          }, 3000);
          return { ...b, status: 'shipping' };
        }
        if (b.status === 'sent' || b.status === 'incoming') {
          toast.success(`Booking ${bookingId} has been Received`);
          return { ...b, status: 'received' };
        }
      }
      return b;
    }));
  };

  const handleVehicleUpdate = (bookingId: string, vehicleNo: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, vehicleNo } : b
    ));
    toast.success(`Vehicle updated for ${bookingId}`);
  };

  const handleBulkStatusUpdate = () => {
    if (selectedIds.length === 0) return;
    
    let updatedCount = 0;
    setBookings(prev => prev.map(b => {
      if (selectedIds.includes(b.id)) {
        if (b.status === 'in-place') {
          updatedCount++;
          // Simulate auto transition from Shipping to Sent
          setTimeout(() => {
            setBookings(current => current.map(currB => 
              currB.id === b.id ? { ...currB, status: 'sent' } : currB
            ));
          }, 3000);
          return { ...b, status: 'shipping' };
        }
        if (b.status === 'sent' || b.status === 'incoming') {
          updatedCount++;
          return { ...b, status: 'received' };
        }
      }
      return b;
    }));

    toast.success(`Updated ${updatedCount} bookings successfully`);
    setSelectedIds([]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const ids = filteredBookings.map(b => b.id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logic for "Incoming" vs "Sent"
    // If status is 'sent', it shows as 'Sent' for origin staff and 'Incoming' for destination staff
    let displayStatus = b.status;
    if (b.status === 'sent') {
      if (currentStaffLocation === b.deliveryLocation) displayStatus = 'incoming';
      else displayStatus = 'sent';
    }

    const matchesTab = activeTab === 'all' ? true : displayStatus === activeTab;

    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'in-place', label: 'In Place' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'sent', label: 'Sent' },
    { id: 'incoming', label: 'Incoming' },
    { id: 'received', label: 'Received' },
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
          <div className="flex gap-3 w-full md:w-auto items-center">
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleBulkStatusUpdate}
                  className="h-10 px-4 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold text-sm"
                  title="Bulk Update Status"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Update ({selectedIds.length})</span>
                </motion.button>
              )}
            </AnimatePresence>
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
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    onChange={handleSelectAll}
                    checked={filteredBookings.length > 0 && selectedIds.length === filteredBookings.length}
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Vehicle No</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                let displayStatus = booking.status;
                if (booking.status === 'sent') {
                  if (currentStaffLocation === booking.deliveryLocation) displayStatus = 'incoming';
                  else displayStatus = 'sent';
                }

                return (
                  <tr key={booking.id} className={cn(
                    "hover:bg-gray-50 transition-colors",
                    selectedIds.includes(booking.id) && "bg-primary-light/30"
                  )}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        checked={selectedIds.includes(booking.id)}
                        onChange={() => handleSelectRow(booking.id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-secondary">{booking.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
                          {booking.customerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-secondary">{booking.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-secondary">{booking.pickupLocation}</span>
                        <span className="text-[10px] text-text-muted">to {booking.deliveryLocation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SearchableSelect 
                        value={MOCK_VEHICLES.find(v => v.number === booking.vehicleNo)?.id.toString() || ''}
                        onSelect={(id) => {
                          const vehicle = MOCK_VEHICLES.find(v => v.id.toString() === id);
                          if (vehicle) handleVehicleUpdate(booking.id, vehicle.number);
                        }}
                        options={MOCK_VEHICLES.map(v => ({ id: v.id.toString(), label: v.number, sublabel: v.name }))}
                        placeholder="Select Vehicle"
                        icon={<Truck className="h-4 w-4" />}
                        className="w-40"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(booking.submittedAt)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "badge", 
                        displayStatus === 'in-place' && "bg-gray-100 text-gray-600",
                        displayStatus === 'shipping' && "bg-blue-100 text-blue-700",
                        displayStatus === 'sent' && "bg-purple-100 text-purple-700",
                        displayStatus === 'incoming' && "bg-orange-100 text-orange-700",
                        displayStatus === 'received' && "bg-green-100 text-green-700"
                      )}>
                        {displayStatus.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu 
                        items={[
                          {
                            label: 'View Details',
                            icon: <Eye className="h-4 w-4" />,
                            onClick: () => setSelectedBooking(booking)
                          },
                          ...(booking.status === 'in-place' || (booking.status === 'sent' && currentStaffLocation === booking.deliveryLocation) ? [
                            {
                              label: booking.status === 'in-place' ? 'Mark as Shipping' : 'Mark as Received',
                              icon: <CheckCircle className="h-4 w-4" />,
                              onClick: () => handleStatusUpdate(booking.id),
                              variant: 'success' as const
                            }
                          ] : []),
                          {
                            label: 'Reject Booking',
                            icon: <XCircle className="h-4 w-4" />,
                            onClick: () => toast.error(`Booking ${booking.id} rejected`),
                            variant: 'danger' as const
                          }
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
                        <p className="text-sm text-text-muted">{selectedBooking.pickupLocation} to {selectedBooking.deliveryLocation}</p>
                      </div>
                      <span className={cn(
                        "badge", 
                        (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status) === 'in-place' && "bg-gray-100 text-gray-600",
                        (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status) === 'shipping' && "bg-blue-100 text-blue-700",
                        (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status) === 'sent' && "bg-purple-100 text-purple-700",
                        (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status) === 'incoming' && "bg-orange-100 text-orange-700",
                        (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status) === 'received' && "bg-green-100 text-green-700"
                      )}>
                        {(selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation ? 'incoming' : selectedBooking.status).replace('-', ' ')}
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
                {(selectedBooking.status === 'in-place' || (selectedBooking.status === 'sent' && currentStaffLocation === selectedBooking.deliveryLocation)) && (
                  <button 
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id);
                      setSelectedBooking(null);
                    }}
                    className="btn-primary px-8"
                  >
                    {selectedBooking.status === 'in-place' ? 'Mark as Shipping' : 
                     'Mark as Received'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" richColors />
    </PortalLayout>
  );
}
