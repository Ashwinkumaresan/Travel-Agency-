import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_VEHICLES } from '@/constants';
import { UserPlus, Truck, X, Hash } from 'lucide-react';
import React, { useState } from 'react';
import { Vehicle } from '@/types';

export default function VehicleManager() {
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(MOCK_VEHICLES);

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    number: ''
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = vehicleList.length > 0 ? Math.max(...vehicleList.map(v => v.id)) + 1 : 1;
    const vehicle: Vehicle = {
      id: newId,
      name: newVehicle.name,
      number: newVehicle.number.toUpperCase()
    };
    setVehicleList([...vehicleList, vehicle]);
    setShowVehicleModal(false);
    setNewVehicle({ name: '', number: '' });
  };

  return (
    <PortalLayout role="admin" title="Vehicle Management">
      <div className="space-y-8">
        {/* Vehicle Management Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-secondary text-sm uppercase tracking-tight">Vehicle Accounts</h3>
                <p className="text-xs text-text-muted mt-0.5">Manage your courier fleet vehicles and license numbers</p>
              </div>
            </div>
            <button 
              onClick={() => setShowVehicleModal(true)}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Add New Vehicle
            </button>
          </div>
          <div className="overflow-x-auto text-black text-left">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicleList.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">
                      VEH-{vehicle.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-secondary">{vehicle.name}</td>
                    <td className="px-6 py-4 text-sm text-text-muted font-mono">{vehicle.number}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-confirmed">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden text-black text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-secondary">Create Vehicle Account</h3>
              <button onClick={() => setShowVehicleModal(false)} className="text-gray-400 hover:text-secondary cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="input-label">Vehicle Name</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Delivery Van" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newVehicle.name}
                    onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label">Vehicle Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="TN-01-AB-1234" 
                    className="input-field pl-10 h-11 text-black uppercase" 
                    required 
                    value={newVehicle.number}
                    onChange={e => setNewVehicle({...newVehicle, number: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-md font-bold text-secondary hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary py-2.5 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
