import React from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';

interface TicketModalProps {
  bookingId: string | null;
  onClose: () => void;
  onSubmit: (bookingId: string, subject: string, message: string) => void;
}

export default function TicketModal({ bookingId, onClose, onSubmit }: TicketModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [issueType, setIssueType] = useState('Booking Issue');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!bookingId) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(bookingId, `${issueType}: ${subject}`, message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-h2 font-display font-bold text-secondary">Raise Support Ticket</h2>
              <p className="text-email text-text-muted font-mono tracking-tight">Ref: {bookingId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="input-label">Issue Category</label>
            <select 
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="input-field h-10 rounded-sm bg-gray-50 border-gray-200"
            >
              <option>Booking Issue</option>
              <option>Payment Issue</option>
              <option>Transport Quality</option>
              <option>Cancellation Request</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="input-label">Subject</label>
            <input 
              required
              type="text" 
              placeholder="Briefly describe the issue..." 
              className="input-field h-10 rounded-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="input-label">Message</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide more details about your concern..." 
              className="input-field rounded-sm resize-none py-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full h-12 bg-primary text-white rounded-md font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] text-button"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                Submit Ticket <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
