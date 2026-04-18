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
  Truck
} from 'lucide-react';
import { Booking } from '@/types';
import SearchableSelect from '@/components/staff/SearchableSelect';
import ActionMenu from '@/components/staff/ActionMenu';
import { toast, Toaster } from 'sonner';

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mocking current staff context
  const staffInfo = {
    name: 'Arun Kumar',
    location: 'Chennai',
    id: 'STF-001'
  };

  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS.map(b => {
    const pickup = b.pickupLocation || 'Chennai';
    const delivery = b.deliveryLocation || 'Salem';
    const mapping = MOCK_ROUTE_MAPPINGS.find(m => m.from === pickup && m.to === delivery);
    
    return {
      ...b,
      status: b.status === 'confirmed' ? 'in-place' : b.status as any,
      pickupLocation: pickup,
      deliveryLocation: delivery,
      productDescription: b.productDescription || 'General Goods',
      vehicleNo: b.vehicleNo || (mapping ? mapping.vehicleNumber : 'Not Assigned')
    };
  }));

  const handleVehicleUpdate = (bookingId: string, vehicleNo: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, vehicleNo } : b
    ));
    toast.success(`Vehicle updated for ${bookingId}`);
  };

  const handleAction = (id: string, action: 'shipping' | 'sent' | 'received') => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: action,
          completedAt: new Date().toISOString()
        };
      }
      return b;
    }));
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const isRelevant = b.pickupLocation === staffInfo.location || b.deliveryLocation === staffInfo.location;
      if (!isRelevant) return false;

      const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           b.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesTab = true;
      if (activeTab === 'sent') matchesTab = (b.status === 'sent' || b.status === 'shipping') && b.pickupLocation === staffInfo.location;
      if (activeTab === 'received') matchesTab = b.status === 'received' && b.deliveryLocation === staffInfo.location;
      if (activeTab === 'pending') {
        matchesTab = (b.status === 'in-place' && b.pickupLocation === staffInfo.location) || 
                     (b.status === 'shipping' && b.pickupLocation === staffInfo.location) || 
                     (b.status === 'sent' && b.deliveryLocation === staffInfo.location);
      }

      return matchesSearch && matchesTab;
    });
  }, [bookings, activeTab, searchTerm, staffInfo.location]);

  const stats = useMemo(() => {
    const relevant = bookings.filter(b => b.pickupLocation === staffInfo.location || b.deliveryLocation === staffInfo.location);
    return {
      total: relevant.length,
      sent: relevant.filter(b => (b.status === 'sent' || b.status === 'shipping') && b.pickupLocation === staffInfo.location).length,
      received: relevant.filter(b => b.status === 'received' && b.deliveryLocation === staffInfo.location).length,
      pending: relevant.filter(b => 
        (b.status === 'in-place' && b.pickupLocation === staffInfo.location) || 
        (b.status === 'shipping' && b.pickupLocation === staffInfo.location) || 
        (b.status === 'sent' && b.deliveryLocation === staffInfo.location)
      ).length
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
              { label: 'Sent', value: stats.sent, icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Received', value: stats.received, icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
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
          <div className="flex p-1 bg-gray-100 rounded-md w-full md:w-fit">
            {(['all', 'sent', 'received', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-1.5 text-xs font-bold rounded-md transition-all capitalize",
                  activeTab === tab 
                    ? "bg-white text-secondary shadow-sm" 
                    : "text-text-muted hover:text-secondary"
                )}
              >
                {tab}
              </button>
            ))}
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
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Tracking ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Parcel Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic">
                      No courier activities found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const isOrigin = booking.pickupLocation === staffInfo.location;
                    const isDest = booking.deliveryLocation === staffInfo.location;
                    const canShip = isOrigin && booking.status === 'in-place';
                    const canSend = isOrigin && booking.status === 'shipping';
                    const canReceive = isDest && booking.status === 'sent';
                    const isCompleted = (isOrigin && booking.status === 'sent') || (isDest && booking.status === 'received');

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold text-secondary">{booking.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-medium", isOrigin ? "text-primary font-bold" : "text-text-muted")}>
                              {booking.pickupLocation}
                            </span>
                            <div className="h-px w-4 bg-gray-300" />
                            <span className={cn("text-xs font-medium", isDest ? "text-primary font-bold" : "text-text-muted")}>
                              {booking.deliveryLocation}
                            </span>
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
                            className="w-36"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs text-text-muted truncate max-w-[150px]">{booking.productDescription}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "badge",
                            booking.status === 'in-place' && "bg-blue-100 text-blue-700",
                            booking.status === 'shipping' && "bg-indigo-100 text-indigo-700",
                            booking.status === 'sent' && "bg-purple-100 text-purple-700",
                            booking.status === 'received' && "bg-green-100 text-green-700"
                          )}>
                            {booking.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isCompleted ? (
                              <div className="flex flex-col items-center gap-1">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className="text-[8px] font-bold text-green-600 uppercase">Completed</span>
                              </div>
                            ) : (
                              <ActionMenu 
                                items={[
                                  {
                                    label: 'Mark as Shipping',
                                    icon: <Truck className="h-4 w-4" />,
                                    onClick: () => handleAction(booking.id, 'shipping'),
                                    disabled: !canShip,
                                    variant: 'success' as const
                                  },
                                  {
                                    label: 'Mark as Sent',
                                    icon: <ArrowUpRight className="h-4 w-4" />,
                                    onClick: () => handleAction(booking.id, 'sent'),
                                    disabled: !canSend,
                                    variant: 'success' as const
                                  },
                                  {
                                    label: 'Mark as Received',
                                    icon: <ArrowDownLeft className="h-4 w-4" />,
                                    onClick: () => handleAction(booking.id, 'received'),
                                    disabled: !canReceive,
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
      </div>
      <Toaster position="top-right" richColors />
    </PortalLayout>
  );
}
