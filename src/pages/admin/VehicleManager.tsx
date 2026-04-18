import PortalLayout from '@/components/layout/PortalLayout';
import React, { useState } from 'react';
import { Truck, Edit2, Trash2, Save, X, Search, AlertCircle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

import { MOCK_VEHICLES } from '@/constants';
import { Vehicle } from '@/types';

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');

  // Basic vehicle number validation (e.g., TN-01-AB-1234)
  const validateVehicleNumber = (num: string) => /^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/.test(num.toUpperCase());

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Vehicle name is required');
      return;
    }
    if (!validateVehicleNumber(newNumber)) {
      setError('Invalid format. Use TN-01-AB-1234');
      return;
    }

    const newVehicle: Vehicle = {
      id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
      name: newName.trim(),
      number: newNumber.toUpperCase(),
    };

    setVehicles([...vehicles, newVehicle]);
    setNewName('');
    setNewNumber('');
    setError('');
  };

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const startEditing = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditName(vehicle.name);
    setEditNumber(vehicle.number);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim()) return;
    if (!validateVehicleNumber(editNumber)) return;

    setVehicles(vehicles.map(v => v.id === id ? { ...v, name: editName.trim(), number: editNumber.toUpperCase() } : v));
    setEditingId(null);
  };

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout role="admin" title="Vehicle Management">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Add Vehicle Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-md">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-bold text-secondary">Add New Vehicle</h2>
          </div>

          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Name</label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Van, Bike" 
                  className="input-field pl-10 h-11 text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Number</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="TN-01-AB-1234" 
                  className="input-field pl-10 h-11 text-sm uppercase"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary h-11 flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" /> Add Vehicle
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Vehicle List Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-display font-bold text-secondary">Vehicle List</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vehicles..." 
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
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider w-20">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic text-sm">
                      No vehicles found.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-text-muted">
                        #{vehicle.id.toString().padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === vehicle.id ? (
                          <input 
                            type="text" 
                            className="input-field h-9 text-sm" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium text-secondary">{vehicle.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === vehicle.id ? (
                          <input 
                            type="text" 
                            className="input-field h-9 text-sm uppercase" 
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                          />
                        ) : (
                          <span className="text-sm text-text-muted">{vehicle.number}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === vehicle.id ? (
                            <>
                              <button 
                                onClick={() => handleSaveEdit(vehicle.id)}
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
                            <>
                              <button 
                                onClick={() => startEditing(vehicle)}
                                className="p-2 text-black hover:bg-gray-100 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(vehicle.id)}
                                className="p-2 text-black hover:bg-gray-100 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
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
    </PortalLayout>
  );
}
