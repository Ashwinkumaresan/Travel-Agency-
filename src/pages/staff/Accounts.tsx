import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_BOOKINGS, MOCK_FINANCES } from '@/constants';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Calculator, Plus, Trash2, Search, ArrowUpRight, ArrowDownRight, DollarSign, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TripFinance, ExpenseItem } from '@/types';

export default function Accounts() {
  const [finances, setFinances] = useState<TripFinance[]>(MOCK_FINANCES);
  const [historySearch, setHistorySearch] = useState('');
  
  // Phase State
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [tripSearch, setTripSearch] = useState('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([{ label: '', amount: 0 }]);
  const [revenue, setRevenue] = useState(0);

  const filteredTrips = MOCK_BOOKINGS.filter(b => 
    b.id.toLowerCase().includes(tripSearch.toLowerCase()) || 
    b.customerName.toLowerCase().includes(tripSearch.toLowerCase())
  );

  const selectedBooking = MOCK_BOOKINGS.find(b => b.id === selectedBookingId);
  
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const profit = revenue - totalExpenses;
  const loss = profit < 0 ? Math.abs(profit) : 0;
  const finalProfit = profit > 0 ? profit : 0;

  const addExpenseField = () => {
    setExpenses([...expenses, { label: '', amount: 0 }]);
  };

  const removeExpenseField = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: keyof ExpenseItem, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [field]: value };
    setExpenses(newExpenses);
  };

  const handleSave = () => {
    if (!selectedBookingId) return;
    
    const newFinance: TripFinance = {
      id: `FIN-${Math.floor(Math.random() * 1000)}`,
      bookingId: selectedBookingId,
      expenses: expenses.filter(e => e.label.trim() !== ''),
      revenue: revenue,
      profit: finalProfit,
      loss: loss,
      updatedAt: new Date().toISOString()
    };

    setFinances([newFinance, ...finances]);
    alert('Account details saved successfully!');
    resetForm();
  };

  const resetForm = () => {
    setCurrentPhase(1);
    setSelectedBookingId('');
    setTripSearch('');
    setExpenses([{ label: '', amount: 0 }]);
    setRevenue(0);
  };

  return (
    <PortalLayout role="staff" title="Trip Accounts Handling">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry Form - Phase Wise */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-light p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-secondary">New Entry</h3>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((p) => (
                    <div 
                      key={p} 
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-all",
                        currentPhase >= p ? "bg-primary" : "bg-gray-100"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  {currentPhase === 1 && (
                    <motion.div 
                      key="phase1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <p className="text-sm text-text-muted">Step 1: Select the trip for account entry</p>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search Trip ID or Name..." 
                            className="input-field pl-10"
                            value={tripSearch}
                            onChange={(e) => setTripSearch(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {filteredTrips.map((trip) => (
                            <button
                              key={trip.id}
                              onClick={() => setSelectedBookingId(trip.id)}
                              className={cn(
                                "w-full p-4 rounded-lg border-2 text-left transition-all",
                                selectedBookingId === trip.id 
                                  ? "border-primary bg-primary-light" 
                                  : "border-gray-50 hover:border-primary/20"
                              )}
                            >
                              <p className="font-bold text-secondary">{trip.id}</p>
                              <p className="text-xs text-text-muted">{trip.customerName} • {trip.packageName}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        disabled={!selectedBookingId}
                        onClick={() => setCurrentPhase(2)}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        Next Step <ChevronRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}

                  {currentPhase === 2 && (
                    <motion.div 
                      key="phase2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-text-muted">Step 2: Add expenses and revenue</p>
                          <button 
                            onClick={addExpenseField}
                            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Add Label
                          </button>
                        </div>
                        
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                          {expenses.map((exp, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <div className="flex-grow space-y-1">
                                <input 
                                  type="text" 
                                  placeholder="Label (e.g. Petrol)" 
                                  className="input-field py-2 text-sm"
                                  value={exp.label}
                                  onChange={(e) => updateExpense(index, 'label', e.target.value)}
                                />
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                  <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    className="input-field pl-8 py-2 text-sm"
                                    value={exp.amount || ''}
                                    onChange={(e) => updateExpense(index, 'amount', Number(e.target.value))}
                                  />
                                </div>
                              </div>
                              {expenses.length > 1 && (
                                <button 
                                  onClick={() => removeExpenseField(index)}
                                  className="p-2 text-black hover:bg-gray-100 rounded-md mt-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Total Revenue</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                              type="number" 
                              className="input-field pl-10"
                              placeholder="Enter total revenue"
                              value={revenue || ''}
                              onChange={(e) => setRevenue(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setCurrentPhase(1)}
                          className="flex-1 btn-outline py-3 flex items-center justify-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" /> Back
                        </button>
                        <button 
                          disabled={expenses.some(e => !e.label || e.amount <= 0) || revenue <= 0}
                          onClick={() => setCurrentPhase(3)}
                          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          Review <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentPhase === 3 && (
                    <motion.div 
                      key="phase3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-6">
                        <p className="text-sm text-text-muted text-center">Step 3: Confirm and submit</p>
                        
                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <div>
                              <p className="text-xs text-text-muted uppercase font-bold">Trip ID</p>
                              <p className="font-bold text-secondary">{selectedBookingId}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-text-muted uppercase font-bold">Customer</p>
                              <p className="font-bold text-secondary">{selectedBooking?.customerName}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {expenses.map((exp, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-text-muted">{exp.label}</span>
                                <span className="font-medium text-secondary">{formatCurrency(exp.amount)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-secondary">Total Revenue</span>
                              <span className="font-bold text-green-600">{formatCurrency(revenue)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-secondary">Total Expenses</span>
                              <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-dashed border-gray-300">
                              <span className="font-bold text-secondary">Net {profit >= 0 ? 'Profit' : 'Loss'}</span>
                              <span className={cn("text-lg font-bold", profit >= 0 ? "text-green-600" : "text-red-600")}>
                                {formatCurrency(profit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setCurrentPhase(2)}
                          className="flex-1 btn-outline py-3 flex items-center justify-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" /> Back
                        </button>
                        <button 
                          onClick={handleSave}
                          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Submit Entry
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-display font-bold text-secondary">Account History</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Booking ID..." 
                    className="input-field pl-10 py-1.5 text-xs w-48"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Expenses</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Profit/Loss</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {finances.filter(f => f.bookingId.toLowerCase().includes(historySearch.toLowerCase())).map((finance) => {
                      const totalExp = finance.expenses.reduce((acc, curr) => acc + curr.amount, 0);
                      const isProfit = finance.profit > 0;
                      return (
                        <tr key={finance.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono font-bold text-secondary">{finance.bookingId}</td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">{formatCurrency(finance.revenue)}</td>
                          <td className="px-6 py-4 text-sm text-red-600">{formatCurrency(totalExp)}</td>
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
        </div>
      </div>
    </PortalLayout>
  );
}
