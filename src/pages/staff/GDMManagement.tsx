import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Truck, Search, Filter, ArrowRight, Printer, 
  ChevronRight, Calendar, User, MapPin, Package, ShieldCheck, 
  Info, X, Clock, Banknote, Trash2, Check, CheckCircle
} from 'lucide-react';
import PortalLayout from '../../components/layout/PortalLayout';
import { MOCK_GDMS, MOCK_BOOKINGS } from '../../constants';
import { GDM, Booking } from '../../types';
import { cn } from '../../lib/utils';
import { toast, Toaster } from 'sonner';

export default function GDMManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'inplace' | 'shipping' | 'sent'>('all');
  const [loading, setLoading] = useState(true);
  
  const [gdms, setGdms] = useState<GDM[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedGDM, setSelectedGDM] = useState<GDM | null>(null);
  const [printingGdmId, setPrintingGdmId] = useState<string | null>(null);

  const mapBackendStatusToFrontend = (status: string): Booking['status'] => {
    if (status === 'inplace') return 'in-place';
    if (status === 'shipping') return 'shipping';
    if (status === 'delevered') return 'sent'; // Backend spells it 'delevered'
    return 'in-place';
  };

  const fetchBookings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiUrl}couriers/?status=all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const mappedData: Booking[] = data.map((c: any) => ({
          id: c.id.toString(),
          lrNo: c.lr_number,
          customerName: c.sender_name,
          customerEmail: '',
          customerPhone: c.sender_phone_num,
          pickupLocation: c.from_location?.name || `Branch ${c.from_location}`,
          deliveryLocation: c.to_location?.name || `Branch ${c.to_location}`,
          travelDate: c.created_at ? c.created_at.split('T')[0] : '',
          travellersCount: 1,
          totalPrice: parseFloat(c.total) || 0,
          status: mapBackendStatusToFrontend(c.status),
          paymentMode: c.payment_mode || 'Cash',
          paymentStatus: c.payment_status || 'to-pay',
          submittedAt: c.created_at,
          weightKg: parseFloat(c.weight) || 0,
          vehicleNo: c.vehicle ? (c.vehicle.vehicle_number || c.vehicle) : ''
        }));
        setBookings(mappedData);
        return mappedData;
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    return [];
  };

  const fetchGDMs = async (bookingsData: Booking[]) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiUrl}gdms/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const mappedData: GDM[] = data.map((g: any) => {
          const lrIds = g.couriers.map((id: any) => id.toString());
          const gdmBookings = bookingsData.filter(b => lrIds.includes(b.id));
          
          return {
            id: g.id.toString(),
            gdmNo: g.gdm_number,
            vehicleNo: g.vehicle_number,
            driverName: g.driver?.user_name || g.driver_name || 'No Driver',
            driverPhone: g.driver?.phone_number || g.driver_phone_num || '',
            route: g.route ? `${g.route.from_location?.name} → ${g.route.to_location?.name}` : 'No Route',
            totalLRCount: g.total_couriers_count || 0,
            totalPackages: g.total_couriers_count || 0, // Simplified
            totalWeight: parseFloat(g.total_weights) || 0,
            totalFreight: parseFloat(g.total_price) || 0,
            paidCount: gdmBookings.filter(b => b.paymentStatus === 'paid').length,
            toPayCount: gdmBookings.filter(b => b.paymentStatus !== 'paid').length,
            dispatchDate: g.dispatch_date,
            status: g.status,
            lrIds: lrIds
          };
        });
        setGdms(mappedData);
      }
    } catch (error) {
      console.error('Error fetching GDMs:', error);
      toast.error('Failed to fetch GDMs');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const init = async () => {
      const bData = await fetchBookings();
      await fetchGDMs(bData);
    };
    init();
  }, []);

  const filteredGDMs = useMemo(() => {
    return gdms.filter(gdm => {
      const matchesSearch = 
        gdm.gdmNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gdm.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gdm.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'inplace' && (gdm.status === 'unshipped' || gdm.status === 'generated')) ||
        (activeTab === 'shipping' && (gdm.status === 'dispatched' || gdm.status === 'shipping')) ||
        (activeTab === 'sent' && gdm.status === 'sent');

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, gdms, activeTab]);

  const handleDeleteGDM = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}gdms/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.error('GDM deleted successfully');
        const bData = await fetchBookings();
        await fetchGDMs(bData);
      } else {
        toast.error('Failed to delete GDM');
      }
    } catch (error) {
      console.error('Error deleting GDM:', error);
      toast.error('An error occurred while deleting GDM');
    }
  };

  const handleDispatchGDM = async (e: React.MouseEvent, gdm: GDM) => {
    e.stopPropagation();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}couriers/bulk-mark-shipping/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courier_ids: gdm.lrIds.map(id => parseInt(id))
        })
      });

      if (response.ok) {
        toast.success(`All ${gdm.totalLRCount} bookings marked as Shipped under ${gdm.gdmNo}`);
        const bData = await fetchBookings();
        await fetchGDMs(bData);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Failed to dispatch GDM'}`);
      }
    } catch (error) {
      console.error('Error dispatching GDM:', error);
      toast.error('An error occurred while dispatching GDM');
    }
  };

  const handleDeleteLRFromGDM = async (lrId: string) => {
    if (!selectedGDM) return;

    const lrToRemove = bookings.find(b => b.id === lrId);
    if (!lrToRemove) return;

    const newLrIds = selectedGDM.lrIds.filter(id => id !== lrId);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}gdms/${selectedGDM.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          couriers: newLrIds.map(id => parseInt(id))
        })
      });

      if (response.ok) {
        toast.error(`LR ${lrToRemove.lrNo} removed from GDM`);
        const bData = await fetchBookings();
        await fetchGDMs(bData);
        
        // Update selectedGDM state for immediate UI update
        const freshGDMResponse = await fetch(`${apiUrl}gdms/${selectedGDM.id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (freshGDMResponse.ok) {
          const freshGDMData = await freshGDMResponse.json();
          // Map it to frontend GDM type
          const mappedGDM: GDM = {
            id: freshGDMData.id.toString(),
            gdmNo: freshGDMData.gdm_number,
            vehicleNo: freshGDMData.vehicle_number,
            driverName: freshGDMData.driver?.user_name || freshGDMData.driver_name || 'No Driver',
            driverPhone: freshGDMData.driver?.phone_number || freshGDMData.driver_phone_num || '',
            route: freshGDMData.route ? `${freshGDMData.route.from_location?.name} → ${freshGDMData.route.to_location?.name}` : 'No Route',
            totalLRCount: freshGDMData.total_couriers_count || 0,
            totalPackages: freshGDMData.total_couriers_count || 0,
            totalWeight: parseFloat(freshGDMData.total_weights) || 0,
            totalFreight: parseFloat(freshGDMData.total_price) || 0,
            paidCount: bData.filter(b => freshGDMData.couriers.includes(parseInt(b.id)) && b.paymentStatus === 'paid').length,
            toPayCount: bData.filter(b => freshGDMData.couriers.includes(parseInt(b.id)) && b.paymentStatus !== 'paid').length,
            dispatchDate: freshGDMData.dispatch_date,
            status: freshGDMData.status,
            lrIds: freshGDMData.couriers.map((id: any) => id.toString())
          };
          setSelectedGDM(mappedGDM);
        }
      } else {
        toast.error('Failed to remove LR from GDM');
      }
    } catch (error) {
      console.error('Error removing LR from GDM:', error);
      toast.error('An error occurred while removing LR from GDM');
    }
  };

  const getGdmBookings = (gdm: GDM): Booking[] => {
    return bookings.filter(b => gdm.lrIds.includes(b.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = async (gdmId: string, gdmNo: string) => {
    setPrintingGdmId(gdmId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://api.backend.sasalemsuperservice.com/api/staff/';
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiUrl}gdms/${gdmId}/pdf/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create a hidden iframe for direct printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.src = url;
        
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            
            // Clean up the iframe after a short delay (e.g. 60 seconds) to allow the printer system to process
            setTimeout(() => {
              document.body.removeChild(iframe);
              window.URL.revokeObjectURL(url);
            }, 60000);
          } catch (e) {
            console.error('Direct print failed, falling back to new window:', e);
            window.open(url, '_blank');
          }
        };
      } else {
        toast.error('Failed to retrieve GDM PDF');
      }
    } catch (error) {
      console.error('Error printing GDM PDF:', error);
      toast.error('An error occurred while printing GDM PDF');
    } finally {
      setPrintingGdmId(null);
    }
  };

  return (
    <PortalLayout role="staff" title="GDM Management">
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-2 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-secondary tracking-tight">Goods Dispatch Memo</h1>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Manage transport dispatch records</p>
            </div>
            
            <div className="flex items-center bg-gray-100/50 p-1 rounded-[4px] border border-gray-200 overflow-x-auto no-scrollbar">
              {(['all', 'inplace', 'shipping', 'sent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-[4px] text-xs font-black uppercase tracking-tighter transition-all",
                    activeTab === tab 
                      ? "bg-white text-secondary shadow-sm scale-105" 
                      : "text-text-muted hover:text-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search GDM No, Vehicle..." 
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-[4px] text-xs font-bold w-full md:w-80 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* GDM Table */}
        <div className="bg-white rounded-[8px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">GDM Information</th>
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Vehicle & Driver</th>
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">LR Count</th>
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Dispatch Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-black">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-xl shadow-sm shrink-0 font-display"></div>
                          <div className="space-y-2 w-28 font-display">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2 w-24">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="h-6 bg-gray-200 rounded w-10 mx-auto"></div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-3.5 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="h-8 bg-gray-200 rounded w-28 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredGDMs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic text-xs">
                      No GDM records found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredGDMs.map((gdm) => (
                    <motion.tr 
                      key={gdm.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedGDM(gdm)}
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-gray-50 rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-secondary">{gdm.gdmNo}</p>
                            <p className="text-[10px] font-bold text-primary italic">{gdm.route}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Truck className="h-3 w-3 text-primary" />
                            <span className="text-xs font-black font-mono text-secondary">{gdm.vehicleNo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-text-muted" />
                            <span className="text-[10px] font-bold text-text-muted">{gdm.driverName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-sm font-black text-secondary bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{gdm.totalLRCount}</span>
                      </td>
                      <td className="px-6 py-6 font-mono text-[10px] font-bold text-text-muted">
                        {new Date(gdm.dispatchDate).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter",
                          gdm.status === 'generated' ? "bg-blue-100 text-blue-700" : 
                          gdm.status === 'dispatched' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        )}>
                          {gdm.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {gdm.status !== 'dispatched' && (
                            <button 
                              onClick={(e) => handleDispatchGDM(e, gdm)}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all border border-green-100 shadow-sm group/btn"
                              title="Mark all as Shipped"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrint(gdm.id, gdm.gdmNo);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm group/btn disabled:opacity-50"
                            disabled={printingGdmId !== null}
                            title="Print GDM Record"
                          >
                            {printingGdmId === gdm.id ? (
                              <svg className="animate-spin h-4 w-4 text-blue-600 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Printer className="h-4 w-4" />
                            )}
                          </button>
                          <button 
                            onClick={(e) => handleDeleteGDM(e, gdm.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm group/btn"
                            title="Delete GDM"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="w-px h-4 bg-gray-100 mx-1" />
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GDM Details Modal */}
        <AnimatePresence>
          {selectedGDM && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGDM(null)} className="absolute inset-0 bg-secondary/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-5xl rounded-[8px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modern Header */}
                <div className="bg-secondary p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-start gap-4 shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-[4px] blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[8px] flex items-center justify-center border border-white/20 shadow-2xl"><FileText className="h-8 w-8 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl font-black tracking-tight">{selectedGDM.gdmNo}</h2>
                        <span className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-[4px] font-black uppercase">{selectedGDM.status}</span>
                      </div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">{selectedGDM.route}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <button 
                      onClick={() => handlePrint(selectedGDM.id, selectedGDM.gdmNo)} 
                      disabled={printingGdmId !== null}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-[8px] font-black text-xs transition-all shadow-xl shadow-green-500/20 disabled:opacity-50"
                    >
                      {printingGdmId === selectedGDM.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          PRINTING GDM...
                        </>
                      ) : (
                        <>
                          <Printer className="h-4 w-4" /> PRINT GDM
                        </>
                      )}
                    </button>
                    <button onClick={() => setSelectedGDM(null)} className="p-3 hover:bg-white/10 rounded-[8px] transition-colors backdrop-blur-md border border-white/10"><X className="h-6 w-6" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Side: GDM Info & Summary */}
                    <div className="lg:col-span-2 space-y-10">
                      
                      {/* Transport Details Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="p-8 bg-gray-50 border border-gray-100 rounded-[8px] space-y-4">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] border-b border-gray-200 pb-3">Vehicle Details</p>
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-[8px] shadow-sm border border-gray-100 flex items-center justify-center text-primary"><Truck className="h-7 w-7" /></div>
                            <div>
                              <p className="text-xl font-black font-mono text-secondary leading-none mb-1">{selectedGDM.vehicleNo}</p>
                              <p className="text-[11px] font-bold text-text-muted uppercase">Fleet Assigned</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 bg-gray-50 border border-gray-100 rounded-[8px] space-y-4">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] border-b border-gray-200 pb-3">Driver Profile</p>
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-[8px] shadow-sm border border-gray-100 flex items-center justify-center text-primary"><User className="h-7 w-7" /></div>
                            <div>
                              <p className="text-xl font-black text-secondary leading-none mb-1">{selectedGDM.driverName}</p>
                              <p className="text-[11px] font-bold text-text-muted uppercase">{selectedGDM.driverPhone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* LR Table */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                             <Package className="h-4 w-4 text-primary" /> Manifested Shipments
                          </h3>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-[8px] overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase">LR No. / Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase text-center">Route</th>
                                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase text-right">Freight</th>
                                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {getGdmBookings(selectedGDM).map(lr => (
                                <tr key={lr.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-5">
                                    <p className="text-xs font-black text-secondary">{lr.lrNo}</p>
                                    <p className="text-[10px] font-bold text-text-muted">{lr.customerName}</p>
                                  </td>
                                  <td className="px-6 py-5 text-center">
                                    <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{lr.pickupLocation?.substring(0,3)} → {lr.deliveryLocation?.substring(0,3)}</p>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="flex flex-col items-center">
                                      <span className={cn(
                                        "text-[9px] px-2 py-0.5 rounded-[4px] font-black uppercase",
                                        lr.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                      )}>{lr.paymentStatus}</span>
                                      {lr.paymentMode && (
                                        <span className="text-[7px] font-black uppercase text-text-muted italic">via {lr.paymentMode}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-5 text-right font-black text-xs text-primary">
                                    ₹{lr.totalPrice.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <button 
                                      onClick={() => handleDeleteLRFromGDM(lr.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-[8px] transition-colors"
                                      title="Remove from GDM"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Dispatch Summary */}
                    <div className="space-y-8">
                       <div className="bg-gray-900 text-white rounded-[8px] p-10 shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Truck className="h-40 w-40 rotate-12 transition-transform duration-700" /></div>
                          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">Dispatch Summary</h4>
                          <div className="space-y-8 relative z-10">
                             <div className="grid grid-cols-2 gap-8">
                                <div>
                                  <p className="text-[10px] font-black text-white/30 uppercase mb-2">Total Weight</p>
                                  <p className="text-2xl font-black">{selectedGDM.totalWeight} <span className="text-[10px] text-white/40 uppercase">KG</span></p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-white/30 uppercase mb-2">Packages</p>
                                  <p className="text-2xl font-black">{selectedGDM.totalPackages} <span className="text-[10px] text-white/40 uppercase">Units</span></p>
                                </div>
                             </div>
                             <div className="pt-8 border-t border-white/10">
                                <p className="text-[10px] font-black text-white/30 uppercase mb-2">Total Estimated Freight</p>
                                <p className="text-4xl font-black text-primary">₹{(selectedGDM.totalFreight).toLocaleString()}</p>
                             </div>
                          </div>
                       </div>

                       {/* <div className="p-8 border-2 border-dashed border-gray-100 rounded-[8px] space-y-6">
                         <h4 className="text-[10px] font-black text-text-muted uppercase text-center tracking-[0.2em]">Route Ledger</h4>
                         <div className="space-y-6 relative overflow-hidden">
                           <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100" />
                           <div className="flex gap-4 relative z-10">
                             <div className="w-6 h-6 bg-green-500 rounded-[4px] border-4 border-white shadow-sm shrink-0" />
                             <div>
                               <p className="text-[10px] font-black text-secondary leading-none mb-1">Dispatch Node</p>
                               <p className="text-[9px] font-bold text-text-muted uppercase">{formatDate(selectedGDM.dispatchDate)}</p>
                             </div>
                           </div>
                           <div className="flex gap-4 relative z-10">
                             <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-sm shrink-0" />
                             <div>
                               <p className="text-[10px] font-black text-secondary leading-none mb-1">Transit Node</p>
                               <p className="text-[9px] font-bold text-text-muted uppercase">In Route Processing</p>
                             </div>
                           </div>
                           <div className="flex gap-4 relative z-10 opacity-40">
                             <div className="w-6 h-6 bg-gray-200 rounded-full border-4 border-white shadow-sm shrink-0" />
                             <div>
                               <p className="text-[10px] font-black text-secondary leading-none mb-1">Destination Arrival</p>
                               <p className="text-[9px] font-bold text-text-muted uppercase">Estimated T+48 Hours</p>
                             </div>
                           </div>
                         </div>
                       </div> */}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
      `}</style>
      <Toaster position="bottom-right" richColors />
    </PortalLayout>
  );
}
