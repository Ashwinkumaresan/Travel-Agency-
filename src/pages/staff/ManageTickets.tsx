import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_TICKETS } from '@/constants';
import { cn, formatDate } from '@/lib/utils';
import { Search, MessageCircle, X, Send, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from '@/types';

export default function ManageTickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredTickets = MOCK_TICKETS.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || t.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PortalLayout role="staff" title="Manage Support Tickets">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md pb-4 pt-2">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="input-field pl-10 py-2 text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex p-1 bg-gray-100 rounded-md">
              {(['all', 'open', 'resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all capitalize",
                    activeFilter === tab ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <td className="px-6 py-4 text-sm font-mono text-secondary">{ticket.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
                        {ticket.customerName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-secondary">{ticket.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-secondary truncate max-w-xs">{ticket.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                      ticket.category === 'Booked' ? "bg-blue-100 text-blue-700" : 
                      ticket.category === 'Completed' ? "bg-green-100 text-green-700" : 
                      "bg-orange-100 text-orange-700"
                    )}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("badge", `badge-${ticket.status}`)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-md text-text-muted">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg",
                    selectedTicket.status === 'open' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  )}>
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-secondary">{selectedTicket.subject}</h2>
                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold">
                      {selectedTicket.customerName} • {selectedTicket.category} • {selectedTicket.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTicket.status === 'open' && (
                    <button className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700 transition-all">
                      Mark Resolved
                    </button>
                  )}
                  <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-6 w-6 text-text-muted" />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                {selectedTicket.messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      msg.senderRole === 'staff' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{msg.senderName}</span>
                      <span className="text-[10px] text-text-muted">{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg text-sm leading-relaxed shadow-sm",
                      msg.senderRole === 'staff' ? "bg-primary text-white rounded-tr-none" : "bg-white text-secondary border border-gray-100 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your response to the customer..." 
                    className="input-field pr-12 py-4"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PortalLayout>
  );
}
