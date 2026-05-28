import PortalLayout from '@/components/layout/PortalLayout';
import { DollarSign, Briefcase, Users, User, Ticket, TrendingUp, MapPin, BarChart3, ChevronDown, Truck, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, ArrowLeft, History, TrendingDown, FileText, Package, ChevronRight } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_GDMS } from '@/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { GDM, Booking } from '@/types';

const MOCK_EXPENSES = [
  { id: '1', category: 'Diesel refuel', otherReason: 'Vehicle TN-01-AB-1234 refuel', amount: 1500, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', category: 'Office Supplies', otherReason: 'Printer paper & ink', amount: 450, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', category: 'Toll Charge', otherReason: 'Chennai-Salem Tollway', amount: 320, timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: '4', category: 'Driver Allowance', otherReason: 'Food allowance for Ravi Teja', amount: 500, timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: '5', category: 'Vehicle Repair', otherReason: 'Wheel alignment & wash', amount: 1200, timestamp: new Date(Date.now() - 18000000).toISOString() }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedGdmId, setSelectedGdmId] = useState<string | null>(null);

  const selectedGdm = useMemo(() => {
    if (!selectedGdmId) return null;
    return MOCK_GDMS.find(g => g.id === selectedGdmId) || null;
  }, [selectedGdmId]);

  const selectedGdmBookings = useMemo(() => {
    if (!selectedGdm) return [];
    return MOCK_BOOKINGS.filter(b => selectedGdm.lrIds.includes(b.id));
  }, [selectedGdm]);

  const filteredBookings = useMemo(() => {
    if (selectedBranch === 'All') return MOCK_BOOKINGS;
    return MOCK_BOOKINGS.filter(b => b.pickupLocation === selectedBranch || b.destination === selectedBranch);
  }, [selectedBranch]);

  const metricsData = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    const inplace = filteredBookings.filter(b => b.status === 'in-place').length;
    const shipped = filteredBookings.filter(b => b.status === 'shipping').length;
    const incoming = filteredBookings.filter(b => b.status === 'incoming').length;
    
    // Sent: count received/completed bookings
    const sent = filteredBookings.filter(b => b.status === 'received').length;

    // Delivered vs Not Delivered split
    const deliveredBookings = filteredBookings.filter(b => b.status === 'received');
    const notDeliveredBookings = filteredBookings.filter(b => b.status !== 'received');

    const delivered = deliveredBookings.length;
    const deliveredPaid = deliveredBookings.filter(b => b.paymentStatus === 'paid').length;
    const deliveredToPay = deliveredBookings.filter(b => b.paymentStatus === 'to-pay').length;

    const notDelivered = notDeliveredBookings.length;
    const notDeliveredPaid = notDeliveredBookings.filter(b => b.paymentStatus === 'paid').length;
    const notDeliveredToPay = notDeliveredBookings.filter(b => b.paymentStatus === 'to-pay').length;

    return {
      revenue: totalRevenue,
      inplace,
      shipped,
      incoming,
      sent,
      delivered,
      deliveredPaid,
      deliveredToPay,
      notDelivered,
      notDeliveredPaid,
      notDeliveredToPay
    };
  }, [filteredBookings]);

  const kpis = useMemo(() => {
    const data = metricsData;
    return [
      { 
        label: 'Revenue', 
        value: formatCurrency(data.revenue), 
        icon: DollarSign, 
        color: 'text-green-600', 
        bg: 'bg-green-50' 
      },
      { 
        label: 'Inplace', 
        value: data.inplace.toString(), 
        icon: MapPin, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50' 
      },
      { 
        label: 'Shipped', 
        value: data.shipped.toString(), 
        icon: Truck, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50' 
      },
      { 
        label: 'Incoming', 
        value: data.incoming.toString(), 
        icon: ArrowDownLeft, 
        color: 'text-orange-600', 
        bg: 'bg-orange-50' 
      },
      { 
        label: 'Sent', 
        value: data.sent.toString(), 
        icon: ArrowUpRight, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50' 
      },
      { 
        label: 'Delivered', 
        value: data.delivered.toString(), 
        icon: CheckCircle, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        subs: [
          { label: 'Paid', value: data.deliveredPaid },
          { label: 'To Pay', value: data.deliveredToPay }
        ]
      },
      { 
        label: 'Not Delivered', 
        value: data.notDelivered.toString(), 
        icon: Clock, 
        color: 'text-rose-600', 
        bg: 'bg-rose-50',
        subs: [
          { label: 'Paid', value: data.notDeliveredPaid },
          { label: 'To Pay', value: data.notDeliveredToPay }
        ]
      }
    ];
  }, [metricsData]);



  return (
    <PortalLayout role="admin" title="Admin Dashboard">
      <div className="space-y-8">
        {/* KPI Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest font-display">Branch:</span>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-white border border-gray-200 text-secondary text-sm font-bold pl-10 pr-9 py-2 rounded-[4px] hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer h-10 min-w-[160px]"
              >
                <option value="All">All Branches</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Salem">Salem</option>
                <option value="Vellore">Vellore</option>
                <option value="Chennai">Chennai</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/metrics')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary border border-primary/20 bg-primary/5 rounded-[4px] hover:bg-primary/10 transition-all cursor-pointer h-10 w-fit"
          >
            <BarChart3 className="h-4 w-4" />
            View All Metrics
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {kpis.map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", metric.bg)}>
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div> */}
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{metric.label}</p>
                <p className="text-xl font-display font-bold text-secondary mt-1">{metric.value}</p>
              </div>

              {/* Sub-metrics breakdown if they exist */}
              {metric.subs && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-1.5 text-center">
                  {metric.subs.map((sub, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-1 bg-gray-50/50 rounded">
                      <span className="text-[8px] uppercase font-bold text-text-muted tracking-wider">{sub.label}</span>
                      <span className={cn(
                        "text-xs font-bold mt-0.5",
                        sub.label === 'Paid' ? "text-green-600" : "text-orange-600"
                      )}>{sub.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Accounts & GDM Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts Panel (Recent Expenses) */}
          <div className="bg-white rounded-[8px] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-tight">Recent Expenses</h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Accounts & Cash Flow</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Total Spent</span>
                <span className="text-sm font-black text-red-600 mt-0.5">₹3,970</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[350px] custom-scrollbar text-black">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">Category / Details</th>
                    <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">Time</th>
                    <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_EXPENSES.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="px-4 py-4">
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-secondary">{item.category}</span>
                          {item.otherReason && (
                            <span className="text-[10px] font-bold text-text-muted italic mt-0.5">{item.otherReason}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold text-text-muted">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-xs font-black text-red-600 font-mono">
                          - ₹{item.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Cash Balance Status</span>
              <span className="text-xs font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-[4px]">Healthy</span>
            </div> */}
          </div>

          {/* GDM Panel */}
          <div className="bg-white rounded-[8px] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 flex flex-col min-h-[450px]">
            {!selectedGdm ? (
              // State A: GDM List View
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-secondary uppercase tracking-tight">Dispatch Memo (GDM)</h3>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Fleet Dispatch Registry</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-[4px] uppercase tracking-wider">
                    {MOCK_GDMS.length} Generated Today
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[350px] custom-scrollbar text-black">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">GDM / Route</th>
                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest text-left">Vehicle & Driver</th>
                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">LRs</th>
                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Freight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_GDMS.map((gdm) => (
                        <tr 
                          key={gdm.id} 
                          className="group hover:bg-primary/5 transition-colors cursor-pointer"
                          onClick={() => setSelectedGdmId(gdm.id)}
                        >
                          <td className="px-4 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-black text-secondary group-hover:text-primary transition-colors">{gdm.gdmNo}</span>
                              <span className="text-[9px] font-bold text-text-muted uppercase mt-0.5">{gdm.route}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-left">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-secondary font-mono">{gdm.vehicleNo}</span>
                              <span className="text-[9px] font-bold text-text-muted mt-0.5">{gdm.driverName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-xs font-black text-secondary bg-gray-50 px-2.5 py-0.5 rounded border border-gray-100">{gdm.totalLRCount}</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-xs font-black text-primary font-mono">₹{gdm.totalFreight.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-text-muted">
                  <span>Click a GDM row to inspect manifested LRs</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ) : (
              // State B: GDM Details (LR Table) View
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedGdmId(null)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-text-muted hover:text-secondary transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4 text-primary" />
                    </button>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-secondary uppercase tracking-tight">{selectedGdm.gdmNo}</h3>
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{selectedGdm.route}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] px-2.5 py-1 rounded-[4px] font-black uppercase tracking-tighter",
                    selectedGdm.status === 'generated' ? "bg-blue-100 text-blue-700" : 
                    selectedGdm.status === 'dispatched' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {selectedGdm.status}
                  </span>
                </div>

                {/* mini summary of vehicle & driver */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-left">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-primary" />
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-wider leading-none">Vehicle</p>
                        <p className="text-xs font-black text-secondary font-mono mt-1 leading-none">{selectedGdm.vehicleNo}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-left">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <div>
                        <p className="text-[8px] font-black text-text-muted uppercase tracking-wider leading-none">Driver</p>
                        <p className="text-xs font-black text-secondary mt-1 leading-none">{selectedGdm.driverName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[260px] custom-scrollbar text-black">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-2 text-[10px] font-black text-text-muted uppercase tracking-widest">LR No. / Customer</th>
                        <th className="px-4 py-2 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Route</th>
                        <th className="px-4 py-2 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Status</th>
                        <th className="px-4 py-2 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Freight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedGdmBookings.map((lr) => (
                        <tr key={lr.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-black text-secondary">{lr.lrNo}</span>
                              <span className="text-[9px] font-bold text-text-muted">{lr.customerName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter">
                              {lr.pickupLocation?.substring(0,3)} → {lr.deliveryLocation?.substring(0,3)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={cn(
                              "text-[8px] px-2 py-0.5 rounded-[4px] font-black uppercase tracking-wider",
                              lr.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            )}>
                              {lr.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-black text-xs text-primary font-mono">
                            ₹{lr.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {selectedGdmBookings.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-xs font-bold text-text-muted italic">
                            No shipments manifested under this GDM
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between text-black">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total GDM Freight</span>
                  <span className="text-sm font-black text-primary font-mono">₹{selectedGdm.totalFreight.toLocaleString()}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}

