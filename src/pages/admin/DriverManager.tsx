import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_DRIVERS } from '@/constants';
import { UserPlus, Phone, X, Users, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Driver } from '@/types';

export default function DriverManager() {
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverList, setDriverList] = useState<Driver[]>(MOCK_DRIVERS);

  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: ''
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = driverList.length > 0 ? Math.max(...driverList.map(d => d.id)) + 1 : 1;
    const driver: Driver = {
      id: newId,
      name: newDriver.name,
      phone: newDriver.phone
    };
    setDriverList([...driverList, driver]);
    setShowDriverModal(false);
    setNewDriver({ name: '', phone: '' });
  };

  return (
    <PortalLayout role="admin" title="Driver Management">
      <div className="space-y-8">
        {/* Driver Management Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-secondary text-sm uppercase tracking-tight">Driver Accounts</h3>
                <p className="text-xs text-text-muted mt-0.5">Manage your fleet drivers and their contact information</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDriverModal(true)}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Add New Driver
            </button>
          </div>
          <div className="overflow-x-auto text-black">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Driver ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {driverList.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">
                      DRV-{driver.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-secondary">{driver.name}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{driver.phone}</td>
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

      {/* Add Driver Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden text-black text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-secondary">Create Driver Account</h3>
              <button onClick={() => setShowDriverModal(false)} className="text-gray-400 hover:text-secondary cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddDriver} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Suresh Kumar" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newDriver.name}
                    onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="9876543210" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newDriver.phone}
                    onChange={e => setNewDriver({...newDriver, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowDriverModal(false)}
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
