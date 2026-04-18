import PortalLayout from '@/components/layout/PortalLayout';
import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Save, X, Phone, User as UserIcon, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

import { MOCK_DRIVERS } from '@/constants';
import { Driver } from '@/types';

export default function DriverManager() {
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Driver name is required');
      return;
    }
    if (!validatePhone(newPhone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    const newDriver: Driver = {
      id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
      name: newName.trim(),
      phone: newPhone,
    };

    setDrivers([...drivers, newDriver]);
    setNewName('');
    setNewPhone('');
    setError('');
  };

  const handleDelete = (id: number) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  const startEditing = (driver: Driver) => {
    setEditingId(driver.id);
    setEditName(driver.name);
    setEditPhone(driver.phone);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim()) return;
    if (!validatePhone(editPhone)) return;

    setDrivers(drivers.map(d => d.id === id ? { ...d, name: editName.trim(), phone: editPhone } : d));
    setEditingId(null);
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.phone.includes(searchTerm)
  );

  return (
    <PortalLayout role="admin" title="Driver Management">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Add Driver Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-md">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-bold text-secondary">Add New Driver</h2>
          </div>

          <form onSubmit={handleAddDriver} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Driver Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Enter name" 
                  className="input-field pl-10 h-11 text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="10-digit number" 
                  className="input-field pl-10 h-11 text-sm"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary h-11 flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" /> Add Driver
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Driver List Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-display font-bold text-secondary">Driver List</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search drivers..." 
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
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic text-sm">
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-text-muted">
                        #{driver.id.toString().padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === driver.id ? (
                          <input 
                            type="text" 
                            className="input-field h-9 text-sm" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium text-secondary">{driver.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === driver.id ? (
                          <input 
                            type="text" 
                            className="input-field h-9 text-sm" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        ) : (
                          <span className="text-sm text-text-muted">{driver.phone}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === driver.id ? (
                            <>
                              <button 
                                onClick={() => handleSaveEdit(driver.id)}
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
                                onClick={() => startEditing(driver)}
                                className="p-2 text-black hover:bg-gray-100 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(driver.id)}
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
