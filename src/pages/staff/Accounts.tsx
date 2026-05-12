import PortalLayout from '@/components/layout/PortalLayout';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  History,
  X,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const COMMON_REASONS = [
  "Fuel",
  "Driver Salary",
  "Vehicle Maintenance",
  "Toll Charges",
  "Parking Fees",
  "Loading Charges",
  "Unloading Charges",
  "Permits & Documentation",
  "Insurance Premium",
  "Vehicle Repairs",
  "Cleaning & Washing",
  "Office Supplies",
  "Utilities (Electricity/Water)",
  "Communication (Phone/Data)",
  "Inter-branch Transfer",
  "Others"
];

interface ExpenseEntry {
  id: string;
  category: string;
  otherReason?: string;
  amount: number;
  timestamp: string;
}

export default function Accounts() {
  const [revenue, setRevenue] = useState(50000); // Default daily revenue for demo
  const [expenseList, setExpenseList] = useState<ExpenseEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [amount, setAmount] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isMobileAddOpen, setIsMobileAddOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    return COMMON_REASONS.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  const totalExpenses = useMemo(() => {
    return expenseList.reduce((sum, item) => sum + item.amount, 0);
  }, [expenseList]);

  const balance = revenue - totalExpenses;

  const handleAddExpense = () => {
    if (!selectedCategory || !amount) return;
    
    const newExpense: ExpenseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      category: selectedCategory,
      otherReason: selectedCategory === "Others" ? otherReason : undefined,
      amount: parseFloat(amount),
      timestamp: new Date().toISOString()
    };

    setExpenseList(prev => [newExpense, ...prev]);
    
    // Reset form
    setSelectedCategory("");
    setOtherReason("");
    setAmount("");
    setCategorySearch("");
    setIsMobileAddOpen(false);
  };

  const removeExpense = (id: string) => {
    setExpenseList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <PortalLayout role="staff" title="Accounts & Expenses">
      <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Column: Form (Desktop Only) */}
        <div className="hidden lg:block w-[380px] h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-8 overflow-y-auto custom-scrollbar shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-secondary tracking-tight">Daily Entry</h2>
              <p className="text-xs font-bold text-text-muted">Manage your expenses</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Filter className="h-3 w-3" /> Select Category
              </label>
              
              <div className="relative">
                <div 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all"
                >
                  <span className={cn("text-xs font-bold", !selectedCategory ? "text-text-muted" : "text-secondary")}>
                    {selectedCategory || "Choose reason..."}
                  </span>
                  <Search className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 max-h-[300px] overflow-hidden flex flex-col"
                    >
                      <div className="p-2 border-b border-gray-50 text-black">
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search or filter..."
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-primary/20"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 text-black">
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowCategoryDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer",
                              selectedCategory === cat 
                                ? "bg-primary text-white" 
                                : "text-text-muted hover:bg-primary/5 hover:text-primary"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                        {filteredCategories.length === 0 && (
                          <div className="p-4 text-center text-[10px] font-bold text-text-muted italic">
                            No results found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedCategory === "Others" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Specific Reason</label>
                  <input 
                    type="text"
                    placeholder="Type your own reason..."
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold focus:ring-1 focus:ring-primary/20 transition-all text-black"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Amount Spent</label>
                <div className="relative text-black">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 text-xs font-black focus:ring-1 focus:ring-primary/20 transition-all text-black"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleAddExpense}
                disabled={!selectedCategory || !amount}
                className="w-full bg-primary text-white rounded-2xl py-5 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </button>
            </div>

            <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-4">
              <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-3 w-3" /> Revenue Management
              </h4>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-text-muted uppercase">Today's Revenue</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-secondary font-mono">₹{revenue.toLocaleString()}</span>
                  <button className="text-[10px] font-black text-primary hover:underline pb-1 cursor-pointer">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Table & Summary */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 min-w-0 text-black">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 px-4 lg:px-0">
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Revenue</p>
                <p className="text-lg font-black text-secondary font-mono">₹{revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                <ArrowDownRight className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Spent</p>
                <p className="text-lg font-black text-secondary font-mono">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-primary p-5 rounded-3xl shadow-xl shadow-primary/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Balance</p>
                <p className="text-lg font-black text-white font-mono">₹{balance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden flex flex-col mx-4 lg:mx-0">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-secondary" />
                <h3 className="font-black text-secondary text-sm uppercase tracking-tight">Recent Expenses</h3>
              </div>
              <button 
                onClick={() => setIsMobileAddOpen(true)}
                className="lg:hidden p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-gray-50">
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Time</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {expenseList.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-secondary">{item.category}</span>
                          {item.otherReason && (
                            <span className="text-[10px] font-bold text-text-muted italic">{item.otherReason}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-bold text-text-muted">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-xs font-black text-red-600 font-mono">
                          - ₹{item.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => removeExpense(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {expenseList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center underline-offset-4">
                        <div className="flex flex-col items-center gap-3 text-black">
                          <div className="p-4 bg-gray-50 rounded-full">
                            <TrendingDown className="h-8 w-8 text-gray-300" />
                          </div>
                          <p className="text-xs font-black text-text-muted uppercase tracking-wider">No expenses recorded today</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Calculation */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between shrink-0">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Balance after expenses</span>
               <span className={cn(
                 "text-sm font-black font-mono",
                 balance >= 0 ? "text-green-600" : "text-red-600"
               )}>
                 ₹{balance.toLocaleString()}
               </span>
            </div>
          </div>
        </div>

        {/* Mobile Popup Form */}
        <AnimatePresence>
          {isMobileAddOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileAddOpen(false)}
                className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-secondary">Add Expense</h3>
                  <button 
                    onClick={() => setIsMobileAddOpen(false)}
                    className="p-2 bg-gray-50 rounded-full text-text-muted hover:text-secondary transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Re-use form inside mobile popup */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Filter className="h-3 w-3" /> Select Category
                    </label>
                    
                    <div className="relative">
                      <div 
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all"
                      >
                        <span className={cn("text-xs font-bold", !selectedCategory ? "text-text-muted" : "text-secondary")}>
                          {selectedCategory || "Choose reason..."}
                        </span>
                        <Search className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>

                      <AnimatePresence>
                        {showCategoryDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 bottom-full sm:top-full left-0 w-full mb-2 sm:mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 max-h-[300px] overflow-hidden flex flex-col"
                          >
                            <div className="p-2 border-b border-gray-50">
                              <input 
                                type="text"
                                autoFocus
                                placeholder="Search or filter..."
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-primary/20 text-black"
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                              />
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2 text-black">
                              {filteredCategories.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowCategoryDropdown(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer",
                                    selectedCategory === cat 
                                      ? "bg-primary text-white" 
                                      : "text-text-muted hover:bg-primary/5 hover:text-primary"
                                  )}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {selectedCategory === "Others" && (
                      <div className="space-y-2">
                        <input 
                          type="text"
                          placeholder="Type your own reason..."
                          className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold focus:ring-1 focus:ring-primary/20 transition-all text-black"
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <input 
                          type="number"
                          placeholder="Amount Spent"
                          className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 text-xs font-black focus:ring-1 focus:ring-primary/20 transition-all text-black"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleAddExpense}
                      disabled={!selectedCategory || !amount}
                      className="w-full bg-primary text-white rounded-2xl py-5 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Expense
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PortalLayout>
  );
}
