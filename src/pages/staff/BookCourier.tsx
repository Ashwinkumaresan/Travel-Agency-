import PortalLayout from '@/components/layout/PortalLayout';
import { COURIER_LOCATIONS } from '@/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Package, 
  Weight, 
  Plus, 
  Trash2, 
  ClipboardList, 
  CheckCircle2, 
  X, 
  Save,
  Truck,
  Building2,
  Receipt,
  Calculator,
  ArrowRight,
  Search,
  Phone,
  User
} from 'lucide-react';

interface PackageRow {
  id: number;
  nature: string;
  count: number;
}

export default function BookCourier() {
  const staffBranch = 'Chennai Branch';
  
  // States
  const [routeInfo, setRouteInfo] = useState({
    toBranch: '',
    fromName: '',
    fromAddress: '',
    fromPhone: '',
    toName: '',
    toAddress: '',
    toPhone: '',
    deliveryType: 'Godown' as 'Godown' | 'Door'
  });

  const [packages, setPackages] = useState<PackageRow[]>([
    { id: Date.now(), nature: '', count: 1 }
  ]);

  const [paymentInfo, setPaymentInfo] = useState({
    weight: 1,
    status: 'Paid' as 'Paid' | 'To Pay',
    paymentMode: 'Cash' as 'Cash' | 'Online',
    invoiceNumber: ''
  });

  const [fees, setFees] = useState({
    freight: 0,
    loadingUnloading: 0,
    doorPickup: 0,
    ddCharges: 0,
    otherTransport: 0,
    mamool: 0,
    statCharges: 10
  });

  const [isBranchSearchOpen, setIsBranchSearchOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');

  // Derived
  const otherBranches = useMemo(() => 
    COURIER_LOCATIONS.filter((l: string) => l !== 'Chennai' && l !== 'All')
  , []);

  const filteredBranches = useMemo(() => 
    otherBranches.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))
  , [otherBranches, branchSearch]);

  const totalPackages = useMemo(() => 
    packages.reduce((sum, p) => sum + (Number(p.count) || 0), 0)
  , [packages]);

  const totalAmount = useMemo(() => {
    return Object.values(fees).reduce((sum: number, val) => sum + (Number(val) || 0), 0);
  }, [fees]);

  // Handlers
  const addPackageRow = () => {
    setPackages([...packages, { id: Date.now(), nature: '', count: 1 }]);
  };

  const removePackageRow = (id: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const updatePackage = (id: number, field: keyof PackageRow, value: any) => {
    setPackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleFeeChange = (field: keyof typeof fees, value: string) => {
    const rawNum = value === '' ? 0 : parseFloat(value);
    const num = Math.max(0, rawNum);
    setFees({ ...fees, [field]: num });
  };

  const handleConfirm = () => {
    alert('Booking Confirmed Successfully!');
    // Reset all fields instead of navigating
    setRouteInfo({
      toBranch: '',
      fromName: '',
      fromAddress: '',
      fromPhone: '',
      toName: '',
      toAddress: '',
      toPhone: '',
      deliveryType: 'Godown'
    });
    setPackages([{ id: Date.now(), nature: '', count: 1 }]);
    setPaymentInfo({
      weight: 1,
      status: 'Paid',
      paymentMode: 'Cash',
      invoiceNumber: ''
    });
    setFees({
      freight: 0,
      loadingUnloading: 0,
      doorPickup: 0,
      ddCharges: 0,
      otherTransport: 0,
      mamool: 0,
      statCharges: 10
    });
  };

  return (
    <PortalLayout role="staff" title="New Courier Booking">
      <div className="max-w-[1600px] mx-auto h-full xl:max-h-[calc(100vh-140px)] flex flex-col gap-4">
        
        {/* Main Grid Content */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0 overflow-hidden">
          
          {/* Scrollable Form Section */}
          <div className="xl:col-span-8 h-full overflow-y-auto pr-2 space-y-6 pb-4 custom-scrollbar">
            
            {/* Section 1: Route Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Route Information</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">From Branch</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-bold text-secondary">{staffBranch}</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">To Branch Selection</label>
                    <div 
                      onClick={() => setIsBranchSearchOpen(!isBranchSearchOpen)}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-primary/30 transition-all bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className={cn("text-sm", routeInfo.toBranch ? "font-bold text-secondary" : "text-gray-400")}>
                          {routeInfo.toBranch || 'Select Destination Branch'}
                        </span>
                      </div>
                      <Search className="h-4 w-4 text-gray-300" />
                    </div>
                    
                    <AnimatePresence>
                      {isBranchSearchOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden"
                        >
                          <div className="p-2 border-b border-gray-50">
                            <input 
                              autoFocus
                              type="text" 
                              className="w-full text-xs p-2 outline-none" 
                              placeholder="Search branches..." 
                              value={branchSearch}
                              onChange={e => setBranchSearch(e.target.value)}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredBranches.map(branch => (
                              <div 
                                key={branch}
                                onClick={() => {
                                  setRouteInfo({...routeInfo, toBranch: branch});
                                  setIsBranchSearchOpen(false);
                                  setBranchSearch('');
                                }}
                                className="px-4 py-2 text-xs font-medium hover:bg-primary/5 cursor-pointer flex items-center justify-between transition-colors"
                              >
                                {branch}
                                {routeInfo.toBranch === branch && <CheckCircle2 className="h-3 w-3 text-primary" />}
                              </div>
                            ))}
                            {filteredBranches.length === 0 && (
                              <div className="px-4 py-3 text-xs text-text-muted text-center italic">No branches found</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Delivery Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Godown', 'Door'].map(type => (
                        <button
                          key={type}
                          onClick={() => setRouteInfo({...routeInfo, deliveryType: type as any})}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                            routeInfo.deliveryType === type 
                              ? "border-primary bg-primary/5 text-primary shadow-sm" 
                              : "border-gray-100 hover:border-gray-200 text-text-muted"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                            routeInfo.deliveryType === type ? "border-primary" : "border-gray-300"
                          )}>
                            {routeInfo.deliveryType === type && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                          </div>
                          <Truck className={cn("h-4 w-4", routeInfo.deliveryType === type ? "text-primary" : "text-gray-400")} />
                          <span className="text-xs font-bold whitespace-nowrap">{type} Delivery</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

        <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Sender Name</label>
                    <div className="relative mb-3">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input 
                        type="text"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Enter sender name"
                        value={routeInfo.fromName}
                        onChange={e => setRouteInfo({...routeInfo, fromName: e.target.value})}
                      />
                    </div>
                    
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">From Address (Sender)</label>
                    <textarea 
                      className="w-full h-20 p-3 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all resize-none mb-3" 
                      placeholder="Enter sender full address..."
                      value={routeInfo.fromAddress}
                      onChange={e => setRouteInfo({...routeInfo, fromAddress: e.target.value})}
                    />
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Sender Phone No</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input 
                        type="tel"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Sender's 10-digit number"
                        value={routeInfo.fromPhone}
                        onChange={e => setRouteInfo({...routeInfo, fromPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Receiver Name</label>
                    <div className="relative mb-3">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input 
                        type="text"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Enter receiver name"
                        value={routeInfo.toName}
                        onChange={e => setRouteInfo({...routeInfo, toName: e.target.value})}
                      />
                    </div>

                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">To Address (Receiver)</label>
                    <textarea 
                      className="w-full h-20 p-3 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all resize-none mb-3" 
                      placeholder="Enter receiver full address..."
                      value={routeInfo.toAddress}
                      onChange={e => setRouteInfo({...routeInfo, toAddress: e.target.value})}
                    />
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 block">Receiver Phone No</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input 
                        type="tel"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Receiver's 10-digit number"
                        value={routeInfo.toPhone}
                        onChange={e => setRouteInfo({...routeInfo, toPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Parcel Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Parcel Information</h2>
                </div>
                <button 
                  onClick={addPackageRow}
                  className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-primary border border-primary/20 bg-primary/5 rounded-md hover:bg-primary/10 transition-all"
                >
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
              <div className="p-5 space-y-3">
                <AnimatePresence initial={false}>
                  {packages.map((pkg, idx) => (
                    <motion.div 
                      key={pkg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-12 gap-4 items-center p-3 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow bg-gray-50/10"
                    >
                      <div className="col-span-1 flex items-center justify-center font-mono text-[10px] text-gray-400 font-bold bg-white w-6 h-6 rounded-full border border-gray-50">
                        {idx + 1}
                      </div>
                      <div className="col-span-11 md:col-span-7 italic md:not-italic order-1 md:order-none">
                        <label className="text-[9px] font-bold text-text-muted uppercase mb-1 block">Nature of Packing</label>
                        <input 
                          type="text" 
                          placeholder="Box, Sack, Piece..."
                          className="w-full p-2 text-xs border-b border-gray-200 outline-none focus:border-primary transition-colors bg-transparent"
                          value={pkg.nature}
                          onChange={e => updatePackage(pkg.id, 'nature', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3 order-2 md:order-none">
                        <label className="text-[9px] font-bold text-text-muted uppercase mb-1 block">No. of Pkgs</label>
                        <input 
                          type="number" 
                          className="w-full p-2 text-xs border-b border-gray-200 outline-none focus:border-primary transition-colors bg-transparent"
                          min="1"
                          value={pkg.count}
                          onChange={e => updatePackage(pkg.id, 'count', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-1 flex justify-end order-3 md:order-none">
                        <button 
                          onClick={() => removePackageRow(pkg.id)}
                          disabled={packages.length === 1}
                          className="p-1 px-2 text-gray-300 hover:text-red-500 disabled:opacity-0 transition-all hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Section 3: Weight & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-50 text-primary rounded-xl">
                  <Weight className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Weight (KG)</label>
                  <input 
                    type="number" 
                    className="w-full text-lg font-bold text-secondary outline-none border-b border-transparent focus:border-primary/30 transition-all"
                    value={paymentInfo.weight}
                    onChange={e => setPaymentInfo({...paymentInfo, weight: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Payment Status</label>
                  <div className="flex gap-2">
                    {['Paid', 'To Pay'].map(status => (
                      <button
                        key={status}
                        onClick={() => setPaymentInfo({...paymentInfo, status: status as any})}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border",
                          paymentInfo.status === status 
                            ? "bg-secondary border-secondary text-white" 
                            : "bg-white border-gray-100 text-text-muted hover:border-secondary/30"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentInfo.status === 'Paid' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2 border-t border-gray-50"
                  >
                    <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Payment Mode</label>
                    <div className="flex gap-2">
                      {['Cash', 'Online'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setPaymentInfo({...paymentInfo, paymentMode: mode as any})}
                          className={cn(
                            "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all border",
                            paymentInfo.paymentMode === mode 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-gray-100 text-text-muted bg-white"
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Receipt className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Invoice Number</label>
                  <input 
                    type="text" 
                    placeholder="INV-XXXX"
                    className="w-full text-sm font-bold text-secondary outline-none border-b border-transparent focus:border-primary/30 transition-all"
                    value={paymentInfo.invoiceNumber}
                    onChange={e => setPaymentInfo({...paymentInfo, invoiceNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Fees Calculation */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">Fees Calculation</h2>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                {[
                  { label: 'Freight', key: 'freight' },
                  { label: 'Loading & Unloading', key: 'loadingUnloading' },
                  { label: 'Door Pickup', key: 'doorPickup' },
                  { label: 'D/D Charges', key: 'ddCharges' },
                  { label: 'Other Transport Crossing', key: 'otherTransport' },
                  { label: 'Mamool', key: 'mamool' },
                  { label: 'Statistical Charges', key: 'statCharges', default: 10 },
                ].map(fee => (
                  <div key={fee.key} className="space-y-1.5 group">
                    <label className="text-[10px] font-medium text-text-muted group-hover:text-primary transition-colors">{fee.label}</label>
                    <div className="relative">
                      <span className="absolute left-0 bottom-2 text-xs font-bold text-gray-300">₹</span>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="0"
                        className="w-full pl-4 py-1 text-sm font-bold text-secondary border-b border-gray-100 focus:border-primary outline-none transition-all bg-transparent"
                        value={fees[fee.key as keyof typeof fees] || ''}
                        onChange={e => handleFeeChange(fee.key as any, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 p-6 border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-white rounded-lg">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Estimated Total</p>
                    <p className="text-xs text-text-muted leading-none mt-0.5 italic">Auto-calculated based on all fields</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-display font-bold text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Side Summary Section */}
          <div className="xl:col-span-4 h-full flex flex-col gap-4">
            <div className="bg-secondary text-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full sticky top-0">
              <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-display font-bold uppercase tracking-wider">Booking Summary</h2>
              </div>
              
              <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar-light">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/50 uppercase">Shipment Path</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold">{staffBranch}</span>
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <span className={cn("text-xs font-bold", routeInfo.toBranch ? "text-white" : "text-white/30")}>
                        {routeInfo.toBranch || 'Not Selected'}
                      </span>
                    </div>
                    {routeInfo.deliveryType && (
                      <div className="flex items-center gap-2 mt-2">
                        <Truck className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-medium bg-white/10 px-2 py-0.5 rounded-full">{routeInfo.deliveryType} Delivery</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/50 uppercase">Sender Info</p>
                      <p className="text-xs font-bold text-white leading-tight">{routeInfo.fromName || 'No Name'}</p>
                      <p className="text-[10px] leading-relaxed line-clamp-1 italic text-white/60">{routeInfo.fromAddress || 'No address'}</p>
                      <p className="text-[10px] font-bold text-primary">{routeInfo.fromPhone || 'No Phone'}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-white/50 uppercase">Receiver Info</p>
                      <p className="text-xs font-bold text-white leading-tight">{routeInfo.toName || 'No Name'}</p>
                      <p className="text-[10px] leading-relaxed line-clamp-1 italic text-white/60">{routeInfo.toAddress || 'No address'}</p>
                      <p className="text-[10px] font-bold text-primary">{routeInfo.toPhone || 'No Phone'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-white/50 uppercase">Total Packages</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">{totalPackages} Nos</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/50 uppercase">Total Weight</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Weight className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">{paymentInfo.weight} KG</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/50 uppercase">Status</p>
                      <div className="mt-1 flex flex-col items-end gap-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          paymentInfo.status === 'Paid' ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                        )}>
                          {paymentInfo.status}
                        </span>
                        {paymentInfo.status === 'Paid' && (
                          <span className="text-[9px] font-medium text-white/40 italic">
                            via {paymentInfo.paymentMode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase leading-none mb-1">Invoice Number</p>
                        <p className="text-xs font-mono font-bold text-primary">{paymentInfo.invoiceNumber || 'NEW-BOOKING'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white/50 uppercase leading-none mb-1">Grand Total</p>
                        <p className="text-2xl font-display font-bold text-white">{formatCurrency(totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary">
                <button 
                  onClick={handleConfirm}
                  disabled={!routeInfo.toBranch || totalAmount === 0}
                  className="w-full flex items-center justify-center gap-3 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-black/10 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl"
                >
                  Print LR <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Helper Hint */}
            <div className="hidden xl:flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <Calculator className="h-4 w-4 text-primary shrink-0" />
              <p className="text-[9px] text-text-muted leading-tight">
                Review all fields in the summary carefully before confirmation. Total is calculated live based on tax and overhead inputs.
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e2e2;
        }

        .custom-scrollbar-light::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </PortalLayout>
  );
}
