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
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_DRIVERS, MOCK_VEHICLES, COURIER_LOCATIONS, MOCK_ROUTE_MAPPINGS } from '@/constants';
import { RouteMapping } from '@/types';
import SearchableSelect from '@/components/staff/SearchableSelect';
import ActionMenu from '@/components/staff/ActionMenu';
import { Toaster } from 'sonner';

export default function RouteMappingPage() {
  // Mocking current staff context
  const staffInfo = {
    name: 'Arun Kumar',
    location: 'Chennai',
    id: 'STF-001'
  };

  const [mappings, setMappings] = useState<RouteMapping[]>(MOCK_ROUTE_MAPPINGS.filter(m => m.from === staffInfo.location));

  const [toLocation, setToLocation] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit state
  const [editTo, setEditTo] = useState('');
  const [editDriverId, setEditDriverId] = useState<string>('');
  const [editVehicleId, setEditVehicleId] = useState<string>('');

  const otherLocations = COURIER_LOCATIONS.filter(loc => loc !== staffInfo.location);

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

    // Prevent duplicate routes
    if (mappings.some(m => m.to === toLocation)) {
      setError(`Route to ${toLocation} already exists`);
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
      vehicleNumber: vehicle.number
    };

    setMappings([...mappings, newMapping]);
    setToLocation('');
    setSelectedDriverId('');
    setSelectedVehicleId('');
  };

  const handleDelete = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const startEditing = (mapping: RouteMapping) => {
    setEditingId(mapping.id);
    setEditTo(mapping.to);
    setEditDriverId(mapping.driverId.toString());
    setEditVehicleId(mapping.vehicleId.toString());
  };

  const handleSaveEdit = (id: string) => {
    const driver = MOCK_DRIVERS.find(d => d.id === parseInt(editDriverId));
    const vehicle = MOCK_VEHICLES.find(v => v.id === parseInt(editVehicleId));

    if (!driver || !vehicle || !editTo) return;

    // Check for duplicates excluding current
    if (mappings.some(m => m.to === editTo && m.id !== id)) {
      alert(`Route to ${editTo} already exists`);
      return;
    }

    setMappings(mappings.map(m => 
      m.id === id ? { 
        ...m, 
        to: editTo, 
        driverId: driver.id, 
        driverName: driver.name, 
        vehicleId: vehicle.id, 
        vehicleNumber: vehicle.number 
      } : m
    ));
    setEditingId(null);
  };

  const filteredMappings = mappings.filter(m => 
    m.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="staff" title="Route Mapping">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Info Bar */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">Current Location:</span>
          <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/20">
            <MapPin className="h-4 w-4" />
            <span className="font-bold">{staffInfo.location}</span>
          </div>
        </div>

        {/* Add Mapping Form */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-md">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-bold text-secondary">Add New Route Mapping</h2>
          </div>

          <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* From (Disabled) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">From Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={staffInfo.location} 
                  disabled 
                  className="input-field pl-10 h-11 bg-gray-50 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* To (Searchable Dropdown) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">To Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select 
                  className="input-field pl-10 h-11 appearance-none cursor-pointer"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                >
                  <option value="">Select Destination</option>
                  {otherLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Driver */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Driver Name</label>
              <SearchableSelect 
                value={selectedDriverId}
                onSelect={setSelectedDriverId}
                options={MOCK_DRIVERS.map(d => ({ id: d.id.toString(), label: d.name, sublabel: `ID: ${d.id}` }))}
                placeholder="Select Driver"
                icon={<UserIcon className="h-4 w-4" />}
                className="h-11"
              />
            </div>

            {/* Vehicle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Number</label>
              <SearchableSelect 
                value={selectedVehicleId}
                onSelect={setSelectedVehicleId}
                options={MOCK_VEHICLES.map(v => ({ id: v.id.toString(), label: v.number, sublabel: v.name }))}
                placeholder="Select Vehicle"
                icon={<Truck className="h-4 w-4" />}
                className="h-11"
              />
            </div>

            <div className="lg:col-span-4 flex justify-end">
              <button type="submit" className="btn-primary px-8 h-11 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Route
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Mapping Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-display font-bold text-secondary">Active Route Mappings</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search routes..." 
                className="input-field pl-10 h-10 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">From</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">To</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMappings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic text-sm">
                      No routes available.
                    </td>
                  </tr>
                ) : (
                  filteredMappings.map((mapping) => (
                    <tr key={mapping.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-secondary">{mapping.from}</span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === mapping.id ? (
                          <select 
                            className="input-field h-9 text-sm"
                            value={editTo}
                            onChange={(e) => setEditTo(e.target.value)}
                          >
                            {otherLocations.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-primary" />
                            <span className="text-sm font-bold text-secondary">{mapping.to}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === mapping.id ? (
                          <SearchableSelect 
                            value={editDriverId}
                            onSelect={setEditDriverId}
                            options={MOCK_DRIVERS.map(d => ({ id: d.id.toString(), label: d.name }))}
                            className="w-40"
                          />
                        ) : (
                          <span className="text-sm text-text-main">{mapping.driverName}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === mapping.id ? (
                          <SearchableSelect 
                            value={editVehicleId}
                            onSelect={setEditVehicleId}
                            options={MOCK_VEHICLES.map(v => ({ id: v.id.toString(), label: v.number }))}
                            className="w-40"
                          />
                        ) : (
                          <span className="text-sm font-mono text-text-muted">{mapping.vehicleNumber}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === mapping.id ? (
                            <>
                              <button 
                                onClick={() => handleSaveEdit(mapping.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Save"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => setEditingId(null)}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <ActionMenu 
                              items={[
                                {
                                  label: 'Edit Route',
                                  icon: <Edit2 className="h-4 w-4" />,
                                  onClick: () => startEditing(mapping)
                                },
                                {
                                  label: 'Delete Route',
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
      <Toaster position="top-right" richColors />
    </PortalLayout>
  );
}
