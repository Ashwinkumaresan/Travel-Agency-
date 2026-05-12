import PortalLayout from '@/components/layout/PortalLayout';
import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  User as UserIcon, 
  Truck, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Search, 
  AlertCircle,
  ArrowRight,
  GripVertical,
  ChevronRight,
  Layers,
  ArrowDown,
  Navigation,
  Building2,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_DRIVERS, MOCK_VEHICLES, COURIER_LOCATIONS, MOCK_ROUTE_MAPPINGS } from '@/constants';
import { RouteMapping } from '@/types';
import SearchableSelect from '@/components/staff/SearchableSelect';
import ActionMenu from '@/components/staff/ActionMenu';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence, Reorder } from 'motion/react';

interface RouteStopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  from: string;
  to: string;
  selectedStops: string[];
  onChange: (stops: string[]) => void;
}

function RouteStopsModal({ isOpen, onClose, from, to, selectedStops, onChange }: RouteStopsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableStops = useMemo(() => {
    return COURIER_LOCATIONS.filter(loc => loc !== from && loc !== to);
  }, [from, to]);

  const filteredStops = useMemo(() => {
    return availableStops.filter(loc => 
      loc.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedStops.includes(loc)
    );
  }, [availableStops, searchTerm, selectedStops]);

  const addStop = (stop: string) => {
    onChange([...selectedStops, stop]);
  };

  const removeStop = (stop: string) => {
    onChange(selectedStops.filter(s => s !== stop));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-display font-bold text-secondary">Select Route Stops</h2>
              <p className="text-xs text-text-muted mt-0.5">Planning path from <span className="text-primary font-bold">{from}</span> to <span className="text-primary font-bold">{to}</span></p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 h-[450px]">
            {/* Available Stops */}
            <div className="p-6 border-r border-gray-100 flex flex-col gap-4 overflow-hidden">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Plus className="h-3 w-3" /> Available Stops
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search locations..." 
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-lg outline-none focus:border-primary/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {filteredStops.map(stop => (
                  <motion.div 
                    layout
                    key={stop}
                    onClick={() => addStop(stop)}
                    className="p-3 border border-gray-50 rounded-xl hover:border-primary/20 hover:bg-primary/5 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <span className="text-sm font-medium text-secondary">{stop}</span>
                    <Plus className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
                {filteredStops.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs italic text-text-muted">No stops available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Route Path */}
            <div className="p-6 bg-gray-50/30 flex flex-col gap-4 overflow-hidden">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Navigation className="h-3 w-3" /> Route Reordering
              </h3>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1 relative">
                  {/* Visual Line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-dashed-border opacity-20" />

                  {/* Start Point */}
                  <div className="flex items-center gap-4 p-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm font-bold text-xs text-secondary italic">START</div>
                    <span className="text-sm font-bold text-secondary">{from}</span>
                  </div>

                  <Reorder.Group axis="y" values={selectedStops} onReorder={onChange} className="space-y-1">
                    {selectedStops.map((stop) => (
                      <Reorder.Item 
                        key={stop} 
                        value={stop}
                        className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all z-20 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                          <GripVertical className="h-4 w-4 text-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="flex-1 text-sm font-bold text-secondary">{stop}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeStop(stop); }}
                          className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  {/* End Point */}
                  <div className="flex items-center gap-4 p-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm font-bold text-xs text-secondary italic">END</div>
                    <span className="text-sm font-bold text-secondary">{to}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-text-muted hover:text-secondary transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Confirm Route Path
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function RouteMappingPage() {
  // Mocking current staff context
  const staffInfo = {
    name: 'Arun Kumar',
    location: 'Chennai',
    id: 'STF-001'
  };

  const [mappings, setMappings] = useState<RouteMapping[]>(MOCK_ROUTE_MAPPINGS.filter(m => m.from === staffInfo.location));

  const [toLocation, setToLocation] = useState('');
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit state
  const [editTo, setEditTo] = useState('');
  const [editStops, setEditStops] = useState<string[]>([]);
  const [editDriverId, setEditDriverId] = useState<string>('');
  const [editVehicleId, setEditVehicleId] = useState<string>('');

  const otherLocations = COURIER_LOCATIONS.filter(loc => loc !== staffInfo.location);

  const fullRoutePath = useMemo(() => {
    return [staffInfo.location, ...selectedStops, toLocation].filter(Boolean);
  }, [selectedStops, toLocation]);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!toLocation) {
      setError('Please select a destination location');
      return;
    }
    if (!selectedDriverId) {
      setError('Please select a driver');
      return;
    }
    if (!selectedVehicleId) {
      setError('Please select a vehicle');
      return;
    }

    const driver = MOCK_DRIVERS.find(d => d.id === parseInt(selectedDriverId));
    const vehicle = MOCK_VEHICLES.find(v => v.id === parseInt(selectedVehicleId));

    if (!driver || !vehicle) return;

    const newMapping: RouteMapping = {
      id: `RM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: staffInfo.location,
      to: toLocation,
      driverId: driver.id,
      driverName: driver.name,
      vehicleId: vehicle.id,
      vehicleNumber: vehicle.number,
      routePath: fullRoutePath,
      stopsCount: selectedStops.length
    };

    setMappings([...mappings, newMapping]);
    toast.success(`New route dedicated to ${toLocation} mapped!`);
    setToLocation('');
    setSelectedStops([]);
    setSelectedDriverId('');
    setSelectedVehicleId('');
  };

  const handleDelete = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
    toast.error('Route mapping removed');
  };

  const startEditing = (mapping: RouteMapping) => {
    setEditingId(mapping.id);
    setEditTo(mapping.to);
    // Extract intermediate stops
    const stops = mapping.routePath.slice(1, -1);
    setEditStops(stops);
    setEditDriverId(mapping.driverId.toString());
    setEditVehicleId(mapping.vehicleId.toString());
  };

  const handleSaveEdit = (id: string) => {
    const driver = MOCK_DRIVERS.find(d => d.id === parseInt(editDriverId));
    const vehicle = MOCK_VEHICLES.find(v => v.id === parseInt(editVehicleId));

    if (!driver || !vehicle || !editTo) return;

    const updatedRoutePath = [staffInfo.location, ...editStops, editTo].filter(Boolean);

    setMappings(mappings.map(m => 
      m.id === id ? { 
        ...m, 
        to: editTo, 
        driverId: driver.id, 
        driverName: driver.name, 
        vehicleId: vehicle.id, 
        vehicleNumber: vehicle.number,
        routePath: updatedRoutePath,
        stopsCount: editStops.length
      } : m
    ));
    setEditingId(null);
    toast.info('Route mapping updated');
  };

  const filteredMappings = mappings.filter(m => 
    m.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.routePath.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="staff" title="Route Mapping">
      <div className="max-w-7xl mx-auto h-full max-h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden">
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Base Hub:</span>
            <div className="bg-primary/5 text-primary px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/10">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-black">{staffInfo.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/5 rounded-full text-[10px] font-bold text-secondary">
            <Layers className="h-3.5 w-3.5" />
            {mappings.length} ACTIVE ROUTES
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
          
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                  <Settings2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-display font-bold text-secondary">Configuration</h2>
              </div>

              <form onSubmit={handleAddRoute} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Starting From</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-secondary">{staffInfo.location}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Final Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select 
                      className="input-field pl-10 h-11 appearance-none cursor-pointer bg-white"
                      value={toLocation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setToLocation(val);
                        if (val) setIsModalOpen(true);
                      }}
                    >
                      <option value="">Select Destination</option>
                      {otherLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {toLocation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Route Path</span>
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" /> Edit Stops
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                       {fullRoutePath.map((stop, i) => (
                         <React.Fragment key={i}>
                           <span className={cn(
                             "text-[10px] font-black px-2 py-1 rounded",
                             i === 0 || i === fullRoutePath.length - 1 ? "bg-secondary text-white" : "bg-white border border-gray-100 text-secondary"
                           )}>
                             {stop}
                           </span>
                           {i < fullRoutePath.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                         </React.Fragment>
                       ))}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Assign Driver</label>
                  <SearchableSelect 
                    value={selectedDriverId}
                    onSelect={setSelectedDriverId}
                    options={MOCK_DRIVERS.map(d => ({ id: d.id.toString(), label: d.name, sublabel: `ID: ${d.id}` }))}
                    placeholder="Select Driver"
                    icon={<UserIcon className="h-4 w-4" />}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Assign Vehicle</label>
                  <SearchableSelect 
                    value={selectedVehicleId}
                    onSelect={setSelectedVehicleId}
                    options={MOCK_VEHICLES.map(v => ({ id: v.id.toString(), label: v.number, sublabel: v.name }))}
                    placeholder="Select Vehicle"
                    icon={<Truck className="h-4 w-4" />}
                    className="h-11"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full btn-primary h-12 flex items-center justify-center gap-3 group relative overflow-hidden">
                    <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" /> 
                    <span>Map New Route</span>
                  </button>
                </div>
              </form>

              {error && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: List Table */}
          <div className="lg:col-span-8 flex flex-col min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
              <div>
                <h3 className="font-display font-bold text-secondary flex items-center gap-2">
                  Active Route Mappings
                  <span className="text-[10px] font-bold bg-white border border-gray-200 text-text-muted px-2 py-0.5 rounded-full">v3.0 Secure</span>
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-widest">Fleet & Trip Distribution</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search routes or stops..." 
                  className="input-field pl-10 h-10 text-xs bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">From</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Detailed Route Path</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Fleet Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMappings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-text-muted italic text-sm">
                         <div className="flex flex-col items-center gap-3">
                           <Layers className="h-12 w-12 text-gray-200" />
                           <p>No active logistics routes found.</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMappings.map((mapping) => (
                      <tr key={mapping.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-5 align-top">
                          <span className="text-sm font-black text-secondary">{mapping.from}</span>
                        </td>
                        <td className="px-6 py-5 align-top">
                           {editingId === mapping.id ? (
                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                               <div className="flex flex-wrap items-center gap-2">
                                 {editStops.length > 0 ? editStops.map((s, i) => (
                                   <span key={i} className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-gray-100">{s}</span>
                                 )) : <span className="text-[10px] italic text-text-muted">No intermediate stops</span>}
                               </div>
                               <button 
                                 type="button"
                                 onClick={() => {
                                   setSelectedStops(editStops);
                                   setToLocation(editTo);
                                   setIsModalOpen(true);
                                 }}
                                 className="text-[10px] font-bold text-primary flex items-center gap-1"
                               >
                                 <Edit2 className="h-3 w-3" /> Resize/Reorder
                               </button>
                             </div>
                           ) : (
                            <div className="space-y-4">
                               <div className="flex flex-wrap items-center gap-y-3">
                                 {mapping.routePath.map((stop, i) => (
                                   <React.Fragment key={i}>
                                     <div className={cn(
                                       "px-3 py-1 text-[10px] font-black rounded-lg transition-transform hover:scale-105",
                                       i === 0 ? "bg-blue-600 text-white shadow-sm" : 
                                       i === mapping.routePath.length - 1 ? "bg-green-600 text-white shadow-sm" : 
                                       "bg-white border border-gray-200 text-secondary"
                                     )}>
                                       {stop}
                                     </div>
                                     {i < mapping.routePath.length - 1 && (
                                       <div className="px-2">
                                         <ArrowRight className="h-3 w-3 text-gray-300" />
                                       </div>
                                     )}
                                   </React.Fragment>
                                 ))}
                               </div>
                               <div className="flex items-center gap-2">
                                 <span className="text-[9px] font-black uppercase bg-primary text-white px-2 py-0.5 rounded-full ring-4 ring-primary/10">
                                   {mapping.stopsCount || 0} Intermediate Stops
                                 </span>
                               </div>
                            </div>
                           )}
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-secondary">{mapping.to}</span>
                            <span className="text-[9px] text-text-muted mt-1 uppercase tracking-tighter">Final Hub</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {editingId === mapping.id ? (
                                <SearchableSelect 
                                  value={editDriverId}
                                  onSelect={setEditDriverId}
                                  options={MOCK_DRIVERS.map(d => ({ id: d.id.toString(), label: d.name }))}
                                  className="w-40 h-8 text-[11px]"
                                />
                              ) : (
                                <>
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                    <UserIcon className="h-3 w-3 text-gray-400" />
                                  </div>
                                  <span className="text-xs font-bold text-text-main">{mapping.driverName}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {editingId === mapping.id ? (
                                <SearchableSelect 
                                  value={editVehicleId}
                                  onSelect={setEditVehicleId}
                                  options={MOCK_VEHICLES.map(v => ({ id: v.id.toString(), label: v.number }))}
                                  className="w-40 h-8 text-[11px]"
                                />
                              ) : (
                                <>
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                    <Truck className="h-3 w-3 text-gray-400" />
                                  </div>
                                  <span className="text-xs font-mono font-black text-secondary">{mapping.vehicleNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right align-top">
                          <div className="flex justify-end gap-2">
                            {editingId === mapping.id ? (
                              <>
                                <button 
                                  onClick={() => handleSaveEdit(mapping.id)}
                                  className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-100"
                                  title="Save"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                                  title="Cancel"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <ActionMenu 
                                items={[
                                  {
                                    label: 'Edit Configuration',
                                    icon: <Edit2 className="h-4 w-4" />,
                                    onClick: () => startEditing(mapping)
                                  },
                                  {
                                    label: 'Delete Mapping',
                                    icon: <Trash2 className="h-4 w-4" />,
                                    onClick: () => handleDelete(mapping.id),
                                    variant: 'danger' as const
                                  }
                                ]}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RouteStopsModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Sync edit state if we were editing
          if (editingId) {
            setEditStops(selectedStops);
          }
        }}
        from={staffInfo.location}
        to={editingId ? editTo : toLocation}
        selectedStops={selectedStops}
        onChange={setSelectedStops}
      />

      <Toaster position="bottom-right" richColors />
      
      <style>{`
        .bg-dashed-border {
          background-image: linear-gradient(to bottom, #d1d5db 50%, transparent 50%);
          background-size: 2px 8px;
          background-repeat: repeat-y;
        }
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
      `}</style>
    </PortalLayout>
  );
}
