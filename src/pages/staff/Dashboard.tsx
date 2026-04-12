import PortalLayout from '@/components/layout/PortalLayout';
import { Briefcase, Ticket, Users, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { MOCK_BOOKINGS } from '@/constants';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

export default function StaffDashboard() {
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending');

  return (
    <PortalLayout role="staff" title="Staff Dashboard">
      <div className="space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Bookings (Today)', value: '24', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Confirmation', value: '8', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Open Tickets', value: '15', icon: Ticket, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Payment Overdue', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className={cn("p-4 rounded-lg", metric.bg)}>
                <metric.icon className={cn("h-6 w-6", metric.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">{metric.label}</p>
                <p className="text-2xl font-display font-bold text-secondary">{metric.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-secondary">Bookings Awaiting Review</h2>
              <button className="text-primary text-sm font-bold hover:underline">View All Queue</button>
            </div>
            
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary">{booking.customerName}</h3>
                      <p className="text-xs text-text-muted">{booking.packageName} • {booking.travellersCount} Travellers</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Travel Date</p>
                      <p className="text-sm font-medium">{formatDate(booking.travelDate)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-1">Payment Mode</p>
                      <p className="text-sm font-medium capitalize">{booking.paymentMode}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors" title="Confirm">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors" title="Reject">
                      <XCircle className="h-5 w-5" />
                    </button>
                    <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                      Review <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-secondary">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6">
              {[
                { action: 'Confirmed Booking', target: '#BK-20250409-0042', time: '2 mins ago' },
                { action: 'Replied to Ticket', target: '#TKT-0198', time: '15 mins ago' },
                { action: 'Updated Package', target: 'Swiss Alps Adventure', time: '1 hour ago' },
                { action: 'Resolved Ticket', target: '#TKT-0155', time: '3 hours ago' },
                { action: 'Rejected Booking', target: '#BK-20250408-0012', time: '5 hours ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 4 && <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-100" />}
                  <div className="w-4 h-4 rounded-full bg-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-text-main">
                      <span className="font-bold">{activity.action}</span> {activity.target}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

