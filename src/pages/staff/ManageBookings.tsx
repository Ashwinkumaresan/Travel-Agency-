import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS, MOCK_ROUTE_MAPPINGS, MOCK_DRIVERS } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { 
  Search, Filter, Eye, CheckCircle, X, User, Phone, MapPin, 
  Calendar, Users, CreditCard, Info, Truck, Check, 
  ChevronRight, ArrowLeftRight, Clock, Hash, ShieldCheck,
  Settings2, LayoutGrid, List, MoreVertical,
  Banknote, Wallet, ArrowUpCircle, ArrowDownCircle,
  Navigation, XCircle
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, RouteMapping, PaymentMode, GDM } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import ActionMenu from '@/components/staff/ActionMenu';

export default function ManageBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in-place' | 'shipping' | 'sent' | 'incoming' | 'received'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<Booking | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'Online' | 'Cash'>('Online');
  
  // Filter state
  const [filterVehicleNo, setFilterVehicleNo] = useState('');
  const [filterRoute, setFilterRoute] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${apiUrl}locations/other/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${apiUrl}vehicles/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${apiUrl}routes/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRoutes(data);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutes();
  }, []);

  const mapBackendStatusToFrontend = (status: string): Booking['status'] => {
    if (status === 'inplace') return 'in-place';
    if (status === 'shipping') return 'shipping';
    if (status === 'delevered') return 'sent'; // Backend spells it 'delevered'
    return 'in-place';
  };

  const fetchBookings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
      const token = localStorage.getItem('accessToken');
      
      let url = `${apiUrl}couriers/`;
      const params = new URLSearchParams();
      
      if (activeTab === 'in-place') params.append('status', 'inplace');
      else if (activeTab === 'shipping') params.append('status', 'shipping');
      else if (activeTab === 'sent') params.append('status', 'sent');
      else if (activeTab === 'incoming') params.append('status', 'incoming');
      else if (activeTab === 'received') params.append('status', 'recieved'); // Backend spells it 'recieved'
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const mappedData: Booking[] = data.map((c: any) => {
          const fromLocationName = c.from_location?.name || `Branch ${c.from_location}`;
          const toLocationName = c.to_location?.name || `Branch ${c.to_location}`;
          
          return {
            id: c.id.toString(),
            lrNo: c.lr_number,
            customerName: c.sender_name,
            customerEmail: '',
            customerPhone: c.sender_phone_num,
            pickupLocation: fromLocationName,
            deliveryLocation: toLocationName,
            travelDate: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            travellersCount: 1,
            totalPrice: parseFloat(c.total) || 0,
            status: mapBackendStatusToFrontend(c.status),
            paymentMode: c.payment_mode || 'Cash',
            paymentStatus: c.payment_status || 'to-pay',
            submittedAt: c.created_at,
            weightKg: parseFloat(c.weight) || 0,
            vehicleNo: c.vehicle ? (c.vehicle.vehicle_number || c.vehicle) : ''
          };
        });
        
        setBookings(mappedData);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, locations]);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
  };
  
  const navigate = useNavigate();
  const currentStaffLocation = 'Chennai';

  const handleStatusUpdate = async (bookingId: string, nextStatus: Booking['status']) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
      const token = localStorage.getItem('accessToken');
      
      let endpoint = '';
      if (nextStatus === 'shipping') {
        endpoint = `${apiUrl}couriers/${bookingId}/mark-shipping/`;
      } else if (nextStatus === 'sent' || nextStatus === 'received') {
        endpoint = `${apiUrl}couriers/${bookingId}/mark-delevered/`;
      }
      
      if (!endpoint) {
        toast.error(`Unsupported status transition to ${nextStatus}`);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(`Booking ${bookingId} moved to ${nextStatus.replace('-', ' ')}`);
        fetchBookings();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Failed to update status'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating status');
    }
  };

  const handlePaymentUpdate = (bookingId: string) => {
    const updated = bookings.map(b => 
      b.id === bookingId ? { ...b, paymentStatus: 'paid' as const, paymentMode: selectedPaymentMode } : b
    );
    saveBookings(updated);
    toast.success(`Payment confirmed via ${selectedPaymentMode} for ${bookingId}`);
    setIsPaymentModalOpen(null);
  };

  const handleBulkVehicleAssign = async (routeId: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
      const token = localStorage.getItem('accessToken');

      const promises = selectedIds.map(async (id) => {
        const response = await fetch(`${apiUrl}couriers/assign-route/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courier_id: parseInt(id), route_id: routeId })
        });
        return response;
      });

      const results = await Promise.all(promises);
      const allOk = results.every(r => r.ok);

      if (allOk) {
        toast.success(`Route assigned to ${selectedIds.length} bookings`);
        setSelectedIds([]);
        setIsVehicleModalOpen(false);
        fetchBookings();
      } else {
        toast.error('Failed to assign route to some bookings');
      }
    } catch (error) {
      console.error('Error assigning route:', error);
      toast.error('An error occurred while assigning route');
    }
  };

  const handleBulkStatusChange = async (status: Booking['status']) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
      const token = localStorage.getItem('accessToken');
      
      let endpoint = '';
      if (status === 'shipping') {
        endpoint = `${apiUrl}couriers/bulk-mark-shipping/`;
      } else if (status === 'sent' || status === 'received') {
        endpoint = `${apiUrl}couriers/bulk-mark-delivered/`;
      }
      
      if (!endpoint) {
        toast.error(`Unsupported bulk status transition to ${status}`);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courier_ids: selectedIds.map(id => parseInt(id)) })
      });

      if (response.ok) {
        toast.success(`${selectedIds.length} bookings marked as ${status.replace('-', ' ')}`);
        setSelectedIds([]);
        fetchBookings();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Failed to update status'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating status');
    }
  };

  const handleGenerateGDM = async () => {
    const selectedBookings = bookings.filter(b => selectedIds.includes(b.id));
    
    // Validate assignments
    const unassigned = selectedBookings.filter(b => !b.vehicleNo);
    if (unassigned.length > 0) {
      toast.error(`Assign vehicle before generating GDM for ${unassigned.length} bookings`);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/staff/';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}gdms/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          couriers: selectedIds.map(id => parseInt(id))
        })
      });

      if (response.ok) {
        toast.success(`GDM Generated successfully for ${selectedIds.length} bookings`);
        setSelectedIds([]);
        fetchBookings();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Failed to generate GDM'}`);
      }
    } catch (error) {
      console.error('Error generating GDM:', error);
      toast.error('An error occurred while generating GDM');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBookings.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const uniqueTableVehicles = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.vehicleNo).filter(Boolean))) as string[];
  }, [bookings]);

  const uniqueTableRoutes = useMemo(() => {
    return Array.from(new Set(bookings.map(b => `${b.pickupLocation} → ${b.deliveryLocation}`))) as string[];
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.lrNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const vehicleMatches = !filterVehicleNo || b.vehicleNo === filterVehicleNo;
      const routeMatches = !filterRoute || 
                          `${b.pickupLocation} → ${b.deliveryLocation}` === filterRoute;

      return matchesSearch && vehicleMatches && routeMatches;
    });
  }, [bookings, searchTerm, filterVehicleNo, filterRoute]);

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'in-place', label: 'In Place', count: bookings.filter(b => b.status === 'in-place' && b.pickupLocation === currentStaffLocation).length },
    { id: 'shipping', label: 'Shipping', count: bookings.filter(b => b.status === 'shipping' && b.pickupLocation === currentStaffLocation).length },
    { id: 'sent', label: 'Sent', count: bookings.filter(b => (b.status === 'sent' || b.status === 'received') && b.pickupLocation === currentStaffLocation).length },
    { id: 'incoming', label: 'Incoming', count: bookings.filter(b => b.status === 'incoming' && b.deliveryLocation === currentStaffLocation).length },
    { id: 'received', label: 'Received', count: bookings.filter(b => b.status === 'received' && b.deliveryLocation === currentStaffLocation).length },
  ] as const;

  return (
    <PortalLayout role="staff" title="Manage Bookings">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-6 overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-gray-100/50 p-1 rounded-[8px] w-full md:w-fit overflow-x-auto custom-scrollbar border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-[4px] transition-all duration-300 relative flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-white text-secondary shadow-md font-bold" 
                    : "text-text-muted hover:text-secondary font-medium"
                )}
              >
                <span className="text-xs uppercase tracking-wider">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-[4px] mx-1" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search LR No or Customer..." 
                className="w-full pl-9 pr-4 h-11 bg-white border border-gray-100 rounded-[8px] text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className={cn(
                "h-11 px-4 flex items-center gap-2 bg-white border border-gray-100 rounded-[8px] transition-all hover:bg-gray-50",
                (filterVehicleNo || filterRoute) && "border-primary/30 bg-primary/5 text-primary"
              )}
            >
              <Filter className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-bold">Filters</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 py-3 bg-secondary text-white rounded-[8px] flex items-center justify-between shadow-xl shadow-secondary/20 shrink-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-white/90">{selectedIds.length} Bookings Selected</span>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-[4px] text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <Truck className="h-3.5 w-3.5" /> Assign Vehicle
                  </button>
                  <button 
                    onClick={() => handleBulkStatusChange('shipping')}
                    className="px-4 py-1.5 bg-primary hover:bg-primary/90 rounded-[4px] text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <ArrowUpCircle className="h-3.5 w-3.5" /> Mark as Shipping
                  </button>
                  {activeTab === 'in-place' && (
                    <button 
                      onClick={handleGenerateGDM}
                      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-[4px] text-xs font-black transition-colors flex items-center gap-2"
                    >
                      <Truck className="h-3.5 w-3.5" /> GDM
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-xs font-bold text-white/60 hover:text-white flex items-center gap-1"
              >
                Clear Selection <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Container */}
        <div className="flex-1 bg-white rounded-[8px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-auto custom-scrollbar flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 w-12">
                    {activeTab !== 'all' && (
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all"
                        onChange={handleSelectAll}
                        checked={filteredBookings.length > 0 && selectedIds.length === filteredBookings.length}
                      />
                    )}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">LR Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Route Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Finances</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  {activeTab !== 'all' && (
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right uppercase tracking-widest">Controls</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-24">
                      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                        <div className="p-4 bg-gray-50 rounded-[4px]">
                          <LayoutGrid className="h-12 w-12 text-gray-200" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-display font-medium text-secondary">No Records Found</p>
                          <p className="text-xs text-text-muted">Adjust your search or filters to see more bookings.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className={cn(
                      "hover:bg-gray-50/50 transition-colors group",
                      selectedIds.includes(booking.id) && "bg-primary-light/10 hover:bg-primary-light/20"
                    )}>
                      <td className="px-6 py-5">
                        {activeTab !== 'all' && (
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all"
                            checked={selectedIds.includes(booking.id)}
                            onChange={() => handleSelectRow(booking.id)}
                          />
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-[4px] bg-primary" />
                          <span className="text-sm font-black text-secondary">{booking.lrNo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[8px] bg-gray-100 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                            <span className="text-sm font-black text-secondary">{booking.customerName.charAt(0)}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-secondary truncate">{booking.customerName}</span>
                            <span className="text-[10px] text-text-muted font-bold truncate tracking-widest">{booking.customerPhone || '+91 98765 43210'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-secondary italic">{booking.pickupLocation}</span>
                            <span className="text-gray-300"><ChevronRight className="h-3 w-3" /></span>
                            <span className="text-[11px] font-black text-primary italic">{booking.deliveryLocation}</span>
                          </div>
                          {MOCK_ROUTE_MAPPINGS.find(m => m.vehicleNumber === booking.vehicleNo)?.routePath && MOCK_ROUTE_MAPPINGS.find(m => m.vehicleNumber === booking.vehicleNo)!.routePath.length > 2 && (
                            <div className="flex items-center gap-1">
                              <Navigation className="h-2.5 w-2.5 text-primary" />
                              <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter truncate max-w-[120px]">
                                Via {MOCK_ROUTE_MAPPINGS.find(m => m.vehicleNumber === booking.vehicleNo)!.routePath.slice(1, -1).join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                             <Clock className="h-3 w-3 text-gray-400" />
                             <span className="text-[10px] text-text-muted font-bold">{formatDate(booking.travelDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {booking.status !== 'in-place' ? (
                          <div className={cn(
                            "px-3 py-1.5 border rounded-[4px] inline-flex items-center gap-2",
                            booking.status === 'shipping' ? "bg-gray-100 border-gray-200" : "bg-primary/5 border-primary/20"
                          )}>
                            <Truck className={cn("h-3 w-3", booking.status === 'shipping' ? "text-secondary" : "text-primary")} />
                            <span className={cn("text-[11px] font-black font-mono", booking.status === 'shipping' ? "text-secondary" : "text-primary")}>{booking.vehicleNo || 'UNASSIGNED'}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               setSelectedIds([booking.id]);
                               setIsVehicleModalOpen(true);
                            }}
                            className={cn(
                              "px-3 py-1.5 border rounded-[4px] text-[10px] font-bold transition-all flex items-center gap-2 group/btn",
                              booking.vehicleNo 
                                ? "bg-white border-primary/20 text-primary hover:bg-primary/5" 
                                : "border-dashed border-gray-200 text-text-muted hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            {booking.vehicleNo ? (
                              <>
                                <Truck className="h-3 w-3" /> {booking.vehicleNo} (Change)
                              </>
                            ) : (
                              <>
                                <Settings2 className="h-3 w-3 group-hover/btn:rotate-45 transition-transform" /> Assign Vehicle
                              </>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-secondary">{formatCurrency(booking.totalPrice)}</span>
                          </div>
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded w-fit",
                            booking.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {booking.paymentStatus.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-[4px] text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 w-fit shadow-sm",
                          booking.status === 'in-place' && "bg-gray-100 text-gray-600 border border-gray-200",
                          booking.status === 'shipping' && "bg-blue-600 text-white shadow-blue-200",
                          booking.status === 'sent' && "bg-purple-600 text-white shadow-purple-200",
                          booking.status === 'incoming' && "bg-orange-600 text-white shadow-orange-200",
                          booking.status === 'received' && "bg-green-600 text-white shadow-green-200"
                        )}>
                          <div className={cn(
                            "w-1 h-1 rounded-[4px]",
                            booking.status === 'in-place' ? "bg-gray-400" : "bg-white"
                          )} />
                          {booking.status.replace('-', ' ')}
                        </span>
                      </td>
                      {activeTab !== 'all' && (
                        <td className="px-6 py-5 text-right">
                          <ActionMenu 
                            items={[
                              {
                                label: 'View Details',
                                icon: <Eye className="h-4 w-4" />,
                                onClick: () => setSelectedBooking(booking)
                              },
                              ...(booking.status === 'in-place' ? [
                                {
                                  label: 'Mark as Shipping',
                                  icon: <ArrowUpCircle className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'shipping'),
                                  variant: 'success' as const
                                }
                              ] : []),
                              ...(booking.status === 'shipping' && activeTab === 'incoming' ? [
                                {
                                  label: 'Mark as Sent',
                                  icon: <ArrowUpCircle className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'sent'),
                                  variant: 'success' as const
                                },
                                {
                                  label: 'Move to In Place',
                                  icon: <ArrowDownCircle className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'in-place')
                                }
                              ] : []),
                              ...(booking.status === 'sent' ? [
                                {
                                  label: 'Mark as Incoming (Dest)',
                                  icon: <ChevronRight className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'incoming'),
                                  variant: 'success' as const
                                }
                              ] : []),
                              ...(booking.status === 'incoming' ? [
                                {
                                  label: 'Mark as Received',
                                  icon: <CheckCircle className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'received'),
                                  variant: 'success' as const
                                }
                              ] : []),
                              ...(booking.status === 'received' ? [
                                {
                                  label: 'Mark as Not Received',
                                  icon: <XCircle className="h-4 w-4" />,
                                  onClick: () => handleStatusUpdate(booking.id, 'incoming')
                                },
                                ...(booking.paymentStatus === 'to-pay' ? [{
                                  label: 'Update Payment',
                                  icon: <Banknote className="h-4 w-4" />,
                                  onClick: () => setIsPaymentModalOpen(booking),
                                  variant: 'success' as const
                                }] : [])
                              ] : [])
                            ]}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isVehicleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVehicleModalOpen(false)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[8px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <h3 className="font-display font-bold text-secondary">Assign Logistics Vehicle</h3>
                <button onClick={() => setIsVehicleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-[4px] transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search vehicle or driver..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-[8px] text-sm" 
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                  />
                </div>

                {(() => {
                  const selectedBookings = bookings.filter(b => selectedIds.includes(b.id));
                  
                  // Filter routes based on search
                  const filteredRoutes = routes.filter(r => {
                    const vehicleNumber = r.vehicle?.vehicle_number || '';
                    const driverName = r.driver?.user_name || '';
                    const fromLoc = r.from_location?.name || '';
                    const toLoc = r.to_location?.name || '';
                    
                    return (
                      vehicleNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                      driverName.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                      fromLoc.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                      toLoc.toLowerCase().includes(vehicleSearch.toLowerCase())
                    );
                  });

                  return (
                    <div className="space-y-6">
                      {filteredRoutes.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">
                             Available Routes
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {filteredRoutes.map(route => {
                              const vehicleNumber = route.vehicle?.vehicle_number || 'No Vehicle';
                              const fromLoc = route.from_location?.name || 'Unknown';
                              const toLoc = route.to_location?.name || 'Unknown';
                              const driverName = route.driver?.user_name || 'No Driver';
                              
                              return (
                                <button 
                                  key={route.id}
                                  onClick={() => {
                                     handleBulkVehicleAssign(route.id);
                                     setVehicleSearch('');
                                  }}
                                  className="w-full p-4 border border-gray-100 rounded-[8px] hover:border-primary/30 hover:bg-gray-50 text-left transition-all group shrink-0"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                     <div className="flex items-center gap-3">
                                       <div className="p-2 bg-gray-100 text-gray-500 rounded-[8px] group-hover:bg-primary group-hover:text-white transition-colors"><Truck className="h-4 w-4" /></div>
                                       <span className="font-black text-secondary font-mono tracking-tight">{vehicleNumber}</span>
                                     </div>
                                     <span className="text-[9px] font-bold text-text-muted uppercase italic tracking-tighter">
                                        {route.route_path && Array.isArray(route.route_path) ? route.route_path.join(' → ') : `${fromLoc} → ${toLoc}`}
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3.5 w-3.5 text-gray-400" />
                                      <span className="text-xs font-bold text-text-muted group-hover:text-secondary transition-colors">{driverName}</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {filteredRoutes.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-sm font-bold text-text-muted italic">No matching routes found.</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}

        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterModalOpen(false)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} className="absolute right-0 top-0 bottom-0 bg-white w-full max-w-sm shadow-2xl flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-secondary">Advanced Filters</h3>
                <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-[4px] transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Truck className="h-3 w-3" /> Logistical Mapping (from Table)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilterVehicleNo('')}
                      className={cn(
                        "px-4 py-2.5 rounded-[8px] text-[10px] font-black transition-all border uppercase",
                        !filterVehicleNo ? "bg-primary text-white border-primary shadow-md" : "bg-gray-50 border-gray-100 text-text-muted hover:bg-gray-100"
                      )}
                    >
                      All Vehicles
                    </button>
                    {uniqueTableVehicles.map(v => (
                      <button 
                        key={v}
                        onClick={() => setFilterVehicleNo(v)}
                        className={cn(
                          "px-4 py-2.5 rounded-[8px] text-[10px] font-black transition-all border uppercase",
                          filterVehicleNo === v ? "bg-primary text-white border-primary shadow-md" : "bg-gray-50 border-gray-100 text-text-muted hover:bg-gray-100"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Navigation className="h-3 w-3" /> Route Filter (from Table)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setFilterRoute('')}
                      className={cn(
                        "px-4 py-2.5 rounded-[8px] text-[10px] font-black transition-all border uppercase",
                        !filterRoute ? "bg-secondary text-white border-secondary shadow-md" : "bg-gray-50 border-gray-100 text-text-muted hover:bg-gray-100"
                      )}
                    >
                      All Routes
                    </button>
                    {uniqueTableRoutes.map(r => (
                      <button 
                        key={r}
                        onClick={() => setFilterRoute(r)}
                        className={cn(
                          "px-4 py-2.5 rounded-[8px] text-[10px] font-black transition-all border uppercase whitespace-nowrap",
                          filterRoute === r ? "bg-secondary text-white border-secondary shadow-md" : "bg-gray-50 border-gray-100 text-text-muted hover:bg-gray-100"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-4">
                <button onClick={() => { setFilterVehicleNo(''); setFilterRoute(''); setIsFilterModalOpen(false); }} className="flex-1 py-3 text-sm font-bold text-text-muted hover:text-secondary transition-colors">Reset</button>
                <button onClick={() => setIsFilterModalOpen(false)} className="flex-1 btn-primary py-3">Apply Filters</button>
              </div>
            </motion.div>
          </div>
        )}

        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPaymentModalOpen(null)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[8px] shadow-2xl p-8 flex flex-col gap-6">
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[4px] flex items-center justify-center mx-auto mb-4 border border-green-100"><Banknote className="h-8 w-8" /></div>
                   <h3 className="text-xl font-display font-bold text-secondary">Complete Payment</h3>
                   <p className="text-sm text-text-muted">LR No: <span className="font-bold text-secondary">{isPaymentModalOpen.lrNo}</span></p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs font-bold text-text-muted uppercase text-center">Select Payment Mode</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedPaymentMode('Online')}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 border rounded-[8px] transition-all font-bold text-sm relative",
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
                        "flex flex-col items-center gap-3 p-4 border rounded-[8px] transition-all font-bold text-sm relative",
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

                <div className="flex gap-4 mt-2">
                  <button onClick={() => setIsPaymentModalOpen(null)} className="flex-1 py-3 text-sm font-bold text-text-muted hover:text-secondary transition-colors">Cancel</button>
                  <button onClick={() => handlePaymentUpdate(isPaymentModalOpen.id)} className="flex-1 btn-primary py-3">Confirm Paid</button>
                </div>
             </motion.div>
          </div>
        )}

        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-secondary/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-4xl rounded-[8px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modern Header */}
              <div className="bg-secondary p-8 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-[4px] blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[8px] flex items-center justify-center border border-white/20"><Truck className="h-8 w-8 text-primary" /></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black">{selectedBooking.lrNo}</h2>
                      <div className="flex flex-col gap-0.5">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-[4px] font-black uppercase text-center",
                          selectedBooking.paymentStatus === 'paid' ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                        )}>{selectedBooking.paymentStatus}</span>
                        {selectedBooking.paymentMode && (
                          <span className="text-[8px] font-black uppercase text-white/40 text-center tracking-tighter italic">via {selectedBooking.paymentMode}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{selectedBooking.status} STATUS</p>
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="relative z-10 p-2 hover:bg-white/10 rounded-[4px] transition-colors"><X className="h-6 w-6" /></button>
              </div>

              {/* Dynamic Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Main */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Route Section */}
                    <div className="space-y-4">
                       <h3 className="text-xs font-black text-text-muted uppercase tracking-widest underline decoration-primary decoration-4 underline-offset-8">Logistic Path Flow</h3>
                       <div className="bg-gray-50 p-8 rounded-[8px] border border-gray-100 flex items-center justify-between relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-[60%] bg-dashed-border opacity-20" />
                          <div className="flex flex-col items-center gap-3 relative z-10">
                             <div className="w-12 h-12 bg-white rounded-[8px] shadow-xl flex items-center justify-center text-primary border border-gray-100"><MapPin className="h-6 w-6" /></div>
                             <div className="text-center">
                               <p className="text-[10px] font-black text-text-muted uppercase">Starting</p>
                               <p className="text-sm font-black text-secondary">{selectedBooking.pickupLocation}</p>
                             </div>
                          </div>

                          <div className="flex flex-col items-center gap-3 relative z-10">
                              <div className="px-4 py-2 bg-primary text-white rounded-[4px] text-[10px] font-black shadow-lg shadow-primary/20">{selectedBooking.vehicleNo || 'AWAITING VEHICLE'}</div>
                          </div>

                          <div className="flex flex-col items-center gap-3 relative z-10">
                             <div className="w-12 h-12 bg-white rounded-[8px] shadow-xl flex items-center justify-center text-primary border border-gray-100"><Navigation className="h-6 w-6" /></div>
                             <div className="text-center">
                               <p className="text-[10px] font-black text-text-muted uppercase">Destination</p>
                               <p className="text-sm font-black text-secondary">{selectedBooking.deliveryLocation}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Basic Grid */}
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-white border border-gray-100 rounded-[8px] shadow-sm space-y-3">
                          <p className="text-[10px] font-black text-text-muted uppercase">Customer Interface</p>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-primary/5 text-primary rounded-[8px] flex items-center justify-center"><User className="h-6 w-6" /></div>
                             <div>
                                <p className="text-sm font-black text-secondary">{selectedBooking.customerName}</p>
                                <p className="text-xs text-text-muted font-bold truncate max-w-[150px]">{selectedBooking.customerEmail}</p>
                             </div>
                          </div>
                       </div>
                       <div className="p-6 bg-white border border-gray-100 rounded-[8px] shadow-sm space-y-3">
                          <p className="text-[10px] font-black text-text-muted uppercase">Trip Schedule</p>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-secondary/5 text-secondary rounded-[8px] flex items-center justify-center"><Calendar className="h-6 w-6" /></div>
                             <div>
                                <p className="text-sm font-black text-secondary">{formatDate(selectedBooking.travelDate)}</p>
                                <p className="text-xs text-text-muted font-bold">Planned Arrival: T+1 Day</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-8 bg-gray-900 text-white rounded-[8px] shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Truck className="h-32 w-32 rotate-12" /></div>
                       <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Consignment Info</h3>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase mb-2">Weight</p>
                             <p className="text-xl font-black">{selectedBooking.weightKg} <span className="text-[10px] text-white/60">KG</span></p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase mb-2">Freight Value</p>
                             <p className="text-xl font-black text-primary">{formatCurrency(selectedBooking.totalPrice)}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase mb-2">Fragile</p>
                             <p className="text-sm font-black flex items-center gap-2">{selectedBooking.isFragile ? <ShieldCheck className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-white/20" />} {selectedBooking.isFragile ? 'YES' : 'NO'}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase mb-2">Type</p>
                             <p className="text-sm font-black uppercase text-primary tracking-tighter">{selectedBooking.packageName}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="space-y-6">
                     <div className="p-6 bg-gray-50 border border-gray-100 rounded-[8px] space-y-6">
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Address Ledger</h4>
                        <div className="space-y-6">
                           <div className="flex gap-4">
                              <div className="w-1 h-full bg-green-500 rounded-[4px]" />
                              <div>
                                 <p className="text-[9px] font-black text-green-600 uppercase mb-1">Pick up Point</p>
                                 <p className="text-[11px] font-bold text-secondary leading-relaxed">{selectedBooking.pickupAddress || 'Verified Branch Location'}</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-1 h-full bg-red-500 rounded-[4px]" />
                              <div>
                                 <p className="text-[9px] font-black text-red-600 uppercase mb-1">Final Drop Off</p>
                                 <p className="text-[11px] font-bold text-secondary leading-relaxed">{selectedBooking.dropAddress || 'Customer Destination Address'}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-6 border border-gray-100 rounded-[8px] space-y-4">
                        <p className="text-[9px] font-black text-text-muted uppercase text-center border-b border-gray-50 pb-3">Quick Logistics Actions</p>
                        <div className="space-y-2">
                           <button onClick={() => setSelectedBooking(null)} className="w-full h-11 bg-gray-100 text-secondary text-xs font-black rounded-[8px] hover:bg-gray-200 transition-all flex items-center justify-center gap-2 italic">DOWNLOAD LR RECEIPT</button>
                           {selectedBooking.status === 'in-place' && (
                             <button onClick={() => { handleStatusUpdate(selectedBooking.id, 'shipping'); setSelectedBooking(null); }} className="w-full h-11 bg-primary text-white text-xs font-black rounded-[8px] hover:scale-105 transition-all shadow-xl shadow-primary/20 italic">DISPATCH SHIPMENT</button>
                           )}
                           {selectedBooking.status === 'incoming' && (
                             <button onClick={() => { handleStatusUpdate(selectedBooking.id, 'received'); setSelectedBooking(null); }} className="w-full h-11 bg-green-600 text-white text-xs font-black rounded-[8px] hover:scale-105 transition-all shadow-xl shadow-green-200 italic">VERIFY & RECEIVE</button>
                           )}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-right" richColors />
      <style>{`
        .bg-dashed-border {
          background-image: linear-gradient(to right, #d1d5db 50%, transparent 50%);
          background-size: 8px 2px;
          background-repeat: repeat-x;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
      `}</style>
    </PortalLayout>
  );
}
