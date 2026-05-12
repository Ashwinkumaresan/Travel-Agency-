import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS, MOCK_ROUTE_MAPPINGS, MOCK_VEHICLES } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Truck,
  Check,
  CreditCard,
  Wallet,
  X
} from 'lucide-react';
import { Booking, PaymentMode } from '@/types';
import SearchableSelect from '@/components/staff/SearchableSelect';
import ActionMenu from '@/components/staff/ActionMenu';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'in-place' | 'delivered'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'to-pay'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<Booking | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'Online' | 'Cash'>('Online');
  
  // Mocking current staff context
  const staffInfo = {
    name: 'Arun Kumar',
    location: 'Chennai',
    id: 'STF-001'
  };

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('voyage_bookings');
    const initial = saved ? JSON.parse(saved) : MOCK_BOOKINGS;
    return initial.map((b: any) => {
      const pickup = b.pickupLocation || 'Chennai';
      const delivery = b.deliveryLocation || 'Salem';
      const mapping = MOCK_ROUTE_MAPPINGS.find(m => m.from === pickup && m.to === delivery);
      
      return {
        ...b,
        status: b.status || 'in-place',
        pickupLocation: pickup,
        deliveryLocation: delivery,
        productDescription: b.productDescription || 'General Goods',
        vehicleNo: b.vehicleNo || (mapping ? mapping.vehicleNumber : 'Not Assigned')
      };
    });
  });

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('voyage_bookings', JSON.stringify(newBookings));
  };

  const handleVehicleUpdate = (bookingId: string, vehicleNo: string) => {
    const updated = bookings.map(b => 
      b.id === bookingId ? { ...b, vehicleNo } : b
    );
    saveBookings(updated);
    toast.success(`Vehicle updated for ${bookingId}`);
  };

  const handleAction = (id: string, action: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    if (action === 'delivered') {
      if (booking.paymentStatus === 'to-pay') {
        setIsPaymentModalOpen(booking);
        return;
      }
      
      const updated = bookings.map(b => 
        b.id === id ? { ...b, status: 'delivered' as any, completedAt: new Date().toISOString() } : b
      );
      saveBookings(updated);
      toast.success(`Booking ${id} marked as delivered`);
    } else {
      const updated = bookings.map(b => 
        b.id === id ? { ...b, status: action as any, completedAt: new Date().toISOString() } : b
      );
      saveBookings(updated);
    }
  };

  const handlePaymentAndDeliver = (keepToPay = false) => {
    if (!isPaymentModalOpen) return;
    
    const updated = bookings.map(b => 
      b.id === isPaymentModalOpen.id 
        ? { 
            ...b, 
            status: 'delivered' as any, 
            paymentStatus: keepToPay ? 'to-pay' as const : 'paid' as const, 
            paymentMode: keepToPay ? (b.paymentMode || 'Cash') : selectedPaymentMode,
            completedAt: new Date().toISOString() 
          } 
        : b
    );
    saveBookings(updated);
    if (keepToPay) {
      toast.success(`Booking ${isPaymentModalOpen.id} updated (To Pay maintained)`);
    } else {
      const wasAlreadyDelivered = isPaymentModalOpen.status === 'delivered';
      toast.success(wasAlreadyDelivered 
        ? `Payment status updated to Paid (${selectedPaymentMode}) for ${isPaymentModalOpen.id}`
        : `Payment confirmed via ${selectedPaymentMode} and marked as Delivered`
      );
    }
    setIsPaymentModalOpen(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // ONLY Incoming (Coming FROM other branches TO this login location)
      const isIncoming = b.deliveryLocation === staffInfo.location;
      if (!isIncoming) return false;

      const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           b.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTab = true;
      if (activeTab === 'in-place') matchesTab = b.status === 'received' || b.status === 'in-place';
      if (activeTab === 'delivered') matchesTab = b.status === 'delivered';

      let matchesPayment = true;
      if (paymentFilter === 'paid') matchesPayment = b.paymentStatus === 'paid';
      if (paymentFilter === 'to-pay') matchesPayment = b.paymentStatus === 'to-pay';

      return matchesSearch && matchesTab && matchesPayment;
    });
  }, [bookings, activeTab, paymentFilter, searchTerm, staffInfo.location]);

  const stats = useMemo(() => {
    const relevant = bookings.filter(b => b.deliveryLocation === staffInfo.location);
    return {
      total: relevant.length,
      inPlace: relevant.filter(b => (b.status === 'received' || b.status === 'in-place')).length,
      delivered: relevant.filter(b => b.status === 'delivered').length,
      paid: relevant.filter(b => b.paymentStatus === 'paid').length,
    };
  }, [bookings, staffInfo.location]);

  return (
    <PortalLayout role="staff" title="Daily Courier Report">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <input 
                type="date" 
                className="text-lg font-display font-bold text-secondary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                <User className="h-3 w-3" />
                <span>{staffInfo.name}</span>
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3" />
                <span>{staffInfo.location} Office</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'In Place', value: stats.inPlace, icon: ArrowDownLeft, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Paid', value: stats.paid, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <div key={i} className={cn("px-4 py-2 rounded-lg border border-gray-50 flex flex-col items-center justify-center min-w-[80px]", stat.bg)}>
                <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter / Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex p-1 bg-gray-100 rounded-md">
              {[
                { id: 'all', label: 'All' },
                { id: 'in-place', label: 'In Place (Received)' },
                { id: 'delivered', label: 'Delivered (To Customer)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-white text-secondary shadow-sm" 
                      : "text-text-muted hover:text-secondary"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex p-1 bg-gray-100 rounded-md">
              {[
                { id: 'all', label: 'All Payments' },
                { id: 'paid', label: 'Paid' },
                { id: 'to-pay', label: 'To Pay' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPaymentFilter(filter.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all whitespace-nowrap",
                    paymentFilter === filter.id 
                      ? "bg-secondary text-white shadow-sm" 
                      : "text-text-muted hover:text-secondary"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Tracking ID..." 
              className="input-field pl-10 h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courier List Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">LR ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">To Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">From Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic text-xs">
                      No courier activities found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const isDest = booking.deliveryLocation === staffInfo.location;
                    const canDeliver = isDest && (booking.status === 'received' || booking.status === 'in-place');
                    const isDelivered = booking.status === 'delivered';

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-secondary font-mono">{booking.lrNo || booking.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-secondary tracking-tight">{booking.customerName}</span>
                            <span className="text-[9px] font-bold text-text-muted tracking-widest">{booking.customerPhone || '+91 98765 43210'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className={cn(
                              "text-[9px] px-2 py-0.5 rounded font-black uppercase text-center w-fit",
                              booking.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {booking.paymentStatus?.replace('-', ' ')}
                            </span>
                            {booking.paymentMode && (
                              <span className="text-[7px] font-bold text-text-muted italic">via {booking.paymentMode}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span className="text-xs font-bold text-primary">{booking.pickupLocation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isDelivered ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-1 shadow-sm px-2 py-0.5 bg-green-50 rounded-full border border-green-100">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">Delivered</span>
                                </div>
                                {booking.paymentStatus === 'to-pay' && (
                                  <button 
                                    onClick={() => setIsPaymentModalOpen(booking)}
                                    className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase rounded-lg shadow-md hover:bg-primary/90 transition-all"
                                  >
                                    Update Payment
                                  </button>
                                )}
                              </div>
                            ) : (
                              <ActionMenu 
                                items={[
                                  {
                                    label: 'Mark as Delivered',
                                    icon: <CheckCircle2 className="h-4 w-4" />,
                                    onClick: () => handleAction(booking.id, 'delivered'),
                                    disabled: !canDeliver,
                                    variant: 'success' as const
                                  }
                                ]}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Confirmation Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-8 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-secondary">Collect Payment</h2>
                    <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">DR ID: {isPaymentModalOpen.lrNo || isPaymentModalOpen.id}</p>
                  </div>
                  <button onClick={() => setIsPaymentModalOpen(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-8 pt-0 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase">Amount to Collect</p>
                      <p className="text-2xl font-black text-primary">{formatCurrency(isPaymentModalOpen.totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-muted uppercase">Consignee</p>
                      <p className="text-xs font-bold text-secondary">{isPaymentModalOpen.customerName}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted uppercase text-center">Select Payment Mode</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setSelectedPaymentMode('Online')}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 border rounded-2xl transition-all font-bold text-sm relative",
                          selectedPaymentMode === 'Online' 
                            ? "border-primary bg-primary/5 text-secondary shadow-sm" 
                            : "border-gray-100 bg-white text-text-muted hover:border-gray-200"
                        )}
                      >
                        {selectedPaymentMode === 'Online' && <Check className="h-4 w-4 absolute top-3 right-3 text-primary" />}
                        <CreditCard className={cn("h-6 w-6", selectedPaymentMode === 'Online' ? "text-primary" : "text-gray-400")} /> Online/UPI
                      </button>
                      <button 
                        onClick={() => setSelectedPaymentMode('Cash')}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 border rounded-2xl transition-all font-bold text-sm relative",
                          selectedPaymentMode === 'Cash' 
                            ? "border-primary bg-primary/5 text-secondary shadow-sm" 
                            : "border-gray-100 bg-white text-text-muted hover:border-gray-200"
                        )}
                      >
                        {selectedPaymentMode === 'Cash' && <Check className="h-4 w-4 absolute top-3 right-3 text-primary" />}
                        <Wallet className={cn("h-6 w-6", selectedPaymentMode === 'Cash' ? "text-primary" : "text-gray-400")} /> Cash Point
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsPaymentModalOpen(null)}
                        className="flex-1 py-4 px-6 rounded-2xl font-black text-xs text-text-muted hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handlePaymentAndDeliver(false)}
                        className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        {isPaymentModalOpen.status === 'delivered' ? 'Confirm Payment' : 'Confirm & Pay'}
                      </button>
                    </div>
                    {isPaymentModalOpen.status !== 'delivered' && (
                      <button 
                        onClick={() => handlePaymentAndDeliver(true)}
                        className="w-full py-4 px-6 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl font-black text-xs hover:bg-secondary/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Clock className="h-4 w-4" /> Deliver (Keep To Pay)
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="top-right" richColors />
    </PortalLayout>
  );
}
