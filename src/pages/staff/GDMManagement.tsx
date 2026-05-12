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
  const [activeTab, setActiveTab] = useState<'all' | 'unshipped' | 'shipped'>('all');
  
  // Initialize from localStorage + MOCK
  const [gdms, setGdms] = useState<GDM[]>(() => {
    const saved = localStorage.getItem('voyage_gdms');
    return saved ? JSON.parse(saved) : MOCK_GDMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('voyage_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });

  const [selectedGDM, setSelectedGDM] = useState<GDM | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredGDMs = useMemo(() => {
    return gdms.filter(gdm => {
      const matchesSearch = 
        gdm.gdmNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gdm.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gdm.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'unshipped' && gdm.status !== 'dispatched') ||
        (activeTab === 'shipped' && gdm.status === 'dispatched');

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, gdms, activeTab]);

  const handleDeleteGDM = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = gdms.filter(gdm => gdm.id !== id);
    setGdms(updated);
    localStorage.setItem('voyage_gdms', JSON.stringify(updated));
    toast.error('GDM deleted successfully');
  };

  const handleDispatchGDM = (e: React.MouseEvent, gdm: GDM) => {
    e.stopPropagation();
    
    // Update GDMs
    const updatedGdms = gdms.map(item => 
      item.id === gdm.id ? { ...item, status: 'dispatched' as const } : item
    );
    setGdms(updatedGdms);
    localStorage.setItem('voyage_gdms', JSON.stringify(updatedGdms));

    // Sync Booking Statuses
    const updatedBookings = bookings.map(b => 
      gdm.lrIds.includes(b.id) ? { ...b, status: 'shipping' as const } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('voyage_bookings', JSON.stringify(updatedBookings));

    toast.success(`All ${gdm.totalLRCount} bookings marked as Shipped under ${gdm.gdmNo}`);
  };

  const handleDeleteLRFromGDM = (lrId: string) => {
    if (!selectedGDM) return;

    const lrToRemove = bookings.find(b => b.id === lrId);
    if (!lrToRemove) return;

    // 1. Update GDM lrIds and statistics
    const updatedGdms = gdms.map(gdm => {
      if (gdm.id === selectedGDM.id) {
        const newLrIds = gdm.lrIds.filter(id => id !== lrId);
        return {
          ...gdm,
          lrIds: newLrIds,
          totalLRCount: newLrIds.length,
          totalWeight: Math.max(0, gdm.totalWeight - (lrToRemove.weightKg || 0)),
          totalPackages: Math.max(0, gdm.totalPackages - (lrToRemove.travellersCount || 1)),
          totalFreight: Math.max(0, gdm.totalFreight - lrToRemove.totalPrice),
          paidCount: lrToRemove.paymentStatus === 'paid' ? Math.max(0, gdm.paidCount - 1) : gdm.paidCount,
          toPayCount: lrToRemove.paymentStatus === 'to-pay' ? Math.max(0, gdm.toPayCount - 1) : gdm.toPayCount,
        };
      }
      return gdm;
    });

    setGdms(updatedGdms);
    localStorage.setItem('voyage_gdms', JSON.stringify(updatedGdms));

    // 2. Update selectedGDM state for immediate UI update
    const updatedSelectedGDM = updatedGdms.find(g => g.id === selectedGDM.id);
    if (updatedSelectedGDM) {
      setSelectedGDM(updatedSelectedGDM);
    }

    // 3. Reset booking vehicle info and status
    const updatedBookings = bookings.map(b => 
      b.id === lrId ? { ...b, vehicleNo: undefined, status: 'in-place' as any } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('voyage_bookings', JSON.stringify(updatedBookings));

    toast.error(`LR ${lrToRemove.lrNo} removed from GDM`);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <PortalLayout role="staff" title="GDM Management">
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-secondary tracking-tight">Goods Dispatch Memo</h1>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Manage transport dispatch records</p>
            </div>
            
            <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-2xl border border-gray-200">
              {(['all', 'unshipped', 'shipped'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all",
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
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-xs font-bold w-full md:w-80 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* GDM Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
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
              <tbody className="divide-y divide-gray-50">
                {filteredGDMs.map((gdm) => (
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
                            setSelectedGDM(gdm);
                            setIsPrintModalOpen(true);
                          }}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm group/btn"
                          title="Print GDM Record"
                        >
                          <Printer className="h-4 w-4" />
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GDM Details Modal */}
        <AnimatePresence>
          {selectedGDM && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGDM(null)} className="absolute inset-0 bg-secondary/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modern Header */}
                <div className="bg-secondary p-10 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex items-center gap-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl"><FileText className="h-8 w-8 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-3xl font-black tracking-tight">{selectedGDM.gdmNo}</h2>
                        <span className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-full font-black uppercase">{selectedGDM.status}</span>
                      </div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">{selectedGDM.route}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <button onClick={() => setIsPrintModalOpen(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-xl shadow-green-500/20"><Printer className="h-4 w-4" /> PRINT GDM</button>
                    <button onClick={() => setSelectedGDM(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors backdrop-blur-md border border-white/10"><X className="h-6 w-6" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Side: GDM Info & Summary */}
                    <div className="lg:col-span-2 space-y-10">
                      
                      {/* Transport Details Cards */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2rem] space-y-4">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] border-b border-gray-200 pb-3">Vehicle Details</p>
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary"><Truck className="h-7 w-7" /></div>
                            <div>
                              <p className="text-xl font-black font-mono text-secondary leading-none mb-1">{selectedGDM.vehicleNo}</p>
                              <p className="text-[11px] font-bold text-text-muted uppercase">Fleet Assigned</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2rem] space-y-4">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] border-b border-gray-200 pb-3">Driver Profile</p>
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary"><User className="h-7 w-7" /></div>
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
                        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
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
                                        "text-[9px] px-2 py-0.5 rounded-full font-black uppercase",
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
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                       <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
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

                       <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] space-y-6">
                         <h4 className="text-[10px] font-black text-text-muted uppercase text-center tracking-[0.2em]">Route Ledger</h4>
                         <div className="space-y-6 relative overflow-hidden">
                           <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100" />
                           <div className="flex gap-4 relative z-10">
                             <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm shrink-0" />
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
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Print Layout Overlay (Hidden in screen, visible in print) */}
        <AnimatePresence>
          {isPrintModalOpen && selectedGDM && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrintModalOpen(false)} className="absolute inset-0 bg-secondary/80 backdrop-blur-xl" />
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl p-10 overflow-y-auto">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                     <h3 className="text-xl font-display font-bold text-secondary flex items-center gap-3"><Printer className="h-6 w-6 text-primary" /> Print Preview - GDM</h3>
                     <div className="flex gap-3">
                        <button onClick={() => setIsPrintModalOpen(false)} className="px-6 py-3 rounded-2xl font-black text-xs text-text-muted hover:bg-gray-100 transition-all">Close</button>
                        <button onClick={handlePrint} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-primary/20">Finalize & Print</button>
                     </div>
                  </div>

                  {/* The actual printable area */}
                  <div id="gdm-print-area" className="bg-white p-12 border border-gray-200 shadow-sm print:border-none print:shadow-none font-serif text-black">
                     <div className="flex justify-between items-start mb-10 border-b-4 border-black pb-8">
                        <div>
                           <h1 className="text-4xl font-black tracking-tighter text-black mb-2 italic">VoyageArc</h1>
                           <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Enterprise Logistics Solutions</p>
                           <p className="text-[9px] font-medium leading-relaxed max-w-[200px] mt-4 text-gray-500">Corporate Office: Tech Park Phase 2, Marina Road, Chennai - 600001</p>
                        </div>
                        <div className="text-right">
                           <h2 className="text-2xl font-black uppercase text-black mb-4">GDM RECEIPT</h2>
                           <div className="flex flex-col gap-3">
                              <div className="space-y-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-500">GDM Number</p>
                                 <p className="text-xl font-black font-mono">{selectedGDM.gdmNo}</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-500">Dispatch Date</p>
                                 <p className="text-xs font-bold text-gray-700">{formatDate(selectedGDM.dispatchDate)}</p>
                              </div>
                           </div>
                           <div className="mt-4 flex flex-col items-end gap-1">
                              <p className="text-[10px] font-black uppercase text-secondary">Route: {selectedGDM.route}</p>
                              <p className="text-[10px] font-black uppercase text-secondary">Vehicle: {selectedGDM.vehicleNo}</p>
                              <p className="text-[10px] font-black uppercase text-secondary">Driver: {selectedGDM.driverName}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mb-10">
                        <h4 className="text-xs font-black uppercase mb-4 pl-2 border-l-4 border-black">Consignment Ledger</h4>
                        <table className="w-full border-collapse border border-black">
                           <thead>
                              <tr className="bg-gray-100 border-b border-black">
                                 <th className="p-3 text-[10px] font-black uppercase border-r border-black">S.No</th>
                                 <th className="p-3 text-[10px] font-black uppercase border-r border-black text-left">LR Number</th>
                                 <th className="p-3 text-[10px] font-black uppercase border-r border-black text-left">Nature of Packing</th>
                                 <th className="p-3 text-[10px] font-black uppercase border-r border-black text-center">No. of Pkgs</th>
                                 <th className="p-3 text-[10px] font-black uppercase text-right">Freight</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-300">
                              {getGdmBookings(selectedGDM).map((lr, i) => (
                                <tr key={lr.id}>
                                  <td className="p-3 text-[10px] font-bold border-r border-black text-center">{i + 1}</td>
                                  <td className="p-3 text-[10px] font-black border-r border-black">
                                    {lr.lrNo}
                                    {lr.paymentMode && (
                                      <p className="text-[7px] font-black uppercase text-gray-400 italic">Paid via {lr.paymentMode}</p>
                                    )}
                                  </td>
                                  <td className="p-3 text-[10px] font-medium border-r border-black uppercase text-gray-700">{lr.packageName || 'General Parcel'}</td>
                                  <td className="p-3 text-[10px] font-black border-r border-black text-center">{lr.travellersCount || 1}</td>
                                  <td className="p-3 text-[10px] font-black text-right">₹{lr.totalPrice.toLocaleString()}</td>
                                </tr>
                              ))}
                           </tbody>
                           <tfoot>
                              <tr className="bg-gray-50 border-t border-black font-black">
                                 <td colSpan={3} className="p-4 text-xs uppercase border-r border-black text-right">Total Summary</td>
                                 <td className="p-4 text-xs text-center border-r border-black">{selectedGDM.totalPackages} Pkgs</td>
                                 <td className="p-4 text-xs text-right text-black">₹{selectedGDM.totalFreight.toLocaleString()}</td>
                              </tr>
                           </tfoot>
                        </table>
                     </div>

                     <div className="grid grid-cols-2 gap-20 pt-20">
                        <div className="border-t border-black pt-4">
                           <p className="text-[10px] font-black uppercase text-center mb-1">Dispatch Manager Signature</p>
                           <p className="text-[8px] text-center text-gray-400 italic">Auth ID: EMP-90218</p>
                        </div>
                        <div className="border-t border-black pt-4">
                           <p className="text-[10px] font-black uppercase text-center mb-1">Driver's Acknowledgement</p>
                           <p className="text-[8px] text-center text-gray-400 italic">Verify vehicle seal before signing</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #gdm-print-area, #gdm-print-area * { visibility: visible; }
          #gdm-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
      `}</style>
      <Toaster position="bottom-right" richColors />
    </PortalLayout>
  );
}
