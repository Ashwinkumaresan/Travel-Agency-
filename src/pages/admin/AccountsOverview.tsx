import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_FINANCES, COURIER_LOCATIONS } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Download, UserPlus, Mail, Lock, MapPin, X, Shield } from 'lucide-react';
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

  const totalRevenue = MOCK_FINANCES.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = MOCK_FINANCES.reduce((acc, curr) => acc + curr.profit, 0);
  const totalLoss = MOCK_FINANCES.reduce((acc, curr) => acc + curr.loss, 0);
  const netProfit = totalProfit - totalLoss;

  return (
    <PortalLayout role="admin" title="Accounts & Staff Management">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-text-muted">Total Revenue</p>
            <h3 className="text-2xl font-display font-bold text-secondary mt-1">{formatCurrency(totalRevenue)}</h3>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-text-muted">Net Profit</p>
            <h3 className="text-2xl font-display font-bold text-green-600 mt-1">{formatCurrency(netProfit)}</h3>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-50 p-3 rounded-lg text-red-600">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-text-muted">Total Loss</p>
            <h3 className="text-2xl font-display font-bold text-red-600 mt-1">{formatCurrency(totalLoss)}</h3>
          </div>
        </div>

        {/* Staff Management Section */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-secondary">Staff Accounts</h3>
              <p className="text-xs text-text-muted">Manage your courier staff and their assigned locations</p>
            </div>
            <button 
              onClick={() => setShowStaffModal(true)}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> Add New Staff
            </button>
          </div>
          <div className="overflow-x-auto">
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

        {/* Detailed Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-display font-bold text-secondary">Financial Statements</h3>
            <div className="flex gap-2">
              <button className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                <Download className="h-4 w-4" /> Export PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Expenses</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Expense Breakdown</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Net Result</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_FINANCES.map((finance) => {
                  const totalExp = finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);
                  const isProfit = finance.profit > 0;
                  return (
                    <tr key={finance.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">{finance.bookingId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-secondary">{formatCurrency(finance.revenue)}</td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">{formatCurrency(totalExp)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {finance.expenses.map((exp, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-text-muted px-1.5 py-0.5 rounded-sm">
                              {exp.label}: {formatCurrency(exp.amount)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {isProfit ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                          <span className={cn("text-sm font-bold", isProfit ? "text-green-600" : "text-red-600")}>
                            {formatCurrency(isProfit ? finance.profit : finance.loss)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted">{formatDate(finance.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display font-bold text-secondary">Create Staff Account</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-secondary">
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
                    className="input-field pl-10 h-11" 
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
                    className="input-field pl-10 h-11" 
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
                    className="input-field pl-10 h-11" 
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
                    className="input-field pl-10 h-11 appearance-none"
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
                  className="flex-1 border border-gray-200 py-2.5 rounded-md font-bold text-secondary hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary py-2.5"
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
