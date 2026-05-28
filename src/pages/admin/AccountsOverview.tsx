import PortalLayout from '@/components/layout/PortalLayout';
import { COURIER_LOCATIONS } from '@/constants';
import { UserPlus, Mail, Lock, MapPin, X, Shield, Users } from 'lucide-react';
import React, { useState } from 'react';
import { User } from '@/types';

export default function AdminAccounts() {
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffList, setStaffList] = useState<User[]>([
    { id: 'STF-001', name: 'Arun Kumar', email: 'arun@voyagearc.com', role: 'staff', location: 'Chennai' },
    { id: 'STF-002', name: 'Priya Dharshini', email: 'priya@voyagearc.com', role: 'staff', location: 'Salem' },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Chennai'
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staff: User = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name,
      email: newStaff.email,
      role: 'staff',
      location: newStaff.location
    };
    setStaffList([...staffList, staff]);
    setShowStaffModal(false);
    setNewStaff({ name: '', email: '', password: '', location: 'Chennai' });
  };

  return (
    <PortalLayout role="admin" title="Staff Management">
      <div className="space-y-8">
        {/* Staff Management Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-secondary text-sm uppercase tracking-tight">Staff Accounts</h3>
                <p className="text-xs text-text-muted mt-0.5">Manage your courier staff and their assigned locations</p>
              </div>
            </div>
            <button 
              onClick={() => setShowStaffModal(true)}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Add New Staff
            </button>
          </div>
          <div className="overflow-x-auto text-black">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Staff ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Assigned Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">{staff.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-secondary">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{staff.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-secondary font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {staff.location}
                      </div>
                    </td>
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

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden text-black">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-secondary">Create Staff Account</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-secondary cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Arun Kumar" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newStaff.name}
                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="staff@voyagearc.com" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="input-field pl-10 h-11 text-black" 
                    required 
                    value={newStaff.password}
                    onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="input-label">Assigned Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select 
                    className="input-field pl-10 h-11 appearance-none text-black"
                    value={newStaff.location}
                    onChange={e => setNewStaff({...newStaff, location: e.target.value})}
                  >
                    {COURIER_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowStaffModal(false)}
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
