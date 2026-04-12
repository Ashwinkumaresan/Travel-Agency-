import PortalLayout from '@/components/layout/PortalLayout';
import { MOCK_TICKETS, MOCK_BOOKINGS } from '@/constants';
import { cn, formatDate } from '@/lib/utils';
import { Plus, MessageCircle, Clock, CheckCircle2, AlertCircle, X, Send, ChevronRight, Info, History, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketCategory } from '@/types';

export default function Tickets() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Create Ticket State
  const [createStep, setCreateStep] = useState(1);
  const [ticketCategory, setTicketCategory] = useState<TicketCategory | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [queryText, setQueryText] = useState('');
  const [subject, setSubject] = useState('');

  const filteredTickets = MOCK_TICKETS.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const handleCreateTicket = () => {
    alert('Ticket created successfully!');
    setIsCreateModalOpen(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setCreateStep(1);
    setTicketCategory(null);
    setSelectedBookingId('');
    setQueryText('');
    setSubject('');
  };

  const getBookingsByCategory = (category: TicketCategory) => {
    if (category === 'Booked') {
      return MOCK_BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'pending');
    }
    if (category === 'Completed') {
      return MOCK_BOOKINGS.filter(b => b.status === 'completed');
    }
    return [];
  };

  return (
    <PortalLayout role="customer" title="My Tickets">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md pb-4 pt-2">
          <div className="flex p-1 bg-gray-100 rounded-md w-fit">
            {(['all', 'open', 'resolved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 text-sm font-bold rounded-md transition-all capitalize",
                  activeTab === tab ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-secondary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Raise New Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-lg shrink-0",
                    ticket.status === 'open' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  )}>
                    {ticket.status === 'open' ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{ticket.subject}</h3>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                        ticket.category === 'Booked' ? "bg-blue-100 text-blue-700" : 
                        ticket.category === 'Completed' ? "bg-green-100 text-green-700" : 
                        "bg-orange-100 text-orange-700"
                      )}>
                        {ticket.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      ID: {ticket.id} • {ticket.bookingId ? `Booking: ${ticket.bookingId}` : 'General Inquiry'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-secondary flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-primary-light rounded-md text-primary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-secondary">Raise New Ticket</h2>
                <button onClick={() => { setIsCreateModalOpen(false); resetCreateForm(); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-text-muted" />
                </button>
              </div>

              <div className="p-8">
                {createStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-text-muted text-center mb-8">What kind of issue are you facing?</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'Booked', icon: Info, label: 'Booked Trip', desc: 'Issues with active bookings' },
                        { id: 'Completed', icon: History, label: 'Completed Trip', desc: 'Issues with past trips' },
                        { id: 'Common Query', icon: HelpCircle, label: 'Common Query', desc: 'General questions' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setTicketCategory(cat.id as TicketCategory);
                            setCreateStep(cat.id === 'Common Query' ? 3 : 2);
                          }}
                          className="p-6 rounded-lg border-2 border-gray-100 hover:border-primary hover:bg-primary-light transition-all text-center group"
                        >
                          <cat.icon className="h-8 w-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                          <h4 className="font-bold text-secondary mb-1">{cat.label}</h4>
                          <p className="text-[10px] text-text-muted uppercase tracking-wider">{cat.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {createStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <button onClick={() => setCreateStep(1)} className="text-primary text-sm font-bold hover:underline">Back</button>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm font-bold text-secondary">Select {ticketCategory} Trip</span>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {getBookingsByCategory(ticketCategory!).map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setCreateStep(3);
                          }}
                          className={cn(
                            "p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center",
                            selectedBookingId === booking.id ? "border-primary bg-primary-light" : "border-gray-100 hover:border-primary/20"
                          )}
                        >
                          <div>
                            <p className="font-bold text-secondary">{booking.packageName}</p>
                            <p className="text-xs text-text-muted">ID: {booking.id} • Date: {formatDate(booking.travelDate)}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-text-muted" />
                        </div>
                      ))}
                      {getBookingsByCategory(ticketCategory!).length === 0 && (
                        <p className="text-center py-8 text-text-muted italic">No {ticketCategory?.toLowerCase()} trips found.</p>
                      )}
                    </div>
                  </div>
                )}

                {createStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <button onClick={() => setCreateStep(ticketCategory === 'Common Query' ? 1 : 2)} className="text-primary text-sm font-bold hover:underline">Back</button>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm font-bold text-secondary">Describe Your Issue</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Subject</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Brief summary of the issue"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Your Query</label>
                        <textarea 
                          className="input-field min-h-[150px] resize-none" 
                          placeholder="Explain your problem in detail..."
                          value={queryText}
                          onChange={(e) => setQueryText(e.target.value)}
                        ></textarea>
                      </div>
                      <button 
                        onClick={handleCreateTicket}
                        disabled={!subject || !queryText}
                        className="w-full btn-primary py-3 disabled:opacity-50"
                      >
                        Submit Ticket
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Conversation Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col"
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
                      {selectedTicket.category} • {selectedTicket.id}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-text-muted" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {selectedTicket.messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.senderRole === 'customer' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1 px-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{msg.senderName}</span>
                      <span className="text-[10px] text-text-muted">{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg text-sm leading-relaxed shadow-sm",
                      msg.senderRole === 'customer' ? "bg-primary text-white rounded-tr-none" : "bg-white text-secondary border border-gray-100 rounded-tl-none"
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
                    placeholder="Type your message here..." 
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
